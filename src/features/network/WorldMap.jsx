/**
 * WorldMap — shared, fully-controlled map renderer.
 *
 * Props:
 *   partners   { id, lat, lng }[]  — pins to display
 *   center     [lng, lat]          — controlled center
 *   zoom       number              — controlled zoom level
 *   onMoveEnd  ({ coordinates, zoom }) => void
 *   height     number (px) | undefined — explicit pixel height.
 *                                         Omit when a parent div controls the height
 *                                         (e.g. pass className="h-full" instead).
 *   className  string              — extra classes for the frame div
 */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  useZoomPanContext,
} from "react-simple-maps";
import locationMarkerUrl from "./Group 82.svg?url";
import LogoLoaderOverlay from "../../components/ui/LogoLoaderOverlay.tsx";
import { isWorldGeoReady, setWorldGeoReady } from "./worldGeoCache.js";

// ─── Public constants (re-exported for consumers) ─────────────────────────────
export const GEO_URL       = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
export const DEFAULT_CENTER = [0, 35];
export const DEFAULT_ZOOM   = 1;
export const FOCUS_ZOOM     = 3.75;

// ─── Private constants ────────────────────────────────────────────────────────
const MIN_ZOOM       = 0.28;
const MAX_ZOOM       = 8;
const WHEEL_BASE_STEP = 0.055;

const GEO_STYLE = {
  default: { fill: "#5AC422", stroke: "#000000", strokeWidth: 0.9, outline: "none" },
  hover:   { fill: "#4aad1a", stroke: "#000000", strokeWidth: 0.9, outline: "none" },
  pressed: { fill: "#4aad1a", stroke: "#000000", strokeWidth: 0.9, outline: "none" },
};

// ─── Marker layer (must live inside ZoomableGroup to access useZoomPanContext) ─
function MarkerLayer({ partners }) {
  const { k } = useZoomPanContext();
  const inv = k > 0 ? 1 / k : 1;

  return partners.map((p) => (
    <Marker key={p.id} coordinates={[p.lng, p.lat]}>
      <g transform={`scale(${inv})`}>
        <g
          className="group"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <circle
            r={12} cx={0} cy={0}
            fill="#39e75f" opacity={0.55}
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

// ─── WorldMap ─────────────────────────────────────────────────────────────────
export default function WorldMap({
  partners,
  center,
  zoom,
  onMoveEnd,
  height,
  className = "",
  onLoad,
  hideLoadingOverlay = false,
}) {
  const frameRef  = useRef(null);
  const [mapWidth,  setMapWidth]  = useState(800);
  const [mapHeight, setMapHeight] = useState(height ?? 440);
  const [geoLoaded, setGeoLoaded] = useState(isWorldGeoReady);

  // Notify parent once geo is ready (stable ref avoids stale closure)
  const onLoadRef = useRef(onLoad);
  useEffect(() => { onLoadRef.current = onLoad; }, [onLoad]);
  useEffect(() => { if (geoLoaded) onLoadRef.current?.(); }, [geoLoaded]);

  // Stable refs so the wheel handler never captures stale props
  const centerRef    = useRef(center);
  const zoomRef      = useRef(zoom);
  const onMoveEndRef = useRef(onMoveEnd);
  useEffect(() => { centerRef.current    = center;    }, [center]);
  useEffect(() => { zoomRef.current      = zoom;      }, [zoom]);
  useEffect(() => { onMoveEndRef.current = onMoveEnd; }, [onMoveEnd]);

  // Measure immediately after DOM mount, before the browser paints,
  // so the first visible frame already has the correct projection.
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const { width: w, height: h } = el.getBoundingClientRect();
    if (w > 0) setMapWidth(Math.floor(w));
    if (h > 0) setMapHeight(Math.floor(h));
  }, []);

  // ResizeObserver — keeps projection correct when the container is resized
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      if (w > 0) setMapWidth(Math.floor(w));
      if (h > 0) setMapHeight(Math.floor(h));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // Ctrl / Cmd + wheel → smooth zoom (registered once; reads current values via refs)
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const handler = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      e.stopPropagation();
      const direction = e.deltaY > 0 ? -1 : 1;
      const scale     = Math.min(2, Math.abs(e.deltaY) / 100);
      const factor    = 1 + direction * WHEEL_BASE_STEP * scale;
      const newZoom   = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomRef.current * factor));
      onMoveEndRef.current?.({ coordinates: centerRef.current, zoom: newZoom });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []); // intentionally empty — uses refs above

  /**
   * Mercator projection calibration.
   * Full world width = scale × 2π  →  scale = size / (2π).
   * translate_y = scale × π → top of world at y = 0.
   */
  const projectionConfig = useMemo(() => {
    const mult  = mapWidth <= 768 ? 0.92 : mapWidth <= 1024 ? 1.05 : 1.25;
    const scale = (Math.min(mapWidth, mapHeight) / (2 * Math.PI)) * mult;
    const yMult = mapWidth <= 768 ? 1.22 : 1.35;
    return {
      scale,
      center: [...DEFAULT_CENTER],
      translate: [mapWidth / 2, scale * Math.PI * yMult],
    };
  }, [mapWidth, mapHeight]);

  // Restrict drag so the map can't be panned fully off-screen
  const translateExtent = useMemo(() => {
    const vi = Math.max(40, Math.round(mapHeight * 0.18));
    return [[0, vi], [mapWidth, mapHeight - vi]];
  }, [mapWidth, mapHeight]);

  return (
    <div
      ref={frameRef}
      className={`relative w-full overflow-hidden bg-transparent ${className}`}
      style={height != null ? { height } : { height: "100%" }}
    >
      {/* Loading overlay — shown until the world atlas GeoJSON is fetched */}
      {!hideLoadingOverlay && !geoLoaded && (
        <LogoLoaderOverlay className="z-10" label="Loading map" />
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={projectionConfig}
        width={mapWidth}
        height={mapHeight}
        className="h-full w-full bg-transparent"
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          translateExtent={translateExtent}
          filterZoomEvent={(e) => e.type !== "wheel"}
          onMoveEnd={onMoveEnd}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              if (geographies.length > 0) {
                setWorldGeoReady();
                if (!geoLoaded) setGeoLoaded(true);
              }
              return geographies
                .filter((g) => g.properties.name !== "Antarctica")
                .map((g) => (
                  <Geography key={g.rsmKey} geography={g} style={GEO_STYLE} />
                ));
            }}
          </Geographies>

          <MarkerLayer partners={partners} />
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
