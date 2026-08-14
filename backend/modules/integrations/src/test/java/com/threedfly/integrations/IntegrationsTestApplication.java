package com.threedfly.integrations;

import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Test-only Boot application scoped to this module (+ common beans).
 * The real entrypoint lives in backend/app.
 */
@SpringBootApplication(scanBasePackages = "com.threedfly")
public class IntegrationsTestApplication {
}
