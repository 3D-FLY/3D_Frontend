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
