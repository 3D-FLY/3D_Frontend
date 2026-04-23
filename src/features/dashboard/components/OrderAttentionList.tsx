import { useNavigate } from "react-router-dom";
import ScrollableContent from "./ScrollableContent.js";

export type AttentionReason =
  | "no_supplier"
  | "supplier_rejected"
  | "missing_data"
  | "shipping_issue"
  | "production_delay";

export interface OrderAttention {
  id: string;
  orderId: string;
  reason: AttentionReason;
  detail?: string;
  timestamp: string;
} 

const reasonConfig: Record<AttentionReason, {
  label: string;
  dot: string;
  tab: string;
}> = {
  supplier_rejected:  { label: "Supplier Rejected",  dot: "bg-red-400",    tab: "assign"      },
  no_supplier:        { label: "No Supplier",         dot: "bg-orange-400", tab: "assign"      },
  production_delay:   { label: "Production Delay",    dot: "bg-orange-400", tab: "production"  },
  missing_data:       { label: "Missing Data",        dot: "bg-yellow-400", tab: "details"     },
  shipping_issue:     { label: "Shipping Issue",      dot: "bg-sky-400",    tab: "shipping"    },
};

interface OrderAttentionListProps {
  items: OrderAttention[];
}

export default function OrderAttentionList({ items }: OrderAttentionListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <ScrollableContent scrollbarSide="left">
        {items.map((item, index) => {
          const config = reasonConfig[item.reason];
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/admin/orders/${item.orderId}?tab=${config.tab}`)}
              className={`
                flex items-center gap-3 py-2.5 px-1
                cursor-pointer hover:bg-white/10 transition-colors rounded-md
                ${index < items.length - 1 ? "border-b-[0.5px] border-white/50" : ""}
              `}
            >
              {/* Dot */}
              <span className={`shrink-0 w-2 h-2 rounded-full ${config.dot}`} />

              {/* Order + Reason */}
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="text-[clamp(13px,1vw,14.5px)] font-semibold uppercase tracking-wide text-black">
                  #{item.orderId} — {config.label}
                </span>
                {item.detail && (
                  <span className="text-[11px] font-normal text-black/50 truncate">
                    {item.detail}
                  </span>
                )}
              </div>

              {/* Arrow */}
              <span className="shrink-0 text-black/40 text-sm">→</span>
            </div>
          );
        })}
      </ScrollableContent>
    </div>
  );
}