import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/ui/Button";
import HowItWorksStep from "./HowItWorksStep";
import HowDoesItWorkGlow from "./HowItWorksGlow";
import IconArrowAnimated from "./icons/IconArrowAnimated.jsx";
import { howDoesItWorkSteps } from "./howItWorksData";
import HowItWorksStepMobile from "./HowItWorksStepMobile";

// desktop animation delay
const STEP_DELAY_MS = 450;

// mobile / tablet: time-based step reveal (not scroll-linked)
const MOBILE_STEP_STAGGER_S   = 0.52;
const MOBILE_STEP_DURATION_S  = 0.72;
const MOBILE_ARROW_DURATION_S = 0.48;
/** intersectionRatio ≥ this ⇒ start mobile animations (~15% of section visible in viewport) */
const MOBILE_REVEAL_THRESHOLD = 0.15;

export default function HowDoesItWork() {
  const [inView, setInView] = useState(false); // desktop trigger
  const [mobileReveal, setMobileReveal] = useState(false); // mobile time-based steps
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const thresholds = [0, 0.05, 0.1, 0.12, 0.15, 0.2, 0.3, 0.5, 0.75, 1];
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const r = entry.intersectionRatio;
        if (r >= 0.12) setInView(true);
        if (r >= MOBILE_REVEAL_THRESHOLD) setMobileReveal(true);
      },
      { threshold: thresholds }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const steps = howDoesItWorkSteps;
  const N     = steps.length;

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full min-h-[calc(100dvh-var(--nav-h))] flex-col justify-center overflow-hidden bg-dark px-0 lg:h-full lg:min-h-0"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <HowDoesItWorkGlow />

      <div className="mx-auto flex min-h-0 w-full max-w-[1300px] flex-col justify-around px-4 py-10 lg:h-full lg:min-h-0 lg:flex-1 lg:px-0 lg:py-16">
        {/* Title */}
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
          <div
            className="grid w-full gap-[clamp(1rem,2.5vw,3.5rem)]"
            style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
          >
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
            Time-based reveal after ~15% of section is visible
            ========================= */}
        <div className="lg:hidden flex flex-col gap-10 w-full mx-auto">
          {steps.map((step, index) => {
            const alignRight = index % 2 === 1;
            const isLast     = index === N - 1;

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
                      reveal={mobileReveal}
                      transitionDelay={(index + 0.5) * MOBILE_STEP_STAGGER_S}
                      duration={MOBILE_ARROW_DURATION_S}
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
                    reveal={mobileReveal}
                    stepIndex={index}
                    staggerSeconds={MOBILE_STEP_STAGGER_S}
                    durationSeconds={MOBILE_STEP_DURATION_S}
                  />
                </div>

                {!alignRight && !isLast && (
                  <div className="flex-shrink-0 w-10 flex justify-center pt-45">
                    <IconArrowAnimated
                      direction="right"
                      className="w-10 h-7"
                      reveal={mobileReveal}
                      transitionDelay={(index + 0.5) * MOBILE_STEP_STAGGER_S}
                      duration={MOBILE_ARROW_DURATION_S}
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
