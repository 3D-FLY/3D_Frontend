package com.threedfly.partners.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "filament_stock")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class FilamentStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "partner_id")
    @lombok.ToString.Exclude
    private Partner partner;

    @Enumerated(EnumType.STRING)
    @Column(name = "material_type", length = 32)
    private FilamentType materialType;

    private String color;

    @Column(name = "quantity_kg")
    private Double quantityKg;

    @Column(name = "reserved_kg")
    @Builder.Default
    private Double reservedKg = 0.0;

    @Builder.Default
    private boolean available = true;

    @Column(name = "last_restocked")
    private Date lastRestocked;

    @Column(name = "expiry_date")
    private Date expiryDate;

    public Double getAvailableQuantityKg() {
        return quantityKg - (reservedKg != null ? reservedKg : 0.0);
    }

    public boolean hasEnoughStock(Double requiredKg) {
        return getAvailableQuantityKg() >= requiredKg;
    }
}
