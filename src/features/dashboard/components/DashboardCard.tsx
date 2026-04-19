import { type ReactNode } from "react";
import Turtle from "../../../components/ui/Turtle.jsx";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  withBackground?: boolean;
  className?: string;
}

export default function DashboardCard({
  title,
  children,
  withBackground = true,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`relative w-full h-[300px] rounded-2xl bg-gray overflow-hidden flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-0 shrink-0">
        <h2 className="text-[24px] font-semibold uppercase tracking-[0.1em] text-black not-italic m-0">
          {title}
        </h2>
      </div>

      {/* Divider — מקצה לקצה */}
      <div className="h-[2px] bg-black/50 mx-0 mt-3 mb-0 shrink-0" />

      {/* אזור תוכן — הצב רק כאן */}
      <div className="relative flex flex-col flex-1 overflow-hidden p-5 pt-4">
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
        <div className="relative z-10 flex min-h-0 flex-1 w-full flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}