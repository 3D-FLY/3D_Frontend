package com.threedfly.orders.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * A fulfillment order — single source of truth for status. Normalized from
 * marketplace payloads by the integrations module; marketplace is a plain
 * string ("SHOPIFY") to keep this module dependency-free.
 */
@Entity
@Table(
        name = "orders",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_orders_marketplace_external",
                columnNames = {"marketplace", "external_order_id"}
        )
)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String marketplace;

    @Column(name = "external_order_id", nullable = false, length = 128)
    private String externalOrderId;

    // Display number from the marketplace, e.g. "#1001"
    @Column(name = "order_number", length = 64)
    private String orderNumber;

    @Column(name = "shop_domain", length = 255)
    private String shopDomain;

    // Loose references — resolved via integrations/users as those flows mature
    @Column(name = "integration_account_id")
    private Long integrationAccountId;

    @Column(name = "seller_id")
    private Long sellerId;

    // Assigned during matching (partners module)
    @Column(name = "partner_id")
    private Long partnerId;

    @Column(name = "customer_name", length = 255)
    private String customerName;

    // Raw marketplace shipping address as JSON — schema varies per marketplace
    @Column(name = "shipping_address_json", length = 4000)
    private String shippingAddressJson;

    @Column(length = 8)
    private String currency;

    @Column(name = "total_price", precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private OrderStatus status;

    @Column(name = "received_at", nullable = false)
    private Instant receivedAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Version
    @Column(name = "version")
    private Long version;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem item) {
        item.setOrder(this);
        items.add(item);
    }
}
