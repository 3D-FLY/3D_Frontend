import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import useModalBehavior from "./useModalBehavior.js";

interface ConfirmDialogProps {
  open: boolean;
  /** Called on Escape, backdrop click and the X button (only when dismissible) */
  onClose: () => void;
  /** When false the dialog can only be closed through its own buttons */
  dismissible?: boolean;
  /** Accessible name when the dialog has no visible heading */
  ariaLabel?: string;
  children: ReactNode;
  /** The primary action; rendered as the last child and focused on open */
  actions: ReactNode;
}

// Animated modal for landing forms: Escape, scroll lock, focus trap, focus return.
export default function ConfirmDialog({
  open,
  onClose,
  dismissible = true,
  ariaLabel,
  children,
  actions,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalBehavior({ open, panelRef, onClose, dismissible });

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-[12px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (dismissible && e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
            className="relative my-auto w-full max-w-md rounded-2xl border border-white/10 bg-dark p-6 text-center shadow-2xl md:p-8"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {dismissible && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 rounded-md p-1.5 text-white/40 transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            )}
            <div className="space-y-3">{children}</div>
            <div className="mt-6 flex justify-center">{actions}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
