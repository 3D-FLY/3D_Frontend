import React from "react";
import earthUrl from "../assets/icons/Earth.svg?url";

interface EarthProps {
  className?: string;
}

export default function Earth({ className = "" }: EarthProps) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ paddingBottom: 0 }}>
      <img
        src={earthUrl}
        alt=""
        aria-hidden
        draggable={false}
        style={{ display: "block", marginBottom: "-1%" }}
        className="w-full h-auto select-none pointer-events-none"
      />
    </div>
  );
}