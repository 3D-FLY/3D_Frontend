// LocationPin.tsx
import React from "react";
import { motion } from "framer-motion";
import Icon from "./Icon.js";
import LocationSvg from "../assets/icons/location.svg?react";

interface LocationPinProps {
  left:     string;
  top:      string;
  width?:   string;
  delay?:   number;
  /** הזזה אופקית נוספת בפיקסלים, למיקום עדין */
  offsetX?: number;
  /** הזזה אנכית נוספת בפיקסלים, למיקום עדין */
  offsetY?: number;
  /** Tailwind utilities (e.g. z-index) merged with base positioning classes */
  className?: string;
}

export default function LocationPin({
  left,
  top,
  width   = "5%",
  delay   = 0,
  offsetX = 0,
  offsetY = 0,
  className = "z-30",
}: LocationPinProps) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`.trim()}
      style={{
        left,
        top,
        width,
        // -50% מרכז אופקית, -100% שם את הטיפ בדיוק על הנקודה
        transform: `translate(calc(-50% + ${offsetX}px), calc(-100% + ${offsetY}px))`,
      }}
      initial={{ opacity: 0, scale: 0, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay,
        type:       "spring",
        stiffness:  420,
        damping:    16,
      }}
    >
      <Icon Svg={LocationSvg} width="100%" />
    </motion.div>
  );
}