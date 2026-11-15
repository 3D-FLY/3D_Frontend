import type { CSSProperties } from "react";
import Background from "../components/ui/Background.jsx";
import useNavbarHeight from "../components/layout/useNavbarHeight.js";
import LegalPage from "../features/Legal/LegalPage.js";
import { PRIVACY_CONTENT } from "../features/Legal/privacyContent.js";

export default function PrivacyPage() {
  const navHeight = useNavbarHeight();

  return (
    <div dir="ltr" style={{ "--nav-h": `${navHeight}px` } as CSSProperties}>
      <Background variant="dark" className="overflow-clip!">
        <LegalPage document={PRIVACY_CONTENT} />
      </Background>
    </div>
  );
}
