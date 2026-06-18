import { useState } from "react";
import { Pencil, Trash2, ArrowRight } from "lucide-react";

interface EntityCardProps {
  icon: React.ReactNode;
  accentColor: string;
  name: string;
  subtitle: string;
  badges?: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onNavigate: () => void;
  navigateLabel?: string;
  onClick?: () => void;
}

export default function EntityCard({
  icon,
  accentColor,
  name,
  subtitle,
  badges,
  onEdit,
  onDelete,
  onNavigate,
  navigateLabel = "View",
  onClick,
}: EntityCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [navHovered, setNavHovered] = useState(false);

  return (
    <div
      className="flex flex-col rounded-2xl border bg-[rgba(149,149,149,0.1)] backdrop-blur-[12px] hover:brightness-110 transition-all"
      style={{ borderColor: cardHovered ? `${accentColor}80` : "rgba(255,255,255,0.1)" }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      {/* Top — clickable section */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === "Enter" && onClick?.()}
        className="flex flex-col gap-2 px-5 pt-5 pb-4 cursor-pointer"
      >
        {icon}

        <div className="flex flex-col gap-0.5 mt-1">
          <span className="font-bold text-white leading-snug" style={{ fontSize: 15 }}>
            {name}
          </span>
          <span style={{ fontSize: 12, color: accentColor }}>
            {subtitle}
          </span>
        </div>

        {badges && (
          <div className="flex items-center gap-2 flex-wrap">
            {badges}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Action row */}
      <div className="flex items-center justify-between px-4 py-3">
        {confirmDelete ? (
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] text-zinc-300 flex-1">Delete?</span>
            <button
              type="button"
              onClick={onDelete}
              className="rounded px-2 py-1 text-[11px] font-bold text-rose-400 border border-rose-400/40 hover:bg-rose-400/10 transition-colors"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded px-2 py-1 text-[11px] font-bold text-zinc-400 border border-zinc-600/40 hover:bg-zinc-700/40 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              title="Edit"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
              title="Delete"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNavigate(); }}
              title={navigateLabel}
              onMouseEnter={() => setNavHovered(true)}
              onMouseLeave={() => setNavHovered(false)}
              style={navHovered ? { color: accentColor, backgroundColor: `${accentColor}1a` } : undefined}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
