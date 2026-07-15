import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SectionTitle from "../../components/ui/SectionTitle.js";
import Button from "../../components/ui/Button.jsx";
import AmbientGlowBackdrop from "../../components/ui/AmbientGlowBackdrop.jsx";
import Turtle from "../../components/ui/Turtle.jsx";
import LogoLoaderOverlay from "../../components/ui/LogoLoaderOverlay.tsx";
import { usePartnerLocations } from "./PartnerLocationsContext.jsx";
import { isWorldGeoReady } from "./worldGeoCache.js";
import WorldMap, { DEFAULT_CENTER, DEFAULT_ZOOM, FOCUS_ZOOM } from "./WorldMap.jsx";

export default function PartnerMap() {
  const { partners } = usePartnerLocations();
  const location     = useLocation();
  const navigate     = useNavigate();
  const mapFocus     = location.state?.mapFocus;

  const [mapCenter, setMapCenter] = useState(() => [...DEFAULT_CENTER]);
  const [mapZoom,   setMapZoom]   = useState(DEFAULT_ZOOM);
  const [mapReady,  setMapReady]  = useState(isWorldGeoReady);

  // Focus on a location passed via router state (e.g. from "Show on map" button)
  useEffect(() => {
    if (
      !mapFocus ||
      typeof mapFocus.lng !== "number" ||
      typeof mapFocus.lat !== "number"
    ) return;
    setMapCenter([mapFocus.lng, mapFocus.lat]);
    setMapZoom(FOCUS_ZOOM);
    navigate(location.pathname, { replace: true, state: {} });
  }, [mapFocus, navigate, location.pathname]);

  const handleMapMoveEnd = useCallback(({ coordinates, zoom: z }) => {
    setMapCenter(coordinates);
    setMapZoom(z);
  }, []);

  const partnerCount = partners.length;

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center overflow-x-hidden overflow-y-auto bg-dark">
      <AmbientGlowBackdrop />
  

      <div className="relative z-10 mt-10 flex w-full max-w-[1440px] flex-col items-center gap-8 px-6 py-8 pb-15">
        <SectionTitle className="w-full mb-7">3D-FLY GLOBAL NETWORK</SectionTitle>

        <div className="flex w-full flex-col items-center gap-3">
          {/* Responsive container — WorldMap fills it via className="h-full" */}
          <div className="relative h-[88vh] min-h-[280px] w-full max-w-[1440px] overflow-hidden border-none bg-transparent box-border max-[1024px]:h-[56vh] max-[1024px]:min-h-[240px] max-[768px]:h-[42vh] max-[768px]:min-h-[190px]">
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
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center justify-center gap-1">
            <p
              className="m-0 font-sans text-[clamp(2rem,12vw,128px)] font-extrabold italic leading-none tracking-[0.02em] text-[#5AC422]"
              aria-live="polite"
            >
              {partnerCount}
            </p>
            <p className="text-gray font-extrabold uppercase tracking-wide leading-tight text-[clamp(12px,4.2vw,70px)]">
              Worldwide partners!
            </p>
          </div>
          <Button
            hovering="darkBg"
            className="rounded-[28px] text-[clamp(14px,2vw,30px)] font-extrabold px-[clamp(16px,3vw,30px)] py-[clamp(8px,1.5vw,16px)] italic"
            onClick={() => navigate("/join-as-partner")}
          >
            Join As a Partner!
          </Button>
        </div>
      </div>
    </div>
  );
}
