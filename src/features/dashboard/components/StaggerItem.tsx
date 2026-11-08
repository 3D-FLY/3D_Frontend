import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE_SOFT, staggerDelay } from "../motion.js";

interface StaggerItemProps {
  children: ReactNode;
  /** Position in the group; later items enter slightly later. */
  index?: number;
  className?: string;
}

/** Standard staggered entrance (fade + small rise), same as the animated table rows. */
export default function StaggerItem({ children, index = 0, className = "" }: StaggerItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_SOFT, delay: 0.1 + staggerDelay(index, 0.05) }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
