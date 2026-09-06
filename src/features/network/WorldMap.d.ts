import type { ComponentType } from "react";
import type { PartnerLocation } from "./PartnerLocationsContext.jsx";

export const GEO_URL: string;
export const DEFAULT_CENTER: number[];
export const DEFAULT_ZOOM: number;
export const FOCUS_ZOOM: number;

interface WorldMapProps {
  partners: PartnerLocation[];
  center: number[];
  zoom: number;
  onMoveEnd?: (payload: { coordinates: number[]; zoom: number }) => void;
  height?: number;
  className?: string;
  onLoad?: () => void;
  hideLoadingOverlay?: boolean;
}

declare const WorldMap: ComponentType<WorldMapProps>;
export default WorldMap;
