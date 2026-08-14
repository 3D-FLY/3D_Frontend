package com.threedfly.integrations.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.threedfly.orders.service.OrderService.IngestItem;
import com.threedfly.orders.service.OrderService.IngestOrderCommand;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Normalizes a Shopify orders/create webhook payload into the orders module's
 * ingest command. Only the fields the fulfillment loop needs — the raw payload
 * stays in webhook_event for anything else.
 */
@Component
public class ShopifyOrderParser {

    private final ObjectMapper om;

    public ShopifyOrderParser(ObjectMapper om) {
        this.om = om;
    }

    public IngestOrderCommand parse(String payload, String shopDomain, Long integrationAccountId) throws Exception {
        JsonNode root = om.readTree(payload);

        JsonNode idNode = root.path("id");
        if (idNode.isMissingNode() || idNode.isNull()) {
            throw new IllegalArgumentException("Shopify order payload has no id");
        }

        String customerName = null;
        JsonNode customer = root.path("customer");
        if (customer.isObject()) {
            customerName = (customer.path("first_name").asText("") + " "
                    + customer.path("last_name").asText("")).trim();
            if (customerName.isBlank()) customerName = null;
        }

        JsonNode shipping = root.path("shipping_address");
        String shippingJson = shipping.isObject() ? om.writeValueAsString(shipping) : null;

        List<IngestItem> items = new ArrayList<>();
        for (JsonNode li : root.path("line_items")) {
            items.add(new IngestItem(
                    li.path("id").isMissingNode() ? null : li.path("id").asText(),
                    li.path("title").asText(null),
                    li.path("quantity").asInt(1),
                    parseMoney(li.path("price")),
                    li.path("sku").asText(null),
                    li.path("product_id").isNull() || li.path("product_id").isMissingNode()
                            ? null : li.path("product_id").asText()
            ));
        }

        return new IngestOrderCommand(
                "SHOPIFY",
                idNode.asText(),
                root.path("name").asText(null),
                shopDomain,
                integrationAccountId,
                customerName,
                shippingJson,
                root.path("currency").asText(null),
                parseMoney(root.path("total_price")),
                items
        );
    }

    private static BigDecimal parseMoney(JsonNode node) {
        if (node == null || node.isMissingNode() || node.isNull()) return null;
        String text = node.asText();
        if (text == null || text.isBlank()) return null;
        return new BigDecimal(text);
    }
}
