package com.threedfly.partners.repository;

import com.threedfly.partners.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, Long> {

    Optional<Partner> findByUserId(Long userId);

    Optional<Partner> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUserId(Long userId);

    List<Partner> findByVerifiedTrueAndActiveTrue();

    @Query("SELECT p FROM Partner p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Partner> findByNameContainingIgnoreCase(@Param("name") String name);

    // Routing pool: vetted, live, and locatable
    @Query("SELECT p FROM Partner p WHERE p.active = true AND p.verified = true " +
           "AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL ORDER BY p.name")
    List<Partner> findRoutable();

    /**
     * Stock-aware closest-partner lookup (ported from product-service) —
     * Haversine in SQL, joined with filament availability, one round trip.
     * Used once orders carry material requirements; the alpha matcher uses
     * findRoutable() + Java-side distance instead.
     */
    @Query(value = """
        SELECT p.id as id,
               p.name as name,
               p.latitude as latitude,
               p.longitude as longitude,
               fs.id as stockId,
               fs.material_type as materialType,
               fs.color as color,
               (fs.quantity_kg - COALESCE(fs.reserved_kg, 0.0)) as availableQuantityKg,
               6371 * acos(cos(radians(:buyerLat)) * cos(radians(p.latitude)) *
                           cos(radians(p.longitude) - radians(:buyerLon)) +
                           sin(radians(:buyerLat)) * sin(radians(p.latitude))) as distanceKm
        FROM partner p
        INNER JOIN filament_stock fs ON p.id = fs.partner_id
        WHERE p.active = true
          AND p.verified = true
          AND p.latitude IS NOT NULL
          AND p.longitude IS NOT NULL
          AND fs.material_type = :materialType
          AND fs.color = :color
          AND fs.available = true
          AND (fs.quantity_kg - COALESCE(fs.reserved_kg, 0.0)) >= :requiredQuantity
        ORDER BY distanceKm ASC, (fs.quantity_kg - COALESCE(fs.reserved_kg, 0.0)) DESC
        LIMIT 1
        """, nativeQuery = true)
    Optional<ClosestPartnerProjection> findClosestPartnerWithStock(@Param("buyerLat") Double buyerLatitude,
                                                                   @Param("buyerLon") Double buyerLongitude,
                                                                   @Param("materialType") String materialType,
                                                                   @Param("color") String color,
                                                                   @Param("requiredQuantity") Double requiredQuantity);

    interface ClosestPartnerProjection {
        Long getId();
        String getName();
        Double getLatitude();
        Double getLongitude();
        Long getStockId();
        String getMaterialType();
        String getColor();
        Double getAvailableQuantityKg();
        Double getDistanceKm();
    }
}
