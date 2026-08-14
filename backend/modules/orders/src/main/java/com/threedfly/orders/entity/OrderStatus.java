package com.threedfly.orders.entity;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * The order lifecycle. Normal flow:
 * RECEIVED → PRICED → MATCHED → ACCEPTED → IN_PRODUCTION → SHIPPED → DELIVERED
 * with REJECTED (partner declines, back to matching) and CANCELLED branches.
 * Admin overrides may bypass this map — recorded in the ledger with a reason.
 */
public enum OrderStatus {
    RECEIVED,
    PRICED,
    MATCHED,
    ACCEPTED,
    REJECTED,
    IN_PRODUCTION,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED = Map.of(
            RECEIVED, EnumSet.of(PRICED, CANCELLED),
            PRICED, EnumSet.of(MATCHED, CANCELLED),
            MATCHED, EnumSet.of(ACCEPTED, REJECTED, CANCELLED),
            ACCEPTED, EnumSet.of(IN_PRODUCTION, REJECTED, CANCELLED),
            REJECTED, EnumSet.of(MATCHED, CANCELLED),
            IN_PRODUCTION, EnumSet.of(SHIPPED, CANCELLED),
            SHIPPED, EnumSet.of(DELIVERED),
            DELIVERED, EnumSet.noneOf(OrderStatus.class),
            CANCELLED, EnumSet.noneOf(OrderStatus.class)
    );

    public boolean canTransitionTo(OrderStatus target) {
        return ALLOWED.getOrDefault(this, Set.of()).contains(target);
    }

    public boolean isTerminal() {
        return ALLOWED.getOrDefault(this, Set.of()).isEmpty();
    }
}
