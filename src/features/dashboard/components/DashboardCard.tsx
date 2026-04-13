import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({ title, children, className = "" }: DashboardCardProps) {
  return (
    <div className={`w-full rounded-xl border border-zinc-700 bg-zinc-800 p-6 box-border ${className}`}>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        {title}
      </h2>
      {children}
    </div>
  );
}
