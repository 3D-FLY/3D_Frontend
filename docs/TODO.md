# Project TODO

## Must happen before launch

- [ ] **Stop loading all of `country-state-city` for the country list.**
  `src/features/forms/locationOptions.ts` → `loadCountryOptions()` does `import("country-state-city")`, which most likely pulls the whole package (including the city database, several MB) into the Join page and the supplier application, only to list ~250 countries.
  - Plan: replace it with a small static list of ISO 3166-1 alpha-2 codes + `Intl.DisplayNames(["en"], { type: "region" })` for the names. No library download.
  - Decide first: some country names stored in the sheets will change (e.g. "Czech Republic" → "Czechia"). Agree on the naming with whoever reads the sheets.
  - Verify: check the built chunk sizes before/after (`npm run build`, `dist/assets`), and that `/join` and `/join-as-partner` no longer request the large chunk.
  - Added 2026-11-15, deferred from the searchable Country field task.
