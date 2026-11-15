import type { CSSProperties } from "react";
import Background from "../components/ui/Background.jsx";
import useNavbarHeight from "../components/layout/useNavbarHeight.js";
import SupplierWizard from "../features/PartnerJoin/SupplierWizard.js";
import { SUPPLIER_HERO } from "../features/PartnerJoin/supplierContent.js";

export default function JoinAsPartnerPage() {
  const navHeight = useNavbarHeight();

  return (
    <div dir="ltr" style={{ "--nav-h": `${navHeight}px` } as CSSProperties}>
      <Background variant="dark" className="overflow-clip!">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pb-32 md:pt-24">
          <header className="text-center">
            {/* Title stays on one line; font size scales down with the viewport */}
            <h1 className="whitespace-nowrap text-[clamp(8px,3.1vw,40px)] font-bold uppercase leading-tight text-white">
              {SUPPLIER_HERO.title}
            </h1>
          </header>

          <div className="mx-auto mt-6 max-w-3xl space-y-5 text-center md:mt-10">
            {SUPPLIER_HERO.paragraphs.map((text) => (
              <p
                key={text}
                className="text-[15px] font-medium leading-relaxed text-white/60 md:text-lg"
              >
                {text}
              </p>
            ))}
          </div>

          <SupplierWizard className="mx-auto mt-10 max-w-5xl md:mt-14" />
        </div>
      </Background>
    </div>
  );
}
