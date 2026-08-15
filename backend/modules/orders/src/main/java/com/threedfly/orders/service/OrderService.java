package com.threedfly.orders.service;

import com.threedfly.orders.entity.Order;
import com.threedfly.orders.entity.OrderItem;
import com.threedfly.orders.entity.OrderLedgerEntry;
import com.threedfly.orders.entity.OrderLedgerEntry.ActorType;
import com.threedfly.orders.entity.OrderStatus;
import com.threedfly.orders.repository.OrderLedgerRepository;
import com.threedfly.orders.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Order lifecycle owner. Every status change goes through transition() or
 * adminOverride() — both write a ledger entry in the same transaction.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orders;
    private final OrderLedgerRepository ledger;

    // ---------- ingestion ----------

    public record IngestItem(String externalLineItemId, String title, int quantity,
                             BigDecimal price, String sku, String externalProductId) {}

    public record IngestOrderCommand(String marketplace, String externalOrderId, String orderNumber,
                                     String shopDomain, Long integrationAccountId, String customerName,
                                     String shippingAddressJson, String currency, BigDecimal totalPrice,
                                     List<IngestItem> items) {}

    /**
     * Creates a RECEIVED order from a normalized marketplace payload.
     * Idempotent on (marketplace, externalOrderId) — returns the existing
     * order on duplicate deliveries.
     */
    @Transactional
    public Order ingest(IngestOrderCommand cmd) {
        Optional<Order> existing = orders.findByMarketplaceAndExternalOrderId(
                cmd.marketplace(), cmd.externalOrderId());
        if (existing.isPresent()) {
            log.debug("Order {}/{} already ingested as id {}",
                    cmd.marketplace(), cmd.externalOrderId(), existing.get().getId());
            return existing.get();
        }

        Instant now = Instant.now();
        Order order = Order.builder()
                .marketplace(cmd.marketplace())
                .externalOrderId(cmd.externalOrderId())
                .orderNumber(cmd.orderNumber())
                .shopDomain(cmd.shopDomain())
                .integrationAccountId(cmd.integrationAccountId())
                .customerName(cmd.customerName())
                .shippingAddressJson(cmd.shippingAddressJson())
                .currency(cmd.currency())
                .totalPrice(cmd.totalPrice())
                .status(OrderStatus.RECEIVED)
                .receivedAt(now)
                .updatedAt(now)
                .build();
        if (cmd.items() != null) {
            cmd.items().forEach(i -> order.addItem(OrderItem.builder()
                    .externalLineItemId(i.externalLineItemId())
                    .title(i.title())
                    .quantity(i.quantity())
                    .price(i.price())
                    .sku(i.sku())
                    .externalProductId(i.externalProductId())
                    .build()));
        }
        Order saved = orders.save(order);

        record(saved.getId(), null, OrderStatus.RECEIVED, ActorType.SYSTEM, null, false,
                "Order ingested from " + cmd.marketplace() + " (" + cmd.orderNumber() + ")");
        log.info("Ingested order {} from {} as id {}", cmd.orderNumber(), cmd.marketplace(), saved.getId());
        return saved;
    }

    // ---------- lifecycle ----------

    @Transactional
    public Order transition(Long orderId, OrderStatus target, ActorType actor, Long actorId, String reason) {
        Order order = orders.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        OrderStatus from = order.getStatus();
        if (!from.canTransitionTo(target)) {
            throw new InvalidTransitionException(orderId, from, target);
        }
        return applyTransition(order, from, target, actor, actorId, false, reason);
    }

    /**
     * Admin-only: bypasses the transition map (MVP allows manual intervention).
     * Requires a reason — it lands in the ledger for the audit trail.
     */
    @Transactional
    public Order adminOverride(Long orderId, OrderStatus target, Long adminId, String reason) {
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Admin override requires a reason");
        }
        Order order = orders.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        return applyTransition(order, order.getStatus(), target, ActorType.ADMIN, adminId, true, reason);
    }

    private Order applyTransition(Order order, OrderStatus from, OrderStatus target,
                                  ActorType actor, Long actorId, boolean override, String reason) {
        order.setStatus(target);
        order.setUpdatedAt(Instant.now());
        Order saved = orders.save(order);
        record(order.getId(), from, target, actor, actorId, override, reason);
        log.info("Order {} transitioned {} -> {} by {}{}",
                order.getId(), from, target, actor, override ? " (OVERRIDE)" : "");
        return saved;
    }

    private void record(Long orderId, OrderStatus from, OrderStatus to,
                        ActorType actor, Long actorId, boolean override, String reason) {
        ledger.save(OrderLedgerEntry.builder()
                .orderId(orderId)
                .fromStatus(from)
                .toStatus(to)
                .actorType(actor)
                .actorId(actorId)
                .override(override)
                .reason(reason)
                .createdAt(Instant.now())
                .build());
    }

    // ---------- partner-facing operations ----------

    /** PRICED → MATCHED, assigning the partner in the same transaction. */
    @Transactional
    public Order matchToPartner(Long orderId, Long partnerId, String reason) {
        Order order = orders.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        OrderStatus from = order.getStatus();
        if (!from.canTransitionTo(OrderStatus.MATCHED)) {
            throw new InvalidTransitionException(orderId, from, OrderStatus.MATCHED);
        }
        order.setPartnerId(partnerId);
        return applyTransition(order, from, OrderStatus.MATCHED, ActorType.SYSTEM, null, false, reason);
    }

    /** IN_PRODUCTION → SHIPPED with tracking info, by the assigned partner. */
    @Transactional
    public Order markShipped(Long orderId, Long partnerId, String trackingNumber, String carrier) {
        Order order = requireAssignedPartner(orderId, partnerId);
        OrderStatus from = order.getStatus();
        if (!from.canTransitionTo(OrderStatus.SHIPPED)) {
            throw new InvalidTransitionException(orderId, from, OrderStatus.SHIPPED);
        }
        order.setTrackingNumber(trackingNumber);
        order.setTrackingCarrier(carrier);
        return applyTransition(order, from, OrderStatus.SHIPPED, ActorType.PARTNER, partnerId, false,
                "Shipped via " + (carrier != null ? carrier : "unknown carrier") + ", tracking " + trackingNumber);
    }

    /** Transition guarded to the partner actually assigned to the order. */
    @Transactional
    public Order partnerTransition(Long orderId, Long partnerId, OrderStatus target, String reason) {
        Order order = requireAssignedPartner(orderId, partnerId);
        OrderStatus from = order.getStatus();
        if (!from.canTransitionTo(target)) {
            throw new InvalidTransitionException(orderId, from, target);
        }
        return applyTransition(order, from, target, ActorType.PARTNER, partnerId, false, reason);
    }

    private Order requireAssignedPartner(Long orderId, Long partnerId) {
        Order order = orders.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        if (order.getPartnerId() == null || !order.getPartnerId().equals(partnerId)) {
            throw new NotAssignedPartnerException(orderId, partnerId);
        }
        return order;
    }

    @Transactional(readOnly = true)
    public List<Order> findByPartner(Long partnerId, List<OrderStatus> statuses) {
        return orders.findByPartnerIdAndStatusInOrderByReceivedAtAsc(partnerId, statuses);
    }

    // ---------- reads ----------

    @Transactional(readOnly = true)
    public Order getWithItems(Long orderId) {
        return orders.findByIdWithItems(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
    }

    @Transactional(readOnly = true)
    public List<Order> findAll() {
        return orders.findAllByOrderByReceivedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<Order> findByStatus(OrderStatus status) {
        return orders.findByStatusOrderByReceivedAtAsc(status);
    }

    @Transactional(readOnly = true)
    public List<OrderLedgerEntry> getLedger(Long orderId) {
        if (orders.findById(orderId).isEmpty()) {
            throw new OrderNotFoundException(orderId);
        }
        return ledger.findByOrderIdOrderByCreatedAtAscIdAsc(orderId);
    }

    // ---------- exceptions ----------

    public static class OrderNotFoundException extends RuntimeException {
        public OrderNotFoundException(Long id) {
            super("Order not found with ID: " + id);
        }
    }

    public static class InvalidTransitionException extends RuntimeException {
        public InvalidTransitionException(Long orderId, OrderStatus from, OrderStatus to) {
            super("Order " + orderId + ": illegal transition " + from + " -> " + to);
        }
    }

    public static class NotAssignedPartnerException extends RuntimeException {
        public NotAssignedPartnerException(Long orderId, Long partnerId) {
            super("Order " + orderId + " is not assigned to partner " + partnerId);
        }
    }
}
