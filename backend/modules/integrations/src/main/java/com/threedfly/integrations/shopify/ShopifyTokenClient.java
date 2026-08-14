package com.threedfly.integrations.shopify;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.threedfly.integrations.shopify.config.ShopifyConfig;
import lombok.extern.slf4j.Slf4j;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Exchanges an OAuth authorization code for a permanent access token.
 * Extracted from the legacy OAuthController so the HTTP hop is mockable
 * (tests point token-url-override at a local mock server).
 */
@Service
@Slf4j
public class ShopifyTokenClient {

    private final OkHttpClient http;
    private final ShopifyConfig cfg;
    private final ObjectMapper om = new ObjectMapper();

    // Test hook only — blank in real environments
    @Value("${shopify.token-url-override:}")
    private String tokenUrlOverride;

    public ShopifyTokenClient(OkHttpClient http, ShopifyConfig cfg) {
        this.http = http;
        this.cfg = cfg;
    }

    public record TokenResponse(String accessToken, String scopes) {}

    public TokenResponse exchangeCode(String shopDomain, String code) throws IOException {
        String url = tokenUrlOverride == null || tokenUrlOverride.isBlank()
                ? "https://" + shopDomain + "/admin/oauth/access_token"
                : tokenUrlOverride;

        FormBody form = new FormBody.Builder()
                .add("client_id", cfg.apiKey)
                .add("client_secret", cfg.apiSecret)
                .add("code", code)
                .build();

        Request req = new Request.Builder().url(url).post(form).build();

        try (Response resp = http.newCall(req).execute()) {
            String body = resp.body() != null ? resp.body().string() : "";
            if (!resp.isSuccessful()) {
                log.error("Shopify token exchange failed for shop {}: HTTP {}", shopDomain, resp.code());
                throw new IOException("Token exchange failed: HTTP " + resp.code());
            }
            JsonNode json = om.readTree(body);
            JsonNode tokenNode = json.get("access_token");
            if (tokenNode == null || tokenNode.asText().isBlank()) {
                throw new IOException("Token exchange response missing access_token");
            }
            return new TokenResponse(tokenNode.asText(), json.path("scope").asText(""));
        }
    }
}
