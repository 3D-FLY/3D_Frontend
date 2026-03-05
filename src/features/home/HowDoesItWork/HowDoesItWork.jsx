import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/ui/Button";
import HowItWorksStep from "./HowItWorksStep";
import HowDoesItWorkGlow from "./HowDoesItWorkGlow";
import IconArrowAnimated from "../../../icons/section-3/IconArrowAnimated.jsx";
import { howDoesItWorkSteps } from "./howDoesItWorkData";
import HowItWorksStepMobile from "./HowItWorksStepMobile";

// desktop animation delay
const STEP_DELAY_MS = 450;

// מובייל/טאבלט: Step Build Sequence
const CARD_REVEAL_MS = 800;
const ARROW_DELAY_AFTER_CARD_MS = 200;
const ARROW_DRAW_MS = 600;
const STEP_CYCLE_MS = CARD_REVEAL_MS + ARROW_DELAY_AFTER_CARD_MS + ARROW_DRAW_MS;

function getRevealDelayForStep(index) {
  return index * STEP_CYCLE_MS;
}
function getDrawDelayForArrow(index) {
  return (index + 1) * CARD_REVEAL_MS + ARROW_DELAY_AFTER_CARD_MS + index * (ARROW_DELAY_AFTER_CARD_MS + ARROW_DRAW_MS);
}

export default function HowDoesItWork() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Fallback: אם האלמנט כבר גלוי, הגדר inView ל-true מיד
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        setInView(true);
      }
    };

    // בדיקה ראשונית
    checkVisibility();

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const steps = howDoesItWorkSteps;

  return (
    <section
      ref={sectionRef}
      className="px-0 bg-dark overflow-hidden relative min-h-0 lg:min-h-[calc(100vh-72px)] flex flex-col justify-center"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <HowDoesItWorkGlow />

      <div className="w-full max-w-[1300px] mx-auto px-4 lg:px-0 py-10 lg:py-16 flex flex-col justify-around min-h-0 lg:min-h-[calc(100vh-72px-104px)] lg:h-full">
        {/* Title — במובייל: פריסה על כל הרוחב (בלי ירידה שורה), בדסקטופ: ממורכז */}
        <h2
          className="flex flex-nowrap justify-evenly lg:justify-center items-baseline gap-1 text-left font-extrabold italic text-gray pt-10 pb-10 lg:flex-initial lg:block lg:text-center lg:pt-0 lg:pb-0"
          style={{ fontFamily: "Montserrat, italic" }}
        >
          <span className="flex shrink-0 items-baseline lg:contents">
            <span className="text-[clamp(2rem,8vw,7rem)]">H</span>
            <span className="text-[clamp(20px,7vw,80px)]">OW DOES IT</span>
          </span>
          <span className="text-green text-[clamp(20px,7vw,80px)] shrink-0 lg:ml-6">WORK?</span>
        </h2>

        {/* =========================
            DESKTOP (>= lg)
            ========================= */}
        <div className="hidden lg:flex items-center justify-center w-full">
          <div className="grid w-full gap-[clamp(1rem,2.5vw,3.5rem)]" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {steps.map((step, index) => (
              <HowItWorksStep
                key={step.title}
                step={step}
                inView={inView}
                index={index}
                delayMs={STEP_DELAY_MS}
              />
            ))}
          </div>
        </div>


        {/* =========================
            MOBILE + TABLET (< lg)
            zig-zag layout (same internal structure as desktop)
            ========================= */}
        {/* MOBILE + TABLET (< lg) — Step Build Sequence */}
        <div className="lg:hidden flex flex-col gap-10 w-full mx-auto">
          {steps.map((step, index) => {
            const alignRight = index % 2 === 1;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.title}
                className={`w-full flex items-center gap-3 ${alignRight ? "justify-end" : "justify-start"}`}
              >
                {alignRight && !isLast && (
                  <div className="flex-shrink-0 w-10 flex justify-center pt-45">
                    <IconArrowAnimated
                      direction="left"
                      className="w-10 h-7"
                      inView={inView}
                      drawDelayMs={getDrawDelayForArrow(index)}
                      drawDurationMs={ARROW_DRAW_MS}
                    />
                  </div>
                )}
                <div className="w-4/7 shrink-0">
                  <HowItWorksStepMobile
                    imageSrc={step.imageSrc}
                    title={step.title}
                    subtitle={step.subtitle}
                    description={step.description}
                    iconWidth={step.iconWidth}
                    iconHeight={step.iconHeight}
                    iconWidthPercent={step.iconWidthPercent}
                    iconPadding={step.iconPadding}
                    inView={inView}
                    index={index}
                    revealDelayMs={getRevealDelayForStep(index)}
                  />
                </div>
                {!alignRight && !isLast && (
                  <div className="flex-shrink-0 w-10 flex justify-center pt-45">
                    <IconArrowAnimated
                      direction="right"
                      className="w-10 h-7"
                      inView={inView}
                      drawDelayMs={getDrawDelayForArrow(index)}
                      drawDurationMs={ARROW_DRAW_MS}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-12 pb-8 lg:pt-0 lg:pb-0">
          <Button
            hovering="darkBg"
            size="md"
            className="italic min-w-[143px] h-[44px] px-[32px] py-[10px] text-[16px]"
          >
            TRY NOW!
          </Button>
        </div>
      </div>
    </section>
  );
}
