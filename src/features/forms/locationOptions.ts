import type { SelectOption } from "../../components/ui/SelectField.js";

// country-state-city is large, so it is only imported when a form needs it.
let countries: Promise<SelectOption[]> | null = null;
const citiesByCountry = new Map<string, Promise<SelectOption[]>>();

export function loadCountryOptions(): Promise<SelectOption[]> {
  countries ??= import("country-state-city").then(({ Country }) =>
    Country.getAllCountries().map((c) => ({ value: c.isoCode, label: c.name })),
  );
  return countries;
}

export function loadCityOptionsForCountry(isoCode: string): Promise<SelectOption[]> {
  let pending = citiesByCountry.get(isoCode);
  if (!pending) {
    pending = import("country-state-city").then(({ City }) => {
      const seen = new Set<string>();
      const options: SelectOption[] = [];
      for (const city of City.getCitiesOfCountry(isoCode) ?? []) {
        if (seen.has(city.name)) continue;
        seen.add(city.name);
        options.push({ value: city.name, label: city.name });
      }
      return options;
    });
    citiesByCountry.set(isoCode, pending);
  }
  return pending;
}
