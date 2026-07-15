import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const INITIAL_PARTNERS = [
  { id: "init-ny", name: "New York, United States", cityName: "New York", countryName: "United States", lat: 40.7128, lng: -74.006 },
  { id: "init-london", name: "London, United Kingdom", cityName: "London", countryName: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { id: "init-tokyo", name: "Tokyo, Japan", cityName: "Tokyo", countryName: "Japan", lat: 35.6762, lng: 139.6503 },
  { id: "init-sydney", name: "Sydney, Australia", cityName: "Sydney", countryName: "Australia", lat: -33.8688, lng: 151.2093 },
  { id: "init-dubai", name: "Dubai, United Arab Emirates", cityName: "Dubai", countryName: "United Arab Emirates", lat: 25.2048, lng: 55.2708 },
  { id: "init-paris", name: "Paris, France", cityName: "Paris", countryName: "France", lat: 48.8566, lng: 2.3522 },
  { id: "init-singapore", name: "Singapore, Singapore", cityName: "Singapore", countryName: "Singapore", lat: 1.3521, lng: 103.8198 },
  { id: "init-saopaulo", name: "São Paulo, Brazil", cityName: "São Paulo", countryName: "Brazil", lat: -23.5505, lng: -46.6333 },
];

const PartnerLocationsContext = createContext(null);

export function PartnerLocationsProvider({ children }) {
  const [partners, setPartners] = useState(INITIAL_PARTNERS);

  const addPartner = useCallback((partner) => {
    setPartners((prev) => [...prev, partner]);
  }, []);

  const removePartner = useCallback((id) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      partners,
      addPartner,
      removePartner,
    }),
    [partners, addPartner, removePartner],
  );

  return (
    <PartnerLocationsContext.Provider value={value}>
      {children}
    </PartnerLocationsContext.Provider>
  );
}

export function usePartnerLocations() {
  const ctx = useContext(PartnerLocationsContext);
  if (!ctx) {
    throw new Error(
      "usePartnerLocations must be used within PartnerLocationsProvider",
    );
  }
  return ctx;
}
