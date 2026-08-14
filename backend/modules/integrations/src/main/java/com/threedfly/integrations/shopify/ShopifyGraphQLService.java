package com.threedfly.integrations.shopify;

import com.threedfly.integrations.shopify.config.ShopifyConfig;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ShopifyGraphQLService {

    private final OkHttpClient http;
    private final ShopifyConfig cfg;

    // Test hook only — blank in real environments
    @Value("${shopify.graphql-url-override:}")
    private String graphqlUrlOverride;

    public ShopifyGraphQLService(OkHttpClient http, ShopifyConfig cfg) {
        this.http = http;
        this.cfg = cfg;
    }

    public String postGraphQL(String shopDomain, String accessToken, String graphql, String variablesJson) throws Exception {
        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        String body = "{\"query\":" + quote(graphql) + (variablesJson != null ? ",\"variables\":" + variablesJson : "") + "}";
        String url = graphqlUrlOverride == null || graphqlUrlOverride.isBlank()
                ? "https://" + shopDomain + "/admin/api/" + cfg.apiVersion + "/graphql.json"
                : graphqlUrlOverride;
        Request req = new Request.Builder()
                .url(url)
                .addHeader("X-Shopify-Access-Token", accessToken)
                .post(RequestBody.create(body, JSON))
                .build();
        try (Response resp = http.newCall(req).execute()) {
            if (!resp.isSuccessful()) throw new RuntimeException("GraphQL error: " + resp.code() + " " + resp.message());
            return resp.body().string();
        }
    }

    private static String quote(String s) {
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
    }
}
