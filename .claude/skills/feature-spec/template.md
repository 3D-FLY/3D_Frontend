<!-- DRAFT template: section list pending the user's review (the user has their own 8-section format). -->

# Spec: <Feature name>

**Author:** <name> · **Date:** <YYYY-MM-DD> · **Status:** Draft

## 1. Goal
What problem this solves and for whom, in 2–4 sentences. What is true when it's done.

## 2. Users & roles
| Role (`admin` / `seller` / `supplier`) | What they can see / do |
|---|---|

## 3. Routes & navigation
| Path | Page file (`src/pages/dashboard/<role>/<Role><Name>.tsx`) | Sidebar item? | Notes |
|---|---|---|---|

## 4. UI
- Layout: `DashboardLayout` → `DashboardPage` → cards (list them in order, with titles in title case).
- Reused components: `DashboardCard`, `DashboardTable`, `StatusBadge`, `OrderStatusPill`, `Modal`, `Input`, …
- New components (and where they live, per `.claude/rules/components.md`):
- Design reference: <Figma link / screenshot>
- Mobile behavior: <see mobile-screen skill, or "desktop only">

## 5. Data
- Entities read: `mockOrders` / `mockProducts` / `mockSellers` / `mockSuppliers` / `mockNotifications`
- Entities written / new fields (with types):
- IDs involved: `SEL-…`, `SUP-…`, `<sellerId>-PRD-…`, `#00nn`
- Cross-role impact (which other dashboards show these records):
- Statuses used (`ORDER_STATUS_CONFIG` keys):

## 6. States & edge cases
Empty, loading (`DashboardCard loading`), not found (bad `:id`), error, permission (wrong role), long text, many rows.

## 7. Out of scope
Explicitly not part of this task.

## 8. Acceptance criteria
- [ ] <Route> renders for <role> with <elements>
- [ ] <Interaction> results in <state change visible in role X and Y>
- [ ] `npx tsc --noEmit` and `npm run lint` add no new errors
- [ ] Copy uses project terms ("Notifications", title case)

### Open questions
- 
