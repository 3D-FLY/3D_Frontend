package com.threedfly.orders.service;

import com.threedfly.orders.entity.Order;
import com.threedfly.orders.entity.OrderLedgerEntry;
import com.threedfly.orders.entity.OrderLedgerEntry.ActorType;
import com.threedfly.orders.entity.OrderStatus;
import com.threedfly.orders.repository.OrderLedgerRepository;
import com.threedfly.orders.repository.OrderRepository;
import com.threedfly.orders.service.OrderService.IngestItem;
import com.threedfly.orders.service.OrderService.IngestOrderCommand;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderLifecycleIntegrationTest {

    @Autowired private OrderService orderService;
    @Autowired private OrderRepository orders;
    @Autowired private OrderLedgerRepository ledger;

    @BeforeEach
    void clean() {
        ledger.deleteAll();
        orders.deleteAll();
    }

    private IngestOrderCommand command(String externalId) {
        return new IngestOrderCommand(
                "SHOPIFY", externalId, "#1001", "test-store.myshopify.com", 7L,
                "Dana Levi", "{\"city\":\"Toronto\",\"country\":\"Canada\"}",
                "CAD", new BigDecimal("42.50"),
                List.of(new IngestItem("li-1", "Benchy", 2, new BigDecimal("19.90"), "SKU-1", "555")));
    }

    @Test
    @DisplayName("Ingest creates RECEIVED order with items and an initial ledger entry")
    void ingestCreatesOrder() {
        Order order = orderService.ingest(command("1001"));

        assertEquals(OrderStatus.RECEIVED, order.getStatus());
        Order loaded = orderService.getWithItems(order.getId());
        assertEquals(1, loaded.getItems().size());
        assertEquals("Benchy", loaded.getItems().get(0).getTitle());
        assertEquals(2, loaded.getItems().get(0).getQuantity());

        List<OrderLedgerEntry> entries = orderService.getLedger(order.getId());
        assertEquals(1, entries.size());
        assertNull(entries.get(0).getFromStatus());
        assertEquals(OrderStatus.RECEIVED, entries.get(0).getToStatus());
        assertEquals(ActorType.SYSTEM, entries.get(0).getActorType());
    }

    @Test
    @DisplayName("Ingest is idempotent on (marketplace, externalOrderId)")
    void ingestIdempotent() {
        Order first = orderService.ingest(command("1001"));
        Order second = orderService.ingest(command("1001"));

        assertEquals(first.getId(), second.getId());
        assertEquals(1, orders.count());
        assertEquals(1, ledger.count());
    }

    @Test
    @DisplayName("Full happy path walks to DELIVERED with a complete ledger")
    void happyPathToDelivered() {
        Long id = orderService.ingest(command("1001")).getId();

        orderService.transition(id, OrderStatus.PRICED, ActorType.SYSTEM, null, "quoted 42.50");
        orderService.transition(id, OrderStatus.MATCHED, ActorType.SYSTEM, null, "matched partner 3");
        orderService.transition(id, OrderStatus.ACCEPTED, ActorType.PARTNER, 3L, null);
        orderService.transition(id, OrderStatus.IN_PRODUCTION, ActorType.PARTNER, 3L, null);
        orderService.transition(id, OrderStatus.SHIPPED, ActorType.PARTNER, 3L, "tracking CA123");
        Order done = orderService.transition(id, OrderStatus.DELIVERED, ActorType.SYSTEM, null, null);

        assertEquals(OrderStatus.DELIVERED, done.getStatus());
        List<OrderLedgerEntry> entries = orderService.getLedger(id);
        assertEquals(7, entries.size()); // ingest + 6 transitions
        assertEquals(OrderStatus.SHIPPED, entries.get(6).getFromStatus());
        assertEquals(OrderStatus.DELIVERED, entries.get(6).getToStatus());
    }

    @Test
    @DisplayName("Illegal transition throws and changes nothing")
    void illegalTransitionRejected() {
        Long id = orderService.ingest(command("1001")).getId();

        assertThrows(OrderService.InvalidTransitionException.class,
                () -> orderService.transition(id, OrderStatus.SHIPPED, ActorType.PARTNER, 3L, null));

        assertEquals(OrderStatus.RECEIVED, orders.findById(id).orElseThrow().getStatus());
        assertEquals(1, ledger.count()); // only the ingest entry
    }

    @Test
    @DisplayName("Rejected order can be re-matched (reassignment path)")
    void rejectionAndReassignment() {
        Long id = orderService.ingest(command("1001")).getId();
        orderService.transition(id, OrderStatus.PRICED, ActorType.SYSTEM, null, null);
        orderService.transition(id, OrderStatus.MATCHED, ActorType.SYSTEM, null, "partner 3");
        orderService.transition(id, OrderStatus.REJECTED, ActorType.PARTNER, 3L, "out of PLA");
        Order rematched = orderService.transition(id, OrderStatus.MATCHED, ActorType.SYSTEM, null, "partner 5");

        assertEquals(OrderStatus.MATCHED, rematched.getStatus());
    }

    @Test
    @DisplayName("Terminal states accept no transitions")
    void terminalStatesFrozen() {
        Long id = orderService.ingest(command("1001")).getId();
        orderService.transition(id, OrderStatus.CANCELLED, ActorType.SELLER, 9L, "customer cancelled");

        assertThrows(OrderService.InvalidTransitionException.class,
                () -> orderService.transition(id, OrderStatus.PRICED, ActorType.SYSTEM, null, null));
    }

    @Test
    @DisplayName("Admin override bypasses the map and is flagged in the ledger")
    void adminOverride() {
        Long id = orderService.ingest(command("1001")).getId();

        Order order = orderService.adminOverride(id, OrderStatus.SHIPPED, 1L, "partner shipped offline, fixing state");

        assertEquals(OrderStatus.SHIPPED, order.getStatus());
        List<OrderLedgerEntry> entries = orderService.getLedger(id);
        OrderLedgerEntry overrideEntry = entries.get(entries.size() - 1);
        assertTrue(overrideEntry.isOverride());
        assertEquals(ActorType.ADMIN, overrideEntry.getActorType());
        assertEquals(1L, overrideEntry.getActorId());
    }

    @Test
    @DisplayName("Admin override without a reason is refused")
    void adminOverrideRequiresReason() {
        Long id = orderService.ingest(command("1001")).getId();
        assertThrows(IllegalArgumentException.class,
                () -> orderService.adminOverride(id, OrderStatus.SHIPPED, 1L, "  "));
    }

    @Test
    @DisplayName("Unknown order id throws OrderNotFoundException")
    void unknownOrder() {
        assertThrows(OrderService.OrderNotFoundException.class,
                () -> orderService.transition(999L, OrderStatus.PRICED, ActorType.SYSTEM, null, null));
        assertThrows(OrderService.OrderNotFoundException.class, () -> orderService.getLedger(999L));
    }
}
