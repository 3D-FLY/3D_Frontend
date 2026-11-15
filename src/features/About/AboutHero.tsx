import AboutReveal from "./AboutReveal.js";
import { ABOUT_HERO } from "./aboutContent.js";

interface AboutHeroProps {
  className?: string;
}

export default function AboutHero({ className = "" }: AboutHeroProps) {
  return (
    <section
      className={`mx-auto max-w-6xl px-6 pb-10 pt-10 text-center md:pb-16 md:pt-24 ${className}`}
    >
      <AboutReveal>
        {/* Title stays on one line; font size scales down with the viewport */}
        <h1 className="whitespace-nowrap text-[clamp(8px,3vw,40px)] font-bold uppercase leading-tight text-white">
          {ABOUT_HERO.title}
        </h1>
      </AboutReveal>
      <div className="mx-auto mt-6 max-w-4xl space-y-5 md:mt-10">
        {ABOUT_HERO.paragraphs.map((text, i) => (
          <AboutReveal key={text} delay={0.08 * (i + 1)}>
            <p className="text-[15px] font-medium leading-relaxed text-white/60 md:text-lg">
              {text}
            </p>
          </AboutReveal>
        ))}
      </div>
    </section>
  );
}
