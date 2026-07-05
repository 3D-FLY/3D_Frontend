export type OrderStatusKey =
  | "pending"
  | "in_production"
  | "shipped"
  | "delivered"
  | "issue"
  | "cancelled";

export type StatusAccentColor = "green" | "yellow" | "orange" | "blue" | "red";

interface StatusConfig {
  label: string;
  dot: string;
  text: string;
  border: string;
  bg: string;
  accentColor: StatusAccentColor;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatusKey, StatusConfig> = {
  pending:       { label: "Pending",       dot: "bg-orange-400", text: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/10", accentColor: "orange" },
  in_production: { label: "In Production", dot: "bg-sky-400",    text: "text-sky-400",    border: "border-sky-400/30",    bg: "bg-sky-400/10",    accentColor: "blue"   },
  shipped:       { label: "Shipped",       dot: "bg-amber-400",  text: "text-amber-400",  border: "border-amber-400/30",  bg: "bg-amber-400/10",  accentColor: "orange" },
  delivered:     { label: "Delivered",     dot: "bg-green-400",  text: "text-green-400",  border: "border-green-400/30",  bg: "bg-green-400/10",  accentColor: "green"  },
  issue:         { label: "Issue",         dot: "bg-red-400",    text: "text-red-400",    border: "border-red-400/30",    bg: "bg-red-400/10",    accentColor: "red"    },
  cancelled:     { label: "Cancelled",     dot: "bg-zinc-500",   text: "text-zinc-400",   border: "border-zinc-600/30",   bg: "bg-zinc-700/20",   accentColor: "red"    },
};

export const getStatusConfig = (status: OrderStatusKey) => ORDER_STATUS_CONFIG[status];
