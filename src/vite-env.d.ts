/// <reference types="vite/client" />

declare module "*/icons/features/index.js" {
  import type { ComponentType } from "react";
  export const Icon3DPrint: ComponentType<{ className?: string }>;
  export const IconEarth: ComponentType<{ className?: string }>;
  export const IconFast: ComponentType<{ className?: string }>;
  export const IconIntegration: ComponentType<{ className?: string }>;
  export const IconLocally: ComponentType<{ className?: string }>;
  export const IconNoCost: ComponentType<{ className?: string }>;
}

declare module "*/icons/section-3/IconArrow.jsx" {
  import type { ComponentType } from "react";
  const IconArrow: ComponentType<{
    direction?: "left" | "right";
    className?: string;
  }>;
  export default IconArrow;
}

declare module "*/components/ui/Button.jsx" {
  import type { ComponentType } from "react";
  const Button: ComponentType<Record<string, unknown>>;
  export default Button;
}

declare module "*/ui/Turtle.jsx" {
  import type { ComponentType } from "react";
  const Turtle: ComponentType<Record<string, unknown>>;
  export default Turtle;
}

declare module "../ui/Turtle.jsx" {
  import type { ComponentType } from "react";
  const Turtle: ComponentType<Record<string, unknown>>;
  export default Turtle;
}

declare module "*/components/ui/GlowCircle.jsx" {
  import type { ComponentType } from "react";
  const GlowCircle: ComponentType<Record<string, unknown>>;
  export default GlowCircle;
}

declare module "*/WhatCanYouSellDesktop.jsx" {
  import type { ComponentType } from "react";
  const WhatCanYouSellDesktop: ComponentType<Record<string, unknown>>;
  export default WhatCanYouSellDesktop;
}

declare module "*/Photo-carousel/WhatCanYouSellDesktop.jsx" {
  import type { ComponentType } from "react";
  const WhatCanYouSellDesktop: ComponentType<Record<string, unknown>>;
  export default WhatCanYouSellDesktop;
}

declare module "*/network/PartnerLocationsContext.jsx" {
  import type { ReactElement, ReactNode } from "react";
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

declare module "*/network/WorldMap.jsx" {
  import type { ComponentType } from "react";
  import type { PartnerLocation } from "*/network/PartnerLocationsContext.jsx";
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

declare module "*/network/worldGeoCache.js" {
  export function isWorldGeoReady(): boolean;
  export function setWorldGeoReady(): void;
}

declare module "*.svg?url" {
  const src: string;
  export default src;
}

declare module "*.svg?react" {
  import type { FunctionComponent, SVGProps } from "react";
  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.png" {
  const src: string;
  export default src;
}
