package com.threedfly.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Single deployable for all domain modules. Runs in one of two modes,
 * selected via SPRING_PROFILES_ACTIVE:
 *   - "api"    — HTTP: portal APIs, Shopify webhooks, health checks
 *   - "worker" — queue consumers: slicing, routing, notifications
 */
@SpringBootApplication(scanBasePackages = "com.threedfly")
public class ThreeDFlyApplication {

    public static void main(String[] args) {
        SpringApplication.run(ThreeDFlyApplication.class, args);
    }
}
