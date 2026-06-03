import React, { useEffect } from "react";

export default function HowItWorksStep({
  step,
  inView,
  index,
  delayMs = 450,
  className = "",
}) {
  const imageSrc = step.imageSrc;

 

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
          width: clamp(140px, 18vw, ${desktopW}px) !important;
          height: auto !important;
          max-height: ${desktopH}px;
          object-fit: contain;
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
    <div className={`w-full min-w-0 ${className}`} style={animStyle}>
      <div className="flex flex-col items-center text-center w-full min-w-0">
        {/* ICON AREA — רספונסיבי עם רוחב הקולנה */}
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
            className={`icon-step-${index} object-contain flex-shrink-0 max-w-full ${step.iconPadding ?? ""}`}
          />
        </div>

        {/* TITLE AREA — רספונסיבי */}
        <div className="flex items-center justify-center w-full pt-2 pb-0 min-h-[clamp(48px,6vw,85px)]">
          <h3 className="text-white font-normal font-staatliches text-center tracking-normal capitalize w-full" style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: "1.2" }}>
            {step.title}
          </h3>
        </div>

        {/* TEXT AREA — רספונסיבי */}
        <div className="flex items-start justify-center w-full pt-0 mt-[-4px] min-h-[clamp(60px,8vw,120px)]">
          <div
            className="text-gray font-normal italic text-[clamp(13px, 1.4vw, 23px)] leading-[1.6] tracking-normal text-center w-full mx-auto uppercase"
            style={{ textWrap: "pretty" }}
          >
            {step.subtitle}
            <br />
            <span className="text-gray">{step.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
