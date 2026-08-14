package com.threedfly.orders.repository;

import com.threedfly.orders.entity.OrderLedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderLedgerRepository extends JpaRepository<OrderLedgerEntry, Long> {

    List<OrderLedgerEntry> findByOrderIdOrderByCreatedAtAscIdAsc(Long orderId);
}
