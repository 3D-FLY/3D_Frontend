import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface HorizontalCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export default function HorizontalCarousel({
  children,
  className = "",
}: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    // ResizeObserver — מעדכן אם גודל משתנה
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 200 : -200, behavior: "smooth" });
  };

  return (
    <div className={`relative h-full ${className}`}>
      {/* החץ השמאלי */}
      <button
        onClick={() => scroll("left")}
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 z-20
          w-7 h-7 rounded-full
          bg-zinc-800 border border-white/10
          flex items-center justify-center
          transition-opacity duration-200
          hover:bg-zinc-700
          ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <ChevronRight size={14} className="rotate-180 text-white/70" />
      </button>

      {/* הפריטים */}
      <div
        ref={scrollRef}
        className="
          h-full flex gap-3 overflow-x-auto scroll-smooth
          px-1 justify-center
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
      >
        {children}
      </div>

      {/* החץ הימני */}
      <button
        onClick={() => scroll("right")}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 z-20
          w-7 h-7 rounded-full
          bg-zinc-800 border border-white/10
          flex items-center justify-center
          transition-opacity duration-200
          hover:bg-zinc-700
          ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <ChevronRight size={14} className="text-white/70" />
      </button>

      {/* Fade בצדדים — מעיד שיש עוד */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-8
        bg-gradient-to-r from-[var(--card-bg)] to-transparent
        pointer-events-none transition-opacity duration-300
        ${canScrollLeft ? "opacity-100" : "opacity-0"}
      `}/>
      <div className={`
        absolute right-0 top-0 bottom-0 w-8
        bg-gradient-to-l from-[var(--card-bg)] to-transparent
        pointer-events-none transition-opacity duration-300
        ${canScrollRight ? "opacity-100" : "opacity-0"}
      `}/>
    </div>
  );
}