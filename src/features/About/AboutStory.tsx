import SectionTitle from "../../components/ui/SectionTitle.js";
import AboutReveal from "./AboutReveal.js";
import PullQuote from "./PullQuote.js";
import { ABOUT_STORY } from "./aboutContent.js";

interface AboutStoryProps {
  className?: string;
}

const BODY_CLASS =
  "text-[15px] font-medium leading-relaxed text-white/60 md:text-lg";

export default function AboutStory({ className = "" }: AboutStoryProps) {
  return (
    <section className={`mx-auto max-w-4xl px-6 py-10 md:py-16 ${className}`}>
      <AboutReveal>
        <SectionTitle variant="flat">{ABOUT_STORY.title}</SectionTitle>
      </AboutReveal>

      <div className="mt-8 space-y-6 md:mt-12 md:space-y-8">
        <AboutReveal>
          <p className={BODY_CLASS}>{ABOUT_STORY.intro}</p>
        </AboutReveal>

        <AboutReveal>
          <PullQuote>{ABOUT_STORY.quote}</PullQuote>
        </AboutReveal>

        {ABOUT_STORY.beforeHighlight.map((text) => (
          <AboutReveal key={text}>
            <p className={BODY_CLASS}>{text}</p>
          </AboutReveal>
        ))}

        <AboutReveal>
          <p className="text-center text-xl font-extrabold italic text-white md:text-3xl">
            {ABOUT_STORY.highlight}
          </p>
        </AboutReveal>

        {ABOUT_STORY.afterHighlight.map((text) => (
          <AboutReveal key={text}>
            <p className={BODY_CLASS}>{text}</p>
          </AboutReveal>
        ))}
      </div>
    </section>
  );
}
