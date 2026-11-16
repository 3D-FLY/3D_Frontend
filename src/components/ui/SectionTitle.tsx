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
    <div className={`relative mx-auto flex w-full items-center justify-center ${className}`}>
      <IconTitleUnderline
        variant={variant}
        className="inset-x-0 top-1/2 -translate-y-1/2"
      />
      <h1 className="relative z-10 text-[#DBDADA] italic font-extrabold whitespace-nowrap text-[clamp(0.75rem,5.2vw,3.2rem)] leading-none tracking-tight uppercase px-6">
        {children}
      </h1>
    </div>
  );
}