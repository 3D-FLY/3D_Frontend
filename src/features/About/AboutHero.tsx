import AboutReveal from "./AboutReveal.js";
import { ABOUT_HERO } from "./aboutContent.js";

interface AboutHeroProps {
  className?: string;
}

export default function AboutHero({ className = "" }: AboutHeroProps) {
  return (
    <section
      className={`mx-auto max-w-3xl px-6 pb-10 pt-10 text-center md:pb-16 md:pt-24 ${className}`}
    >
      <AboutReveal>
        <h1 className="text-[clamp(22px,6vw,56px)] font-bold uppercase leading-tight text-white">
          {ABOUT_HERO.title}
        </h1>
      </AboutReveal>
      <div className="mt-6 space-y-5 md:mt-10">
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
