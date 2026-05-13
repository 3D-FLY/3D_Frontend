import { useNavigate } from "react-router-dom";
import ScrollableContent from "./ScrollableContent.js";

export type OrderStatus =
  | "pending"
  | "in_production"
  | "shipped"
  | "delivered"
  | "issue";

export interface RecentOrder {
  id: string;
  orderId: string;
  store: string;
  status: OrderStatus;
  date: string; // ISO
}

const statusConfig: Record<OrderStatus, { label: string; dot: string }> = {
  pending:       { label: "Pending",       dot: "bg-orange-400" },
  in_production: { label: "In Production", dot: "bg-sky-400"    },
  shipped:       { label: "Shipped",       dot: "bg-sky-400"    },
  delivered:     { label: "Delivered",     dot: "bg-green-400"  },
  issue:         { label: "Issue",         dot: "bg-red-400"    },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface RecentOrdersTableProps {
  items: RecentOrder[];
}

export default function RecentOrdersTable({ items }: RecentOrdersTableProps) {
  const navigate = useNavigate();
  const capped = items.slice(0, 30);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1.5fr_1.2fr_1fr_24px] gap-3 px-2 pb-2 border-b border-white/20">
        {["Order", "Store", "Status", "Date", ""].map((col) => (
          <span key={col} className="text-[11px] font-semibold uppercase tracking-wide text-zinc-300">
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      <ScrollableContent scrollbarSide="left">
        {capped.map((order, index) => {
          const config = statusConfig[order.status];
          return (
            <div
              key={order.id}
              onClick={() => navigate(`/admin/orders/${order.orderId}`)}
              className={`
                grid grid-cols-[1fr_1.5fr_1.2fr_1fr_24px] gap-3 items-center py-3 px-2
                cursor-pointer hover:bg-[rgba(149,149,149,0.1)] transition-colors rounded-2xl
                ${index < capped.length - 1 ? "border-b-[0.5px] border-white/50" : ""}
              `}
            >
              {/* Order */}
              <span className="text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100 truncate">
                #{order.orderId}
              </span>

              {/* Store */}
              <span className="text-[clamp(12px,1vw,14px)] text-zinc-200 truncate">
                {order.store}
              </span>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`shrink-0 w-2 h-2 rounded-full ${config.dot}`} />
                <span className="text-[clamp(11px,0.9vw,13px)] font-semibold uppercase tracking-wide text-zinc-100 truncate">
                  {config.label}
                </span>
              </div>

              {/* Date */}
              <span className="text-[11px] text-zinc-300">
                {formatDate(order.date)}
              </span>

              {/* Arrow */}
              <span className="text-zinc-300 text-sm">→</span>
            </div>
          );
        })}
      </ScrollableContent>
    </div>
  );
}