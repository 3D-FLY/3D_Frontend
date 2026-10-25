---
name: new-shared-component
description: Use when about to create a new React component, to decide whether it should be shared (src/components/ui, src/features/dashboard/components) or feature/page-local, and to build it in this repo's component conventions.
---

# New shared component

## 1. Check that it doesn't already exist
Look through `src/features/dashboard/components/` and `src/components/ui/` first (the list is in `.claude/rules/components.md`). Extending an existing component with an optional prop beats a near-duplicate. The repo already has one such duplicate to avoid repeating: `NotificationList.tsx` vs `NotificationsList.tsx`.

## 2. Pick the location
| Used by | Put it in |
|---|---|
| Landing **and** dashboard, or auth, or several unrelated features | `src/components/ui/` (layout chrome → `src/components/layout/`) |
| 2+ dashboard pages or 2+ roles | `src/features/dashboard/components/` |
| One landing section / one feature | that feature folder, flat (`src/features/home/HowItWorks/HowItWorksStep.jsx`) |
| One page only | a non-exported function inside the page file (`SupplierModal` in `src/pages/dashboard/admin/SuppliersPage.jsx`) |

When a page-local component gets a second consumer, move it up one level. Don't import across sibling feature folders.

## 3. Write it (start from `template.md`)
- `.tsx`, PascalCase file name = default export name.
- `interface <Name>Props` above the component. Optional props get defaults in the destructuring. Always accept `className?: string` and append it last.
- Role-dependent behavior → take `role: SidebarRole` (import the type from `Sidebar.js`) instead of making one component per role.
- Styling per `.claude/rules/styling.md`: `*-green-500`, `zinc-*` on dark, glass surface only through `DashboardCard`/`EntityCard`, inline `style` only for runtime colors or JS layout constants.
- Icons from `lucide-react` at `size={16}` (dashboard), or SVG via `?url`/`?react`.
- Motion: if it animates on mount, follow `DashboardCard` (`initial={{ opacity: 0, y: 12 }}`, `transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}`) and accept an `index` prop for staggering.
- Comments in English, using `// ─── Section ───` dividers for long files.

## 4. If a TS file must import a JSX component
Add a colocated `.d.ts` (pattern: `src/features/network/WorldMap.d.ts`) or reuse a declaration in `src/vite-env.d.ts`.

## 5. Verify
`npx tsc --noEmit` (no new errors), then use it in at least one page and run `npm run dev`.
