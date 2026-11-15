import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "framer-motion";
import useModalBehavior from "./useModalBehavior.js";

interface BottomSheetProps {
  open: boolean;
  /** Escape, backdrop click and drag-down all call this */
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Element to focus on open (e.g. the selected option) */
  getInitialFocus?: (panel: HTMLElement) => HTMLElement | null | undefined;
}

const CLOSE_OFFSET = 80; // px dragged down
const CLOSE_VELOCITY = 500; // px/s flick

// Mobile sheet that slides up from the bottom. Drag the handle/title down to close.
export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  getInitialFocus,
}: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const dragControls = useDragControls();
  useModalBehavior({
    open,
    panelRef,
    onClose,
    ...(getInitialFocus ? { getInitialFocus } : {}),
  });

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-end bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[80vh] w-full overflow-y-auto rounded-t-2xl border-t border-white/10 bg-dark pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl"
            initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            drag={reduceMotion ? false : "y"}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > CLOSE_OFFSET || info.velocity.y > CLOSE_VELOCITY) onClose();
            }}
          >
            {/* Drag area: handle + title (the option list stays scrollable) */}
            <div
              className="cursor-grab touch-none select-none active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex justify-center pb-1 pt-3" aria-hidden="true">
                <span className="h-1 w-10 rounded-full bg-white/20" />
              </div>
              <h2 id={titleId} className="px-5 pb-3 pt-1 text-[15px] font-semibold leading-snug text-white">
                {title}
              </h2>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
