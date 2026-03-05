import React, { useEffect, useRef } from "react";
import "./whatCanYouSell.css";
import Button from "../../../components/ui/Button";
import Turtle from "../../../components/ui/Turtle";

/* דוגמת נתונים — החלף בנתונים אמיתיים */
const itemsTop = [
  { id: 1, src: "/images/p1.jpg", alt: "Product 1" },
  { id: 2, src: "/images/p2.jpg", alt: "Product 2" },
  { id: 3, src: "/images/p3.jpg", alt: "Product 3" },
  { id: 4, src: "/images/p4.jpg", alt: "Product 4" },
];

const itemsBottom = [
  { id: 5, src: "/images/p5.jpg", alt: "Product 5" },
  { id: 6, src: "/images/p6.jpg", alt: "Product 6" },
  { id: 7, src: "/images/p7.jpg", alt: "Product 7" },
  { id: 8, src: "/images/p8.jpg", alt: "Product 8" },
];

/* קומפוננטת כרטיס פשוטה */
function Card({ item }) {
  return (
    <div data-card className="h-full max-h-full aspect-[397/276] bg-white rounded-[40px] lg:rounded-[50px] xl:rounded-[60px] border-2 border-gray-300 overflow-hidden flex-shrink-0 mr-6">      
     <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        className="w-full h-full object-cover block"
        style={{ display: "block" }}
      />
    </div>
  );
}

/* קומפוננטת קרוסלה אינסופית */
function InfiniteCarousel({ items, direction = "left", speed = 0.1 }) {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // חישוב רוחב רספונסיבי לפי גודל המסך
    const getCardWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) return 200 + 12; // sm
      if (screenWidth < 768) return 220 + 16; // md
      if (screenWidth < 1024) return 250 + 20; // lg
      if (screenWidth < 1280) return 280 + 24; // xl
      return 300 + 32; // 2xl+
    };

    const cardWidth = getCardWidth();
    const singleSetWidth = items.length * cardWidth;

    // התחלה מנקודה שונה לכיוון הפוך
    if (direction === "right" && scrollPositionRef.current === 0) {
      scrollPositionRef.current = singleSetWidth;
      container.scrollLeft = singleSetWidth;
    }

    const animate = () => {
      if (direction === "left") {
        scrollPositionRef.current += speed;
        if (scrollPositionRef.current >= singleSetWidth) {
          scrollPositionRef.current = 0;
        }
      } else {
        // right
        scrollPositionRef.current -= speed;
        if (scrollPositionRef.current <= 0) {
          scrollPositionRef.current = singleSetWidth;
        }
      }

      container.scrollLeft = scrollPositionRef.current;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [items, direction, speed]);

  // יצירת מערך כפול לגלילה אינסופית
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden overflow-x-auto scrollbar-hide"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitScrollbar: { display: "none" },
      }}
    >
      <div
        className="flex h-full items-center" style={{ width: `...px` }}>
        {duplicatedItems.map((item, index) => (
          <Card key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function WhatCanYouSell() {
  return (
    <section className="italic bg-gray relative overflow-x-hidden overflow-y-visible h-screen grid grid-rows-[1.2fr_2.8fr_1fr]">

      {/* צב ברקע - צד שמאל, 50% מחוץ, במרכז האנכי */}
      <Turtle
        left="0"
        top="50%"
        translateX="-50%"
        translateY="-50%"
        height="75%"
        opacity={0.2}
        zIndex={0}
        className="
          w-auto
          sm:h-[75%]
        "
      />
      {/* כותרת */}
      <div className="flex items-center px-4 sm:px-6 md:px-8 z-10">
        <h2 className="text-[clamp(28px,7vw,80px)] font-extrabold text-[#D9D9D9] leading-[0.8]">
          <span className="text-[clamp(2rem,8vw,7rem)]">
            W
          </span>
          HAT CAN YOU <span className="text-green">SELL?</span>
        </h2>
      </div>

      {/* קרוסלה מתמשכת */}
      <div className="flex flex-col h-full justify-between gap-4 overflow-x-hidden overflow-y-visible px-2 z-10">
        <div className="flex-1 flex items-center">
          {/* שורה עליונה — גלילה שמאלה */}
          <InfiniteCarousel items={itemsTop} direction="left" speed={0.7} />
        </div>
          {/* שורה תחתונה — גלילה ימינה */}
        <div className="flex-1 flex items-center">
          <InfiniteCarousel items={itemsBottom} direction="right" speed={0.7} />
        </div>
      </div>

      {/* כפתור */}
      <div className="flex justify-center items-center z-10">
        <Button
        hovering="garyBg"
          className="text-sm sm:text-base md:text-lg w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] px-4 sm:px-5 md:px-6 py-2 text-white relative overflow-hidden"
          style={{
            boxShadow:
              "inset 2px 0 5px rgba(149, 149, 149, 1), inset -2px 0 5px rgba(149, 149, 149, 1) inset 0 2px 5px rgba(149,149,149,1), inset 0 -2px 5px rgba(149,149,149,1) ",
          }}
        >
          VISIT STORE
        </Button>
      </div>
    </section>
  );
}