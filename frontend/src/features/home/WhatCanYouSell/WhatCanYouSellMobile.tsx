import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Group26 from "./assets/images/Group26.png";
import Group28 from "./assets/images/Group28.png";
import Group36 from "./assets/images/image36.png";

type SellItem = {
  id: number;
  src: string;
  name: string;
  models: string;
  price: number;
};

const pages: SellItem[][] = [
  [
    { id: 1, src: Group26, name: "FIDGET TOYS", models: "7 MODELS", price: 10 },
    { id: 2, src: Group26, name: "EARCUPS STAND", models: "3 SIZES", price: 16 },
    { id: 3, src: Group26, name: "DESK ORGANIZER", models: "6 MODELS", price: 8 },
    { id: 4, src: Group26, name: "LITHOPHANE LAMP", models: "16 MODELS", price: 12 },
    { id: 5, src: Group26, name: "LIGHTING FIXTURE", models: "LAMP INCLUDED", price: 14 },
    { id: 6, src: Group26, name: "CONTROLLER STAND", models: "2 MODELS", price: 7 },
    { id: 7, src: Group26, name: "PLANTER", models: "4 MODELS", price: 6 },
    { id: 8, src: Group26, name: "DESK LAMPS", models: "3 MODELS", price: 9 },
  ],
  [
    { id: 9,  src: Group28, name: "PRODUCT 9",  models: "5 MODELS", price: 11 },
    { id: 10, src: Group28, name: "PRODUCT 10", models: "2 SIZES",  price: 20 },
    { id: 11, src: Group28, name: "PRODUCT 11", models: "8 MODELS", price: 5  },
    { id: 12, src: Group28, name: "PRODUCT 12", models: "1 MODEL",  price: 18 },
    { id: 13, src: Group28, name: "PRODUCT 13", models: "3 MODELS", price: 13 },
    { id: 14, src: Group28, name: "PRODUCT 14", models: "6 MODELS", price: 9  },
    { id: 15, src: Group28, name: "PRODUCT 15", models: "4 MODELS", price: 7  },
    { id: 16, src: Group28, name: "PRODUCT 16", models: "2 MODELS", price: 15 },
  ],
  [
    { id: 17, src: Group36, name: "PRODUCT 17", models: "7 MODELS", price: 22 },
    { id: 18, src: Group36, name: "PRODUCT 18", models: "3 SIZES",  price: 8  },
    { id: 19, src: Group36, name: "PRODUCT 19", models: "5 MODELS", price: 17 },
    { id: 20, src: Group36, name: "PRODUCT 20", models: "9 MODELS", price: 11 },
    { id: 21, src: Group36, name: "PRODUCT 21", models: "2 MODELS", price: 6  },
    { id: 22, src: Group36, name: "PRODUCT 22", models: "4 SIZES",  price: 19 },
    { id: 23, src: Group36, name: "PRODUCT 23", models: "1 MODEL",  price: 25 },
    { id: 24, src: Group36, name: "PRODUCT 24", models: "6 MODELS", price: 14 },
  ],
];

function ProductCard({ item, className }: { item: SellItem; className?: string }) {
  return (
    <div className={`w-full h-full rounded-t-2xl overflow-hidden bg-black flex flex-col ${className ?? ""}`.trim()}>

      {/* תמונה — תופסת את כל מה שנשאר */}
      <div className="flex-1 min-h-0 w-full relative overflow-hidden rounded-t-2xl">
        <img
          src={item.src}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* טקסט — גובה לפי תוכן בלבד */}
      <div className="flex-shrink-0 w-full p-2 flex flex-row items-center justify-between gap-1">
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <p className="text-green font-extrabold italic uppercase leading-[1.1] text-[clamp(8px,2.5vw,11px)] line-clamp-2 break-words">
            {item.name}
          </p>
          <p className="text-gray/90 italic font-medium uppercase leading-[1.1] text-[clamp(7px,2.2vw,9px)] line-clamp-1 break-words">
            {item.models}
          </p>
        </div>

        <div className="flex items-center justify-end flex-shrink-0 ml-1">
          <p className="text-green font-extrabold italic leading-none text-[clamp(11px,3.5vw,18px)] whitespace-nowrap">
            {item.price}$
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WhatCanYouSellMobile() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const directionLocked = useRef<"horizontal" | "vertical" | null>(null);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const onTouchMove = (e: TouchEvent) => {
      if (directionLocked.current === "horizontal") {
        // רק אם נעילה אופקית — מונע גלילה רגילה
        e.preventDefault();
      }
      // אם אנכי או לא נעול — לא מתערב, הדפדפן גולל בעצמו
    };

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
    touchStartY.current = e.touches[0]?.clientY ?? 0;
    touchStartTime.current = Date.now();
    directionLocked.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (directionLocked.current) return;

    const dx = Math.abs((e.touches[0]?.clientX ?? 0) - touchStartX.current);
    const dy = Math.abs((e.touches[0]?.clientY ?? 0) - touchStartY.current);

    // נועל כיוון אחרי 5px תנועה
    if (dx > 5 || dy > 5) {
      directionLocked.current = dx > dy ? "horizontal" : "vertical";
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const el = sliderRef.current;
    if (!el || directionLocked.current !== "horizontal") return;

    const delta = touchStartX.current - (e.changedTouches[0]?.clientX ?? touchStartX.current);
    const elapsed = Date.now() - touchStartTime.current;
    const velocity = Math.abs(delta) / elapsed; // px/ms

    // מהירה (>0.3px/ms) → מספיק 10px; איטית → צריך 40px
    const threshold = velocity > 0.3 ? 10 : 40;

    let target = currentPage;
    if (delta > threshold && currentPage < pages.length - 1) target = currentPage + 1;
    else if (delta < -threshold && currentPage > 0) target = currentPage - 1;

    if (target !== currentPage) {
      setCurrentPage(target);
      el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
    }
  };

  const indicatorLeft = `${(currentPage / (pages.length - 1)) * 66.666}%`;

  return (
    <section
      className="relative bg-gray italic overflow-hidden"
      // svh = small viewport height — קבוע גם כשסרגל הדפדפן עולה/יורד
      style={{ fontFamily: "Montserrat, sans-serif", height: "110svh" }}
    >
      <div className="flex flex-col h-full">

        {/* ── אזור האפור ── */}
        <div className="relative w-full mt-[6%] flex-1 min-h-0">
          <div className="absolute inset-0 -translate-x-[12%] bg-dark/70 rounded-r-[49px]" />

          <div className="relative z-10 px-4 pt-8 pb-6 flex flex-col gap-4 h-full">

            {/* כותרת — גדולה יותר */}
            <div className="w-full overflow-hidden flex-shrink-0">
              <h2 className="font-extrabold text-gray/90 leading-[1.2]
                            tracking-wide whitespace-nowrap
                            text-[clamp(18px,6.5vw,42px)]">
                <span className="text-[clamp(20px,7vw,46px)]">W</span>
                HAT CAN YOU{" "}
                <span className="text-green">SELL?</span>
              </h2>
            </div>

            {/* קרוסלה — תופסת את שאר המקום */}
            <div
              ref={sliderRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex gap-4 overflow-x-hidden snap-x snap-mandatory flex-1 min-h-0
                         [scrollbar-width:none] [-ms-overflow-style:none]"
            >
              {pages.map((pageItems, pageIndex) => (
                <div key={pageIndex} className="min-w-full shrink-0 snap-start h-full">
                  <div className="grid grid-cols-2 gap-3 h-full">
                    {pageItems.map((item) => (
                      <div key={item.id} className="min-h-0">
                        <ProductCard item={item} className="h-full w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* אינדיקטור */}
            <div className="flex justify-center flex-shrink-0">
              <div className="relative w-[45%] h-[8px] bg-dark rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full bg-[#5AC422]/50 rounded-full
                             transition-all duration-300 ease-out"
                  style={{
                    width: `${100 / pages.length}%`,
                    left: indicatorLeft,
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── כפתור ── */}
        <div className="flex justify-center py-4 flex-shrink-0">
          <Button
            type="button"
            variant="tertiary"
            hovering="darkBg"
            className="min-h-[44px] px-10 py-2.5 font-medium italic uppercase
                       text-[clamp(14px,4vw,18px)]"
          >
            SEE MORE
          </Button>
        </div>

      </div>
    </section>
  );
}