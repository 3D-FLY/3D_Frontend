import { motion } from "framer-motion";
import { EASE_SOFT, staggerDelay } from "../../../features/dashboard/motion.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import { formatDate, type AdminOrderRow } from "./adminOrders.js";

interface OrdersListMobileProps {
  orders: AdminOrderRow[];
  onSelect: (order: AdminOrderRow) => void;
  /** Hide the status pill (used for the Print History list, where everything is DONE). */
  showStatus?: boolean;
  className?: string;
}

/** Mobile replacement for the orders table: one tappable card per order. */
export default function OrdersListMobile({
  orders,
  onSelect,
  showStatus = true,
  className = "",
}: OrdersListMobileProps) {
  return (
    <ul className={`m-0 flex list-none flex-col gap-3 p-0 ${className}`}>
      {orders.map((order, i) => (
        <motion.li
          key={order.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_SOFT, delay: 0.1 + staggerDelay(i, 0.05) }}
        >
          <button
            type="button"
            onClick={() => onSelect(order)}
            className="flex w-full flex-col gap-1.5 rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.1)] px-4 py-3 text-left backdrop-blur-[12px] transition-colors hover:bg-[rgba(149,149,149,0.16)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-zinc-100">#{order.orderId}</span>
              {showStatus && <OrderStatusPill status={order.status} />}
            </div>
            <span className="truncate text-[13px] text-zinc-200">{order.store}</span>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-zinc-400">{formatDate(order.date)}</span>
              <span className="text-[13px] font-semibold text-green-500">{order.total}</span>
            </div>
          </button>
        </motion.li>
      ))}
    </ul>
  );
}
