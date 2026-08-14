package com.threedfly.integrations.shopify.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class HmacVerifierTest {

    private static final String SECRET = "test-api-secret";

    private static byte[] hmac(byte[] message) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return mac.doFinal(message);
    }

    public static String webhookHeader(byte[] body) throws Exception {
        return Base64.getEncoder().encodeToString(hmac(body));
    }

    public static String queryHmacHex(Map<String, String> params) throws Exception {
        StringBuilder sb = new StringBuilder();
        params.entrySet().stream()
                .filter(e -> !"hmac".equals(e.getKey()))
                .sorted(Map.Entry.comparingByKey())
                .forEach(e -> sb.append(sb.isEmpty() ? "" : "&").append(e.getKey()).append("=").append(e.getValue()));
        byte[] raw = hmac(sb.toString().getBytes(StandardCharsets.UTF_8));
        StringBuilder hex = new StringBuilder();
        for (byte b : raw) hex.append(String.format("%02x", b));
        return hex.toString();
    }

    @Test
    @DisplayName("Webhook HMAC: valid signature verifies")
    void webhookValid() throws Exception {
        byte[] body = "{\"id\":123}".getBytes(StandardCharsets.UTF_8);
        assertTrue(HmacVerifier.verifyWebhook(body, SECRET, webhookHeader(body)));
    }

    @Test
    @DisplayName("Webhook HMAC: tampered body fails")
    void webhookTampered() throws Exception {
        byte[] body = "{\"id\":123}".getBytes(StandardCharsets.UTF_8);
        String header = webhookHeader(body);
        byte[] tampered = "{\"id\":124}".getBytes(StandardCharsets.UTF_8);
        assertFalse(HmacVerifier.verifyWebhook(tampered, SECRET, header));
    }

    @Test
    @DisplayName("Webhook HMAC: wrong secret fails")
    void webhookWrongSecret() throws Exception {
        byte[] body = "{\"id\":123}".getBytes(StandardCharsets.UTF_8);
        assertFalse(HmacVerifier.verifyWebhook(body, "other-secret", webhookHeader(body)));
    }

    @Test
    @DisplayName("Webhook HMAC: null/blank/garbage header fails without throwing")
    void webhookBadHeaders() {
        byte[] body = "{}".getBytes(StandardCharsets.UTF_8);
        assertFalse(HmacVerifier.verifyWebhook(body, SECRET, null));
        assertFalse(HmacVerifier.verifyWebhook(body, SECRET, ""));
        assertFalse(HmacVerifier.verifyWebhook(body, SECRET, "not-base64!!!"));
    }

    @Test
    @DisplayName("Query HMAC: valid signature verifies, hmac param excluded from message")
    void queryValid() throws Exception {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("shop", "test-store.myshopify.com");
        params.put("state", "abc123");
        params.put("code", "authcode");
        params.put("timestamp", "1700000000");
        String hmac = queryHmacHex(params);
        params.put("hmac", hmac);
        assertTrue(HmacVerifier.verifyQueryString(params, SECRET, hmac));
    }

    @Test
    @DisplayName("Query HMAC: tampered param fails")
    void queryTampered() throws Exception {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("shop", "test-store.myshopify.com");
        params.put("timestamp", "1700000000");
        String hmac = queryHmacHex(params);
        params.put("hmac", hmac);
        params.put("shop", "evil-store.myshopify.com");
        assertFalse(HmacVerifier.verifyQueryString(params, SECRET, hmac));
    }
}
