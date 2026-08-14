package com.threedfly.integrations.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Worker-only inbox drain. The api process never runs this — webhook receipt
 * (fast ack) and webhook processing (slow domain work) are separated by the
 * webhook_event table, which acts as the MVP's Postgres-backed queue.
 */
@Component
@Profile("worker")
@RequiredArgsConstructor
@Slf4j
public class WebhookInboxPoller {

    private final WebhookProcessingService processingService;

    @Scheduled(fixedDelayString = "${integrations.webhook.poll-delay-ms:5000}")
    public void drainInbox() {
        int processed = processingService.processPending();
        if (processed > 0) {
            log.info("Webhook inbox drain: {} events processed", processed);
        }
    }
}
