import React from "react";

export default function OptionButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4.5 py-2 rounded text-sm font-medium transition-colors ${
        active ? "bg-dark text-green" : "bg-gray text-white hover:bg-black/20"
      }`}
    >
      {children}
    </button>
  );
}
