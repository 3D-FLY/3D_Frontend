package com.threedfly.orders.controller;

import com.threedfly.orders.entity.Order;
import com.threedfly.orders.entity.OrderItem;
import com.threedfly.orders.entity.OrderLedgerEntry;
import com.threedfly.orders.entity.OrderStatus;
import com.threedfly.orders.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
@Validated
public class OrderController {

    private final OrderService orderService;

    // ---------- views ----------

    public record OrderSummary(Long id, String marketplace, String orderNumber, String shopDomain,
                               String customerName, String currency, BigDecimal totalPrice,
                               OrderStatus status, Long partnerId, Instant receivedAt) {}

    public record ItemView(Long id, String title, int quantity, BigDecimal price, String sku) {}

    public record OrderDetail(OrderSummary summary, String shippingAddressJson, List<ItemView> items) {}

    private static OrderSummary summarize(Order o) {
        return new OrderSummary(o.getId(), o.getMarketplace(), o.getOrderNumber(), o.getShopDomain(),
                o.getCustomerName(), o.getCurrency(), o.getTotalPrice(), o.getStatus(),
                o.getPartnerId(), o.getReceivedAt());
    }

    // ---------- endpoints ----------

    @GetMapping
    public ResponseEntity<List<OrderSummary>> list(@RequestParam(required = false) OrderStatus status) {
        List<Order> result = status == null ? orderService.findAll() : orderService.findByStatus(status);
        return ResponseEntity.ok(result.stream().map(OrderController::summarize).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetail> get(@PathVariable @NotNull Long id) {
        Order order = orderService.getWithItems(id);
        List<ItemView> items = order.getItems().stream()
                .map(i -> new ItemView(i.getId(), i.getTitle(), i.getQuantity(), i.getPrice(), i.getSku()))
                .toList();
        return ResponseEntity.ok(new OrderDetail(summarize(order), order.getShippingAddressJson(), items));
    }

    @GetMapping("/{id}/ledger")
    public ResponseEntity<List<OrderLedgerEntry>> ledger(@PathVariable @NotNull Long id) {
        return ResponseEntity.ok(orderService.getLedger(id));
    }

    public record TransitionRequest(@NotNull OrderStatus target,
                                    @NotNull OrderLedgerEntry.ActorType actorType,
                                    Long actorId,
                                    String reason) {}

    @PostMapping("/{id}/transition")
    public ResponseEntity<OrderSummary> transition(@PathVariable @NotNull Long id,
                                                   @Valid @RequestBody TransitionRequest req) {
        Order order = orderService.transition(id, req.target(), req.actorType(), req.actorId(), req.reason());
        return ResponseEntity.ok(summarize(order));
    }

    public record OverrideRequest(@NotNull OrderStatus target, Long adminId,
                                  @jakarta.validation.constraints.NotBlank String reason) {}

    @PostMapping("/{id}/override")
    public ResponseEntity<OrderSummary> override(@PathVariable @NotNull Long id,
                                                 @Valid @RequestBody OverrideRequest req) {
        Order order = orderService.adminOverride(id, req.target(), req.adminId(), req.reason());
        return ResponseEntity.ok(summarize(order));
    }

    // ---------- error mapping ----------

    @ExceptionHandler(OrderService.OrderNotFoundException.class)
    public ResponseEntity<Map<String, String>> notFound(OrderService.OrderNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(OrderService.InvalidTransitionException.class)
    public ResponseEntity<Map<String, String>> invalidTransition(OrderService.InvalidTransitionException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
    }
}
