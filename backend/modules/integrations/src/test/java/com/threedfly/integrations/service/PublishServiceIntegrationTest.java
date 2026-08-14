package com.threedfly.integrations.service;

import com.threedfly.catalog.entity.Product;
import com.threedfly.catalog.repository.ProductRepository;
import com.threedfly.integrations.entity.IntegrationAccount;
import com.threedfly.integrations.entity.ProductSync;
import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.provider.PublishToStoreRequest;
import com.threedfly.integrations.repository.IntegrationAccountRepository;
import com.threedfly.integrations.repository.ProductSyncRepository;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.io.IOException;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Exercises the publish pipeline end-to-end against a scripted mock of the
 * Shopify GraphQL endpoint: productCreate → variant price → publications
 * lookup → publishablePublish, asserting ProductSync bookkeeping.
 */
@SpringBootTest
class PublishServiceIntegrationTest {

    private static final String CREATE_OK = """
            {"data":{"productCreate":{"product":{"id":"gid://shopify/Product/1",
            "variants":{"nodes":[{"id":"gid://shopify/ProductVariant/11"}]}},"userErrors":[]}}}
            """;
    private static final String CREATE_USER_ERROR = """
            {"data":{"productCreate":{"product":null,
            "userErrors":[{"field":"title","message":"can't be blank"}]}}}
            """;
    private static final String PRICE_OK = """
            {"data":{"productVariantsBulkUpdate":{"userErrors":[]}}}
            """;
    private static final String PUBLICATIONS_OK = """
            {"data":{"publications":{"edges":[{"node":{"id":"gid://shopify/Publication/99","name":"Online Store"}}]}}}
            """;
    private static final String PUBLISH_OK = """
            {"data":{"publishablePublish":{"publishable":{"publicationCount":1},"userErrors":[]}}}
            """;
    private static final String DELETE_OK = """
            {"data":{"productDelete":{"deletedProductId":"gid://shopify/Product/1","userErrors":[]}}}
            """;

    private static MockWebServer shopifyMock;

    @Autowired private PublishService publishService;
    @Autowired private ProductRepository products;
    @Autowired private IntegrationAccountRepository accounts;
    @Autowired private ProductSyncRepository syncs;

    private Product product;
    private IntegrationAccount account;

    @BeforeAll
    static void startMock() throws IOException {
        shopifyMock = new MockWebServer();
        shopifyMock.start();
    }

    @AfterAll
    static void stopMock() throws IOException {
        shopifyMock.shutdown();
    }

    @DynamicPropertySource
    static void graphqlUrl(DynamicPropertyRegistry registry) {
        registry.add("shopify.graphql-url-override",
                () -> shopifyMock.url("/admin/api/2025-07/graphql.json").toString());
    }

    @BeforeEach
    void setUp() {
        syncs.deleteAll();
        products.deleteAll();
        accounts.deleteAll();

        product = new Product();
        product.setName("Benchy");
        product.setDescription("A boat");
        product.setPrice(19.90);
        product = products.save(product);

        account = accounts.save(IntegrationAccount.builder()
                .provider(ShopType.SHOPIFY)
                .externalShopId("test-store.myshopify.com")
                .accessToken("shpat_test")
                .installedAt(Instant.now())
                .build());
    }

    private PublishToStoreRequest request() {
        PublishToStoreRequest req = new PublishToStoreRequest();
        req.setIntegrationAccountId(account.getId());
        return req;
    }

    private void enqueueHappyPublish() {
        for (String body : new String[]{CREATE_OK, PRICE_OK, PUBLICATIONS_OK, PUBLISH_OK}) {
            shopifyMock.enqueue(new MockResponse()
                    .setHeader("Content-Type", "application/json").setBody(body));
        }
        // no media call — test product has no image data
    }

    @Test
    @DisplayName("Happy path: publish creates ProductSync with external ids and CREATED state")
    void publishCreatesSyncRecord() throws Exception {
        enqueueHappyPublish();

        ProductSync sync = publishService.publish(product.getId(), request());

        assertEquals("gid://shopify/Product/1", sync.getExternalProductId());
        assertEquals("gid://shopify/ProductVariant/11", sync.getExternalVariantId());
        assertEquals("CREATED", sync.getSyncState());
        assertNotNull(sync.getLastSyncedAt());
        assertNull(sync.getLastError());
        assertEquals(1, syncs.count());
    }

    @Test
    @DisplayName("Re-publish updates the same sync record to UPDATED state")
    void republishUpdatesSyncRecord() throws Exception {
        enqueueHappyPublish();
        publishService.publish(product.getId(), request());
        enqueueHappyPublish();

        ProductSync sync = publishService.publish(product.getId(), request());

        assertEquals("UPDATED", sync.getSyncState());
        assertEquals(1, syncs.count());
    }

    @Test
    @DisplayName("Shopify userErrors on create: exception thrown, sync record marked FAILED")
    void createUserErrorsMarkSyncFailed() {
        shopifyMock.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json").setBody(CREATE_USER_ERROR));

        Exception ex = assertThrows(Exception.class,
                () -> publishService.publish(product.getId(), request()));
        assertTrue(ex.getMessage().contains("userErrors"));

        ProductSync sync = syncs.findByProductId(product.getId()).orElseThrow();
        assertEquals("FAILED", sync.getSyncState());
        assertTrue(sync.getLastError().contains("can't be blank"));
    }

    @Test
    @DisplayName("Delete from store removes the Shopify product and the sync record")
    void deleteFromStore() throws Exception {
        enqueueHappyPublish();
        publishService.publish(product.getId(), request());

        shopifyMock.enqueue(new MockResponse()
                .setHeader("Content-Type", "application/json").setBody(DELETE_OK));
        publishService.deleteFromStore(product.getId(), ShopType.SHOPIFY);

        assertEquals(0, syncs.count());
    }

    @Test
    @DisplayName("Unknown integration account: fails fast without calling Shopify")
    void unknownAccountFailsFast() {
        int requestsBefore = shopifyMock.getRequestCount();
        PublishToStoreRequest req = new PublishToStoreRequest();
        req.setIntegrationAccountId(9999L);
        assertThrows(IllegalArgumentException.class,
                () -> publishService.publish(product.getId(), req));
        assertEquals(requestsBefore, shopifyMock.getRequestCount());
    }
}
