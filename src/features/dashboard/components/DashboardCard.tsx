import { type ReactNode } from "react";
import Turtle from "../../../components/ui/Turtle.jsx";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  withBackground?: boolean;
  className?: string;
  autoHeight?: boolean;
  headerAction?: ReactNode;
  titleSize?: string;
  clipContent?: boolean;
}

export default function DashboardCard({
  title,
  children,
  withBackground = true,
  className = "",
  autoHeight = false,
  headerAction,
  titleSize,
  clipContent = false,
}: DashboardCardProps) {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-visible flex flex-col border border-white/10 bg-[rgba(149,149,149,0.1)] backdrop-blur-[12px] ${
        autoHeight
          ? ""
          : "h-[clamp(170px,20vw,300px)]"
      } ${className}`}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-0 shrink-0 flex items-center justify-between gap-2">
        <h2
          className={`${
            titleSize ?? "text-[clamp(16px,1.6vw,24px)]"
          } font-semibold uppercase tracking-[0.1em] text-zinc-100 not-italic m-0`}
        >
          {title}
        </h2>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 mx-0 mt-4 mb-0 shrink-0" />

      {/* Content area */}
      <div
        className={`relative z-10 w-full ${
          withBackground || clipContent ? "overflow-hidden " : ""
        }${
          autoHeight ? "" : "h-full flex min-h-0 flex-1 flex-col"
        }`}
      >
        {withBackground && (
          <Turtle
            right="0"
            top="50%"
            height="80%"
            translateX="50%"
            translateY="-50%"
            opacity={0.12}
            zIndex={0}
          />
        )}
        <div
          className={`relative z-10 w-full px-6 py-6 ${
            autoHeight ? "" : "flex min-h-0 flex-1 flex-col justify-center"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
