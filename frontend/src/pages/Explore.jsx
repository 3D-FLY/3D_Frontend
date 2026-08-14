import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";

import Button from "../components/ui/Button";
import { EXPLORE_CONTENT } from "../features/Explore/exploreContent";

function ProgressDots({ activeIndex, total }) {
  return (
    <div className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <motion.div
            animate={{
              scale: i === activeIndex ? 1.6 : 1,
              backgroundColor:
                i === activeIndex
                  ? "#5ac422"
                  : i < activeIndex
                  ? "rgba(90,196,34,0.35)"
                  : "rgba(149,149,149,0.2)",
              boxShadow:
                i === activeIndex ? "0 0 10px rgba(90,196,34,0.8)" : "none",
            }}
            transition={{ duration: 0.3 }}
            className="w-2.5 h-2.5 rounded-full"
          />
          {i < total - 1 && (
            <motion.div
              animate={{
                backgroundColor:
                  i < activeIndex ? "#5ac422" : "rgba(149,149,149,0.15)",
              }}
              transition={{ duration: 0.4 }}
              className="w-px h-5"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut", delay },
  },
});

function StepSection({ step, index, onInView }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.4 });
  const isOdd = index % 2 === 1;

  useEffect(() => {
    if (isInView) onInView(index);
  }, [isInView, index, onInView]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20"
    >
      {/* Ambient glow blob */}
      <motion.div
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        className="absolute pointer-events-none"
        style={{
          [isOdd ? "right" : "left"]: "-8%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(90,196,34,0.09) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />

      <div
        className={`relative flex w-full max-w-[1400px] mx-auto items-center gap-12 lg:gap-20 flex-col ${
          isOdd ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        {/* Image — fixed width, large */}
        <motion.div
          initial={{ opacity: 0, x: isOdd ? 60 : -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="flex-shrink-0 flex justify-center items-center"
          style={{ width: "clamp(280px, 32vw, 440px)" }}
        >
          <motion.img
            src={step.image}
            alt={step.title}
            animate={isInView ? { y: [0, -10, 0] } : { y: 0 }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="w-full h-auto"
          />
        </motion.div>

        {/* Text — takes all remaining width */}
        <div className="flex-1 min-w-0 flex flex-col text-center lg:text-left">

          {/* Title */}
          <motion.h2
            variants={fadeUp(0)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="font-extrabold italic text-white leading-none"
            style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
          >
            {step.title}
          </motion.h2>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-5 mb-5 h-px bg-green/40 w-16 mx-auto lg:mx-0"
          />

          {/* Subtitle */}
          <motion.p
            variants={fadeUp(0.18)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-gray font-medium"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}
          >
            {step.subtitle}
          </motion.p>

          {/* Description paragraphs — bullets injected at bulletsAfterIndex */}
          {step.description?.map((para, i) => (
            <React.Fragment key={i}>
              <motion.p
                variants={fadeUp(0.28 + i * 0.08)}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="mt-3 text-gray/70"
                style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)" }}
              >
                {para}
              </motion.p>

              {step.bullets && step.bulletsAfterIndex === i && (
                <motion.ul
                  variants={fadeUp(0.28 + i * 0.08 + 0.08)}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="mt-2 flex flex-col gap-1 mx-auto lg:mx-0 text-left pl-4"
                >
                  {step.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-gray/70 font-medium"
                      style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray/50 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </motion.ul>
              )}
            </React.Fragment>
          ))}

          {/* Bullets fallback — render at end when no bulletsAfterIndex */}
          {step.bullets && step.bulletsAfterIndex === undefined && (
            <motion.ul
              variants={fadeUp(0.45)}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="mt-5 flex flex-col gap-2 mx-auto lg:mx-0 text-left"
            >
              {step.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-green font-semibold"
                  style={{ fontSize: "clamp(0.85rem, 1.4vw, 1rem)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" />
                  {b}
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Explore() {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleInView = useCallback((i) => setActiveIndex(i), []);
  const steps = EXPLORE_CONTENT;

  return (
    <div className="bg-dark min-h-screen">
      <ProgressDots activeIndex={activeIndex} total={steps.length} />

      {/* Hero */}
      <section className="min-h-[calc(100dvh-var(--nav-h))] flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-nowrap justify-center items-baseline gap-1 font-extrabold italic text-gray mb-16"
          style={{ fontFamily: "Montserrat, italic" }}
        >
          <span className="flex shrink-0 items-baseline">
            <span className="text-[clamp(2rem,8vw,7rem)]">H</span>
            <span className="text-[clamp(20px,7vw,80px)]">OW DOES </span>
            <span className="text-[clamp(2rem,8vw,7rem)] ml-[0.25em]">3D-FLY</span>
          </span>
          <span className="text-green text-[clamp(20px,7vw,80px)] shrink-0 ml-[0.25em]">WORK?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-gray mt-6 leading-tight"
          style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.875rem)" }}
        >
          Let 3D-Fly be your control center.
          <br />
          All your stores, all your products, all your production,
          <br />
          connected, managed, and running through one smart system.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-white mt-4 font-bold"
          style={{ fontSize: "clamp(1.2rem, 2.5vw, 2rem)" }}
        >
          Here's how the magic actually happens:
        </motion.p>
      </section>

      {/* Steps */}
      {steps.map((step, i) => (
        <StepSection
          key={step.title}
          step={step}
          index={i}
          onInView={handleInView}
        />
      ))}

      {/* CTA */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="flex items-baseline gap-0 font-extrabold italic text-[#4CA835] leading-none"
          style={{ fontFamily: "Montserrat, italic" }}
        >
          <span className="text-[clamp(2rem,8vw,7rem)]">R</span>
          <span className="text-[clamp(20px,7vw,80px)]">EADY WHEN YOU ARE!</span>
        </motion.h2>
      </section>
    </div>
  );
}