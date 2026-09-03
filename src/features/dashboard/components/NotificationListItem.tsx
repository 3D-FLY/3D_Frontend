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
}

export default function NotificationListItem({
  orderId,
  title,
  description,
  reason,
  onClick,
}: NotificationListItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={getNotificationCardClasses(reason)}
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
    </div>
  );
}
