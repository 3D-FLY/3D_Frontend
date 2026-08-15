package com.threedfly.partners.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * A vetted local FDM fulfillment node ("studio"). Ported from product-service
 * Supplier, renamed to match the business language. Only verified AND active
 * partners with coordinates participate in routing.
 */
@Entity
@Table(name = "partner")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to the users module account (managed-auth subject), nullable for now
    @Column(name = "user_id")
    private Long userId;

    private String name;
    private String email;
    private String phone;
    private String address;

    private String city;
    private String state;
    private String country;

    @Column(name = "postal_code")
    private String postalCode;

    private Double latitude;
    private Double longitude;

    @Column(name = "business_license")
    private String businessLicense;

    private String description;

    private boolean verified;
    private boolean active;

    @OneToMany(mappedBy = "partner", cascade = CascadeType.ALL)
    @Builder.Default
    @lombok.ToString.Exclude
    private List<FilamentStock> stock = new ArrayList<>();
}
