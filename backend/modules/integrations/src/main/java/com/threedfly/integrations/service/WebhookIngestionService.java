package com.threedfly.integrations.service;

import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.entity.WebhookEvent;
import com.threedfly.integrations.repository.WebhookEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Persists verified webhooks into the durable inbox (webhook_event), deduped
 * by the provider's delivery id. Processing into domain events is a separate
 * async step (worker) — this path must stay fast so the marketplace gets its
 * 200 before its timeout.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookIngestionService {

    public enum IngestResult { ACCEPTED, DUPLICATE }

    private final WebhookEventRepository repo;

    public IngestResult ingest(ShopType provider, String webhookId, String topic,
                               String shopDomain, String payload) {
        if (webhookId != null && repo.existsByProviderAndWebhookId(provider, webhookId)) {
            log.debug("Duplicate webhook delivery {} from {} — ignoring", webhookId, provider);
            return IngestResult.DUPLICATE;
        }
        try {
            repo.save(WebhookEvent.builder()
                    .provider(provider)
                    .webhookId(webhookId)
                    .topic(topic)
                    .shopDomain(shopDomain)
                    .payload(payload)
                    .status(WebhookEvent.Status.RECEIVED)
                    .receivedAt(Instant.now())
                    .build());
            log.info("Webhook stored: provider={} topic={} shop={}", provider, topic, shopDomain);
            return IngestResult.ACCEPTED;
        } catch (DataIntegrityViolationException e) {
            // lost the race with a concurrent duplicate delivery — same outcome
            log.debug("Concurrent duplicate webhook delivery {} from {}", webhookId, provider);
            return IngestResult.DUPLICATE;
        }
    }
}
