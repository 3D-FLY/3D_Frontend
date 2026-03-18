import React from "react";

function SmallCaps80({ text }) {
  if (!text) return null;
  const first = text[0];
  const rest = text.slice(1).toUpperCase();
  return (
    <>
      <span style={{ fontSize: "100%" }}>{first}</span>
      <span style={{ fontSize: "80%" }}>{rest}</span>
    </>
  );
}

export default function FieldLabel({ children, className = "" }) {
  const text = typeof children === "string" ? children : null;

  return (
    <label
      className={`block mb-2
        text-black text-[24px] font-semibold italic leading-[31.2px]
        lg:text-green lg:text-[28px] lg:not-italic lg:font-medium
        ${className}`}
      style={{ letterSpacing: "0" }}
    >
      {text ? <SmallCaps80 text={text} /> : children}
    </label>
  );
}
