import React, { useState } from "react";

export default function ShellsStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  className = "",
}) {
  const [editStr, setEditStr] = useState(null);
  const displayValue = editStr !== null ? editStr : value;

  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const commit = (raw) => {
    const n = parseFloat(String(raw).replace(",", ".").replace(/\s/g, ""));
    if (!Number.isNaN(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      const snapped = Math.round(clamped);
      onChange(Math.min(max, Math.max(min, snapped)));
    }
    setEditStr(null);
  };

  return (
    <div
      className={`inline-flex items-center bg-dark rounded-md h-10 px-2 gap-3 ${className}`}
    >
      <button
        type="button"
        onClick={dec}
        className="w-8 h-8 grid place-items-center rounded translate-y-[2px] hover:bg-black/20 transition-colors"
        aria-label="Decrease"
      >
        <span className="text-[#5AC422] text-xs leading-none">▼</span>
      </button>

      <input
        type="text"
        inputMode="numeric"
        aria-label="Shells"
        value={displayValue}
        onChange={(e) => setEditStr(e.target.value)}
        onFocus={() => setEditStr(String(value))}
        onBlur={() => commit(editStr ?? value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit(editStr ?? value);
        }}
        className="min-w-[28px] w-9 text-center text-[#5AC422] font-medium tabular-nums bg-transparent border-none focus:outline-none focus:ring-0 p-0"
      />

      <button
        type="button"
        onClick={inc}
        className="w-8 h-8 grid place-items-center rounded -translate-y-[2px] hover:bg-black/20 transition-colors"
        aria-label="Increase"
      >
        <span className="text-[#5AC422] text-xs leading-none">▲</span>
      </button>
    </div>
  );
}
