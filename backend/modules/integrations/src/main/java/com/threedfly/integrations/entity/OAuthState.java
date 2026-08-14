package com.threedfly.integrations.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Single-use CSRF state for the OAuth install flow. Replaces the legacy
 * in-memory map — survives restarts and works with multiple api tasks.
 */
@Entity
@Table(name = "oauth_state")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OAuthState {

    @Id
    @Column(length = 64)
    private String state;

    @Column(name = "shop_domain", nullable = false, length = 255)
    private String shopDomain;

    // Optional link to catalog's Shop; nullable until catalog lands (Phase 2b)
    @Column(name = "internal_shop_id")
    private Long internalShopId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    public boolean isExpired(Instant now) {
        return now.isAfter(expiresAt);
    }
}
