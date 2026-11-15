import type { CSSProperties } from "react";
import Background from "../components/ui/Background.jsx";
import useNavbarHeight from "../components/layout/useNavbarHeight.js";
import AboutHero from "../features/About/AboutHero.js";
import AboutStory from "../features/About/AboutStory.js";
import AboutVision from "../features/About/AboutVision.js";
import AboutClosing from "../features/About/AboutClosing.js";

export default function About() {
  const navHeight = useNavbarHeight();

  return (
    <div dir="ltr" style={{ "--nav-h": `${navHeight}px` } as CSSProperties}>
      <Background variant="dark" className="overflow-clip!">
        <AboutHero />
        <AboutStory />
        <AboutVision />
        <AboutClosing />
      </Background>
    </div>
  );
}
