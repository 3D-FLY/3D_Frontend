package com.threedfly.orders.repository;

import com.threedfly.orders.entity.Order;
import com.threedfly.orders.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByMarketplaceAndExternalOrderId(String marketplace, String externalOrderId);

    List<Order> findByStatusOrderByReceivedAtAsc(OrderStatus status);

    List<Order> findAllByOrderByReceivedAtDesc();

    @Query("select o from Order o left join fetch o.items where o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);
}
