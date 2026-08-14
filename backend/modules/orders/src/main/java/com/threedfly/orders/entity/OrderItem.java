package com.threedfly.orders.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_item")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Order order;

    @Column(name = "external_line_item_id", length = 128)
    private String externalLineItemId;

    @Column(length = 512)
    private String title;

    @Column(nullable = false)
    private int quantity;

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @Column(length = 128)
    private String sku;

    // Marketplace-side product id (NOT our catalog id)
    @Column(name = "external_product_id", length = 128)
    private String externalProductId;

    // Our catalog Product.id — resolved during matching, nullable until then
    @Column(name = "catalog_product_id")
    private Long catalogProductId;
}
