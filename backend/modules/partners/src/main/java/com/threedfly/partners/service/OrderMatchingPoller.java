package com.threedfly.partners.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/** Worker-only: periodically places RECEIVED orders and re-places REJECTED ones. */
@Component
@Profile("worker")
@RequiredArgsConstructor
@Slf4j
public class OrderMatchingPoller {

    private final OrderMatchingService matchingService;

    @Scheduled(fixedDelayString = "${partners.matching.poll-delay-ms:7000}")
    public void matchPending() {
        int matched = matchingService.processPending();
        if (matched > 0) {
            log.info("Order matching pass: {} orders matched", matched);
        }
    }
}
