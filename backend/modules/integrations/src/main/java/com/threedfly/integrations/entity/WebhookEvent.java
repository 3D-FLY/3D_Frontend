package com.threedfly.integrations.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Durable inbox for marketplace webhooks. The receiving endpoint verifies,
 * dedups and persists here, then acks fast; processing into domain events
 * happens asynchronously (worker) so a slow consumer can never make Shopify
 * time out and retry-storm us.
 */
@Entity
@Table(
        name = "webhook_event",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_webhook_provider_webhook_id",
                columnNames = {"provider", "webhook_id"}
        )
)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WebhookEvent {

    public enum Status { RECEIVED, PROCESSED, FAILED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ShopType provider;

    // Shopify's X-Shopify-Webhook-Id — delivery-unique, our dedup key
    @Column(name = "webhook_id", length = 128)
    private String webhookId;

    // e.g. "orders/create"
    @Column(nullable = false, length = 128)
    private String topic;

    @Column(name = "shop_domain", length = 255)
    private String shopDomain;

    @Lob
    @Column(nullable = false)
    private String payload;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private Status status;

    @Column(name = "received_at", nullable = false)
    private Instant receivedAt;

    @Column(name = "processed_at")
    private Instant processedAt;

    @Lob
    @Column(name = "last_error")
    private String lastError;
}
