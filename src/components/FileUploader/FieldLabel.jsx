import React from "react";

export default function FieldLabel({ children, className = "" }) {
  return (
    <label
      className={`block text-green text-[28px] font-medium mb-3 leading-[31.2px] ${className}`}
      style={{ fontVariant: "small-caps", letterSpacing: "0%" }}
    >
      {children}
    </label>
  );
}
