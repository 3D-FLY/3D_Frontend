import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, Search } from "lucide-react";
import BottomSheet from "./BottomSheet.js";
import ChoiceTrigger from "./ChoiceTrigger.js";
import FieldShell from "./FieldShell.js";
import SelectField, { type SelectOption } from "./SelectField.js";

interface SearchableChoiceFieldProps {
  label: string;
  options: readonly SelectOption[];
  value: SelectOption | null;
  onChange: (next: SelectOption | null) => void;
  /** Ranked filtering; defaults to a case-insensitive "contains" */
  search?: (options: readonly SelectOption[], query: string) => SelectOption[];
  /** Option value shown in a "Suggested" group at the top */
  suggestedValue?: string | undefined;
  error?: string | undefined;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
  loadingText?: string;
  /** Heading above the full list when a suggestion is shown */
  allHeading?: string;
  isLoading?: boolean;
  /** Compact FieldShell layout and bordered surfaces */
  compact?: boolean;
  className?: string;
}

const defaultSearch = (options: readonly SelectOption[], query: string) => {
  const q = query.trim().toLowerCase();
  return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : [...options];
};

// Long single-choice list with search (e.g. Country):
// - below lg: a field that opens a tall bottom sheet with a search box and a list
//   (combobox pattern: arrows move the highlight, Enter chooses).
// - lg+: the searchable SelectField.
export default function SearchableChoiceField({
  label,
  options,
  value,
  onChange,
  search = defaultSearch,
  suggestedValue,
  error,
  placeholder = "Select…",
  searchPlaceholder = "Search",
  noResultsText = "No results found",
  loadingText = "Loading…",
  allHeading = "All",
  isLoading = false,
  compact = false,
  className = "",
}: SearchableChoiceFieldProps) {
  const id = useId();
  const ids = {
    trigger: `${id}-trigger`,
    label: `${id}-label`,
    value: `${id}-value`,
    error: `${id}-error`,
    input: `${id}-search`,
    list: `${id}-list`,
    suggested: `${id}-suggested`,
    all: `${id}-all`,
    option: (i: number) => `${id}-opt-${i}`,
  };
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const suggested = suggestedValue ? options.find((o) => o.value === suggestedValue) : undefined;
  const results = useMemo(() => search(options, query), [search, options, query]);
  const showSuggested = Boolean(suggested) && !query.trim();
  // Flat row list for keyboard navigation: [suggested?, ...results]
  const rows = useMemo(
    () => (showSuggested && suggested ? [suggested, ...results] : results),
    [showSuggested, suggested, results],
  );
  const offset = showSuggested ? 1 : 0;

  const openSheet = () => {
    setQuery("");
    const selectedIndex = value ? options.findIndex((o) => o.value === value.value) : -1;
    const isSuggested = Boolean(value && suggested && value.value === suggested.value);
    setActive(isSuggested ? 0 : selectedIndex >= 0 ? selectedIndex + (suggested ? 1 : 0) : 0);
    setOpen(true);
  };

  const choose = (option: SelectOption | undefined) => {
    if (!option) return;
    onChange(option);
    setOpen(false);
  };

  // Keep the highlighted row visible (center it when the sheet opens).
  const justOpened = useRef(false);
  useEffect(() => {
    if (open) justOpened.current = true;
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      document
        .getElementById(ids.option(active))
        ?.scrollIntoView({ block: justOpened.current ? "center" : "nearest" });
      justOpened.current = false;
    });
    return () => cancelAnimationFrame(raf);
    // ids.option only depends on the stable useId value.
  }, [open, active]); // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (rows.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i >= rows.length - 1 ? 0 : i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? rows.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(rows[active]);
    }
  };

  const status = query.trim()
    ? results.length
      ? `${results.length} result${results.length === 1 ? "" : "s"}`
      : noResultsText
    : "";

  const renderOption = (option: SelectOption, rowIndex: number) => {
    const isSelected = value?.value === option.value;
    const isActive = rowIndex === active;
    return (
      <div
        key={`${rowIndex}-${option.value}`}
        id={ids.option(rowIndex)}
        role="option"
        aria-selected={isSelected}
        onClick={() => choose(option)}
        onMouseMove={() => setActive(rowIndex)}
        className={[
          "mx-3 flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors",
          isSelected ? "font-semibold text-green-500" : "text-white/85",
          isActive ? (isSelected ? "bg-green-500/15" : "bg-white/[0.07]") : isSelected ? "bg-green-500/10" : "",
        ].join(" ")}
      >
        <span>{option.label}</span>
        {isSelected && <Check size={18} strokeWidth={2.5} aria-hidden="true" />}
      </div>
    );
  };

  const groupHeading = (headingId: string, text: string) => (
    <div
      id={headingId}
      role="presentation"
      className="px-6 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40"
    >
      {text}
    </div>
  );

  return (
    <div className={className}>
      {/* Mobile / tablet: field + tall search sheet */}
      <div className="lg:hidden">
        <FieldShell
          compact={compact}
          label={label}
          labelId={ids.label}
          htmlFor={ids.trigger}
          error={error}
          errorId={ids.error}
        >
          <ChoiceTrigger
            id={ids.trigger}
            labelId={ids.label}
            valueId={ids.value}
            errorId={ids.error}
            displayValue={value?.label}
            placeholder={placeholder}
            open={open}
            error={error}
            compact={compact}
            onOpen={openSheet}
          />
        </FieldShell>

        <BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title={label}
          size="tall"
          // Focus the list (no keyboard pop-up); tapping the search box opens the keyboard.
          getInitialFocus={() => listRef.current}
          header={
            <div className="relative">
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                id={ids.input}
                type="search"
                role="combobox"
                aria-expanded="true"
                aria-controls={ids.list}
                aria-autocomplete="list"
                aria-activedescendant={rows.length ? ids.option(active) : undefined}
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="done"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                className="w-full rounded-[14px] border border-white/10 bg-[rgba(33,33,33,0.9)] py-2.5 pl-10 pr-3 text-base text-[#dfdfdf] outline-none placeholder:text-gray/70 focus:border-green-500/60"
              />
            </div>
          }
        >
          <p className="sr-only" aria-live="polite">
            {status}
          </p>
          <div
            ref={listRef}
            id={ids.list}
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            aria-activedescendant={rows.length ? ids.option(active) : undefined}
            onKeyDown={onKeyDown}
            className="outline-none"
          >
            {isLoading && options.length === 0 ? (
              <p className="px-6 py-4 text-sm text-white/50">{loadingText}</p>
            ) : rows.length === 0 ? (
              <p className="px-6 py-4 text-sm text-white/50">{noResultsText}</p>
            ) : (
              <>
                {showSuggested && suggested && (
                  <div role="group" aria-labelledby={ids.suggested}>
                    {groupHeading(ids.suggested, "Suggested")}
                    {renderOption(suggested, 0)}
                  </div>
                )}
                <div role="group" aria-labelledby={showSuggested ? ids.all : undefined}>
                  {showSuggested && groupHeading(ids.all, allHeading)}
                  {results.map((option, i) => renderOption(option, i + offset))}
                </div>
              </>
            )}
          </div>
        </BottomSheet>
      </div>

      {/* Desktop: searchable select */}
      <div className="hidden lg:block" data-enter-passthrough>
        <SelectField
          compact={compact}
          label={label}
          options={options}
          value={value}
          onChange={onChange}
          search={search}
          suggested={suggested}
          allHeading={allHeading}
          isLoading={isLoading}
          placeholder={placeholder}
          error={error}
        />
      </div>
    </div>
  );
}
