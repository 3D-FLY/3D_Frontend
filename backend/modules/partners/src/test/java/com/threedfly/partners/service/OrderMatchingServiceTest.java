package com.threedfly.partners.service;

import com.threedfly.orders.entity.Order;
import com.threedfly.orders.entity.OrderLedgerEntry;
import com.threedfly.orders.entity.OrderStatus;
import com.threedfly.orders.repository.OrderLedgerRepository;
import com.threedfly.orders.repository.OrderRepository;
import com.threedfly.orders.service.OrderService;
import com.threedfly.partners.entity.Partner;
import com.threedfly.partners.repository.PartnerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Matching against real H2 state. Shipping addresses carry Shopify-style
 * embedded latitude/longitude, so no live geocoding is involved
 * (partners.geocoding.base-url points at a dead port in test config).
 */
@SpringBootTest
class OrderMatchingServiceTest {

    @Autowired private OrderMatchingService matchingService;
    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orders;
    @Autowired private OrderLedgerRepository ledger;
    @Autowired private PartnerRepository partners;

    private Partner toronto;
    private Partner berlin;

    // Downtown Toronto buyer
    private static final String TORONTO_BUYER_ADDR =
            "{\"city\":\"Toronto\",\"country\":\"Canada\",\"latitude\":43.6532,\"longitude\":-79.3832}";

    @BeforeEach
    void setUp() {
        ledger.deleteAll();
        orders.deleteAll();
        partners.deleteAll();
        toronto = partners.save(Partner.builder().name("Toronto Prints").email("t@x.com")
                .latitude(43.7000).longitude(-79.4000).verified(true).active(true).build());
        berlin = partners.save(Partner.builder().name("Berlin 3D").email("b@x.com")
                .latitude(52.5200).longitude(13.4050).verified(true).active(true).build());
    }

    private Order ingest(String externalId, String shippingJson) {
        return orderService.ingest(new OrderService.IngestOrderCommand(
                "SHOPIFY", externalId, "#" + externalId, "s.myshopify.com", null,
                "Buyer", shippingJson, "CAD", new BigDecimal("10.00"), List.of()));
    }

    @Test
    @DisplayName("RECEIVED order is priced (pass-through) and matched to the nearest partner")
    void matchesNearest() {
        Order order = ingest("1", TORONTO_BUYER_ADDR);

        assertEquals(1, matchingService.processPending());

        Order matched = orders.findById(order.getId()).orElseThrow();
        assertEquals(OrderStatus.MATCHED, matched.getStatus());
        assertEquals(toronto.getId(), matched.getPartnerId());

        List<OrderLedgerEntry> entries = orderService.getLedger(order.getId());
        assertEquals(3, entries.size()); // ingest, PRICED pass-through, MATCHED
        assertEquals(OrderStatus.PRICED, entries.get(1).getToStatus());
        assertTrue(entries.get(1).getReason().contains("pass-through"));
        assertTrue(entries.get(2).getReason().contains("Toronto Prints"));
    }

    @Test
    @DisplayName("No routable partners: order stays RECEIVED for admin")
    void noPartnersNoMatch() {
        partners.deleteAll();
        Order order = ingest("1", TORONTO_BUYER_ADDR);

        assertEquals(0, matchingService.processPending());
        assertEquals(OrderStatus.RECEIVED, orders.findById(order.getId()).orElseThrow().getStatus());
    }

    @Test
    @DisplayName("Unverified or inactive partners are not routable")
    void unroutablePartnersExcluded() {
        toronto.setVerified(false);
        partners.save(toronto);
        berlin.setActive(false);
        partners.save(berlin);
        Order order = ingest("1", TORONTO_BUYER_ADDR);

        assertEquals(0, matchingService.processPending());
        assertEquals(OrderStatus.RECEIVED, orders.findById(order.getId()).orElseThrow().getStatus());
    }

    @Test
    @DisplayName("Unresolvable buyer coordinates: order stays RECEIVED")
    void noCoordinatesNoMatch() {
        Order order = ingest("1", null);

        assertEquals(0, matchingService.processPending());
        assertEquals(OrderStatus.RECEIVED, orders.findById(order.getId()).orElseThrow().getStatus());
    }

    @Test
    @DisplayName("REJECTED order is re-matched to the next partner, excluding the rejector")
    void rematchExcludesRejector() {
        Order order = ingest("1", TORONTO_BUYER_ADDR);
        matchingService.processPending();
        orderService.partnerTransition(order.getId(), toronto.getId(), OrderStatus.REJECTED, "out of PLA");

        assertEquals(1, matchingService.processPending());

        Order rematched = orders.findById(order.getId()).orElseThrow();
        assertEquals(OrderStatus.MATCHED, rematched.getStatus());
        assertEquals(berlin.getId(), rematched.getPartnerId());
    }

    @Test
    @DisplayName("REJECTED order with no alternative partner stays REJECTED")
    void rejectedNoAlternative() {
        partners.delete(berlin);
        Order order = ingest("1", TORONTO_BUYER_ADDR);
        matchingService.processPending();
        orderService.partnerTransition(order.getId(), toronto.getId(), OrderStatus.REJECTED, "machine down");

        assertEquals(0, matchingService.processPending());
        assertEquals(OrderStatus.REJECTED, orders.findById(order.getId()).orElseThrow().getStatus());
    }
}
