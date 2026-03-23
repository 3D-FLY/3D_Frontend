import React from "react";
import { motion } from "framer-motion";
import Icon from "./Icon.js";
import LocationSvg from "../assets/icons/location.svg?react";

interface LocationPinProps {
  /** % distance from the scene-container left edge (pin tip is centred here) */
  left: string;
  /** % distance from the scene-container top edge (pin tip lands here) */
  top: string;
  /** Width of the pin relative to the scene container */
  width?: string;
  /** Framer-motion entrance delay in seconds */
  delay?: number;
}

/**
 * Animated map location pin.
 * Drops in after the line finishes drawing, sitting with its tip
 * at (left, top) in the parent container's coordinate space.
 */
export default function LocationPin({
  left,
  top,
  width = "5%",
  delay = 0,
}: LocationPinProps) {
  return (
    <motion.div
      className="absolute z-30 pointer-events-none"
      style={{
        left,
        top,
        width,
        // Shift left by half the pin width so the tip centres on the endpoint,
        // and shift up by the full pin height so the tip lands at `top`.
        transform: "translate(-50%, -100%)",
      }}
      initial={{ opacity: 0, scale: 0, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.35,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Icon Svg={LocationSvg} width="100%" />
    </motion.div>
  );
}
