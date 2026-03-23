import React from "react";
import OptionButton from "./OptionButton";

export default function OptionGroup({ options, value, onChange, className = "", disabledOptions = [] }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {options.map((opt) => (
        <OptionButton
          key={opt}
          active={value === opt}
          onClick={() => onChange(opt)}
          disabled={disabledOptions.includes(opt)}
        >
          {opt}
        </OptionButton>
      ))}
    </div>
  );
}
