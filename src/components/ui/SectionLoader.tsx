import { type ReactNode } from "react";
import LogoLoader from "./LogoLoader";

interface SectionLoaderProps {
  loading: boolean;
  children: ReactNode;
  minHeight?: number;
}

export default function SectionLoader({
  loading,
  children,
  minHeight = 220,
}: SectionLoaderProps) {
  if (loading) {
    return (
      <div
        style={{
          minHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <LogoLoader size={70} />
      </div>
    );
  }

  return <>{children}</>;
}
