import { type ReactNode } from "react";

const PAGE_CLASS = "w-full space-y-6 box-border";
export const DASHBOARD_PAGE_TITLE_CLASS =
  "text-[clamp(22px,2.5vw,32px)] font-semibold text-white";

interface DashboardPageTitleProps {
  children: ReactNode;
  className?: string;
}

/** Page-level h1 — use inside custom `header` slots when needed. */
export function DashboardPageTitle({ children, className = "" }: DashboardPageTitleProps) {
  const extra = className ? ` ${className}` : "";
  return <h1 className={`${DASHBOARD_PAGE_TITLE_CLASS}${extra}`}>{children}</h1>;
}

interface DashboardPageProps {
  children: ReactNode;
  /** Simple page title; ignored when `header` is set. */
  title?: ReactNode;
  titleClassName?: string;
  /** Custom header row (badges, actions, back button). */
  header?: ReactNode;
  className?: string;
}

/** Standard dashboard page shell: spacing + optional title/header. */
export default function DashboardPage({
  children,
  title,
  titleClassName = "",
  header,
  className = "",
}: DashboardPageProps) {
  const rootClass = className ? `${PAGE_CLASS} ${className}` : PAGE_CLASS;

  return (
    <div className={rootClass}>
      {header ??
        (title != null ? (
          <DashboardPageTitle className={titleClassName}>{title}</DashboardPageTitle>
        ) : null)}
      {children}
    </div>
  );
}
