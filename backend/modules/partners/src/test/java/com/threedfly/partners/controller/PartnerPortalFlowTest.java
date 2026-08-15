package com.threedfly.partners.controller;

import com.threedfly.orders.entity.Order;
import com.threedfly.orders.entity.OrderLedgerEntry;
import com.threedfly.orders.entity.OrderStatus;
import com.threedfly.orders.repository.OrderLedgerRepository;
import com.threedfly.orders.repository.OrderRepository;
import com.threedfly.orders.service.OrderService;
import com.threedfly.partners.entity.Partner;
import com.threedfly.partners.repository.PartnerRepository;
import com.threedfly.partners.service.OrderMatchingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * The partner's day in the life, over HTTP: see the job → accept → start
 * production → ship with tracking. Plus the server-side guard that a partner
 * can only act on orders assigned to them.
 */
@SpringBootTest
@AutoConfigureMockMvc
class PartnerPortalFlowTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private OrderService orderService;
    @Autowired private OrderMatchingService matchingService;
    @Autowired private OrderRepository orders;
    @Autowired private OrderLedgerRepository ledger;
    @Autowired private PartnerRepository partners;

    private Partner toronto;
    private Partner berlin;
    private Long orderId;

    @BeforeEach
    void setUp() {
        ledger.deleteAll();
        orders.deleteAll();
        partners.deleteAll();
        toronto = partners.save(Partner.builder().name("Toronto Prints").email("t@x.com")
                .latitude(43.7000).longitude(-79.4000).verified(true).active(true).build());
        berlin = partners.save(Partner.builder().name("Berlin 3D").email("b@x.com")
                .latitude(52.5200).longitude(13.4050).verified(true).active(true).build());

        orderId = orderService.ingest(new OrderService.IngestOrderCommand(
                "SHOPIFY", "9001", "#9001", "s.myshopify.com", null, "Dana Levi",
                "{\"city\":\"Toronto\",\"country\":\"Canada\",\"latitude\":43.6532,\"longitude\":-79.3832}",
                "CAD", new BigDecimal("42.50"), List.of())).getId();
        matchingService.processPending(); // → MATCHED to toronto
    }

    @Test
    @DisplayName("Full portal flow: jobs → accept → start → ship, ledger records every step")
    void fullFlow() throws Exception {
        mockMvc.perform(get("/partner-portal/{pid}/jobs", toronto.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orderId").value(orderId))
                .andExpect(jsonPath("$[0].status").value("MATCHED"))
                .andExpect(jsonPath("$[0].orderNumber").value("#9001"));

        mockMvc.perform(post("/partner-portal/{pid}/jobs/{oid}/accept", toronto.getId(), orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACCEPTED"));

        mockMvc.perform(post("/partner-portal/{pid}/jobs/{oid}/start", toronto.getId(), orderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PRODUCTION"));

        mockMvc.perform(post("/partner-portal/{pid}/jobs/{oid}/ship", toronto.getId(), orderId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"trackingNumber\":\"CA123456\",\"carrier\":\"CanadaPost\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHIPPED"));

        Order shipped = orders.findById(orderId).orElseThrow();
        assertEquals("CA123456", shipped.getTrackingNumber());
        assertEquals("CanadaPost", shipped.getTrackingCarrier());

        List<OrderLedgerEntry> entries = orderService.getLedger(orderId);
        // ingest, PRICED, MATCHED, ACCEPTED, IN_PRODUCTION, SHIPPED
        assertEquals(6, entries.size());
        assertTrue(entries.stream().anyMatch(e ->
                e.getActorType() == OrderLedgerEntry.ActorType.PARTNER
                        && e.getToStatus() == OrderStatus.SHIPPED
                        && e.getReason().contains("CA123456")));
    }

    @Test
    @DisplayName("A partner cannot act on an order assigned to someone else (403)")
    void wrongPartnerForbidden() throws Exception {
        mockMvc.perform(post("/partner-portal/{pid}/jobs/{oid}/accept", berlin.getId(), orderId))
                .andExpect(status().isForbidden());
        assertEquals(OrderStatus.MATCHED, orders.findById(orderId).orElseThrow().getStatus());
    }

    @Test
    @DisplayName("Reject flow returns the order to the pool; rematch assigns the other partner")
    void rejectAndRematch() throws Exception {
        mockMvc.perform(post("/partner-portal/{pid}/jobs/{oid}/reject", toronto.getId(), orderId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"reason\":\"printer down\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"));

        matchingService.processPending();

        Order rematched = orders.findById(orderId).orElseThrow();
        assertEquals(OrderStatus.MATCHED, rematched.getStatus());
        assertEquals(berlin.getId(), rematched.getPartnerId());
    }

    @Test
    @DisplayName("Shipping before production start is a state-machine conflict (409)")
    void shipBeforeStartConflicts() throws Exception {
        mockMvc.perform(post("/partner-portal/{pid}/jobs/{oid}/accept", toronto.getId(), orderId))
                .andExpect(status().isOk());
        mockMvc.perform(post("/partner-portal/{pid}/jobs/{oid}/ship", toronto.getId(), orderId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"trackingNumber\":\"CA1\",\"carrier\":\"CP\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Jobs list is scoped to the requesting partner")
    void jobsScopedToPartner() throws Exception {
        mockMvc.perform(get("/partner-portal/{pid}/jobs", berlin.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}
