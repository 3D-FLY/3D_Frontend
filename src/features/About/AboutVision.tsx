import SectionTitle from "../../components/ui/SectionTitle.js";
import AboutReveal from "./AboutReveal.js";
import { ABOUT_VISION } from "./aboutContent.js";

interface AboutVisionProps {
  className?: string;
}

export default function AboutVision({ className = "" }: AboutVisionProps) {
  return (
    <section className={`mx-auto max-w-3xl px-6 py-10 md:py-16 ${className}`}>
      <AboutReveal>
        <SectionTitle variant="flat">{ABOUT_VISION.title}</SectionTitle>
      </AboutReveal>

      <div className="mt-8 space-y-6 text-center md:mt-12 md:space-y-8">
        {ABOUT_VISION.paragraphs.map((text, i) => (
          <AboutReveal key={text}>
            <p
              className={
                i === 0
                  ? "text-lg font-bold leading-relaxed text-white md:text-2xl"
                  : "text-[15px] font-medium leading-relaxed text-white/60 md:text-lg"
              }
            >
              {text}
            </p>
          </AboutReveal>
        ))}
      </div>
    </section>
  );
}
