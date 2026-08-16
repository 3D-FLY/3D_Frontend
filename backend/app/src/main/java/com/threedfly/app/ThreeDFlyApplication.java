package com.threedfly.app;

import com.threedfly.pricing.config.PrintingPricingConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Single deployable for all domain modules. Runs in one of two modes,
 * selected via SPRING_PROFILES_ACTIVE:
 *   - "api"    — HTTP: portal APIs, Shopify webhooks, health checks
 *   - "worker" — queue consumers: slicing, routing, notifications
 */

// some comment
@SpringBootApplication(scanBasePackages = "com.threedfly")
@org.springframework.boot.autoconfigure.domain.EntityScan(basePackages = "com.threedfly")
@org.springframework.data.jpa.repository.config.EnableJpaRepositories(basePackages = "com.threedfly")
@org.springframework.data.jpa.repository.config.EnableJpaAuditing
@EnableConfigurationProperties(PrintingPricingConfig.class)
public class ThreeDFlyApplication {

    public static void main(String[] args) {
        SpringApplication.run(ThreeDFlyApplication.class, args);
    }
}
