package com.threedfly.integrations.provider;

import com.threedfly.catalog.entity.Product;
import com.threedfly.integrations.entity.IntegrationAccount;
import com.threedfly.integrations.entity.ProductSync;

/**
 * Marketplace adapter contract. Moved from the legacy `common` module (it
 * imports domain entities, so it belongs here) and retyped: the legacy
 * interface returned ResponseEntity<?>, which forced callers to parse HTTP
 * bodies to learn the external product id — the reason ProductSync records
 * were never written. Implementations are Spring beans named by provider key
 * (e.g. "shopify").
 */
public interface StoreProvider {

    /** Publishes the product and returns the external ids needed for sync tracking. */
    PublishResult publishProduct(PublishToStoreRequest req, Product product, IntegrationAccount account) throws Exception;

    /** Deletes the product from the external store. Throws on provider-side errors. */
    void deleteProduct(Product product, ProductSync syncRecord, IntegrationAccount account) throws Exception;

    record PublishResult(String externalProductId, String externalVariantId, boolean published) {}
}
