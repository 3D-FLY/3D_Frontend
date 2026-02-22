// src/sections/home/features/Features.tsx

import React, { useState, useEffect, useRef } from "react";
import GlowCircle from "../../../components/ui/GlowCircle";
import Turtle from "../../../components/ui/Turtle";

import InfoCardDesktop from "./InfoCardDesktop";
import InfoCardMobile from "./InfoCardMobile";
import { featuresData } from "./featuresData";

export default function Features() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // סנטינל קטן בתחילת הסקשן כדי לטרגר את האנימציה בדיוק בזמן
  const triggerRef = useRef(null);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
          observer.disconnect(); // מפעיל פעם אחת בלבד
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px 200px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      className="
        flex flex-col relative text-center items-center justify-center
        w-full max-w-full min-w-0
        min-h-[calc(100vh-72px)]
        overflow-hidden
        bg-gray
      "
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* סנטינל לטריגר האנימציה */}
      <div
        ref={triggerRef}
        className="absolute top-1/3 left-0 w-full h-px"
      />

      {/* Glow circle — מובייל: באמצע הסקשיין */}
      <GlowCircle
        size={300}
        blur={400}
        opacity={0.4}
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-5 md:hidden"
      />

      {/* Glow circle — דסטופ: למטה במרכז */}
      <GlowCircle
        size={481}
        blur={600}
        opacity={0.4}
        className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/5 z-5 hidden md:block"
      />

      {/* Turtle — מובייל: גובה 80%, צד ימין, חצי יוצא מהחלון */}
      <Turtle
        right="0"
        top="50%"
        translateX="50%"
        translateY="-50%"
        height="70vh"
        opacity={0.3}
        zIndex={0}
        className="md:hidden [width:auto!important] max-w-none object-contain"
      />

      {/* Turtle — דסטופ: למטה במרכז */}
      <Turtle
        bottom="0%"
        translateY="37%"
        opacity={0.3}
        zIndex={6}
        className="hidden md:block w-[120vw] sm:w-[105vw] md:w-[90vw] lg:w-[70vw]"
      />

      {/* Desktop grid */}
      <div
        className="
          relative z-10
          mx-auto
          w-full max-w-[1400px]
          px-6 md:px-10
          py-12 md:py-16 lg:py-20
          hidden md:grid
          gap-x-[40px] gap-y-[48px]
          justify-items-stretch
          [grid-template-columns:repeat(auto-fit,minmax(min(400px,100%),1fr))]
        "
      >
        {featuresData.map((f) => (
          <InfoCardDesktop
            key={f.title}
            imageSrc={f.imageSrc}
            title={f.title}
            text={f.text}
          />
        ))}
      </div>

      {/* Mobile list */}
      <div
        className="
          relative z-10
          flex md:hidden flex-col
          w-full max-w-full min-w-0
          pl-0 pr-3
          py-10
          gap-6
        "
      >
        {featuresData.map((f, index) => (
          <InfoCardMobile
            key={f.title}
            imageSrc={f.imageSrc}
            title={f.title}
            text={f.text}
            animationDelay={index * (2 / 4)}
            shouldAnimate={shouldAnimate}
          />
        ))}
      </div>
    </section>
  );
}