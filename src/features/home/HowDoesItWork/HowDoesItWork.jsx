import React, { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValue, useMotionValueEvent } from "framer-motion";
import Button from "../../../components/ui/Button";
import HowItWorksStep from "./HowItWorksStep";
import HowDoesItWorkGlow from "./HowDoesItWorkGlow";
import IconArrowAnimated from "./icons/arrows/IconArrowAnimated.jsx";
import { howDoesItWorkSteps } from "./howDoesItWorkData";
import HowItWorksStepMobile from "./HowItWorksStepMobile";

// desktop animation delay
const STEP_DELAY_MS = 450;

// ─── Scroll-progress ranges (mobile) ─────────────────────────────────────────
// All animations complete by MAX_PROGRESS so the last step is fully revealed
// while the section is still well inside the viewport (not near-exited).
const SCROLL_WINDOW = 0.35;
const MAX_PROGRESS  = 0.65;

function getStepRange(index, total) {
  const stride = total > 1 ? (MAX_PROGRESS - SCROLL_WINDOW) / (total - 1) : 0;
  const start  = index * stride;
  return /** @type {[number, number]} */ ([start, start + SCROLL_WINDOW]);
}

// Arrow i fades in while step i is completing and step i+1 is starting
function getArrowRange(arrowIndex, totalSteps) {
  const stride = totalSteps > 1 ? (MAX_PROGRESS - SCROLL_WINDOW) / (totalSteps - 1) : 0;
  const start  = arrowIndex * stride + SCROLL_WINDOW * 0.5;
  return /** @type {[number, number]} */ ([start, start + SCROLL_WINDOW * 0.4]);
}
// ─────────────────────────────────────────────────────────────────────────────

export default function HowDoesItWork() {
  const [inView, setInView] = useState(false); // desktop trigger
  const sectionRef = useRef(null);

  // Scroll progress for mobile scroll-driven animation.
  // offset "end 0.3": progress reaches 1 when section bottom is at 30% viewport height
  // (before section fully exits), so the last step completes while still in view.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.1"],
  });

  // One-way progress: only ever increases so elements stay revealed on scroll-back
  const committedProgress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > committedProgress.get()) {
      committedProgress.set(latest);
    }
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const steps = howDoesItWorkSteps;
  const N     = steps.length;

  return (
    <section
      ref={sectionRef}
      className="px-0 bg-dark overflow-hidden relative min-h-0 lg:min-h-[calc(100vh-72px)] flex flex-col justify-center"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <HowDoesItWorkGlow />

      <div className="w-full max-w-[1300px] mx-auto px-4 lg:px-0 py-10 lg:py-16 flex flex-col justify-around min-h-0 lg:min-h-[calc(100vh-72px-104px)] lg:h-full">
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
            Scroll-driven reveal via Framer Motion
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
                      scrollYProgress={committedProgress}
                      progressRange={getArrowRange(index, N)}
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
                    scrollYProgress={committedProgress}
                    progressRange={getStepRange(index, N)}
                  />
                </div>

                {!alignRight && !isLast && (
                  <div className="flex-shrink-0 w-10 flex justify-center pt-45">
                    <IconArrowAnimated
                      direction="right"
                      className="w-10 h-7"
                      scrollYProgress={committedProgress}
                      progressRange={getArrowRange(index, N)}
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
