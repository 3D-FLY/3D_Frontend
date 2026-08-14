package com.threedfly.integrations.repository;

import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.entity.WebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long> {

    boolean existsByProviderAndWebhookId(ShopType provider, String webhookId);

    List<WebhookEvent> findByStatusOrderByReceivedAtAsc(WebhookEvent.Status status);
}
