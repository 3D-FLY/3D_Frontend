import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import type { ExploreContent } from "./exploreContent.js";

interface ExploreStepMobileProps {
  step: ExploreContent;
  index: number;
  /** Element id, targeted by the progress bar's jump list. */
  id: string;
  onInView: (index: number) => void;
}

/** Compact mobile card for one Explore step: image, title, first paragraph, rest behind "Read more". */
export default function ExploreStepMobile({ step, index, id, onInView }: ExploreStepMobileProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isInView) onInView(index);
  }, [isInView, index, onInView]);

  const [first, ...rest] = step.description;

  return (
    <motion.article
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="scroll-mt-[calc(var(--nav-h)+56px)] rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.08)] p-5"
    >
      <div className="mb-4 flex aspect-[4/3] max-h-[260px] w-full items-center justify-center overflow-hidden rounded-xl">
        <img src={step.image} alt={step.title} className="h-full w-full object-contain" loading="lazy" />
      </div>

      <span className="text-xs font-bold tracking-widest text-green">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2 className="mt-1 text-[1.6rem] font-extrabold italic leading-tight text-white">{step.title}</h2>
      <p className="mt-2 text-[15px] font-medium leading-relaxed text-gray">{step.subtitle}</p>

      {first && <p className="mt-3 text-[15px] leading-relaxed text-gray/70">{first}</p>}

      {step.bullets && (
        <ul className="mt-4 flex list-none flex-col gap-2 rounded-xl border border-green/20 bg-green/5 p-4">
          {step.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-[15px] font-semibold text-green">
              <Check size={16} className="shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      )}

      {rest.length > 0 && (
        <>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                id={`${id}-more`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {rest.map((para) => (
                  <p key={para} className="mt-3 text-[15px] leading-relaxed text-gray/70">
                    {para}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={`${id}-more`}
            className="mt-4 min-h-[44px] text-sm font-bold uppercase tracking-wide text-green"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        </>
      )}
    </motion.article>
  );
}
