import { useNavigate } from "react-router-dom";
import ScrollableContent from "./ScrollableContent.js";

export interface Notification {
  id: string;
  orderId?: string;
  message: string;
  type: "error" | "warning" | "success" | "info";
  timestamp: string; // ISO string
  link?: string;
}

const dotColor: Record<Notification["type"], string> = {
  error:   "bg-red-400",
  warning: "bg-orange-400",
  success: "bg-green-400",
  info:    "bg-sky-400",
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface NotificationListProps {
  items: Notification[];
}

export default function NotificationList({ items }: NotificationListProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <ScrollableContent scrollbarSide="left">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => item.link && navigate(item.link)}
            className={`
              flex items-center gap-3 py-2.5 px-1
              text-[clamp(13px,1vw,14.5px)] font-semibold uppercase tracking-wide text-black
              ${index < items.length - 1 ? "border-b-[0.5px] border-white/50" : ""}
              ${item.link ? "cursor-pointer hover:bg-white/10 transition-colors rounded-md" : ""}
            `}
          >
            {/* Dot */}
            <span className={`shrink-0 w-2 h-2 rounded-full ${dotColor[item.type]}`} />

            {/* Message */}
            <span className="flex-1">
              {item.orderId && (
                <span className="mr-1 text-black/60">#{item.orderId}</span>
              )}
              {String(item.message)}
            </span>

            {/* Time */}
            <span className="shrink-0 text-[11px] font-normal normal-case text-black/50">
              {timeAgo(item.timestamp)}
            </span>

            {/* Arrow */}
            {item.link && (
              <span className="shrink-0 text-black/40 text-xs">→</span>
            )}
          </div>
        ))}
      </ScrollableContent>
    </div>
  );
}