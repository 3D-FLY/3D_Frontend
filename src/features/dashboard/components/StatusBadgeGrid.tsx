import { type ReactNode } from "react";

interface StatusBadgeGridProps {
  children: ReactNode;
  className?: string;
}

/** KPI tile grid: 2 per row on mobile (fixed tile height), 2 columns at md and 4 at xl. */
export default function StatusBadgeGrid({ children, className = "" }: StatusBadgeGridProps) {
  return (
    <div
      className={`grid w-full grid-cols-2 auto-rows-[150px] gap-3 md:min-h-[180px] md:auto-rows-auto md:gap-6 xl:grid-cols-4 ${className}`}
    >
      {children}
    </div>
  );
}
