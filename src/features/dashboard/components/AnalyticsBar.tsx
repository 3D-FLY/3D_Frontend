import Turtle from "../../../components/ui/Turtle.jsx";

export interface AnalyticBlock {
    id: string;
    value: string;
    label: string;
    change?: {
      percent: number;
      label: string;
    };
  }

interface AnalyticsBarProps {
  items: AnalyticBlock[];
}

export default function AnalyticsBar({ items }: AnalyticsBarProps) {
  return (
    <div className="flex w-full items-start justify-around py-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative grid grid-rows-[auto_auto_auto] justify-items-center gap-1"
        >

          {/* Turtle per item */}
          <Turtle
            left="50%"
            bottom="0"
            height="200%"
            translateX="-50%"
            translateY="80%"
            opacity={0.15}
            zIndex={0}
          />

          {/* Value */}
          <span className="relative z-10 text-[clamp(28px,3vw,75px)] font-bold leading-none text-white">
            {item.value}
          </span>

          {/* Label */}
          <span className="relative z-10 text-[clamp(10px,0.8vw,14px)] font-semibold uppercase tracking-wide text-black whitespace-nowrap">
            {item.label}
          </span>

          {/* Change */}
          <span
            className={`relative z-10 min-h-[1.2em] text-[clamp(10px,0.8vw,13px)] font-semibold whitespace-nowrap ${
              item.change
                ? item.change.percent >= 0
                  ? "text-green"
                  : "text-red-400"
                : "invisible"
            }`}
          >
            {item.change
              ? `${item.change.percent >= 0 ? "+" : ""}${item.change.percent}% ${item.change.label}`
              : "placeholder"}
          </span>

        </div>
      ))}
    </div>
  );
}