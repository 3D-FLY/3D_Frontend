import { useNavigate } from "react-router-dom";
import ScrollableContent from "./ScrollableContent.js";
import AlertListItem from "./AlertListItem.js";
import { ALERT_REASON_LABEL } from "../../../data/mockAlerts.js";
import type { AlertReason, AlertStatus } from "../../../data/mockAlerts.js";

export type AttentionReason = Extract<
  AlertReason,
  "no_supplier" | "supplier_rejected" | "missing_data" | "shipping_issue" | "production_delay"
>;

export interface OrderAttention {
  id: string;
  orderId: string;
  reason: AttentionReason;
  detail?: string;
  timestamp: string;
  status?: AlertStatus;
}

interface OrderAttentionListProps {
  items: OrderAttention[];
  /** Show status badge on each row. Default: false for compact dashboard widget. */
  showStatus?: boolean;
}

export default function OrderAttentionList({ items, showStatus = false }: OrderAttentionListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <ScrollableContent scrollbarSide="left">
        {items.map((item) => (
          <AlertListItem
            key={item.id}
            orderId={`#${item.orderId}`}
            title={ALERT_REASON_LABEL[item.reason]}
            {...(item.detail ? { description: item.detail } : {})}
            reason={item.reason}
            status={item.status ?? "open"}
            showStatus={showStatus}
            onClick={() => navigate(`/dashboard/admin/alerts/${item.id}`)}
          />
        ))}
      </ScrollableContent>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/dashboard/admin/alerts")}
          className="rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide text-zinc-200 transition-colors hover:text-white"
        >
          View All →
        </button>
      </div>
    </div>
  );
}
