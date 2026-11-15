import { useEffect, useMemo, useState } from "react";
import SearchableChoiceField from "../../components/ui/SearchableChoiceField.js";
import type { SelectOption } from "../../components/ui/SelectField.js";
import { searchCountries, suggestedCountryCode } from "./countrySearch.js";
import { loadCountryOptions } from "./locationOptions.js";

interface CountryFieldProps {
  label: string;
  value: SelectOption | null;
  onChange: (next: SelectOption | null) => void;
  error?: string | undefined;
  compact?: boolean;
  className?: string;
}

// Country picker for the public forms: search sheet on mobile, searchable select
// on desktop, with a suggestion from the browser language at the top.
export default function CountryField({
  label,
  value,
  onChange,
  error,
  compact = false,
  className = "",
}: CountryFieldProps) {
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const suggestedValue = useMemo(() => suggestedCountryCode(), []);

  useEffect(() => {
    let cancelled = false;
    loadCountryOptions()
      .then((options) => !cancelled && setCountries(options))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SearchableChoiceField
      label={label}
      options={countries}
      value={value}
      onChange={onChange}
      search={searchCountries}
      suggestedValue={suggestedValue}
      isLoading={loading}
      error={error}
      compact={compact}
      placeholder="Select your country"
      searchPlaceholder="Search countries"
      noResultsText="No countries found"
      loadingText="Loading countries…"
      allHeading="All countries"
      className={className}
    />
  );
}
