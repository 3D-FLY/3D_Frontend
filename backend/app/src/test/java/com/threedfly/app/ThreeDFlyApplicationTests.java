package com.threedfly.app;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Boots the full application context (all modules wired together). Catches
 * missing configuration properties and broken bean wiring at build time.
 */
@SpringBootTest
class ThreeDFlyApplicationTests {

    @Test
    void contextLoads() {
    }
}
