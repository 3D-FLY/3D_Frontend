import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import AmbientGlowBackdrop from "../components/ui/AmbientGlowBackdrop.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.tsx";
import SectionTitle from "../components/ui/SectionTitle.tsx";
import { usePartnerLocations } from "../features/network/PartnerLocationsContext.jsx";


export default function PartnerLocationsPage() {
  const { partners, addPartner, removePartner } = usePartnerLocations();
  const navigate = useNavigate();
  const [addressFields, setAddressFields] = useState({
    country: "",
    region: "",
    city: "",
    street: "",
    houseNumber: "",
    postalCode: "",
  });
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  const partnerCount = partners.length;

  const setAddressField = useCallback((field, value) => {
    setAddressFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleGeocode = useCallback(async () => {
    const q = [
      `${addressFields.street} ${addressFields.houseNumber}`.trim(),
      addressFields.city,
      addressFields.region,
      addressFields.postalCode,
      addressFields.country,
    ]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(", ");

    if (!q) {
      setGeocodeError("Enter at least one location field.");
      return;
    }
    setGeocodeError("");
    setGeocodeLoading(true);
    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("format", "json");
      url.searchParams.set("q", q);
      url.searchParams.set("limit", "1");

      const res = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
        },
      });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();
      const hit = data[0];
      if (!hit) {
        setGeocodeError("No results. Try a different query.");
        return;
      }
      const lat = parseFloat(hit.lat);
      const lng = parseFloat(hit.lon);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        setGeocodeError("Invalid coordinates in response.");
        return;
      }
      const name =
        hit.display_name?.split(",").slice(0, 2).join(",").trim() || q;
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `p-${Date.now()}`;
      const partner = { id, name, lat, lng };
      addPartner(partner);
      setAddressFields({
        country: "",
        region: "",
        city: "",
        street: "",
        houseNumber: "",
        postalCode: "",
      });
      navigate("/partner-map", {
        state: { mapFocus: { lng: partner.lng, lat: partner.lat } },
      });
    } catch (e) {
      console.error(e);
      setGeocodeError(
        e instanceof Error ? e.message : "Geocoding request failed.",
      );
    } finally {
      setGeocodeLoading(false);
    }
  }, [addressFields, addPartner, navigate]);

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center overflow-x-hidden overflow-y-auto bg-dark">
      <AmbientGlowBackdrop />

      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-center gap-8 px-6 py-8 pb-16">
        <div className="flex w-full flex-col gap-4">
          
          <SectionTitle className="w-full">Add &amp; manage locations</SectionTitle>
          <p className="text-center font-mono text-xs text-[#9ca3af]">
            New locations appear on the map immediately. Open the map to see
            them.
          </p>
        </div>

        <div className="w-full max-w-[720px]">
          <div className="flex flex-col gap-3">
            <p className="text-center text-white font-semibold uppercase tracking-wide py-4">
              Add location
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Input
                label="Country"
                value={addressFields.country}
                placeholder="Country"
                autoComplete="country-name"
                onChange={(e) => setAddressField("country", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleGeocode();
                }}
                wrapperClassName="sm:col-span-2"
              />
              <Input
                label="Region / State"
                value={addressFields.region}
                placeholder="State / Region"
                autoComplete="address-level1"
                onChange={(e) => setAddressField("region", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleGeocode();
                }}
              />
              <Input
                label="City"
                value={addressFields.city}
                placeholder="City"
                autoComplete="address-level2"
                onChange={(e) => setAddressField("city", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleGeocode();
                }}
              />
              <Input
                label="Street"
                value={addressFields.street}
                placeholder="Street"
                autoComplete="street-address"
                onChange={(e) => setAddressField("street", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleGeocode();
                }}
              />
              <Input
                label="House Number"
                value={addressFields.houseNumber}
                placeholder="House number"
                autoComplete="address-line2"
                onChange={(e) => setAddressField("houseNumber", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleGeocode();
                }}
              />
              <Input
                label="Postal Code"
                value={addressFields.postalCode}
                placeholder="Postal code (optional)"
                autoComplete="postal-code"
                onChange={(e) => setAddressField("postalCode", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleGeocode();
                }}
                wrapperClassName="sm:col-span-2"
              />
            </div>
            <div className="mt-3 flex justify-center sm:justify-start">
              <Button
                type="button"
                variant="primary"
                hovering="darkBg"
                size="md"
                className="min-w-[170px] px-8 py-2 text-sm font-extrabold italic"
                disabled={geocodeLoading}
                onClick={() => void handleGeocode()}
              >
                {geocodeLoading ? "Searching..." : "Geocode & add"}
              </Button>
            </div>
            {geocodeError ? (
              <p className="mt-1 text-center text-sm text-rose-400 sm:text-left" role="alert">
                {geocodeError}
              </p>
            ) : null}
          </div>

          <div className="pt-4 text-xs font-bold uppercase tracking-[0.15em] text-[#3d7a18]">
            Partners ({partnerCount})
          </div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[rgba(90,196,34,0.55)]">
            Remove partners from the list only — not on the map. Use &quot;Show on
            map&quot; to focus the map.
          </p>
          <ul
            className="max-h-[min(40vh,420px)] overflow-y-auto border border-[#1a3320] bg-[rgba(5,10,7,0.35)]"
            aria-label="Partner locations"
          >
            {partners.map((p) => (
              <li
                key={p.id}
                className="flex items-stretch border-b border-[rgba(26,51,32,0.6)] last:border-b-0 hover:bg-[rgba(90,196,34,0.06)]"
              >
                <div className="flex flex-1 items-start gap-2 px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold tracking-[0.02em] text-[#e8f5e8]">{p.name}</span>
                    <span className="mt-1 block text-xs text-[#3d7a18]">
                      {p.lat.toFixed(4)}°, {p.lng.toFixed(4)}°
                    </span>
                  </span>
                </div>
                <div className="flex items-stretch gap-1 p-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="self-center px-3 py-1 text-xs"
                    onClick={() =>
                      navigate("/partner-map", {
                        state: { mapFocus: { lng: p.lng, lat: p.lat } },
                      })
                    }
                  >
                    Show on map
                  </Button>
                  <button
                    type="button"
                    className="w-9 min-h-11 border-l border-[#1a3320] bg-[rgba(5,10,7,0.6)] text-[#5ac422] transition-colors hover:border-[#5a2222] hover:bg-[rgba(90,34,34,0.2)] hover:text-[#ff6b6b]"
                    aria-label={`Remove ${p.name}`}
                    onClick={() => removePartner(p.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
