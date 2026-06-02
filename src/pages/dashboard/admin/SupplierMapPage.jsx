import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Select from "react-select";
import { CheckCircle } from "lucide-react";
import { City, Country } from "country-state-city";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import ScrollableContent from "../../../features/dashboard/components/ScrollableContent.js";
import {
  PartnerLocationsProvider,
  usePartnerLocations,
} from "../../../features/network/PartnerLocationsContext.jsx";
import WorldMap, {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  FOCUS_ZOOM,
} from "../../../features/network/WorldMap.jsx";

// ─── react-select dark theme ──────────────────────────────────────────────────
const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: "rgba(5,10,7,0.7)",
    borderColor: state.isFocused ? "#5ac422" : "rgba(255,255,255,0.1)",
    boxShadow: state.isFocused ? "0 0 0 1px #5ac422" : "none",
    color: "#e8f5e8",
    minHeight: 40,
    "&:hover": { borderColor: "#5ac422" },
  }),
  menu: (base) => ({
    ...base,
    background: "#0d1a10",
    border: "1px solid rgba(255,255,255,0.1)",
    zIndex: 100,
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: 240,
    "::-webkit-scrollbar":        { width: "6px" },
    "::-webkit-scrollbar-track":  { background: "transparent" },
    "::-webkit-scrollbar-thumb":  { background: "#5ac422", borderRadius: "9999px" },
    "::-webkit-scrollbar-thumb:hover": { filter: "brightness(0.9)" },
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? "#5ac422"
      : state.isFocused
        ? "rgba(90,196,34,0.12)"
        : "transparent",
    color: state.isSelected ? "#000" : "#e8f5e8",
    cursor: "pointer",
    fontSize: 13,
    paddingTop: 7,
    paddingBottom: 7,
  }),
  singleValue:        (base) => ({ ...base, color: "#e8f5e8", fontSize: 13 }),
  input:              (base) => ({ ...base, color: "#e8f5e8" }),
  placeholder:        (base) => ({ ...base, color: "#6b7280", fontSize: 13 }),
  indicatorSeparator: (base) => ({ ...base, background: "rgba(255,255,255,0.1)" }),
  dropdownIndicator:  (base) => ({ ...base, color: "#5ac422", "&:hover": { color: "#5ac422" } }),
  clearIndicator:     (base) => ({ ...base, color: "#5ac422", "&:hover": { color: "#ff6b6b" } }),
  noOptionsMessage:   (base) => ({ ...base, color: "#6b7280", fontSize: 12 }),
};

// ─── Global city list (module-level, built once) ──────────────────────────────
const countryMap = Object.fromEntries(
  Country.getAllCountries().map((c) => [c.isoCode, c.name]),
);

const ALL_CITY_OPTIONS = City.getAllCities()
  .filter((c) => c.latitude && c.longitude)
  .map((c) => {
    const countryName = countryMap[c.countryCode] ?? c.countryCode;
    const lat = parseFloat(c.latitude);
    const lng = parseFloat(c.longitude);
    return { lat, lng, countryName, cityName: c.name };
  })
  .filter((c) => !Number.isNaN(c.lat) && !Number.isNaN(c.lng))
  .map((c) => ({
    value: `${c.cityName}||${c.countryName}||${c.lat}||${c.lng}`,
    label: `${c.cityName}, ${c.countryName}`,
    searchKey: `${c.cityName} ${c.countryName}`.toLowerCase(),
    lat: c.lat,
    lng: c.lng,
    cityName: c.cityName,
    countryName: c.countryName,
  }));

const INITIAL_100 = ALL_CITY_OPTIONS.slice(0, 100);

// ─── Mock supplier data ───────────────────────────────────────────────────────
const MOCK_SUPPLIERS = [
  { id: "sup1", name: "PrintHub TLV",      city: "Tel Aviv, Israel",         email: "contact@printhub.io",     phone: "+972-3-555-0100" },
  { id: "sup2", name: "3D Masters London", city: "London, United Kingdom",    email: "hello@3dmasters.co.uk",   phone: "+44-20-7946-0958" },
  { id: "sup3", name: "FabLab Tokyo",      city: "Tokyo, Japan",              email: "info@fablabtkyo.jp",      phone: "+81-3-1234-5678" },
  { id: "sup4", name: "MakerSpace NYC",    city: "New York City, United States", email: "ops@makerspacenyc.com", phone: "+1-212-555-0174" },
  { id: "sup5", name: "Imprimerie Paris",  city: "Paris, France",             email: "bonjour@imprimerie3d.fr", phone: "+33-1-40-00-01-02" },
  { id: "sup6", name: "PrintForge Dubai",  city: "Dubai, United Arab Emirates", email: "info@printforgedxb.ae",  phone: "+971-4-555-0200" },
  { id: "sup7", name: "SGPrint Co.",       city: "Singapore, Singapore",      email: "sales@sgprint.sg",        phone: "+65-6321-4567" },
  { id: "sup8", name: "FabBrasil",         city: "São Paulo, Brazil",         email: "contato@fabbrasil.com",   phone: "+55-11-2345-6789" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function splitPartnerName(name) {
  const idx = name.indexOf(", ");
  if (idx === -1) return { city: name, country: "" };
  return { city: name.slice(0, idx), country: name.slice(idx + 2) };
}

function matchSupplierName(city, suppliers) {
  const q = city.toLowerCase();
  const match = suppliers.find((s) => s.city.toLowerCase().includes(q));
  return match?.name ?? "—";
}

// ─── City selector ────────────────────────────────────────────────────────────
function CitySelector({ onAdd }) {
  const [inputValue,   setInputValue]   = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState(false);
  const successTimerRef = useRef(null);

  useEffect(() => () => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
  }, []);

  const visibleOptions = useMemo(() => {
    if (inputValue.length < 2) return INITIAL_100;
    const q = inputValue.toLowerCase();
    const out = [];
    for (const opt of ALL_CITY_OPTIONS) {
      if (opt.searchKey.includes(q)) {
        out.push(opt);
        if (out.length === 100) break;
      }
    }
    return out;
  }, [inputValue]);

  const handleInputChange = (val, { action }) => {
    if (action !== "input-blur" && action !== "menu-close") setInputValue(val);
  };

  const handleAdd = () => {
    if (!selectedCity) { setError("Select a city first."); return; }
    setError("");
    setSuccess(false);
    const id = crypto?.randomUUID?.() ?? `p-${Date.now()}`;
    onAdd({ id, name: selectedCity.label, lat: selectedCity.lat, lng: selectedCity.lng });
    setSelectedCity(null);
    setInputValue("");
    setSuccess(true);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
          Search city
        </label>
        <Select
          options={visibleOptions}
          value={selectedCity}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={(opt) => { setSelectedCity(opt); setError(""); }}
          isSearchable
          isClearable
          filterOption={() => true}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          menuPlacement="auto"
          placeholder="Type to search… (e.g. Tel Aviv, London)"
          noOptionsMessage={() => "No cities found"}
          styles={selectStyles}
        />
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <button
          type="button"
          disabled={!selectedCity}
          onClick={handleAdd}
          className="h-10 min-w-[130px] rounded-md bg-[#5ac422] px-5 text-[13px] font-extrabold uppercase italic tracking-wide text-black transition-opacity disabled:opacity-40 hover:brightness-110"
        >
          Add to Map
        </button>
        {error && !success && <p className="text-sm text-rose-400">{error}</p>}
        {success && (
          <p className="text-sm font-semibold text-[#5ac422] flex items-center gap-1.5">
            <CheckCircle size={14} /> Location added to map!
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Locations table ──────────────────────────────────────────────────────────
const TH = "text-[11px] font-semibold uppercase tracking-wide text-zinc-300";
const TD = "text-[clamp(12px,1vw,13px)] text-zinc-200 truncate";

function LocationsTable({ partners, suppliers, onShowOnMap, onReset, onRemove }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return partners;
    const q = search.toLowerCase();
    return partners.filter((p) => {
      const { city, country } = splitPartnerName(p.name);
      const supplierName = matchSupplierName(city, suppliers);
      return (
        p.name.toLowerCase().includes(q) ||
        city.toLowerCase().includes(q) ||
        country.toLowerCase().includes(q) ||
        supplierName.toLowerCase().includes(q)
      );
    });
  }, [partners, suppliers, search]);

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter locations…"
        className="w-full rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#5ac422] transition-colors"
      />

      {/* Header */}
      <div className="grid grid-cols-[1.2fr_1fr_1fr_auto] gap-3 px-2 pb-2 border-b border-white/20">
        <span className={TH}>Supplier Name</span>
        <span className={TH}>Country</span>
        <span className={TH}>City</span>
        <span className={TH}>Actions</span>
      </div>

      {/* Rows */}
      <div className="flex min-h-0 flex-col" style={{ height: 272 }}>
        <ScrollableContent scrollbarSide="right">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">No locations found.</p>
          ) : (
            filtered.map((p, i) => {
              const { city, country } = splitPartnerName(p.name);
              const supplierName = matchSupplierName(city, suppliers);
              return (
                <div
                  key={p.id}
                  className={`grid grid-cols-[1.2fr_1fr_1fr_auto] gap-3 items-center py-2.5 px-2 rounded-2xl hover:bg-[rgba(149,149,149,0.1)] transition-colors ${
                    i < filtered.length - 1 ? "border-b border-white/10" : ""
                  }`}
                >
                  <span className={`${TD} font-semibold text-zinc-100`}>{supplierName}</span>
                  <span className={TD}>{country}</span>
                  <span className={TD}>{city}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onShowOnMap(p)}
                      className="rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#22a8c4] border border-[#22a8c4]/40 hover:bg-[#22a8c4]/10 transition-colors whitespace-nowrap"
                    >
                      Focus
                    </button>
                    <button
                      type="button"
                      onClick={onReset}
                      className="rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-300 border border-zinc-600/50 hover:bg-zinc-700/40 transition-colors whitespace-nowrap"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      aria-label={`Remove ${p.name}`}
                      className="w-6 h-6 flex items-center justify-center rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 transition-colors text-base leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </ScrollableContent>
      </div>
    </div>
  );
}

// ─── Inner page (needs PartnerLocations context) ──────────────────────────────
function SupplierMapContent() {
  const { partners, addPartner, removePartner } = usePartnerLocations();
  const mapSectionRef = useRef(null);

  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom,   setMapZoom]   = useState(DEFAULT_ZOOM);

  const handleMoveEnd = useCallback(({ coordinates, zoom: z }) => {
    setMapCenter(coordinates);
    setMapZoom(z);
  }, []);

  const handleReset = useCallback(() => {
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
  }, []);

  const handleShowOnMap = useCallback((p) => {
    setMapCenter([p.lng, p.lat]);
    setMapZoom(FOCUS_ZOOM);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="w-full flex flex-col gap-4 box-border">

        {/* Page title */}
        <h1 className="text-[clamp(18px,2vw,24px)] font-semibold text-white">
          Supplier Map
        </h1>

        <div ref={mapSectionRef} className="w-full">
          <WorldMap
            partners={partners}
            center={mapCenter}
            zoom={mapZoom}
            onMoveEnd={handleMoveEnd}
            height={500}
          />
        </div>

        <DashboardCard title="Add Location" autoHeight>
          <CitySelector onAdd={(partner) => addPartner(partner)} />
        </DashboardCard>

        <DashboardCard title={`Locations (${partners.length})`} autoHeight>
          <LocationsTable
            partners={partners}
            suppliers={MOCK_SUPPLIERS}
            onShowOnMap={handleShowOnMap}
            onReset={handleReset}
            onRemove={removePartner}
          />
        </DashboardCard>

      </div>
    </DashboardLayout>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function SupplierMapPage() {
  return (
    <PartnerLocationsProvider>
      <SupplierMapContent />
    </PartnerLocationsProvider>
  );
}