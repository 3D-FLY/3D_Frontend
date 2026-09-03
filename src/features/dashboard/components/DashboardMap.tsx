import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../DashboardLayout.js";
import DashboardPage, { DashboardPageTitle } from "./DashboardPage.js";
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
      <DashboardPage header={<DashboardPageTitle>GLOBAL NETWORK</DashboardPageTitle>}>

        {/* Partner count */}
        <div className="flex items-baseline gap-3">
          <span className="text-[clamp(2rem,6vw,64px)] font-extrabold italic leading-none text-green-500">
            {partners.length}
          </span>
          <span className="text-sm font-bold uppercase tracking-widest text-white/40">
            Worldwide Partners
          </span>
        </div>

        {/* Map */}
        <motion.div
          className="relative w-full overflow-hidden rounded-2xl border border-white/10"
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

      </DashboardPage>
    </DashboardLayout>
  );
}
