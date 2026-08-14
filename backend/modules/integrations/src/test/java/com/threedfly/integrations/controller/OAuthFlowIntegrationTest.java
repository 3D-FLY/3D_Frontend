package com.threedfly.integrations.controller;

import com.threedfly.integrations.entity.IntegrationAccount;
import com.threedfly.integrations.entity.OAuthState;
import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.repository.IntegrationAccountRepository;
import com.threedfly.integrations.repository.OAuthStateRepository;
import com.threedfly.integrations.shopify.util.HmacVerifierTest;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OAuthFlowIntegrationTest {

    private static final String SHOP = "test-store.myshopify.com";
    private static MockWebServer shopifyMock;

    @Autowired private MockMvc mockMvc;
    @Autowired private OAuthStateRepository states;
    @Autowired private IntegrationAccountRepository accounts;
    @Autowired private JdbcTemplate jdbc;

    @BeforeAll
    static void startMockShopify() throws IOException {
        shopifyMock = new MockWebServer();
        shopifyMock.start();
    }

    @AfterAll
    static void stopMockShopify() throws IOException {
        shopifyMock.shutdown();
    }

    @DynamicPropertySource
    static void tokenUrl(DynamicPropertyRegistry registry) {
        registry.add("shopify.token-url-override",
                () -> shopifyMock.url("/admin/oauth/access_token").toString());
    }

    @BeforeEach
    void clean() {
        accounts.deleteAll();
        states.deleteAll();
    }

    private String installAndExtractState() throws Exception {
        MvcResult res = mockMvc.perform(get("/oauth/install").param("shop", SHOP))
                .andExpect(status().is3xxRedirection())
                .andReturn();
        String location = res.getResponse().getRedirectedUrl();
        assertNotNull(location);
        assertTrue(location.startsWith("https://" + SHOP + "/admin/oauth/authorize"));
        Matcher m = Pattern.compile("state=([a-f0-9-]+)").matcher(location);
        assertTrue(m.find(), "redirect must carry a state param");
        return m.group(1);
    }

    private MvcResult callback(String state, String code) throws Exception {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("shop", SHOP);
        params.put("state", state);
        params.put("code", code);
        params.put("timestamp", "1700000000");
        String hmac = HmacVerifierTest.queryHmacHex(params);
        return mockMvc.perform(get("/oauth/callback")
                        .param("shop", SHOP)
                        .param("state", state)
                        .param("code", code)
                        .param("timestamp", "1700000000")
                        .param("hmac", hmac))
                .andReturn();
    }

    @Test
    @DisplayName("Install redirect persists a single-use state with TTL")
    void installPersistsState() throws Exception {
        String state = installAndExtractState();
        Optional<OAuthState> stored = states.findById(state);
        assertTrue(stored.isPresent());
        assertEquals(SHOP, stored.get().getShopDomain());
        assertTrue(stored.get().getExpiresAt().isAfter(Instant.now()));
    }

    @Test
    @DisplayName("Happy path: callback exchanges code, stores account, encrypts token at rest, consumes state")
    void happyPath() throws Exception {
        shopifyMock.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json")
                .setBody("{\"access_token\":\"shpat_secret_token_xyz\",\"scope\":\"read_orders\"}"));

        String state = installAndExtractState();
        MvcResult res = callback(state, "authcode-1");
        assertEquals(200, res.getResponse().getStatus(), res.getResponse().getContentAsString());

        IntegrationAccount acct = accounts.findByProviderAndExternalShopId(ShopType.SHOPIFY, SHOP).orElseThrow();
        assertEquals("shpat_secret_token_xyz", acct.getAccessToken());
        assertEquals("read_orders", acct.getScopes());

        // encrypted at rest: raw column must not contain the plaintext token
        String raw = jdbc.queryForObject(
                "select access_token from integration_account where id = ?", String.class, acct.getId());
        assertNotNull(raw);
        assertNotEquals("shpat_secret_token_xyz", raw);
        assertFalse(raw.contains("shpat"));

        // state is single-use
        assertTrue(states.findById(state).isEmpty());
    }

    @Test
    @DisplayName("Replayed state is rejected")
    void replayedStateRejected() throws Exception {
        shopifyMock.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json")
                .setBody("{\"access_token\":\"shpat_secret_token_xyz\",\"scope\":\"read_orders\"}"));

        String state = installAndExtractState();
        assertEquals(200, callback(state, "authcode-1").getResponse().getStatus());
        assertEquals(400, callback(state, "authcode-1").getResponse().getStatus());
        assertEquals(1, accounts.count());
    }

    @Test
    @DisplayName("Expired state is rejected")
    void expiredStateRejected() throws Exception {
        states.save(OAuthState.builder()
                .state("expired-state")
                .shopDomain(SHOP)
                .createdAt(Instant.now().minusSeconds(3600))
                .expiresAt(Instant.now().minusSeconds(60))
                .build());
        assertEquals(400, callback("expired-state", "authcode-2").getResponse().getStatus());
        assertEquals(0, accounts.count());
    }

    @Test
    @DisplayName("Callback with invalid HMAC is rejected before any state lookup")
    void invalidHmacRejected() throws Exception {
        String state = installAndExtractState();
        MvcResult res = mockMvc.perform(get("/oauth/callback")
                        .param("shop", SHOP)
                        .param("state", state)
                        .param("code", "authcode-3")
                        .param("timestamp", "1700000000")
                        .param("hmac", "deadbeef"))
                .andReturn();
        assertEquals(401, res.getResponse().getStatus());
        // state not consumed by a forged callback
        assertTrue(states.findById(state).isPresent());
    }
}
