/**
 * Outbound email/alerts on lifecycle events: partner job alerts, seller status updates.
 *
 * Module rule: owns its own tables; other modules interact only through this
 * module's public services and published events — never its repositories.
 */
package com.threedfly.notifications;
