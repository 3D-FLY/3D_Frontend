package com.threedfly.integrations.controller;

import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.service.WebhookIngestionService;
import com.threedfly.integrations.shopify.config.ShopifyConfig;
import com.threedfly.integrations.shopify.util.HmacVerifier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

/**
 * Shopify webhook receiver (orders/create, orders/updated, app/uninstalled…).
 * Contract: verify HMAC on the RAW body, persist to the inbox, ack 200
 * immediately. Shopify retries on non-2xx and drops the subscription after
 * ~19 failed deliveries — so once verified, always return 200.
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class ShopifyWebhookController {

    private final ShopifyConfig cfg;
    private final WebhookIngestionService ingestion;

    @PostMapping("/webhooks/shopify")
    public ResponseEntity<Void> receive(
            @RequestBody byte[] rawBody,
            @RequestHeader(value = "X-Shopify-Hmac-Sha256", required = false) String hmac,
            @RequestHeader(value = "X-Shopify-Topic", required = false) String topic,
            @RequestHeader(value = "X-Shopify-Shop-Domain", required = false) String shopDomain,
            @RequestHeader(value = "X-Shopify-Webhook-Id", required = false) String webhookId) {

        if (!HmacVerifier.verifyWebhook(rawBody, cfg.apiSecret, hmac)) {
            log.warn("Rejected Shopify webhook with invalid HMAC (topic={}, shop={})", topic, shopDomain);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        ingestion.ingest(
                ShopType.SHOPIFY,
                webhookId,
                topic != null ? topic : "unknown",
                shopDomain,
                new String(rawBody, StandardCharsets.UTF_8));

        return ResponseEntity.ok().build();
    }
}
