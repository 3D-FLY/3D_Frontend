import { ORDER_STATUS_CONFIG, type OrderStatusKey } from "../../../constants/orderStatusConfig.js";

interface OrderStatusPillProps {
  status: OrderStatusKey;
  size?: "sm" | "lg";
}

export default function OrderStatusPill({ status, size = "sm" }: OrderStatusPillProps) {
  const cfg = ORDER_STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
      <span
        className={`font-semibold uppercase tracking-wide ${cfg.text} ${
          size === "lg" ? "text-sm" : "text-[clamp(11px,0.9vw,13px)]"
        } truncate`}
      >
        {cfg.label}
      </span>
    </div>
  );
}
