package com.threedfly.partners.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.threedfly.partners.service.GeocodingService.GeoPoint;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Resolves buyer coordinates from an order's raw shipping-address JSON
 * (Shopify shape). Shopify often includes latitude/longitude directly —
 * use them and skip the geocoding round trip; otherwise geocode the
 * human-readable address.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ShippingAddressExtractor {

    private final ObjectMapper om;
    private final GeocodingService geocoding;

    public Optional<GeoPoint> resolveCoordinates(String shippingAddressJson) {
        if (shippingAddressJson == null || shippingAddressJson.isBlank()) {
            return Optional.empty();
        }
        try {
            JsonNode addr = om.readTree(shippingAddressJson);

            JsonNode lat = addr.path("latitude");
            JsonNode lon = addr.path("longitude");
            if (lat.isNumber() && lon.isNumber()) {
                return Optional.of(new GeoPoint(lat.asDouble(), lon.asDouble()));
            }

            String query = joinNonBlank(
                    addr.path("address1").asText(null),
                    addr.path("city").asText(null),
                    addr.path("province").asText(null),
                    addr.path("zip").asText(null),
                    addr.path("country").asText(null));
            if (query.isBlank()) {
                return Optional.empty();
            }
            return geocoding.geocode(query);
        } catch (Exception e) {
            log.warn("Could not resolve coordinates from shipping address: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private static String joinNonBlank(String... parts) {
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p != null && !p.isBlank()) {
                if (!sb.isEmpty()) sb.append(", ");
                sb.append(p.trim());
            }
        }
        return sb.toString();
    }
}
