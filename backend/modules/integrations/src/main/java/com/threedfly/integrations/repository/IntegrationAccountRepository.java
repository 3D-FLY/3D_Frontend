package com.threedfly.integrations.repository;

import com.threedfly.integrations.entity.IntegrationAccount;
import com.threedfly.integrations.entity.ShopType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IntegrationAccountRepository extends JpaRepository<IntegrationAccount, Long> {
    Optional<IntegrationAccount> findFirstByShopIdAndProvider(Long shopId, ShopType provider);
    Optional<IntegrationAccount> findByShopIdAndProviderAndExternalShopId(Long shopId, ShopType provider, String externalShopId);
    Optional<IntegrationAccount> findByProviderAndExternalShopId(ShopType provider, String externalShopId);
}
