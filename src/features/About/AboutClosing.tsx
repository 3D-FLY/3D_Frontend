import AboutReveal from "./AboutReveal.js";
import { ABOUT_CLOSING } from "./aboutContent.js";

interface AboutClosingProps {
  className?: string;
}

export default function AboutClosing({ className = "" }: AboutClosingProps) {
  return (
    <section
      className={`mx-auto max-w-4xl px-6 pb-20 pt-10 text-center md:pb-32 md:pt-16 ${className}`}
    >
      <AboutReveal>
        <p className="font-extrabold italic leading-tight text-white">
          <span className="block text-[clamp(1.25rem,5vw,3rem)]">
            {ABOUT_CLOSING.lead}
          </span>
          {/* Accent sentence stays on one line; font size scales with viewport width to fit */}
          <span className="mt-2 block whitespace-nowrap text-[clamp(0.9rem,4.4vw,2.5rem)] text-green-500">
            {ABOUT_CLOSING.accent}
          </span>
        </p>
      </AboutReveal>
    </section>
  );
}
