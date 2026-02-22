import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/ui/Button";
import HowItWorksStep from "./HowItWorksStep";
import GlowCircle from "../../../components/ui/GlowCircle";
import { howDoesItWorkSteps } from "./howDoesItWorkData";

// desktop animation delay
const STEP_DELAY_MS = 450;

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
      className="px-4 lg:px-0 bg-dark overflow-hidden relative min-h-[calc(100vh-72px)] flex flex-col justify-center"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Glow circles in background */}
      <GlowCircle
        size={450}
        blur={600}
        opacity={0.8}
        color="149, 149, 149"
        top="0"
        right="0"
        translateX="20%"
        translateY="20%"
        zIndex={0}
      />
      <GlowCircle
        size={356}
        blur={600}
        opacity={0.4}
        color="149, 149, 149"
        bottom="0"
        left="0"
        translateX="20%"
        translateY="60%"
        zIndex={0}
      />

      <div className="w-full max-w-[1300px] mx-auto px-4 py-16 lg:px-0 flex flex-col justify-around h-full min-h-[calc(100vh-72px-104px)]">
        {/* Title */}
        <h2
          className="text-center font-extrabold italic text-gray"
          style={{ fontFamily: "Montserrat, italic" }}
        >
          <span className="text-[clamp(2rem,8vw,7rem)]">H</span>
          <span className="text-[clamp(28px,7vw,80px)]">OW DOES IT</span>
          <span className="text-green text-[clamp(28px,7vw,80px)] ml-6">WORK?</span>
        </h2>

        {/* =========================
            DESKTOP (>= lg)
            ========================= */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="grid grid-cols-4 gap-[132px]">
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
        <div className="lg:hidden">
          <div className="relative mx-auto w-full max-w-[420px]">
            {steps.map((step, index) => {
              const alignRight = index % 2 === 1;

              return (
                <div key={step.title} className="relative">
                  {/* wrapper שמיישר לזיגזג */}
                  <div className={`w-full flex ${alignRight ? "justify-end" : "justify-start"}`}>
                    <HowItWorksStep
                      step={step}
                      inView={inView}
                      index={index}
                      delayMs={220}
                      className="w-[270px]"
                    />
                  </div>

                  {/* רווח קבוע בין בלוק לבלוק */}
                  {index < steps.length - 1 && <div className="h-14" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
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
