package com.threedfly.partners.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

/**
 * Address → coordinates via OpenStreetMap Nominatim (free, no API key).
 * Ported from product-service; rewritten on OkHttp (no WebFlux dependency)
 * with a configurable base URL for tests. Nominatim asks for a descriptive
 * User-Agent and ≤1 req/sec — fine at MVP matcher volumes.
 */
@Service
@Slf4j
public class GeocodingService {

    public record GeoPoint(double latitude, double longitude) {}

    private final OkHttpClient http;
    private final ObjectMapper om;

    @Value("${partners.geocoding.base-url:https://nominatim.openstreetmap.org}")
    private String baseUrl;

    public GeocodingService(OkHttpClient http, ObjectMapper om) {
        this.http = http;
        this.om = om;
    }

    public Optional<GeoPoint> geocode(String address) {
        if (address == null || address.isBlank()) {
            return Optional.empty();
        }
        String url = baseUrl + "/search?q=" + URLEncoder.encode(address.trim(), StandardCharsets.UTF_8)
                + "&format=json&limit=1";
        Request req = new Request.Builder()
                .url(url)
                .header("User-Agent", "3DFly/1.0 (order-to-partner matching)")
                .build();
        try (Response resp = http.newCall(req).execute()) {
            if (!resp.isSuccessful() || resp.body() == null) {
                log.warn("Geocoding failed for '{}': HTTP {}", address, resp.code());
                return Optional.empty();
            }
            JsonNode arr = om.readTree(resp.body().string());
            if (!arr.isArray() || arr.isEmpty()) {
                log.warn("No geocoding results for '{}'", address);
                return Optional.empty();
            }
            return Optional.of(new GeoPoint(
                    Double.parseDouble(arr.get(0).path("lat").asText()),
                    Double.parseDouble(arr.get(0).path("lon").asText())));
        } catch (Exception e) {
            log.warn("Geocoding error for '{}': {}", address, e.getMessage());
            return Optional.empty();
        }
    }
}
