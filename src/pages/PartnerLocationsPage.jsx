import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AmbientGlowBackdrop from "../components/ui/AmbientGlowBackdrop.jsx";
import Turtle from "../components/ui/Turtle.jsx";
import { usePartnerLocations } from "../features/network/PartnerLocationsContext.jsx";
import "../features/auth/registration-form.css";
import "../features/network/partner-map.css";

export default function PartnerLocationsPage() {
  const { partners, addPartner, removePartner } = usePartnerLocations();
  const navigate = useNavigate();
  const [addressInput, setAddressInput] = useState("");
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  const partnerCount = partners.length;

  const handleGeocode = useCallback(async () => {
    const q = addressInput.trim();
    if (!q) {
      setGeocodeError("Enter an address or place name.");
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
      setAddressInput("");
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
  }, [addressInput, addPartner, navigate]);

  return (
    <div className="partner-map-page relative flex min-h-0 w-full flex-1 flex-col items-center overflow-x-hidden overflow-y-auto bg-dark">
      <AmbientGlowBackdrop />
      <Turtle
        bottom="0"
        left="50%"
        height="50vh"
        translateX="-50%"
        translateY="0"
        opacity={0.1}
        zIndex={0}
      />

      <div className="reg-form-content-in partner-map-content relative z-10 flex w-full max-w-[1440px] flex-col items-center gap-8 px-6 py-8 pb-16">
        <div className="flex w-full max-w-[720px] flex-col gap-4">
          <Link
            to="/partner-map"
            className="font-mono text-sm font-bold tracking-wide text-[#5AC422] underline-offset-4 hover:underline"
          >
            ← Back to map
          </Link>
          <h2 className="text-center font-mono text-xl font-bold uppercase tracking-tight text-[#DBDADA]">
            Add &amp; manage locations
          </h2>
          <p className="text-center font-mono text-xs text-[#9ca3af]">
            New locations appear on the map immediately. Open the map to see
            them.
          </p>
        </div>

        <div className="partner-map-bottom w-full max-w-[720px] font-mono">
          <div className="partner-map-geocode">
            <label htmlFor="partner-locations-address">
              Add location (Nominatim)
            </label>
            <div className="partner-map-geocode-row flex flex-col gap-2 sm:flex-row">
              <input
                id="partner-locations-address"
                className="partner-map-input sm:min-w-0 sm:flex-1"
                type="text"
                value={addressInput}
                placeholder="City, street, or coordinates…"
                onChange={(e) => setAddressInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleGeocode();
                }}
                autoComplete="off"
              />
              <button
                type="button"
                className="partner-map-btn sm:mt-0 sm:w-auto sm:shrink-0 sm:px-6"
                disabled={geocodeLoading}
                onClick={() => void handleGeocode()}
              >
                {geocodeLoading ? "Searching…" : "Geocode & add"}
              </button>
            </div>
            {geocodeError ? (
              <p className="partner-map-geocode-msg" role="alert">
                {geocodeError}
              </p>
            ) : null}
          </div>

          <div className="partner-map-list-header">
            Partners ({partnerCount})
          </div>
          <p className="partner-map-list-hint">
            Remove partners from the list only — not on the map. Use &quot;Show on
            map&quot; to focus the map.
          </p>
          <ul className="partner-map-list" aria-label="Partner locations">
            {partners.map((p) => (
              <li key={p.id} className="partner-map-list__row">
                <div className="partner-map-list__item partner-map-list__item--static flex-1 cursor-default">
                  <span className="partner-map-list__body">
                    <span className="partner-map-list__name">{p.name}</span>
                    <span className="partner-map-list__coords">
                      {p.lat.toFixed(4)}°, {p.lng.toFixed(4)}°
                    </span>
                  </span>
                </div>
                <div className="partner-map-list__row-actions">
                  <button
                    type="button"
                    className="partner-map-btn self-center px-3 py-1 text-xs"
                    onClick={() =>
                      navigate("/partner-map", {
                        state: { mapFocus: { lng: p.lng, lat: p.lat } },
                      })
                    }
                  >
                    Show on map
                  </button>
                  <button
                    type="button"
                    className="partner-map-list__remove"
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
