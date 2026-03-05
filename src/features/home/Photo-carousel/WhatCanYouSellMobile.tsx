import React, { useRef, useState } from "react";
import Button from "../../../components/ui/Button.jsx";
// כשתשימי את התמונות ב־src/assets/images/section-6/ (Group26.png, Group28.png, Group36.png) — החזירי את הייבואים והשתמשי בהן ב־pages

type SellItem = {
  id: number;
  src: string;
  name: string;
  models: string;
  price: number;
};


const pages: SellItem[][] = [
  [
    { id: 1, src: "src/assets/images/section-6/Group26.png", name: "FIDGET TOYS", models: "7 MODELS", price: 10 },
    { id: 2, src: "src/assets/images/section-6/Group26.png", name: "EARCUPS STAND", models: "3 SIZES", price: 16 },
    { id: 3, src: "src/assets/images/section-6/Group26.png", name: "DESK ORGANIZER", models: "6 MODELS", price: 8 },
    { id: 4, src: "src/assets/images/section-6/Group26.png", name: "LITHOPHANE LAMP", models: "16 MODELS", price: 12 },
    { id: 5, src: "src/assets/images/section-6/Group26.png", name: "LIGHTING FIXTURE", models: "LAMP INCLUDED", price: 14 },
    { id: 6, src: "src/assets/images/section-6/Group26.png", name: "CONTROLLER STAND", models: "2 MODELS", price: 7 },
    { id: 7, src: "src/assets/images/section-6/Group26.png", name: "PLANTER", models: "4 MODELS", price: 6 },
    { id: 8, src: "src/assets/images/section-6/Group26.png", name: "DESK LAMPS", models: "3 MODELS", price: 9 },
  ],
  [
    { id: 9, src: "src/assets/images/section-6/Group28.png", name: "PRODUCT 9", models: "5 MODELS", price: 11 },
    { id: 10, src: "src/assets/images/section-6/Group28.png", name: "PRODUCT 10", models: "2 SIZES", price: 20 },
    { id: 11, src: "src/assets/images/section-6/Group28.png", name: "PRODUCT 11", models: "8 MODELS", price: 5 },
    { id: 12, src: "src/assets/images/section-6/Group28.png", name: "PRODUCT 12", models: "1 MODEL", price: 18 },
    { id: 13, src: "src/assets/images/section-6/Group28.png", name: "PRODUCT 13", models: "3 MODELS", price: 13 },
    { id: 14, src: "src/assets/images/section-6/Group28.png", name: "PRODUCT 14", models: "6 MODELS", price: 9 },
    { id: 15, src: "src/assets/images/section-6/Group28.png", name: "PRODUCT 15", models: "4 MODELS", price: 7 },
    { id: 16, src: "src/assets/images/section-6/Group28.png", name: "PRODUCT 16", models: "2 MODELS", price: 15 },
  ],
  [
    { id: 17, src: "src/assets/images/section-6/Group36.png", name: "PRODUCT 17", models: "7 MODELS", price: 22 },
    { id: 18, src: "src/assets/images/section-6/Group36.png", name: "PRODUCT 18", models: "3 SIZES", price: 8 },
    { id: 19, src: "src/assets/images/section-6/Group36.png", name: "PRODUCT 19", models: "5 MODELS", price: 17 },
    { id: 20, src: "src/assets/images/section-6/Group36.png", name: "PRODUCT 20", models: "9 MODELS", price: 11 },
    { id: 21, src: "src/assets/images/section-6/Group36.png", name: "PRODUCT 21", models: "2 MODELS", price: 6 },
    { id: 22, src: "src/assets/images/section-6/Group36.png", name: "PRODUCT 22", models: "4 SIZES", price: 19 },
    { id: 23, src: "src/assets/images/section-6/Group36.png", name: "PRODUCT 23", models: "1 MODEL", price: 25 },
    { id: 24, src: "src/assets/images/section-6/Group36.png", name: "PRODUCT 24", models: "6 MODELS", price: 14 },
  ],
];

function ProductCard({ item, className }: { item: SellItem; className?: string }) {
  return (
    <div className={`aspect-square w-full rounded-t-2xl overflow-hidden bg-black flex flex-col ${className ?? ""}`.trim()}>
      
      {/* 3/5 תמונה – בלי מסגרת */}
      <div className="basis-[70%] w-full relative overflow-hidden rounded-t-2xl border-0 outline-none">
        <img
          src={item.src}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover border-0 outline-none ring-0"
        />
      </div>

      {/* 2/5 תוכן - שימוש ב-basis להבטחת אחוזים מדויקים */}
      <div className="basis-[30%] w-full px-2 py-1.5 flex flex-row items-center justify-between gap-1 overflow-hidden">
        
        {/* צד שמאל: שם + מודל */}
        <div className="min-w-0 flex-1 flex flex-col justify-center h-full">
          <p className="text-green font-extrabold italic uppercase leading-[1.1] text-[clamp(8px,2.5vw,11px)] line-clamp-2 break-words">
            {item.name}
          </p>
          <p className="text-gray/90 italic font-medium uppercase leading-[1.1] text-[clamp(7px,2.2vw,9px)] line-clamp-1 break-words">
            {item.models}
          </p>
        </div>

        {/* צד ימין: מחיר */}
        <div className="flex items-center justify-end flex-shrink-0 h-full ml-1">
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

  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el) return;
    const page = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentPage(Math.max(0, Math.min(pages.length - 1, page)));
  };

  // פס ירוק = שליש, תזוזה 0 / 33.333 / 66.666
  const indicatorLeft = `${(currentPage / (pages.length - 1)) * 66.666}%`;

  return (
    <section
      className="relative h-[100dvh] bg-gray italic overflow-hidden"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* מלבן כהה יוצא שמאלה — רק צד ימין מעוגל */}
      {/* המיקום האנכי: items-center = מרכז; items-start + pt = מהתחלה עם ריווח מלמעלה */}
      <div className="absolute inset-0 flex items-start justify-center pointer-events-none pt-[6%]">
        <div className="h-[92%] w-full -ml-[19%] bg-dark/70 rounded-r-[49px]" />
      </div>

      {/* תוכן */}
      <div className="relative z-10 h-full flex flex-col">
        {/* אזור עליון: כותרת + קרוסלה + אינדיקטור (~92% גובה) */}
        <div className="h-[90%] flex flex-col px-4 pt-[6%]">
          {/* כותרת — שורה אחת, גודל = רוחב הקונטינר (9cqi ≈ fills width), min/max לפורפורציה */}
          <div className="flex-none w-[85%] @container min-w-0 pt-6 px-3">
            <h2 className="font-extrabold text-gray/90 leading-[0.85] whitespace-nowrap text-[clamp(18px,9cqi,48px)]">
              <span className="text-[clamp(20px,10cqi,56px)]">W</span>
              HAT CAN YOU <span className="text-green">SELL?</span>
            </h2>
          </div>

          <div className="h-4" />

          {/* קרוסלה (רק X). אין גלילה פנימית ברגיל; רק במצב מסך רחב/נמוך (landscape) נאפשר Y */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div
              ref={sliderRef}
              onScroll={handleScroll}
              className="
                flex flex-1 min-h-0 gap-4
                overflow-x-auto
                snap-x snap-mandatory scroll-smooth
                [scrollbar-width:none] [-ms-overflow-style:none]
              "
            >
              {pages.map((pageItems, pageIndex) => (
                <div key={pageIndex} className="min-w-full shrink-0 snap-start h-full">
                  {/* הגריד המעודכן */}
                  <div
                    className="
                      grid grid-cols-2 gap-4
                      grid-rows-[repeat(4,minmax(0,1fr))] 
                      h-full w-full
                      place-items-stretch
                    "
                  >
                    {pageItems.map((item) => (
                      <div key={item.id} className="aspect-square w-full h-full max-h-full max-w-full">
                        <ProductCard item={item} className="h-full w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

            {/* אינדיקטור */}
            <div className="pt-4 flex justify-center">
              <div className="relative w-[45%] h-[8px] bg-dark rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full bg-[#5AC422]/50 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${100 / pages.length}%`,
                    left: indicatorLeft,
                  }}
                />
              </div>
            </div>
          </div>

        {/* כפתור תחתון (~8% האחרונים למטה) */}
        <div className="h-[12%] flex items-center justify-center pt-[4%]">
          <Button
            variant="tertiary"
            hovering="darkBg"
            className="font-medium italic uppercase px-10 h-[70%] text-[clamp(14px,4vw,18px)]"
          >
            SEE MORE
          </Button>
        </div>
      </div>
    </section>
  );
}