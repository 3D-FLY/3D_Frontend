import type { ReactNode } from "react";
import IconTitleUnderline from "./IconTitleUnderline.js";

export default function SectionTitle({
  children,
  className = "",
  variant = "tall",
}: {
  children: ReactNode;  className?: string;
  variant?: "tall" | "flat";
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <IconTitleUnderline
        variant={variant}
        className="absolute inset-0"
      />
      <h1 className="relative z-10 text-[#DBDADA] italic font-extrabold text-[clamp(1.8rem,8vw,5.5rem)] leading-none tracking-tight uppercase px-10">
        {children}
      </h1>
    </div>
  );
}