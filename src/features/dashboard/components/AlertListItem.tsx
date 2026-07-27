import {
  ALERT_STATUS_DOT,
  ALERT_STATUS_LABEL,
  ALERT_STATUS_TEXT,
  getAlertCardClasses,
  type AlertReason,
  type AlertStatus,
} from "../../../data/mockAlerts.js";

export interface AlertListItemProps {
  orderId: string;
  title: string;
  description?: string;
  reason: AlertReason;
  status?: AlertStatus;
  /** When false, hides the status badge (compact dashboard widgets). Default: true when status is set. */
  showStatus?: boolean;
  onClick: () => void;
}

export default function AlertListItem({
  orderId,
  title,
  description,
  reason,
  status,
  showStatus,
  onClick,
}: AlertListItemProps) {
  const displayStatus = showStatus !== false && status != null;

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
      className={getAlertCardClasses(reason, status)}
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

      <div className="flex shrink-0 items-center gap-3">
        {displayStatus && (
          <span
            className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide ${ALERT_STATUS_TEXT[status]}`}
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${ALERT_STATUS_DOT[status]}`} />
            {ALERT_STATUS_LABEL[status]}
          </span>
        )}
        <span className="text-sm text-zinc-300">→</span>
      </div>
    </div>
  );
}
