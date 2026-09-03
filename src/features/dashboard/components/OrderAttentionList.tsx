import { useNavigate } from "react-router-dom";
import ScrollableContent from "./ScrollableContent.js";
import NotificationListItem from "./NotificationListItem.js";
import { NOTIFICATION_REASON_LABEL } from "../../../data/mockNotifications.js";
import type { NotificationReason } from "../../../data/mockNotifications.js";

export type AttentionReason = Extract<
  NotificationReason,
  "no_supplier" | "supplier_rejected" | "missing_data" | "shipping_issue" | "production_delay"
>;

export interface OrderAttention {
  id: string;
  orderId: string;
  reason: AttentionReason;
  detail?: string;
  timestamp: string;
}

interface OrderAttentionListProps {
  items: OrderAttention[];
}

export default function OrderAttentionList({ items }: OrderAttentionListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <ScrollableContent scrollbarSide="left">
        {items.map((item) => (
          <NotificationListItem
            key={item.id}
            orderId={`#${item.orderId}`}
            title={NOTIFICATION_REASON_LABEL[item.reason]}
            {...(item.detail ? { description: item.detail } : {})}
            reason={item.reason}
            onClick={() => navigate(`/dashboard/admin/notifications/${item.id}`)}
          />
        ))}
      </ScrollableContent>
    </div>
  );
}
