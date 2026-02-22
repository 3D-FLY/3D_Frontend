import React, { useEffect } from "react";

// type Step = {
//   icon: React.ComponentType<any>;
//   title: string;
//   subtitle: string;
//   description: string;

//   
//   iconWidth?: number;
//   iconHeight?: number;
//   iconMobileWidth?: number;
//   iconMobileHeight?: number;
//   iconPadding?: string;

//   // אופציונלי 
//   iconToTitleGap?: number;
//   iconOffsetTop?: number;
// };

// type Props = {
//   step: Step;
//   inView: boolean;
//   index: number;
//   delayMs?: number;
//   className?: string; // למשל: "w-[270px]" במובייל
// };

export default function HowItWorksStep({
  step,
  inView,
  index,
  delayMs = 450,
  className = "",
}) {
  const imageSrc = step.imageSrc;

  /**
   * 1) גדלים יחסיים לפי הנתונים שלך:
   * - בדסקטופ: iconWidth/iconHeight
   * - במובייל: iconMobileWidth/iconMobileHeight
   *
   * אנחנו לא רוצים px קבועים, אבל כן לשמור על "הכוונה" שלך.
   * לכן אנחנו עושים clamp(minMobilePx, preferredVW, maxDesktopPx)
   * כך שבמסכים קטנים זה יתקרב למובייל, ובגדולים יתקרב לדסקטופ.
   */

  // ברירות מחדל מהקוד שלך:
  const DEFAULT_DESKTOP_W = 220;
  const DEFAULT_DESKTOP_H = 96;
  const DEFAULT_MOBILE_W = 180;
  const DEFAULT_MOBILE_H = 80;

  const desktopW = step.iconWidth ?? DEFAULT_DESKTOP_W;
  const desktopH = step.iconHeight ?? DEFAULT_DESKTOP_H;
  // במובייל - אם יש iconMobileWidth/Height נשתמש בהם, אחרת נשתמש ב-iconWidth/Height
  const mobileW = step.iconMobileWidth ?? step.iconWidth ?? DEFAULT_MOBILE_W;
  const mobileH = step.iconMobileHeight ?? step.iconHeight ?? DEFAULT_MOBILE_H;
  
  // וודא שהגדלים במובייל לא קטנים מדי
  const finalMobileW = Math.max(mobileW, 150); // מינימום 150px במובייל
  const finalMobileH = Math.max(mobileH, 100); // מינימום 100px במובייל
  
  // הגדלים הסופיים - מספרים פשוטים (px) - לא מחרוזות clamp
  // בדסקטופ נשתמש ב-desktopW/desktopH, במובייל ב-finalMobileW/finalMobileH
  const iconWidth = desktopW; // בדסקטופ
  const iconHeight = desktopH; // בדסקטופ

  /**
   * 2) גבהים “קבועים” אבל יחסיים (במקום px קבוע)
   * לפי מה שהיה אצלך:
   * - ICON_AREA_HEIGHT_DESKTOP ~235
   * - ICON_AREA_HEIGHT_MOBILE ~240
   * - TEXT_BOX_H desktop 200
   * - MOBILE_TEXT_H 110
   *
   * אז:
   * Icon area: בערך 235–240 => clamp שיחזיק יציב
   * Text area: 110–200 => clamp שמגדיל כשיש מקום
   */
  const ICON_AREA_H = `clamp(235px, 24vw, 240px)`;

  /**
   * 4) אנימציה (כמו שהיה לך):
   * - opacity + translateY
   * - delay לפי index
   */
  const animStyle = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: "opacity 900ms ease, transform 900ms ease",
    transitionDelay: inView ? `${index * delayMs}ms` : "0ms",
  };

  // רווחים שהיו אצלך
  const gap = step.iconToTitleGap ?? 0;
  const offsetTop = step.iconOffsetTop ?? 0;

  // הוסף CSS דינמי עבור גדלים יחסיים במובייל
  useEffect(() => {
    const styleId = `icon-step-${index}-style`;
    // הסר style קיים אם יש
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }

    // במובייל - גדלים יחסיים (vw), בדסקטופ - px קבועים
    // נשתמש ב-clamp כדי להבטיח מינימום ומקסימום
    const mobileW_vw = (finalMobileW / 375) * 100; // 375px הוא רוחב טיפוסי של מובייל
    const mobileH_vw = (finalMobileH / 375) * 100;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .icon-step-${index} {
        display: block;
        width: clamp(${finalMobileW}px, ${mobileW_vw}vw, ${desktopW}px);
        height: clamp(${finalMobileH}px, ${mobileH_vw}vw, ${desktopH}px);
        flex-shrink: 0;
      }
      @media (min-width: 1024px) {
        .icon-step-${index} {
          width: ${desktopW}px !important;
          height: ${desktopH}px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, [index, desktopW, desktopH, finalMobileW, finalMobileH]);

  return (
    <div className={`w-[270px] shrink-0 ${className}`} style={animStyle}>
      <div className="flex flex-col items-center text-center w-full">
        {/* ICON AREA */}
        <div
          className="flex items-end justify-center w-full"
          style={{
            height: ICON_AREA_H,
            marginBottom: gap,
            transform: offsetTop ? `translateY(${offsetTop}px)` : undefined,
          }}
        >
          <img
            src={imageSrc}
            alt=""
            className={`icon-step-${index} object-contain flex-shrink-0 ${step.iconPadding ?? ""}`}
          />
        </div>

        {/* TITLE AREA — Staatliches 400, 64px, line-height 85px, center, title case */}
        <div className="flex items-center justify-center w-full pt-2 pb-2 h-[clamp(64px,8vw,85px)]">
          <h3 className="text-white font-normal font-staatliches text-center text-[64px] leading-[85px] tracking-normal capitalize">
            {step.title}
          </h3>
        </div>

        {/* TEXT AREA — Montserrat 400 italic, 20px, line-height 100%, center, max-width 270px */}
        <div className="flex items-start justify-center w-full pt-0 min-h-[clamp(80px,10vw,120px)]">
          <div className="text-gray font-normal italic text-[20px] leading-[120%] tracking-normal text-center w-full max-w-[270px] mx-auto">
            {step.subtitle}
            <br />
            <span className="text-gray">{step.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
