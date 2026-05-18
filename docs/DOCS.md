# 3D-Fly Frontend — Internal Docs

Internal technical reference for contributors and maintainers.

---

## 1. Architecture Overview

### Feature-based folder structure

Code is organized by domain, not by file type. Each feature owns its components, hooks, assets, and types:

```
src/features/<feature>/
├── components/     # Components used only within this feature
├── hooks/          # Feature-local hooks
├── assets/         # Icons and images scoped to this feature
└── index.ts        # Public API — re-exports what other features may import
```

Anything shared across two or more features lives in `src/components/` or `src/hooks/`.

### Shared vs feature-local components

| Location | Rule |
|---|---|
| `src/components/ui/` | Truly generic primitives (Button, Background, Tooltip…) |
| `src/components/layout/` | Page-level layout (Navbar, Footer, SocialIcons…) |
| `src/features/<x>/components/` | Used only inside feature `x` — do not import cross-feature |

If a feature-local component is needed by a second feature, move it to `src/components/` first.

### Routing structure

Routing is handled with React Router v6 in `src/App.jsx`.

- Top-level routes map to pages in `src/pages/`.
- Dashboard routes are nested under a shared `DashboardLayout` wrapper and branch by `role`:

```
/admin/*   →  DashboardLayout role="admin"
/shop/*    →  DashboardLayout role="shop"
```

---

## 2. Design System

### Colors

| Token | Value | Usage |
|---|---|---|
| Brand green | `#5ac422` | Primary CTAs, active states, highlights |
| Dark background | `rgba(5, 10, 7, 0.7)` | Card and panel backgrounds |
| Status — info | `#3b82f6` (blue) | Informational badges |
| Status — processing | `#06b6d4` (cyan) | In-progress states |
| Status — warning | `#f97316` (orange) | Pending / attention needed |
| Status — success | `#22c55e` (green) | Completed / healthy |
| Status — error | `#ef4444` (red) | Failed / critical |

### Typography conventions

- Font scale follows Tailwind defaults (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`).
- Dashboard headings use `font-semibold`; body copy uses `font-normal`.
- All UI copy is in English; labels and status strings are defined as constants — never inline.

### `DashboardCard` component

Located at [src/features/dashboard/components/DashboardCard.tsx](../src/features/dashboard/components/DashboardCard.tsx).

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Card heading |
| `value` | `string \| number` | Primary metric displayed |
| `icon` | `ReactNode` | Icon rendered in the card header |
| `trend` | `number?` | Optional delta percentage (positive = green, negative = red) |
| `className` | `string?` | Additional Tailwind classes for layout overrides |

### `DashboardLayout` component

Located at [src/features/dashboard/DashboardLayout.tsx](../src/features/dashboard/DashboardLayout.tsx).

| Prop | Type | Description |
|---|---|---|
| `role` | `"admin" \| "shop"` | Determines sidebar links and visible sections |
| `children` | `ReactNode` | Page content rendered in the main area |

The layout composes `Sidebar` + `ScrollableContent`. Pass `role` down from the route definition — never derive it from local state.

### `ScrollableContent` component

Provides a scrollable main area that accounts for the fixed navbar and sidebar offsets using the `NAVBAR_H` and `SIDEBAR_W` constants. Do not add manual `padding-top` or `margin-left` to page components — let `ScrollableContent` handle the offset.

---

## 3. Key Conventions

### Constants over magic numbers

Shared layout constants live in `src/features/dashboard/` or a dedicated constants file. Always reference them by name:

```ts
// correct
height: `calc(100vh - ${NAVBAR_H}px)`

// wrong
height: 'calc(100vh - 64px)'
```

### Types

All shared TypeScript types go in `src/types/`. Feature-specific types may be colocated inside the feature folder but must not be imported outside it.

### Icons

| Location | Rule |
|---|---|
| `src/assets/icons/` | Icons reused across multiple features |
| `src/features/<x>/assets/icons/` | Icons used only within feature `x` |
| `src/features/<x>/icons/` | JSX icon wrapper components for feature `x` |

Prefer SVG imports over icon libraries. Wrap raw SVGs in a small JSX component when you need dynamic color or size props.

### Change discipline

Prefer small, targeted changes over large rewrites. When touching a component, change only what the task requires. Avoid opportunistic refactors in the same PR.

---

## 4. Animations

All animations use **Framer Motion**.

### Patterns in use

| Pattern | Usage |
|---|---|
| Page enter | `opacity: 0 → 1`, `y: 16 → 0`, duration `0.3s` |
| Card stagger | Parent `staggerChildren: 0.07`, each child fades + slides up |
| Count-up | Animated number from `0` to target value on mount |

### Rules

- Maximum duration: **0.4 s**. Nothing slower.
- Easing: **`easeOut`** only. Do not use `easeIn`, `easeInOut`, or spring for UI transitions.
- No `scale` transforms on interactive elements — they cause layout jank on lower-end devices.
- Keep `initial` / `animate` variants in the component file; do not define them inline in JSX props when the same variant is reused more than once.

---

## 5. Current Pages — Admin Dashboard

| Route | Page | Description |
|---|---|---|
| `/admin` | Home | KPI cards, recent activity, production carousel |
| `/admin/users` | Users | User list, roles, account status |
| `/admin/suppliers` | Suppliers | Registered print farms, status badges |
| `/admin/map` | Supplier Map | Interactive world map of active supplier locations |
| `/admin/orders` | Orders | Order list with status filtering |
| `/admin/settings` | Settings | Platform-level configuration |

The sidebar component at [src/features/dashboard/components/Sidebar.tsx](../src/features/dashboard/components/Sidebar.tsx) drives navigation for all admin routes.
