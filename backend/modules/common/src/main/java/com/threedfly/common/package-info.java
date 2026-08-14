/**
 * Cross-cutting plumbing: event/job-queue abstraction, token encryption, shared config.
 *
 * Module rule: owns its own tables; other modules interact only through this
 * module's public services and published events — never its repositories.
 */
package com.threedfly.common;
