package com.threedfly.integrations.entity;

import com.threedfly.common.crypto.StringEncryptionConverter;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(
        name = "integration_account",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_integration_provider_ext",
                columnNames = {"provider", "external_shop_id"}
        )
)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class IntegrationAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK to catalog's Shop; nullable until the catalog module lands (Phase 2b)
    @Column(name = "shop_id")
    private Long shopId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ShopType provider;

    // e.g. "mystore.myshopify.com" or marketplace merchant ID
    @Column(name = "external_shop_id", nullable = false, length = 255)
    private String externalShopId;

    // Admin/API access token or credential material (ENCRYPTED)
    @Lob
    @Column(name = "access_token", nullable = false)
    @Convert(converter = StringEncryptionConverter.class)
    private String accessToken;

    // optional: comma-separated scopes or JSON
    @Column(length = 1000)
    private String scopes;

    private Instant installedAt;
    private Instant updatedAt;

    // optional: per-provider metadata JSON (store domain, api version, etc.)
    @Lob
    private String metadataJson;
}
