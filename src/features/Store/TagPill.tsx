
import React from "react";

type Props = {
  children: React.ReactNode;
  variant?: "green" | "gray";
};

const base =
    "h-[27px] px-[15px] pt-[1px] rounded-[4px] text-[12px] leading-[26px] font-inter select-none";

export default function TagPill({ children, variant = "gray" }: Props) {
    

  const styles =
    variant === "green"
      ? "bg-[#1A1A1A] text-green" // תחליפי ל-classnames שיש אצלך
      : "bg-[#FFFFFF]/6 text-white";

  return <span className={`${base} ${styles}`}>{children}</span>;
}
