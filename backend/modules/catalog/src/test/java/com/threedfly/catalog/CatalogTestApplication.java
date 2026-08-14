package com.threedfly.catalog;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Test-only Boot application scoped to this module (+ common beans).
 * The real entrypoint lives in backend/app.
 */
@SpringBootApplication(scanBasePackages = "com.threedfly")
@EnableJpaAuditing
public class CatalogTestApplication {
}
