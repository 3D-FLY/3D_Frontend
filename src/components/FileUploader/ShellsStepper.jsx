import React from "react";

export default function ShellsStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  className = "",
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={`inline-flex items-center bg-[#222222] rounded-md h-10 px-2 gap-3 ${className}`}
    >
      <button
        type="button"
        onClick={dec}
        className="w-8 h-8 grid place-items-center rounded translate-y-[2px] hover:bg-black/20 transition-colors"
        aria-label="Decrease"
      >
        <span className="text-[#5AC422] text-xs leading-none">▼</span>
      </button>

      <div className="min-w-[28px] text-center text-[#5AC422] font-medium tabular-nums">
        {value}
      </div>

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
