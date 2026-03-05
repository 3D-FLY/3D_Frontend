import React from "react";

export default function OptionButton({ active, onClick, children, disabled = false }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className={`px-4.5 py-2 rounded text-sm font-medium transition-colors ${
        active ? "bg-dark text-green" : "bg-gray/20 text-white hover:bg-black/20"
      } ${disabled ? "cursor-default opacity-70" : ""}`}
    >
      {children}
    </button>
  );
}
