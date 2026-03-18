import React from "react";

export default function OptionButton({ active, onClick, children, disabled = false }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={`relative px-4.5 py-2 rounded text-[14.5px] font-medium group font-['Inter'] ${
        active
          ? "bg-dark text-green"
          : "text-white"
      } ${disabled ? "cursor-default" : ""}`}
      style={
        disabled
          ? { background: "linear-gradient(rgba(255,255,255,0.35), rgba(255,255,255,0.35)), linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2))" }
          : !active
            ? { background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06))" }
            : undefined
      }
    >
      {!disabled && !active && (
        <span className="absolute inset-0 rounded bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
      )}
      {children}
    </button>
  );
}
