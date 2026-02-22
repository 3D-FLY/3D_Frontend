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

declare module "*.svg?url" {
  const src: string;
  export default src;
}
