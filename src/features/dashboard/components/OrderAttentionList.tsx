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
  accent: string;
  tab: string;
}> = {
  supplier_rejected:  { label: "Supplier Rejected",  accent: "border-l-red-400",    tab: "assign"      },
  no_supplier:        { label: "No Supplier",        accent: "border-l-orange-400", tab: "assign"      },
  production_delay:   { label: "Production Delay",   accent: "border-l-orange-400", tab: "production"  },
  missing_data:       { label: "Missing Data",       accent: "border-l-yellow-400", tab: "details"     },
  shipping_issue:     { label: "Shipping Issue",     accent: "border-l-sky-400",    tab: "shipping"    },
};

interface OrderAttentionListProps {
  items: OrderAttention[];
}

export default function OrderAttentionList({ items }: OrderAttentionListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <ScrollableContent scrollbarSide="left">
        {items.map((item) => {
          const config = reasonConfig[item.reason];
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/admin/orders/${item.orderId}?tab=${config.tab}`)}
              className={`
                mb-3 flex min-h-[60px] items-center gap-3 rounded-2xl border border-white/10 border-l-4 ${config.accent}
                bg-[rgba(149,149,149,0.05)] px-5 py-2
                cursor-pointer hover:bg-[rgba(149,149,149,0.1)] transition-colors
              `}
            >
              {/* Order + Reason */}
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <span className="text-[clamp(13px,1vw,14.5px)] font-semibold uppercase tracking-wide text-zinc-100">
                  #{item.orderId} — {config.label}
                </span>
                {item.detail && (
                  <span className="text-[11px] font-normal text-zinc-300 truncate">
                    {item.detail}
                  </span>
                )}
              </div>

              {/* Arrow */}
              <span className="shrink-0 text-zinc-300 text-sm">→</span>
            </div>
          );
        })}
      </ScrollableContent>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide text-zinc-200 transition-colors hover:text-white"
        >
          View All →
        </button>
      </div>
    </div>
  );
}