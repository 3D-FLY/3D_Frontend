package com.threedfly.integrations.controller;

import com.threedfly.integrations.entity.IntegrationAccount;
import com.threedfly.integrations.entity.OAuthState;
import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.repository.IntegrationAccountRepository;
import com.threedfly.integrations.repository.OAuthStateRepository;
import com.threedfly.integrations.shopify.ShopifyAuthService;
import com.threedfly.integrations.shopify.ShopifyTokenClient;
import com.threedfly.integrations.shopify.config.ShopifyConfig;
import com.threedfly.integrations.shopify.util.HmacVerifier;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

/**
 * Shopify OAuth install flow. Reworked from the legacy product-service
 * controller: HMAC verification is ENFORCED (legacy skipped it), state is a
 * single-use DB row with TTL (legacy: in-memory map), no secrets are logged,
 * and there is no dependency on the catalog Shop entity yet — accounts are
 * keyed by (provider, external shop domain).
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class OAuthController {

    static final Duration STATE_TTL = Duration.ofMinutes(10);

    private final ShopifyAuthService authService;
    private final ShopifyConfig cfg;
    private final IntegrationAccountRepository accounts;
    private final OAuthStateRepository states;
    private final ShopifyTokenClient tokenClient;

    /**
     * Shopify app-install entry point (the app URL configured in the Partner
     * dashboard). Shopify signs this request; we verify before redirecting
     * the merchant into the authorize screen.
     */
    @GetMapping("/shopify/install")
    public void handleShopifyInstall(@RequestParam Map<String, String> params,
                                     HttpServletResponse res) throws IOException {
        String shop = params.get("shop");
        if (shop == null || shop.isBlank()) {
            res.sendError(HttpStatus.BAD_REQUEST.value(), "Missing shop parameter");
            return;
        }
        if (!HmacVerifier.verifyQueryString(params, cfg.apiSecret, params.get("hmac"))) {
            log.warn("Rejected Shopify install request with invalid HMAC for shop {}", shop);
            res.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid HMAC");
            return;
        }
        res.sendRedirect(beginInstall(shop, null));
    }

    /**
     * Manual/dev install kick-off (no Shopify signature — not reachable from
     * the outside world in prod; the ALB only routes real paths).
     */
    @GetMapping("/oauth/install")
    public void install(@RequestParam String shop,
                        @RequestParam(value = "internalShopId", required = false) Long internalShopId,
                        HttpServletResponse res) throws IOException {
        res.sendRedirect(beginInstall(shop, internalShopId));
    }

    private String beginInstall(String shopDomain, Long internalShopId) {
        String state = authService.newState();
        Instant now = Instant.now();
        states.save(OAuthState.builder()
                .state(state)
                .shopDomain(shopDomain)
                .internalShopId(internalShopId)
                .createdAt(now)
                .expiresAt(now.plus(STATE_TTL))
                .build());
        log.info("Starting Shopify OAuth install for shop {}", shopDomain);
        return authService.buildInstallUrl(shopDomain, state);
    }

    @GetMapping("/oauth/callback")
    @Transactional
    public ResponseEntity<String> callback(@RequestParam Map<String, String> params) throws IOException {
        String shop = params.get("shop");
        String state = params.get("state");
        String code = params.get("code");

        if (!HmacVerifier.verifyQueryString(params, cfg.apiSecret, params.get("hmac"))) {
            log.warn("Rejected OAuth callback with invalid HMAC for shop {}", shop);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid HMAC");
        }

        Optional<OAuthState> stored = state == null ? Optional.empty() : states.findById(state);
        if (stored.isEmpty() || stored.get().isExpired(Instant.now())) {
            log.warn("Rejected OAuth callback with unknown or expired state for shop {}", shop);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired state. Please reinstall the app.");
        }
        // single-use: consume before the token exchange
        states.delete(stored.get());

        ShopifyTokenClient.TokenResponse token = tokenClient.exchangeCode(shop, code);

        Instant now = Instant.now();
        IntegrationAccount acct = accounts
                .findByProviderAndExternalShopId(ShopType.SHOPIFY, shop)
                .orElseGet(() -> IntegrationAccount.builder()
                        .provider(ShopType.SHOPIFY)
                        .externalShopId(shop)
                        .installedAt(now)
                        .build());
        acct.setShopId(stored.get().getInternalShopId());
        acct.setAccessToken(token.accessToken());
        acct.setScopes(token.scopes());
        acct.setUpdatedAt(now);
        IntegrationAccount saved = accounts.save(acct);

        log.info("Shopify integration installed for shop {} (account id {})", shop, saved.getId());
        return ResponseEntity.ok("""
                <html><body>
                <h2>3DFly connected to Shopify</h2>
                <p><strong>Shop:</strong> %s</p>
                <p>You can close this window and return to your 3DFly dashboard.</p>
                </body></html>
                """.formatted(shop));
    }

    @GetMapping("/oauth/accounts")
    public ResponseEntity<Map<String, Object>> listIntegrationAccounts() {
        var accountsInfo = accounts.findAll().stream().map(OAuthController::toView).toList();
        return ResponseEntity.ok(Map.of(
                "totalAccounts", accountsInfo.size(),
                "accounts", accountsInfo
        ));
    }

    @GetMapping("/oauth/accounts/{id}")
    public ResponseEntity<Map<String, Object>> getIntegrationAccount(@PathVariable Long id) {
        return accounts.findById(id)
                .map(acct -> ResponseEntity.ok(toView(acct)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private static Map<String, Object> toView(IntegrationAccount acct) {
        return Map.of(
                "id", acct.getId(),
                "shopId", acct.getShopId() != null ? acct.getShopId() : "",
                "provider", acct.getProvider().toString(),
                "externalShopId", acct.getExternalShopId(),
                "scopes", acct.getScopes() != null ? acct.getScopes() : "",
                "installedAt", acct.getInstalledAt() != null ? acct.getInstalledAt().toString() : "",
                "updatedAt", acct.getUpdatedAt() != null ? acct.getUpdatedAt().toString() : "",
                "hasToken", acct.getAccessToken() != null && !acct.getAccessToken().isEmpty()
        );
    }
}
