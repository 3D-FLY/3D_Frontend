# Shared component template

Pattern sources: `src/features/dashboard/components/Modal.tsx`, `ActiveBadge.tsx`, `DashboardCard.tsx`.

```tsx
import { type ReactNode } from "react";
import type { SidebarRole } from "./Sidebar.js"; // only if role-aware

type ExampleSize = "sm" | "md";

interface ExampleProps {
  title: string;
  children?: ReactNode;
  role?: SidebarRole;
  size?: ExampleSize;
  className?: string;
}

const sizeClasses: Record<ExampleSize, string> = {
  sm: "px-3 py-2 text-[12px]",
  md: "px-5 py-4 text-sm",
};

export default function Example({
  title,
  children,
  size = "md",
  className = "",
}: ExampleProps) {
  return (
    <div className={`rounded-2xl border border-white/10 text-zinc-100 ${sizeClasses[size]} ${className}`}>
      <span className="font-semibold uppercase tracking-wide">{title}</span>
      {children}
    </div>
  );
}
```

Notes:
- `title` is passed in title case. `uppercase` makes it caps.
- Under `exactOptionalPropertyTypes`, callers spread optional handlers conditionally: `{...(onClick && { onClick })}`.
