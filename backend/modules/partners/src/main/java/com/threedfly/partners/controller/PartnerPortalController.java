package com.threedfly.partners.controller;

import com.threedfly.orders.entity.Order;
import com.threedfly.orders.entity.OrderStatus;
import com.threedfly.orders.service.OrderService;
import jakarta.validation.constraints.NotBlank;
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

/**
 * The Partner Portal API: incoming jobs, accept/reject, production and
 * shipping updates. Auth arrives with the users module — until then partnerId
 * is a path variable and every mutating call is guarded server-side to the
 * order's assigned partner.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/partner-portal/{partnerId}")
@Validated
public class PartnerPortalController {

    private final OrderService orderService;

    private static final List<OrderStatus> OPEN_JOB_STATUSES =
            List.of(OrderStatus.MATCHED, OrderStatus.ACCEPTED, OrderStatus.IN_PRODUCTION);

    public record JobView(Long orderId, String orderNumber, OrderStatus status, String customerName,
                          String shippingAddressJson, String currency, BigDecimal totalPrice,
                          Instant receivedAt) {}

    private static JobView job(Order o) {
        return new JobView(o.getId(), o.getOrderNumber(), o.getStatus(), o.getCustomerName(),
                o.getShippingAddressJson(), o.getCurrency(), o.getTotalPrice(), o.getReceivedAt());
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobView>> jobs(@PathVariable @NotNull Long partnerId,
                                              @RequestParam(required = false) OrderStatus status) {
        List<OrderStatus> statuses = status != null ? List.of(status) : OPEN_JOB_STATUSES;
        return ResponseEntity.ok(orderService.findByPartner(partnerId, statuses).stream()
                .map(PartnerPortalController::job).toList());
    }

    @PostMapping("/jobs/{orderId}/accept")
    public ResponseEntity<JobView> accept(@PathVariable @NotNull Long partnerId,
                                          @PathVariable @NotNull Long orderId) {
        return ResponseEntity.ok(job(orderService.partnerTransition(
                orderId, partnerId, OrderStatus.ACCEPTED, "Partner accepted job")));
    }

    public record RejectRequest(@NotBlank String reason) {}

    @PostMapping("/jobs/{orderId}/reject")
    public ResponseEntity<JobView> reject(@PathVariable @NotNull Long partnerId,
                                          @PathVariable @NotNull Long orderId,
                                          @RequestBody @jakarta.validation.Valid RejectRequest req) {
        return ResponseEntity.ok(job(orderService.partnerTransition(
                orderId, partnerId, OrderStatus.REJECTED, "Partner rejected: " + req.reason())));
    }

    @PostMapping("/jobs/{orderId}/start")
    public ResponseEntity<JobView> startProduction(@PathVariable @NotNull Long partnerId,
                                                   @PathVariable @NotNull Long orderId) {
        return ResponseEntity.ok(job(orderService.partnerTransition(
                orderId, partnerId, OrderStatus.IN_PRODUCTION, "Production started")));
    }

    public record ShipRequest(@NotBlank String trackingNumber, String carrier) {}

    @PostMapping("/jobs/{orderId}/ship")
    public ResponseEntity<JobView> ship(@PathVariable @NotNull Long partnerId,
                                        @PathVariable @NotNull Long orderId,
                                        @RequestBody @jakarta.validation.Valid ShipRequest req) {
        return ResponseEntity.ok(job(orderService.markShipped(
                orderId, partnerId, req.trackingNumber(), req.carrier())));
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

    @ExceptionHandler(OrderService.NotAssignedPartnerException.class)
    public ResponseEntity<Map<String, String>> notAssigned(OrderService.NotAssignedPartnerException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
    }
}
