import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AboutRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Scroll-reveal wrapper (same motion values as ExploreStepMobile).
export default function AboutReveal({
  children,
  delay = 0,
  className = "",
}: AboutRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
