import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
  // Paths that render without the entrance animation (they animate on their own).
  skipPaths?: string[];
  className?: string;
}

const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

// Fade + small rise on every route change. Navbar and Footer stay outside it.
export default function PageTransition({
  children,
  skipPaths = [],
  className = "",
}: PageTransitionProps) {
  const { pathname } = useLocation();
  const wrapperClass = `flex min-h-0 flex-1 flex-col ${className}`;

  if (skipPaths.includes(pathname)) {
    return <div className={wrapperClass}>{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      className={wrapperClass}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_SOFT }}
    >
      {children}
    </motion.div>
  );
}
