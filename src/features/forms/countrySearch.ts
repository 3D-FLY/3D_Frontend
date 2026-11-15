import type { SelectOption } from "../../components/ui/SelectField.js";

// Country search shared by the mobile sheet and the desktop select.
// Options are { value: ISO 3166-1 alpha-2 code, label: country name }.

/** Lowercase, trimmed, accents removed ("Côte" → "cote"). */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// Common names people type that do not appear in the official names.
const ALIASES: Record<string, string> = {
  uk: "GB",
  "great britain": "GB",
  britain: "GB",
  england: "GB",
  usa: "US",
  america: "US",
  uae: "AE",
  emirates: "AE",
};

/**
 * Ranked matches: exact ISO code or alias ("de", "uk") first, then names
 * starting with the query, then names containing it. Empty query returns the list unchanged.
 */
export function searchCountries(
  options: readonly SelectOption[],
  query: string,
): SelectOption[] {
  const q = normalize(query);
  if (!q) return [...options];
  const aliasCode = ALIASES[q];
  const exact: SelectOption[] = [];
  const prefix: SelectOption[] = [];
  const contains: SelectOption[] = [];
  for (const option of options) {
    const name = normalize(option.label);
    if (option.value.toLowerCase() === q || option.value === aliasCode) exact.push(option);
    else if (name.startsWith(q)) prefix.push(option);
    else if (name.includes(q)) contains.push(option);
  }
  return [...exact, ...prefix, ...contains];
}

/**
 * Country code suggested from the browser languages, without asking for location.
 * Uses an explicit region ("en-GB" → GB) first; otherwise infers it from a
 * single-country language ("he" → IL). English, Spanish, etc. are too ambiguous.
 */
export function suggestedCountryCode(): string | undefined {
  if (typeof navigator === "undefined") return undefined;
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  try {
    for (const lang of languages) {
      const region = new Intl.Locale(lang).region;
      if (region) return region;
    }
    const first = languages[0];
    if (!first) return undefined;
    const locale = new Intl.Locale(first);
    if (["en", "es", "fr", "ar", "pt", "de", "zh", "ru"].includes(locale.language)) return undefined;
    return locale.maximize().region;
  } catch {
    return undefined;
  }
}
