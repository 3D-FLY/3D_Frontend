import type { CSSProperties } from "react";
import Background from "../components/ui/Background.jsx";
import useNavbarHeight from "../components/layout/useNavbarHeight.js";
import LegalPage from "../features/Legal/LegalPage.js";
import { TERMS_CONTENT } from "../features/Legal/termsContent.js";

export default function TermsPage() {
  const navHeight = useNavbarHeight();

  return (
    <div dir="ltr" style={{ "--nav-h": `${navHeight}px` } as CSSProperties}>
      <Background variant="dark" className="overflow-clip!">
        <LegalPage document={TERMS_CONTENT} />
      </Background>
    </div>
  );
}
