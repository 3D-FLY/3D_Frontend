import React, { useEffect, useRef } from "react";
import Button from "./Button";

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
    <div className="w-[200px] sm:w-[220px] md:w-[250px] lg:w-[280px] xl:w-[300px] h-[120px] sm:h-[130px] md:h-[150px] lg:h-[170px] xl:h-[200px] bg-white rounded-[30px] sm:rounded-[35px] md:rounded-[40px] lg:rounded-[50px] xl:rounded-[60px] border-2 border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 mr-3 sm:mr-4 md:mr-5 lg:mr-6 xl:mr-8">
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        className="w-full h-full object-cover rounded-[30px] sm:rounded-[35px] md:rounded-[40px] lg:rounded-[50px] xl:rounded-[60px] block"
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
      className="w-full overflow-hidden overflow-x-auto scrollbar-hide"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitScrollbar: { display: "none" },
      }}
    >
      <div
        className="flex"
        style={{
          width: `${
            duplicatedItems.length *
            (() => {
              const screenWidth = window.innerWidth;
              if (screenWidth < 640) return 212; // 200 + 12
              if (screenWidth < 768) return 236; // 220 + 16
              if (screenWidth < 1024) return 270; // 250 + 20
              if (screenWidth < 1280) return 304; // 280 + 24
              return 332; // 300 + 32
            })()
          }px`,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <Card key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function WhatCanYouSell() {
  return (
    <section className="section-6 italic py-10 bg-gray relative overflow-hidden h-screen flex flex-col">
      {/* כותרת */}
      <div className="text-left z-10 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 flex-shrink-0">
        <h2 className="text-[40px] sm:text-[50px] md:text-[60px] lg:text-[70px] xl:text-[80px] font-extrabold text-white leading-[0.8]">
          <span className="text-[50px] sm:text-[60px] md:text-[70px] lg:text-[80px] xl:text-[100px] align-top">
            W
          </span>
          HAT CAN YOU <span className="text-green">SELL?</span>
        </h2>
      </div>

      {/* קרוסלה מתמשכת */}
      <div className="relative flex-1 overflow-hidden px-2 sm:px-4 md:px-6 lg:px-8 z-0 flex flex-col justify-center space-y-2 sm:space-y-3 md:space-y-4">
        {/* שורה עליונה — גלילה שמאלה */}
        <InfiniteCarousel items={itemsTop} direction="left" speed={0.7} />

        {/* שורה תחתונה — גלילה ימינה */}
        <InfiniteCarousel items={itemsBottom} direction="right" speed={0.7} />
      </div>

      {/* כפתור */}
      <div className="flex justify-center items-center py-3 sm:py-4 md:py-5 lg:py-6 z-10 flex-shrink-0">
        <Button
        hovering="garyBg"
          className="text-sm sm:text-base md:text-lg w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] px-4 sm:px-5 md:px-6 py-2 text-white relative overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at center, #7bd445 0%, #5ac422 70%, #4a9c1b 100%)",
          }}
        >
          VISIT STORE
        </Button>
      </div>
    </section>
  );
}
