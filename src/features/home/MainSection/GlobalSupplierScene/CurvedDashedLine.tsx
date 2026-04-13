interface CurvedDashedLineProps {
  start: { x: number; y: number };
  end:   { x: number; y: number };
  ctrl:  { x: number; y: number };
  ctrl2?: { x: number; y: number }; // ← הוסיפי את זה
  stroke?:      string;
  strokeWidth?: number;
  dashSize?:    number;
  dashGap?:     number;
  delay?:       number;
  duration?:    number;
}

export default function CurvedDashedLine({
  start, end, ctrl, ctrl2, // ← הוסיפי ctrl2
  stroke = "#4CAF50",
  strokeWidth = 0.4,
  dashSize = 1.5,
  dashGap = 1.5,
  delay = 0,
  duration = 0.9,
}: CurvedDashedLineProps) {
  const d = ctrl2
    ? `M ${start.x} ${start.y} C ${ctrl.x} ${ctrl.y} ${ctrl2.x} ${ctrl2.y} ${end.x} ${end.y}`
    : `M ${start.x} ${start.y} Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`;

  return (
    <path
      className="dashed-line"
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={`${dashSize} ${dashGap}`}
      pathLength="100"
      style={{
        animation: `drawLine ${duration}s ease-in-out ${delay}s both, revealLine 0.01s linear ${delay}s forwards`,
      }}
    />
  );
}