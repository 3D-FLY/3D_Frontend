import ArrowLeftSvg from "../../assets/icons/section-3/arrow-left.svg?react";
import ArrowRightSvg from "../../assets/icons/section-3/arrow-right.svg?react";

/**
 * רכיב חץ אחד – כיוון לפי ה-prop direction.
 * @param {"left" | "right"} direction - כיוון החץ (שמאל או ימין)
 * @param {string} className - מחלקות CSS (אופציונלי)
 */
export default function IconArrow({ direction = "right", className = "" }) {
  const Svg = direction === "left" ? ArrowLeftSvg : ArrowRightSvg;
  return <Svg aria-hidden className={className} />;
}
