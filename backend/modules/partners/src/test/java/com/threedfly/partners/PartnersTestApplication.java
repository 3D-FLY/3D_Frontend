package com.threedfly.partners;

import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Test-only Boot application scoped to this module (+ common + orders beans).
 * The real entrypoint lives in backend/app.
 */
@SpringBootApplication(scanBasePackages = "com.threedfly")
@org.springframework.boot.autoconfigure.domain.EntityScan(basePackages = "com.threedfly")
@org.springframework.data.jpa.repository.config.EnableJpaRepositories(basePackages = "com.threedfly")
public class PartnersTestApplication {
}
