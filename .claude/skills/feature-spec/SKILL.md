---
name: feature-spec
description: Use when the user asks for a spec, brief, or task write-up to hand a feature to another developer (or another agent). Produces a structured 8-section product spec grounded in this repo's roles, routes, components, and mock data.
---

# Feature spec

> **DRAFT: the section list is a proposal pending the user's review.** The user has their own 8-section format. Replace the sections in `template.md` once they provide it.

## Steps
1. Ask the requester for (or infer from the conversation) the goal, which roles are affected, and any designs (Figma links). Don't invent business rules. Put unknowns under **Open questions** in the spec.
2. Ground every section in the repo:
   - Roles: only `admin`, `seller`, `supplier` (`SidebarRole`).
   - Routes: exact `/dashboard/<role>/<page>` paths and whether a sidebar item is added (`src/features/dashboard/components/Sidebar.tsx`).
   - UI: name the existing components to reuse (`DashboardCard`, `DashboardTable`, `StatusBadge`, `OrderStatusPill`, `Modal`, `Input`…) and flag anything genuinely new.
   - Data: which `src/data/*` entities and fields are read or written, the ID formats (`SEL-001`, `SUP-001`, `SEL-001-PRD-001`, `#0041`), new fields, and which other roles see the same records.
   - Status/labels: reference `ORDER_STATUS_CONFIG` keys, not free text.
3. Use project vocabulary ("Notifications", "My Store", "Suppliers", "Capabilities") and title-case UI strings.
4. Fill `template.md` and save it where the user asks. If they don't say, return it in chat. Don't create a docs folder on your own.
5. Acceptance criteria must be checkable in `npm run dev` (route, visible element, state) plus "no new `tsc`/lint errors".
