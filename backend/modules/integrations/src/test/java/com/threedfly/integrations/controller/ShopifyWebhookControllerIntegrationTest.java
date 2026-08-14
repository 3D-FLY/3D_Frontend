package com.threedfly.integrations.controller;

import com.threedfly.integrations.entity.WebhookEvent;
import com.threedfly.integrations.repository.WebhookEventRepository;
import com.threedfly.integrations.shopify.util.HmacVerifierTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ShopifyWebhookControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebhookEventRepository repo;

    private static final String ORDER_PAYLOAD = """
            {"id": 5678, "name": "#1001", "total_price": "42.50"}
            """;

    @BeforeEach
    void clean() {
        repo.deleteAll();
    }

    private void postWebhook(byte[] body, String hmacHeader, String webhookId, int expectedStatus) throws Exception {
        mockMvc.perform(post("/webhooks/shopify")
                        .content(body)
                        .header("X-Shopify-Hmac-Sha256", hmacHeader)
                        .header("X-Shopify-Topic", "orders/create")
                        .header("X-Shopify-Shop-Domain", "test-store.myshopify.com")
                        .header("X-Shopify-Webhook-Id", webhookId)
                        .contentType("application/json"))
                .andExpect(status().is(expectedStatus));
    }

    @Test
    @DisplayName("Valid HMAC: 200, event persisted with payload and topic")
    void validWebhookPersisted() throws Exception {
        byte[] body = ORDER_PAYLOAD.getBytes(StandardCharsets.UTF_8);
        postWebhook(body, HmacVerifierTest.webhookHeader(body), "delivery-1", 200);

        List<WebhookEvent> events = repo.findAll();
        assertEquals(1, events.size());
        WebhookEvent event = events.get(0);
        assertEquals("orders/create", event.getTopic());
        assertEquals("test-store.myshopify.com", event.getShopDomain());
        assertEquals(WebhookEvent.Status.RECEIVED, event.getStatus());
        assertTrue(event.getPayload().contains("\"total_price\": \"42.50\""));
    }

    @Test
    @DisplayName("Invalid HMAC: 401, nothing persisted")
    void invalidHmacRejected() throws Exception {
        byte[] body = ORDER_PAYLOAD.getBytes(StandardCharsets.UTF_8);
        postWebhook(body, "AAAA" + HmacVerifierTest.webhookHeader(body).substring(4), "delivery-2", 401);
        assertEquals(0, repo.count());
    }

    @Test
    @DisplayName("Duplicate delivery id: second call returns 200 but stores one row")
    void duplicateDeliveryIdempotent() throws Exception {
        byte[] body = ORDER_PAYLOAD.getBytes(StandardCharsets.UTF_8);
        String hmac = HmacVerifierTest.webhookHeader(body);
        postWebhook(body, hmac, "delivery-3", 200);
        postWebhook(body, hmac, "delivery-3", 200);
        assertEquals(1, repo.count());
    }

    @Test
    @DisplayName("Missing HMAC header: 401")
    void missingHmacRejected() throws Exception {
        mockMvc.perform(post("/webhooks/shopify")
                        .content(ORDER_PAYLOAD.getBytes(StandardCharsets.UTF_8))
                        .header("X-Shopify-Topic", "orders/create")
                        .contentType("application/json"))
                .andExpect(status().isUnauthorized());
        assertEquals(0, repo.count());
    }
}
