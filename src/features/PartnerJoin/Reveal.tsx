import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface RevealProps {
  show: boolean;
  children: ReactNode;
  className?: string;
}

// Expands a follow-up field (e.g. "Please Specify") in place.
export default function Reveal({ show, children, className = "" }: RevealProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className={`pt-1 ${className}`}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
