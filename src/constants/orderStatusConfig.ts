export const ORDER_STATUS_KEYS = [
  "pending",
  "accepted",
  "in_production",
  "ready",
  "shipped",
  "delivered",
  "issue",
  "cancelled",
] as const;

export type OrderStatusKey = (typeof ORDER_STATUS_KEYS)[number];

export type StatusAccentColor = "green" | "yellow" | "orange" | "blue" | "red";

export interface StatusConfig {
  label: string;
  dot: string;
  text: string;
  border: string;
  bg: string;
  accentColor: StatusAccentColor;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatusKey, StatusConfig> = {
  pending:       { label: "Pending",       dot: "bg-orange-400", text: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/10", accentColor: "orange" },
  accepted:      { label: "Accepted",      dot: "bg-yellow-400", text: "text-yellow-400", border: "border-yellow-400/30", bg: "bg-yellow-400/10", accentColor: "yellow" },
  in_production: { label: "Printing",       dot: "bg-sky-400",    text: "text-sky-400",    border: "border-sky-400/30",    bg: "bg-sky-400/10",    accentColor: "blue"   },
  ready:         { label: "Ready",         dot: "bg-lime-400",   text: "text-lime-400",   border: "border-lime-400/30",   bg: "bg-lime-400/10",   accentColor: "green"  },
  shipped:       { label: "Shipped",       dot: "bg-amber-400",  text: "text-amber-400",  border: "border-amber-400/30",  bg: "bg-amber-400/10",  accentColor: "orange" },
  delivered:     { label: "DONE",          dot: "bg-green-400",  text: "text-green-400",  border: "border-green-400/30",  bg: "bg-green-400/10",  accentColor: "green"  },
  issue:         { label: "Issue",         dot: "bg-red-400",    text: "text-red-400",    border: "border-red-400/30",    bg: "bg-red-400/10",    accentColor: "red"    },
  cancelled:     { label: "Cancelled",     dot: "bg-zinc-500",   text: "text-zinc-400",   border: "border-zinc-600/30",   bg: "bg-zinc-700/20",   accentColor: "red"    },
};

export const getStatusConfig = (status: OrderStatusKey) => ORDER_STATUS_CONFIG[status];

/** Statuses a supplier may actively set on an order (via dropdown). Excludes
 * pending/accepted (set only via the Accept/Reject action), ready and
 * cancelled (not the supplier's call). */
export const SUPPLIER_EDITABLE_STATUS_KEYS = ["in_production", "shipped", "issue", "delivered"] as const satisfies readonly OrderStatusKey[];
