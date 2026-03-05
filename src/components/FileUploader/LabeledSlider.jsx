import React, { useState } from "react";

export default function LabeledSlider({
  value,
  onChange,
  min,
  max,
  step,
  valueWidth = 64,
  format = (v) => v,
}) {
  const [editStr, setEditStr] = useState(null);
  const isEditing = editStr !== null;
  const displayValue = isEditing ? editStr : format(value);

  const commit = (raw) => {
    const n = parseFloat(String(raw).replace(",", "."));
    if (!Number.isNaN(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      const stepsFromMin = (clamped - min) / step;
      const nearestStep = Math.round(stepsFromMin);
      const snapped = min + nearestStep * step;
      const inRange = Math.min(max, Math.max(min, snapped));
      onChange(Number(inRange.toPrecision(12)));
    }
    setEditStr(null);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        inputMode="decimal"
        aria-label="ערך"
        value={displayValue}
        onChange={(e) => setEditStr(e.target.value)}
        onFocus={() => setEditStr(String(value))}
        onBlur={() => commit(editStr ?? value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit(editStr ?? value);
        }}
        className="w-[64px] text-center text-green text-sm bg-dark p-2 rounded-md tabular-nums border border-transparent focus:border-green focus:outline-none"
      />

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
