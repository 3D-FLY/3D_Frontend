/**
 * Production cost engine (slicing/heuristic), shipping table engine, 3DFly fee, pricing records.
 *
 * Module rule: owns its own tables; other modules interact only through this
 * module's public services and published events — never its repositories.
 */
package com.threedfly.pricing;
