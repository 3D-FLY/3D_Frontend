package com.threedfly.integrations.service;

import com.threedfly.catalog.entity.Product;
import com.threedfly.catalog.repository.ProductRepository;
import com.threedfly.integrations.entity.IntegrationAccount;
import com.threedfly.integrations.entity.ProductSync;
import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.provider.PublishToStoreRequest;
import com.threedfly.integrations.provider.StoreProvider;
import com.threedfly.integrations.repository.IntegrationAccountRepository;
import com.threedfly.integrations.repository.ProductSyncRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.time.Instant;

/**
 * Orchestrates publishing catalog products to marketplaces. Extracted from
 * the legacy ProductService (catalog must not depend on integrations).
 *
 * Fix over legacy: publishing now UPSERTS a ProductSync record — the legacy
 * flow never wrote one, so delete-from-store (which requires it) failed for
 * every product published through the normal path.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PublishService {

    private final ProductRepository productRepository;
    private final IntegrationAccountRepository accounts;
    private final ProductSyncRepository productSyncs;
    private final ApplicationContext applicationContext;

    // Deliberately NOT @Transactional: the provider call is slow remote HTTP,
    // and the FAILED sync record must survive the exception that follows it.
    public ProductSync publish(Long productId, PublishToStoreRequest req) throws Exception {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        IntegrationAccount account = accounts.findById(req.getIntegrationAccountId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Integration account not found: " + req.getIntegrationAccountId()));

        StoreProvider provider = resolveProvider(account.getProvider());
        log.info("Publishing product {} to {} shop {}", productId, account.getProvider(), account.getExternalShopId());

        ProductSync sync = productSyncs
                .findByProductIdAndIntegrationAccountId(productId, account.getId())
                .orElseGet(() -> ProductSync.builder()
                        .productId(productId)
                        .integrationAccountId(account.getId())
                        .build());
        try {
            StoreProvider.PublishResult result = provider.publishProduct(req, product, account);
            sync.setExternalProductId(result.externalProductId());
            sync.setExternalVariantId(result.externalVariantId());
            sync.setSyncState(sync.getLastSyncedAt() == null ? "CREATED" : "UPDATED");
            sync.setLastSyncedAt(Instant.now());
            sync.setLastError(null);
        } catch (Exception e) {
            sync.setSyncState("FAILED");
            sync.setLastError(truncate(e.getMessage()));
            productSyncs.save(sync);
            throw e;
        }
        return productSyncs.save(sync);
    }

    public void deleteFromStore(Long productId, ShopType shopType) throws Exception {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        ProductSync sync = productSyncs.findByProductId(productId)
                .orElseThrow(() -> new IllegalArgumentException("No sync record for product: " + productId));
        IntegrationAccount account = accounts.findById(sync.getIntegrationAccountId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Integration account not found: " + sync.getIntegrationAccountId()));

        resolveProvider(shopType).deleteProduct(product, sync, account);
        productSyncs.delete(sync);
        log.info("Deleted product {} from {} and removed sync record", productId, shopType);
    }

    private StoreProvider resolveProvider(ShopType type) {
        return applicationContext.getBean(type.getValue(), StoreProvider.class);
    }

    private static String truncate(String msg) {
        if (msg == null) return null;
        return msg.length() <= 2000 ? msg : msg.substring(0, 2000);
    }
}
