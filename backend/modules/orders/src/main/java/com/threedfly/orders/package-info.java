/**
 * Order lifecycle state machine, single source of truth for status, order ledger / audit trail.
 *
 * Module rule: owns its own tables; other modules interact only through this
 * module's public services and published events — never its repositories.
 */
package com.threedfly.orders;
