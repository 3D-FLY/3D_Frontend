import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ExploreProgressBarProps {
  titles: string[];
  activeIndex: number;
  /** Prefix of the step element ids (`${idPrefix}${index}`), used for jump-to-step scrolling. */
  idPrefix: string;
  className?: string;
}

/** Sticky mobile progress bar: "Step N of M" with a jump list. Replaces the desktop-only progress dots. */
export default function ExploreProgressBar({
  titles,
  activeIndex,
  idPrefix,
  className = "",
}: ExploreProgressBarProps) {
  const [open, setOpen] = useState(false);
  const total = titles.length;
  const progress = ((activeIndex + 1) / total) * 100;

  const jumpTo = (i: number) => {
    setOpen(false);
    document.getElementById(`${idPrefix}${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`sticky top-[var(--nav-h)] z-40 border-b border-white/10 bg-dark/95 backdrop-blur ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="explore-step-list"
        className="flex min-h-[48px] w-full items-center justify-between gap-3 px-6 text-left"
      >
        <span className="min-w-0 truncate text-sm font-semibold text-white">
          <span className="text-green">Step {activeIndex + 1} of {total}</span>
          <span className="text-white/40"> · </span>
          {titles[activeIndex]}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-white/60 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div className="h-0.5 w-full bg-white/10">
        <motion.div
          className="h-full bg-green"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            id="explore-step-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="m-0 list-none overflow-hidden p-0"
          >
            {titles.map((title, i) => (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={`flex min-h-[44px] w-full items-center gap-3 px-6 text-left text-sm ${
                    i === activeIndex ? "font-bold text-green" : "text-white/70"
                  }`}
                >
                  <span className="w-6 shrink-0 text-xs tabular-nums text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{title}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
