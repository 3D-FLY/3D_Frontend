package com.threedfly.integrations.shopify;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.threedfly.catalog.entity.Product;
import com.threedfly.common.util.StoreUtils;
import com.threedfly.integrations.entity.IntegrationAccount;
import com.threedfly.integrations.entity.ProductSync;
import com.threedfly.integrations.provider.PublishToStoreRequest;
import com.threedfly.integrations.provider.StoreProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Shopify implementation of StoreProvider via the Admin GraphQL API:
 * productCreate → set variant price → attach media → publish to Online Store.
 * Ported from product-service; hardened: userErrors checked after create
 * (legacy read the product id blindly), slf4j instead of stdout, media URL
 * built from app.public-base-url instead of ngrok system properties.
 */
@Service("shopify")
@Slf4j
public class ShopifyProvider implements StoreProvider {

    private final ObjectMapper om;
    private final ShopifyGraphQLService graphQL;

    @Value("${app.public-base-url:http://localhost:8080}")
    private String publicBaseUrl;

    public ShopifyProvider(ObjectMapper om, ShopifyGraphQLService graphQL) {
        this.om = om;
        this.graphQL = graphQL;
    }

    @Override
    public PublishResult publishProduct(PublishToStoreRequest req, Product product,
                                        IntegrationAccount account) throws Exception {
        log.info("Publishing product {} ('{}') to Shopify shop {}",
                product.getId(), product.getName(), account.getExternalShopId());

        String createRaw = createProduct(req, account, product);
        JsonNode createJson = om.readTree(createRaw);
        failOnErrors(createJson, "/data/productCreate/userErrors", "productCreate");

        String productGid = createJson.at("/data/productCreate/product/id").asText();
        String defaultVariantId = createJson.at("/data/productCreate/product/variants/nodes/0/id").asText();
        if (productGid.isBlank()) {
            throw new IllegalStateException("Shopify productCreate returned no product id: " + createRaw);
        }

        setVariantPrice(defaultVariantId, product, productGid, account);
        setProductMedia(product, productGid, account);
        boolean published = publishToOnlineStore(account.getExternalShopId(), account.getAccessToken(), productGid);

        log.info("Product {} published to Shopify as {} (published={})", product.getId(), productGid, published);
        return new PublishResult(productGid, defaultVariantId, published);
    }

    @Override
    public void deleteProduct(Product product, ProductSync syncRecord, IntegrationAccount account) throws Exception {
        String shopifyProductId = syncRecord.getExternalProductId();
        String deleteMutation = """
                mutation productDelete($input: ProductDeleteInput!) {
                  productDelete(input: $input) {
                    deletedProductId
                    userErrors { field message }
                  }
                }
            """;

        ObjectNode deleteInput = om.createObjectNode().put("id", shopifyProductId);
        ObjectNode variables = om.createObjectNode();
        variables.set("input", deleteInput);

        String deleteResponse = graphQL.postGraphQL(
                account.getExternalShopId(), account.getAccessToken(),
                deleteMutation, om.writeValueAsString(variables));

        JsonNode deleteJson = om.readTree(deleteResponse);
        failOnErrors(deleteJson, "/data/productDelete/userErrors", "productDelete");
        log.info("Deleted Shopify product {} for local product {}", shopifyProductId, product.getId());
    }

    private String createProduct(PublishToStoreRequest request, IntegrationAccount acct, Product product) throws Exception {
        String createMutation = """
                mutation CreateProduct($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
                  productCreate(product: $product, media: $media) {
                    product {
                      id
                      variants(first: 1) { nodes { id inventoryItem { id } } }
                    }
                    userErrors { field message }
                  }
                }
                """;

        String status = StoreUtils.coalesce(request.getStatus(), "ACTIVE");
        ObjectNode productNode = om.createObjectNode()
                .put("title", product.getName())
                .put("status", status)
                .put("descriptionHtml", product.getDescription() == null ? "" : product.getDescription());

        ObjectNode createVars = om.createObjectNode();
        createVars.set("product", productNode);

        return graphQL.postGraphQL(
                acct.getExternalShopId(), acct.getAccessToken(), createMutation, om.writeValueAsString(createVars));
    }

    private void setVariantPrice(String defaultVariantId, Product product, String productGid,
                                 IntegrationAccount acct) throws Exception {
        String bulkUpdate = """
                mutation SetVariantPrice($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
                  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
                    product { id variants(first: 10) { nodes { id price inventoryItem { id } } } }
                    userErrors { field message }
                  }
                }
                """;

        ArrayNode variantsArr = om.createArrayNode();
        ObjectNode v = om.createObjectNode();
        v.put("id", defaultVariantId);
        v.put("price", String.format("%.2f", product.getPrice()));
        variantsArr.add(v);

        ObjectNode bulkVars = om.createObjectNode();
        bulkVars.put("productId", productGid);
        bulkVars.set("variants", variantsArr);

        graphQL.postGraphQL(
                acct.getExternalShopId(), acct.getAccessToken(), bulkUpdate, om.writeValueAsString(bulkVars));
    }

    private void setProductMedia(Product product, String productGid, IntegrationAccount acct) throws Exception {
        if (product.getImageData() == null || product.getImageData().length == 0) {
            log.debug("No image data for product {} — skipping media step", product.getId());
            return;
        }

        // Shopify fetches media by URL, so this deployment must be publicly
        // reachable at app.public-base-url (ngrok in dev, ALB URL in prod).
        String imageUrl = publicBaseUrl + "/products/" + product.getId() + "/image";

        String updateMedia = """
                mutation UpdateProductWithNewMedia($product: ProductUpdateInput!, $media: [CreateMediaInput!]) {
                  productUpdate(product: $product, media: $media) {
                    product { id media(first: 10) { nodes { alt mediaContentType preview { status } } } }
                    userErrors { field message }
                  }
                }
                """;

        ObjectNode productInput = om.createObjectNode().put("id", productGid);
        ArrayNode mediaToAdd = om.createArrayNode();
        ObjectNode m = om.createObjectNode();
        m.put("originalSource", imageUrl);
        m.put("mediaContentType", "IMAGE");
        if (product.getImageFilename() != null) {
            m.put("alt", product.getImageFilename());
        }
        mediaToAdd.add(m);

        ObjectNode vars = om.createObjectNode();
        vars.set("product", productInput);
        vars.set("media", mediaToAdd);

        graphQL.postGraphQL(
                acct.getExternalShopId(), acct.getAccessToken(), updateMedia, om.writeValueAsString(vars));
        log.debug("Attached media {} to Shopify product {}", imageUrl, productGid);
    }

    private boolean publishToOnlineStore(String shopDomain, String accessToken, String productGid) throws Exception {
        String publicationId = fetchOnlineStorePublicationId(shopDomain, accessToken);
        if (publicationId == null) {
            throw new IllegalStateException("Could not find 'Online Store' publication on this shop");
        }

        String publishMutation = """
                mutation Publish($id: ID!, $input: [PublicationInput!]!) {
                  publishablePublish(id: $id, input: $input) {
                    publishable { publicationCount }
                    userErrors { field message }
                  }
                }
                """;

        ObjectNode vars = om.createObjectNode();
        vars.put("id", productGid);
        ArrayNode inputArr = om.createArrayNode();
        ObjectNode pub = om.createObjectNode();
        pub.put("publicationId", publicationId);
        inputArr.add(pub);
        vars.set("input", inputArr);

        String publishRaw = graphQL.postGraphQL(shopDomain, accessToken, publishMutation, om.writeValueAsString(vars));
        JsonNode root = om.readTree(publishRaw);
        failOnErrors(root, "/data/publishablePublish/userErrors", "publishablePublish");

        return root.at("/data/publishablePublish/publishable/publicationCount").asInt() > 0;
    }

    private String fetchOnlineStorePublicationId(String shopDomain, String accessToken) throws Exception {
        String publicationsQuery = """
                query {
                  publications(first: 25) {
                    edges { node { id name } }
                  }
                }
                """;

        String publicationsRaw = graphQL.postGraphQL(shopDomain, accessToken, publicationsQuery, null);
        JsonNode root = om.readTree(publicationsRaw);
        failOnErrors(root, null, "publications");

        JsonNode edges = root.path("data").path("publications").path("edges");
        if (!edges.isArray()) return null;
        for (JsonNode edge : edges) {
            if ("Online Store".equals(edge.path("node").path("name").asText())) {
                return edge.path("node").path("id").asText();
            }
        }
        return null;
    }

    /** Throws if the response carries GraphQL-level errors or non-empty userErrors at the given pointer. */
    private void failOnErrors(JsonNode root, String userErrorsPointer, String operation) {
        JsonNode gqlErrors = root.path("errors");
        if (gqlErrors.isArray() && gqlErrors.size() > 0) {
            throw new IllegalStateException("Shopify " + operation + " GraphQL errors: " + gqlErrors);
        }
        if (userErrorsPointer != null) {
            JsonNode userErrors = root.at(userErrorsPointer);
            if (userErrors.isArray() && userErrors.size() > 0) {
                throw new IllegalStateException("Shopify " + operation + " userErrors: " + userErrors);
            }
        }
    }
}
