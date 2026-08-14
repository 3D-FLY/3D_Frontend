package com.threedfly.integrations.service;

import com.threedfly.integrations.entity.IntegrationAccount;
import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.entity.WebhookEvent;
import com.threedfly.integrations.repository.IntegrationAccountRepository;
import com.threedfly.integrations.repository.WebhookEventRepository;
import com.threedfly.orders.entity.Order;
import com.threedfly.orders.entity.OrderStatus;
import com.threedfly.orders.repository.OrderLedgerRepository;
import com.threedfly.orders.repository.OrderRepository;
import com.threedfly.orders.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

/**
 * End-to-end: webhook_event inbox row → WebhookProcessingService → normalized
 * Order in the orders module. This is the seam the whole MVP loop crosses.
 */
@SpringBootTest
class WebhookProcessingIntegrationTest {

    private static final String SHOP = "test-store.myshopify.com";

    private static final String ORDER_PAYLOAD = """
            {
              "id": 820982911946154500,
              "name": "#1001",
              "currency": "CAD",
              "total_price": "42.50",
              "customer": {"first_name": "Dana", "last_name": "Levi"},
              "shipping_address": {"address1": "123 Queen St W", "city": "Toronto",
                                   "province": "Ontario", "country": "Canada", "zip": "M5H 2M9"},
              "line_items": [
                {"id": 866550311766439000, "title": "Benchy - Blue PLA", "quantity": 2,
                 "price": "19.90", "sku": "BENCHY-BLU", "product_id": 7513594},
                {"id": 141249953214522980, "title": "Phone Stand", "quantity": 1,
                 "price": "2.70", "sku": null, "product_id": null}
              ]
            }
            """;

    @Autowired private WebhookProcessingService processingService;
    @Autowired private WebhookEventRepository webhookEvents;
    @Autowired private IntegrationAccountRepository accounts;
    @Autowired private OrderRepository orders;
    @Autowired private OrderLedgerRepository ledger;
    @Autowired private OrderService orderService;

    private IntegrationAccount account;

    @BeforeEach
    void setUp() {
        ledger.deleteAll();
        orders.deleteAll();
        webhookEvents.deleteAll();
        accounts.deleteAll();
        account = accounts.save(IntegrationAccount.builder()
                .provider(ShopType.SHOPIFY)
                .externalShopId(SHOP)
                .accessToken("shpat_test")
                .installedAt(Instant.now())
                .build());
    }

    private WebhookEvent enqueue(String topic, String payload, String webhookId) {
        return webhookEvents.save(WebhookEvent.builder()
                .provider(ShopType.SHOPIFY)
                .webhookId(webhookId)
                .topic(topic)
                .shopDomain(SHOP)
                .payload(payload)
                .status(WebhookEvent.Status.RECEIVED)
                .receivedAt(Instant.now())
                .build());
    }

    @Test
    @DisplayName("orders/create event becomes a normalized RECEIVED order with items")
    void ordersCreateBecomesOrder() {
        enqueue("orders/create", ORDER_PAYLOAD, "wh-1");

        int processed = processingService.processPending();

        assertEquals(1, processed);
        assertEquals(WebhookEvent.Status.PROCESSED, webhookEvents.findAll().get(0).getStatus());

        Order order = orders.findByMarketplaceAndExternalOrderId("SHOPIFY", "820982911946154500").orElseThrow();
        assertEquals(OrderStatus.RECEIVED, order.getStatus());
        assertEquals("#1001", order.getOrderNumber());
        assertEquals("Dana Levi", order.getCustomerName());
        assertEquals(new BigDecimal("42.50"), order.getTotalPrice());
        assertEquals(account.getId(), order.getIntegrationAccountId());
        assertTrue(order.getShippingAddressJson().contains("Toronto"));

        Order withItems = orderService.getWithItems(order.getId());
        assertEquals(2, withItems.getItems().size());
        assertEquals("BENCHY-BLU", withItems.getItems().get(0).getSku());
        assertNull(withItems.getItems().get(1).getSku());
    }

    @Test
    @DisplayName("Duplicate marketplace order across two events yields a single order")
    void duplicateOrderEventIdempotent() {
        enqueue("orders/create", ORDER_PAYLOAD, "wh-1");
        enqueue("orders/create", ORDER_PAYLOAD, "wh-2");

        processingService.processPending();

        assertEquals(1, orders.count());
        assertTrue(webhookEvents.findAll().stream()
                .allMatch(e -> e.getStatus() == WebhookEvent.Status.PROCESSED));
    }

    @Test
    @DisplayName("Malformed payload marks the event FAILED with an error, creates no order")
    void malformedPayloadFails() {
        enqueue("orders/create", "{\"no_id\": true}", "wh-bad");

        processingService.processPending();

        WebhookEvent event = webhookEvents.findAll().get(0);
        assertEquals(WebhookEvent.Status.FAILED, event.getStatus());
        assertNotNull(event.getLastError());
        assertEquals(0, orders.count());
    }

    @Test
    @DisplayName("A poison event does not block later events")
    void poisonEventDoesNotBlockQueue() {
        enqueue("orders/create", "not-even-json", "wh-poison");
        enqueue("orders/create", ORDER_PAYLOAD, "wh-good");

        processingService.processPending();

        assertEquals(1, orders.count());
        assertEquals(1, webhookEvents.findByStatusOrderByReceivedAtAsc(WebhookEvent.Status.FAILED).size());
    }

    @Test
    @DisplayName("Unhandled topics are marked processed and create nothing")
    void unhandledTopicSkipped() {
        enqueue("app/uninstalled", "{}", "wh-3");

        processingService.processPending();

        assertEquals(WebhookEvent.Status.PROCESSED, webhookEvents.findAll().get(0).getStatus());
        assertEquals(0, orders.count());
    }

    @Test
    @DisplayName("Order from an unknown shop is still ingested, without an account link")
    void unknownShopStillIngested() {
        WebhookEvent event = enqueue("orders/create", ORDER_PAYLOAD, "wh-4");
        event.setShopDomain("stranger.myshopify.com");
        webhookEvents.save(event);

        processingService.processPending();

        Order order = orders.findAll().get(0);
        assertNull(order.getIntegrationAccountId());
        assertEquals("stranger.myshopify.com", order.getShopDomain());
    }
}
