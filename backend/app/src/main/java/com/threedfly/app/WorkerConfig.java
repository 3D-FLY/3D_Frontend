package com.threedfly.app;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Scheduling is enabled ONLY in worker mode — the api process must never run
 * pollers (that separation is the whole point of the two-service split).
 */
@Configuration
@Profile("worker")
@EnableScheduling
public class WorkerConfig {
}
