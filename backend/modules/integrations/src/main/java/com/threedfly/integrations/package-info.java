/**
 * Marketplace connectors (Shopify): OAuth, order webhooks, reconciliation, fulfillment push-back.
 *
 * Module rule: owns its own tables; other modules interact only through this
 * module's public services and published events — never its repositories.
 */
package com.threedfly.integrations;
