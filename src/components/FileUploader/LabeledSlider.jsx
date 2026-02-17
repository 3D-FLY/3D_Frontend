import React from "react";

export default function LabeledSlider({
  value,
  onChange,
  min,
  max,
  step,
  valueWidth = 64,
  format = (v) => v,
}) {
  return (
    <div className="flex items-center gap-4">
      <span className={`w-[64px] text-center text-green text-sm bg-dark p-2 rounded-md tabular-nums`}>
        {format(value)}
      </span>

      <div className="flex-1 relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-dark rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
  );
}
