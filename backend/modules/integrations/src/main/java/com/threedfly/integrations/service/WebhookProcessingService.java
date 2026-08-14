package com.threedfly.integrations.service;

import com.threedfly.integrations.entity.IntegrationAccount;
import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.entity.WebhookEvent;
import com.threedfly.integrations.repository.IntegrationAccountRepository;
import com.threedfly.integrations.repository.WebhookEventRepository;
import com.threedfly.orders.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Drains the webhook_event inbox: turns RECEIVED rows into domain effects
 * (orders/create → OrderService.ingest) and marks them PROCESSED/FAILED.
 * Runs in the worker (polled by WebhookInboxPoller); each event is handled
 * independently so one poison payload can't block the queue.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookProcessingService {

    private final WebhookEventRepository webhookEvents;
    private final IntegrationAccountRepository accounts;
    private final ShopifyOrderParser parser;
    private final OrderService orderService;

    /** Processes all currently-pending events; returns how many were handled. */
    public int processPending() {
        List<WebhookEvent> pending = webhookEvents.findByStatusOrderByReceivedAtAsc(WebhookEvent.Status.RECEIVED);
        int processed = 0;
        for (WebhookEvent event : pending) {
            processOne(event);
            processed++;
        }
        return processed;
    }

    private void processOne(WebhookEvent event) {
        try {
            switch (event.getTopic()) {
                case "orders/create" -> {
                    Long accountId = accounts
                            .findByProviderAndExternalShopId(ShopType.SHOPIFY, event.getShopDomain())
                            .map(IntegrationAccount::getId)
                            .orElse(null);
                    if (accountId == null) {
                        log.warn("Webhook {} from unknown shop {} — ingesting order without account link",
                                event.getId(), event.getShopDomain());
                    }
                    orderService.ingest(parser.parse(event.getPayload(), event.getShopDomain(), accountId));
                }
                default -> log.info("Webhook topic {} has no handler yet — marking processed (event {})",
                        event.getTopic(), event.getId());
            }
            event.setStatus(WebhookEvent.Status.PROCESSED);
            event.setProcessedAt(Instant.now());
            event.setLastError(null);
        } catch (Exception e) {
            log.error("Failed to process webhook event {} (topic {}): {}",
                    event.getId(), event.getTopic(), e.getMessage());
            event.setStatus(WebhookEvent.Status.FAILED);
            event.setProcessedAt(Instant.now());
            event.setLastError(truncate(e.getMessage()));
        }
        webhookEvents.save(event);
    }

    private static String truncate(String msg) {
        if (msg == null) return "unknown error";
        return msg.length() <= 2000 ? msg : msg.substring(0, 2000);
    }
}
