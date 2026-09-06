import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../DashboardLayout.js";
import DashboardPage from "./DashboardPage.js";
import LogoLoaderOverlay from "../../../components/ui/LogoLoaderOverlay.js";
import { usePartnerLocations } from "../../network/PartnerLocationsContext.jsx";
import { isWorldGeoReady } from "../../network/worldGeoCache.js";
import WorldMap, { DEFAULT_CENTER, DEFAULT_ZOOM, FOCUS_ZOOM } from "../../network/WorldMap.jsx";
import type { SidebarRole } from "./Sidebar.js";

interface DashboardMapProps {
  role: SidebarRole;
}

export default function DashboardMap({ role }: DashboardMapProps) {
  const { partners } = usePartnerLocations();
  const location = useLocation();
  const navigate = useNavigate();
  const mapFocus = location.state?.mapFocus;

  const [mapCenter, setMapCenter] = useState(() => [...DEFAULT_CENTER]);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [mapReady, setMapReady] = useState(isWorldGeoReady);

  useEffect(() => {
    if (!mapFocus || typeof mapFocus.lng !== "number" || typeof mapFocus.lat !== "number") return;
    setMapCenter([mapFocus.lng, mapFocus.lat]);
    setMapZoom(FOCUS_ZOOM);
    navigate(location.pathname, { replace: true, state: {} });
  }, [mapFocus, navigate, location.pathname]);

  const handleMapMoveEnd = useCallback(({ coordinates, zoom: z }: { coordinates: number[]; zoom: number }) => {
    setMapCenter(coordinates);
    setMapZoom(z);
  }, []);

  return (
    <DashboardLayout role={role}>
      <DashboardPage
        header={
          <h1 className="w-full text-center text-[clamp(28px,4vw,48px)] font-semibold text-white">
            GLOBAL NETWORK
          </h1>
        }
      >

        <motion.div
          className="relative w-full overflow-hidden border-none bg-transparent"
          style={{ height: "70vh", minHeight: "400px" }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: mapReady ? 1 : 0, scale: mapReady ? 1 : 0.98 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          {!mapReady && <LogoLoaderOverlay label="Loading map" />}
          <WorldMap
            partners={partners}
            center={mapCenter}
            zoom={mapZoom}
            onMoveEnd={handleMapMoveEnd}
            onLoad={() => setMapReady(true)}
            hideLoadingOverlay
            className="h-full"
          />
        </motion.div>

        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <p
              className="m-0 font-sans text-[clamp(3rem,7vw,88px)] font-extrabold italic leading-none tracking-[0.02em] text-[#5AC422]"
              aria-live="polite"
            >
              {partners.length}
            </p>
            <p className="text-gray font-extrabold uppercase tracking-wide leading-tight text-[clamp(14px,2vw,28px)]">
              Worldwide partners!
            </p>
          </div>
        </motion.div>

      </DashboardPage>
    </DashboardLayout>
  );
}
