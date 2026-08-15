package com.threedfly.partners.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.OkHttpClient;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class GeocodingServiceTest {

    private MockWebServer nominatimMock;
    private GeocodingService service;

    @BeforeEach
    void setUp() throws Exception {
        nominatimMock = new MockWebServer();
        nominatimMock.start();
        service = new GeocodingService(new OkHttpClient(), new ObjectMapper());
        ReflectionTestUtils.setField(service, "baseUrl", nominatimMock.url("").toString().replaceAll("/$", ""));
    }

    @AfterEach
    void tearDown() throws Exception {
        nominatimMock.shutdown();
    }

    @Test
    @DisplayName("Parses lat/lon from a Nominatim result")
    void parsesCoordinates() {
        nominatimMock.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json")
                .setBody("[{\"lat\":\"43.6532\",\"lon\":\"-79.3832\",\"display_name\":\"Toronto\"}]"));

        Optional<GeocodingService.GeoPoint> point = service.geocode("123 Queen St W, Toronto, Canada");

        assertTrue(point.isPresent());
        assertEquals(43.6532, point.get().latitude(), 0.0001);
        assertEquals(-79.3832, point.get().longitude(), 0.0001);
    }

    @Test
    @DisplayName("Empty result array yields empty")
    void emptyResults() {
        nominatimMock.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json").setBody("[]"));
        assertTrue(service.geocode("nowhere at all").isEmpty());
    }

    @Test
    @DisplayName("Server error yields empty, not an exception")
    void serverError() {
        nominatimMock.enqueue(new MockResponse().setResponseCode(500));
        assertTrue(service.geocode("some address").isEmpty());
    }

    @Test
    @DisplayName("Blank address yields empty without any HTTP call")
    void blankAddress() {
        assertTrue(service.geocode("  ").isEmpty());
        assertTrue(service.geocode(null).isEmpty());
        assertEquals(0, nominatimMock.getRequestCount());
    }
}
