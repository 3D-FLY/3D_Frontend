package com.threedfly.orders.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Append-only audit trail: one row per status transition, including admin
 * overrides (which record a reason). This is how disputes get resolved —
 * never update or delete rows.
 */
@Entity
@Table(name = "order_ledger")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderLedgerEntry {

    public enum ActorType { SYSTEM, SELLER, PARTNER, ADMIN }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 32)
    private OrderStatus fromStatus; // null for the initial RECEIVED entry

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 32)
    private OrderStatus toStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "actor_type", nullable = false, length = 32)
    private ActorType actorType;

    @Column(name = "actor_id")
    private Long actorId;

    @Column(name = "override_flag", nullable = false)
    private boolean override;

    @Column(length = 1000)
    private String reason;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
