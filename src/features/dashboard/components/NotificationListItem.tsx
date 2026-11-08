import { motion } from "framer-motion";
import { EASE_SOFT, staggerDelay } from "../motion.js";
import {
  getNotificationCardClasses,
  type NotificationReason,
} from "../../../data/mockNotifications.js";

export interface NotificationListItemProps {
  orderId: string;
  title: string;
  description?: string;
  reason: NotificationReason;
  onClick: () => void;
  /** Position in the list, used to stagger the entrance animation. */
  index?: number;
  /** Below md: full glass surface, for when the list sits directly on the page background. */
  glassOnMobile?: boolean;
}

export default function NotificationListItem({
  orderId,
  title,
  description,
  reason,
  onClick,
  index = 0,
  glassOnMobile = false,
}: NotificationListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_SOFT, delay: 0.1 + staggerDelay(index, 0.05) }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`${getNotificationCardClasses(reason)}${
        glassOnMobile ? " max-md:bg-[rgba(149,149,149,0.1)] max-md:backdrop-blur-[12px]" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[clamp(13px,1vw,14.5px)] font-semibold uppercase tracking-wide text-zinc-100">
          {orderId} — {title}
        </span>
        {description && (
          <span className="truncate text-[11px] font-normal text-zinc-300">
            {description}
          </span>
        )}
      </div>

      <span className="shrink-0 text-sm text-zinc-300">→</span>
    </motion.div>
  );
}
