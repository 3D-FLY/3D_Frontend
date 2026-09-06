import type { ComponentType, ReactElement, ReactNode } from "react";

declare module "../../network/PartnerLocationsContext.jsx" {
  export interface PartnerLocation {
    id: string;
    lat: number;
    lng: number;
    name?: string;
    cityName?: string;
    countryName?: string;
  }
  export const INITIAL_PARTNERS: PartnerLocation[];
  export function PartnerLocationsProvider(props: { children: ReactNode }): ReactElement;
  export function usePartnerLocations(): {
    partners: PartnerLocation[];
    addPartner: (partner: PartnerLocation) => void;
    removePartner: (id: string) => void;
  };
}

declare module "../../network/WorldMap.jsx" {
  import type { PartnerLocation } from "../../network/PartnerLocationsContext.jsx";
  export const GEO_URL: string;
  export const DEFAULT_CENTER: number[];
  export const DEFAULT_ZOOM: number;
  export const FOCUS_ZOOM: number;
  const WorldMap: ComponentType<{
    partners: PartnerLocation[];
    center: number[];
    zoom: number;
    onMoveEnd?: (payload: { coordinates: number[]; zoom: number }) => void;
    height?: number;
    className?: string;
    onLoad?: () => void;
    hideLoadingOverlay?: boolean;
  }>;
  export default WorldMap;
}

declare module "../../network/worldGeoCache.js" {
  export function isWorldGeoReady(): boolean;
  export function setWorldGeoReady(): void;
}
