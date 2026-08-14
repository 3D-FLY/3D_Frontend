/**
 * Accounts and roles (ADMIN/SELLER/SUPPLIER); claims mapping over the managed auth provider.
 *
 * Module rule: owns its own tables; other modules interact only through this
 * module's public services and published events — never its repositories.
 */
package com.threedfly.users;
