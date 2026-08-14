package com.threedfly.pricing;

import com.threedfly.pricing.config.PrintingPricingConfig;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * Test-only Boot application so @SpringBootTest can build a context scoped to
 * this module. The real entrypoint lives in backend/app.
 */
@SpringBootApplication
@EnableConfigurationProperties(PrintingPricingConfig.class)
public class PricingTestApplication {
}
