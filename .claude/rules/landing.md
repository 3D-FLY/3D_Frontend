---
paths:
  - "src/features/home/**"
  - "src/features/Explore/**"
  - "src/features/auth/**"
  - "src/features/network/**"
  - "src/pages/*.{jsx,tsx}"
  - "src/components/layout/**"
---

# Landing site (public pages)

## Structure
- Public routes are children of `MainLayout` in `src/App.jsx` (Navbar + `<main>` + Footer). Pages: `Home, About, Explore, FAQPage, Store, Blog, STLPricing, JoinAsPartnerPage, PartnerMapPage`, plus `/login` and `/register` (from `src/features/auth/`).
- `src/pages/Home.jsx` is a stack of full-width `<section>`s. The hero (`MainSection`) loads eagerly, and every other section is `lazy()` inside one `<Suspense fallback={null}>`.
- Section wrapper pattern (in `Home.jsx`): `relative isolate z-0 w-full overflow-hidden` + alternating `bg-dark` / `bg-gray` + viewport heights via `h-[calc(100svh-var(--nav-h))]` on mobile and `lg:h-[calc(100dvh-var(--nav-h))]` on desktop. Use `--nav-h` (defined in `src/index.css`) and never a literal 72px.
- Each section is a folder in `src/features/home/<Section>/` with its main component, sub-components, a data file (`featuresData.tsx`, `howItWorksData.js`), `assets/{icons,images}/`, and `icons/` (JSX icon components plus an `index.js` barrel, see `src/features/home/Features/icons/index.js`).
- Explore content is data-driven: `EXPLORE_CONTENT` in `src/features/Explore/exploreContent.ts` is rendered by `src/pages/Explore.jsx` (scroll-tracked steps with `useInView`, progress dots).

## Mobile / desktop split
- When mobile and desktop layouts differ structurally, create **two components** and toggle them with CSS. Don't use JS width checks:
  `src/features/home/WhatCanYouSell/WhatCanYouSell.tsx` renders `<div className="md:hidden"><WhatCanYouSellMobile/></div>` + `<div className="hidden md:block"><WhatCanYouSellDesktop/></div>`.
  The same pattern shows up at card level: `InfoCardMobile.tsx` / `InfoCardDesktop.tsx` in `src/features/home/Features/` and `HowItWorksStepMobile.tsx`.
- Naming: `<Name>Mobile.tsx`, `<Name>Desktop.tsx`, and a parent `<Name>.tsx` that switches between them.
- For small differences, use responsive utilities in one component (`px-6 md:px-10`, `hidden md:grid` in `Features.jsx`).
- Open question: the split breakpoint is `md` (WhatCanYouSell, Features), `lg` (HowItWorks), or `xl`/1280px (Navbar menu). Match the section you're in.

## Shared visuals
- Backgrounds and glows: `Background` (inner content pages: About, Blog, FAQ…), `GlowCircle` / `AmbientGlowBackdrop` (auth, partner map), section-specific `*Glow.jsx` (`MainSectionGlow.jsx`, `HowItWorksGlow.jsx`).
- `Turtle` (logo watermark, positioned with `right/bottom/translateX/translateY/opacity`) and `SectionTitle` (heading over the `IconTitleUnderline` graphic, `variant="tall" | "flat"`).
- Primary CTA → `Button` from `src/components/ui/Button.jsx` (default label "TRY NOW", `variant`, `size`, `hovering`).

## Maps
- The world map is `src/features/network/WorldMap.jsx` (react-simple-maps). Partner locations come from `PartnerLocationsContext.jsx` (provider wraps the whole app in `App.jsx`). City search options load lazily from country-state-city through `cityOptionsLoader.js` (cached promise). Keep that library behind the dynamic `import()` because it's large.
- TS consumers of these JSX modules rely on the `.d.ts` shims (`WorldMap.d.ts`, `PartnerLocationsContext.d.ts`).

## File upload
- Accepted model types are `.stl,.obj,.3mf` (`src/features/home/FileUploader/FileUploader.jsx`, `src/pages/dashboard/seller/AddProduct.tsx`). 3MF print settings aren't parsed yet: `AddProduct.tsx` fills `MOCK_3MF_SETTINGS` when the file name ends in `.3mf`. Don't describe it as real parsing.

## Open questions
- `src/features/Explore/` has stray assets (`12/` duplicates, `ChatGPT Image …png`, `6 (2).png`) that `exploreContent.ts` partly imports. Don't add more files with names like that.
