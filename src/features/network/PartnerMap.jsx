import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  useZoomPanContext,
} from "react-simple-maps";
import SectionTitle from "../../components/ui/SectionTitle.js";
import Button from "../../components/ui/Button.jsx";
import AmbientGlowBackdrop from "../../components/ui/AmbientGlowBackdrop.jsx";
import Turtle from "../../components/ui/Turtle.jsx";
import { usePartnerLocations } from "./PartnerLocationsContext.jsx";
import locationMarkerUrl from "./Group 82.svg?url";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const GEOGRAPHY_STYLE = {
  default: {
    fill: "#5AC422",
    stroke: "#000000",
    strokeWidth: 0.9,
    outline: "none",
  },
  hover: {
    fill: "#4aad1a",
    stroke: "#000000",
    strokeWidth: 0.9,
    outline: "none",
  },
  pressed: {
    fill: "#4aad1a",
    stroke: "#000000",
    strokeWidth: 0.9,
    outline: "none",
  },
};

/** Mercator: center at 35°N — ZoomableGroup brings this to screen-center,
 *  which lands 85°N exactly at the top edge with 1.25× scale. */
const DEFAULT_CENTER = [0, 35];
const DEFAULT_ZOOM = 1;
const FOCUS_ZOOM = 3.75;
const MIN_ZOOM = 0.28;
const MAX_ZOOM = 8;
/** Ctrl/Cmd + wheel: gentle steps (d3-zoom multiplies wheel delta by 10 when ctrl is held → huge jumps). */
const WHEEL_ZOOM_BASE_STEP = 0.055;

/** Counter-scale pins so size stays ~constant on screen when map zoom (k) changes. */
function PartnerMapMarkerLayer({ partners, locationMarkerUrl }) {
  const { k } = useZoomPanContext();
  const invScale = k > 0 ? 1 / k : 1;

  return partners.map((p) => (
    <Marker key={p.id} coordinates={[p.lng, p.lat]}>
      <g transform={`scale(${invScale})`}>
        <g
          className="group"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <circle
            r={12}
            cx={0}
            cy={0}
            fill="#39e75f"
            opacity={0.55}
            style={{ pointerEvents: "none" }}
          >
            <animate
              attributeName="opacity"
              values="0.55;0;0.55"
              dur="1.8s"
              repeatCount="indefinite"
            />
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;2.4;1"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
          <g transform="translate(-12.5, -34)">
            <g className="origin-[12.5px_34px] transition-transform duration-200 group-hover:scale-110">
              <image
                href={locationMarkerUrl}
                width={25}
                height={35}
                className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]"
              />
            </g>
          </g>
        </g>
      </g>
    </Marker>
  ));
}

function useMapFrameSize() {
  const ref = useRef(null);
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? Math.max(280, window.innerWidth - 40) : 800,
  );
  const [height, setHeight] = useState(() =>
    typeof window !== "undefined"
      ? Math.max(280, Math.round(window.innerHeight * 0.7))
      : 560,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const measure = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      if (w > 0) setWidth(Math.floor(w));
      if (h > 0) setHeight(Math.floor(h));
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();

    return () => ro.disconnect();
  }, []);

  return { ref, width, height };
}

export default function PartnerMap() {
  const { partners } = usePartnerLocations();
  const location = useLocation();
  const navigate = useNavigate();
  const mapFocus = location.state?.mapFocus;

  const [mapCenter, setMapCenter] = useState(() => [...DEFAULT_CENTER]);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  const { ref: mapFrameRef, width: mapWidth, height: mapHeight } =
    useMapFrameSize();

  useEffect(() => {
    const el = mapFrameRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      e.stopPropagation();
      const dy = e.deltaY;
      const direction = dy > 0 ? -1 : 1;
      const scale = Math.min(2, Math.abs(dy) / 100);
      const step = WHEEL_ZOOM_BASE_STEP * scale;
      const factor = 1 + direction * step;
      setMapZoom((z) =>
        Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor)),
      );
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [mapWidth, mapHeight]);

  useEffect(() => {
    if (
      !mapFocus ||
      typeof mapFocus.lng !== "number" ||
      typeof mapFocus.lat !== "number"
    ) {
      return;
    }
    setMapCenter([mapFocus.lng, mapFocus.lat]);
    setMapZoom(FOCUS_ZOOM);
    navigate(location.pathname, { replace: true, state: {} });
  }, [mapFocus, navigate, location.pathname]);

  const handleMapMoveEnd = useCallback(({ coordinates, zoom: z }) => {
    setMapCenter(coordinates);
    setMapZoom(z);
  }, []);

  const partnerCount = partners.length;

  /**
   * Mercator world spans ±π in both axes at the clip latitude (~85.05°).
   * Full world width  = scale × 2π  →  scale = width  / (2π) to fill width.
   * Full world height = scale × 2π  →  scale = height / (2π) to fill height.
   * Use min() so the entire world fits in whichever dimension is smaller.
   *
   * translate_y = scale × π positions the top of the world (lat ≈ 85°) at y = 0,
   * preventing any top-clipping regardless of aspect ratio.
   */
  const projectionConfig = useMemo(() => {
    const scaleMultiplier =
      mapWidth <= 768 ? 0.92 : mapWidth <= 1024 ? 1.05 : 1.25;
    const scale = (Math.min(mapWidth, mapHeight) / (2 * Math.PI)) * scaleMultiplier;
    const translateYMultiplier = mapWidth <= 768 ? 1.22 : 1.35;
    return {
      scale,
      center: [...DEFAULT_CENTER],
      translate: [mapWidth / 2, scale * Math.PI * translateYMultiplier],
    };
  }, [mapWidth, mapHeight]);

  /**
   * Restrict drag area so the map cannot be panned too far outside viewport.
   * Keep bounds strict so blank space cannot replace the map.
   */
  const mapTranslateExtent = useMemo(() => {
    const verticalInset = Math.max(40, Math.round(mapHeight * 0.18));
    return [
      [0, verticalInset],
      [mapWidth, mapHeight - verticalInset],
    ];
  }, [mapWidth, mapHeight]);

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center overflow-x-hidden overflow-y-auto bg-dark">
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

      <div className="relative z-10 mt-10 flex w-full max-w-[1440px] flex-col items-center gap-8 px-6 py-8 pb-[50vh]">
      <SectionTitle className="w-full mb-7">3D-FLY GLOBAL NETWORK</SectionTitle>

        <div className="flex w-full flex-col items-center gap-3">
          <div
            ref={mapFrameRef}
            className="relative h-[88vh] min-h-[280px] w-full max-w-[1440px] overflow-hidden border-none bg-transparent box-border max-[1024px]:h-[56vh] max-[1024px]:min-h-[240px] max-[768px]:h-[42vh] max-[768px]:min-h-[190px]"
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={projectionConfig}
              width={mapWidth}
              height={mapHeight}
              className="h-full w-full bg-transparent"
            >
              <ZoomableGroup
                center={mapCenter}
                zoom={mapZoom}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                translateExtent={mapTranslateExtent}
                filterZoomEvent={(e) => e.type !== "wheel"}
                onMoveEnd={handleMapMoveEnd}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies
                      .filter((geo) => geo.properties.name !== "Antarctica")
                      .map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={GEOGRAPHY_STYLE}
                        />
                      ))
                  }
                </Geographies>

                <PartnerMapMarkerLayer
                  partners={partners}
                  locationMarkerUrl={locationMarkerUrl}
                />
              </ZoomableGroup>
            </ComposableMap>
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
          <Link
            to="/partner-locations"
            className="font-mono text-sm font-bold uppercase tracking-wide text-[#5AC422] underline-offset-4 hover:underline"
          >
            Add / manage locations
          </Link>
        </div>
      </div>
    </div>
  );
}
