// CurvedDashedLine.tsx
interface CurvedDashedLineProps {
    start: { x: number; y: number };
    end:   { x: number; y: number };
    ctrl:  { x: number; y: number };
    stroke?:      string;
    strokeWidth?: number;
    dashSize?:    number;
    dashGap?:     number;
    delay?:       number;
    duration?:    number;
  }
  
  export default function CurvedDashedLine({
    start,
    end,
    ctrl,
    stroke      = "#4CAF50",
    strokeWidth = 0.4,
    dashSize    = 1.5,
    dashGap     = 1.5,
    delay       = 0,
    duration    = 0.9,
  }: CurvedDashedLineProps) {
    return (
      <path
        d={`M ${start.x} ${start.y} Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dashSize} ${dashGap}`}
        pathLength="100"
        style={{
          strokeDashoffset: 100,
          animation: `drawLine ${duration}s ease forwards`,
          animationDelay: `${delay}s`,
        }}
      />
    );
  }