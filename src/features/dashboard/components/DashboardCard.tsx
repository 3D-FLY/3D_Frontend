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
      className={`relative w-full rounded-2xl bg-gray overflow-visible flex flex-col ${
        autoHeight
          ? ""
          : "h-[clamp(170px,20vw,300px)]"
      } ${className}`}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-0 shrink-0 flex items-center justify-between gap-2">
        <h2
          className={`${
            titleSize ?? "text-[clamp(16px,1.6vw,24px)]"
          } font-semibold uppercase tracking-[0.1em] text-black not-italic m-0`}
        >
          {title}
        </h2>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-black/50 mx-0 mt-3 mb-0 shrink-0" />

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
          className={`relative z-10 w-full px-5 py-3 ${
            autoHeight ? "" : "flex min-h-0 flex-1 flex-col justify-center"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
