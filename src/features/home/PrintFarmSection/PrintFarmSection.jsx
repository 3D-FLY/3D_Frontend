import React from "react";
import PrintFarmImage from "../assets/images/PrintFarm3D-Fly2.png";
import Button from "../../../components/ui/Button";
import GlowCircle from "../../../components/ui/GlowCircle";

export default function PrintFarmSection() {
  return (
    <section
      className="relative w-full overflow-hidden min-h-0 2xl:h-auto 2xl:min-h-[calc(100dvh-var(--nav-h))]"
      style={{ height: "90svh" }}
    >

      {/* ========== MOBILE + TABLET (עד מסכים רחבים — כולל אייפדים בכל הכיוונים) ========== */}
      <div className="flex h-full min-h-0 flex-col 2xl:hidden">

        {/* תמונה (~55% מתוך 90svh; אחוזים מההורה כדי שלא יחרוג מ־h-[90svh]) */}
        <div className="h-[55%] min-h-0 w-full shrink-0 overflow-hidden">
          <img
            src={PrintFarmImage}
            alt="printFarmPic"
            className="w-full h-full object-cover object-left scale-[1.4]"
            style={{ transformOrigin: "65% 80%" }}
          />
        </div>

        {/* כרטיס תוכן (~50%) + חפיפה (svh — לא אחוז margin, שב־CSS יחסי לרוחב) */}
        <div
          className="relative z-10 flex h-[50%] min-h-0 shrink-0 flex-col items-center justify-between rounded-tr-[60px] bg-dark px-6 pt-8 pb-3"
          style={{ marginTop: "-5svh" }}
        >
          {/* כותרת */}
          <h3 className="text-gray italic font-extrabold leading-tight text-left m-0 text-[clamp(38px,11vw,60px)]">
            RUNNING A <br />
            <span className="text-green">PRINT FARM?</span>
          </h3>

          {/* כפתור */}
          <div className="mt-auto">
          <Button
            hovering="darkBg"
            className="italic font-extrabold self-start text-[clamp(15px,4.5vw,22px)] py-[clamp(10px,2.5vw,14px)] px-[clamp(22px,6vw,34px)]"
          >
            Join As a Parter!
          </Button>
          </div>

          {/* הערה */}
          <div className="mt-auto">
          <p className="text-gray italic font-bold opacity-80 leading-snug text-left m-0 text-[clamp(11px,3vw,15px)]">
            <span className="text-[clamp(13px,3.5vw,17px)]">H</span>
            EADS UP – WE&apos;RE PICKY, AND PROUD OF IT! :)
          </p>
          </div>
        </div>
      </div>

      {/* ========== DESKTOP (מסכים רחבים בלבד) ========== */}
      <div className="hidden h-[calc(100dvh-var(--nav-h))] 2xl:flex">
        <GlowCircle
          size={450}
          blur={600}
          opacity={0.8}
          color="149, 149, 149"
          top="0"
          right="0"
          translateX="20%"
          translateY="20%"
          zIndex={0}
        />

        {/* תמונה */}
        <div className="flex-1 self-stretch overflow-hidden">
          <img
            src={PrintFarmImage}
            alt="printFarmPic"
            className="w-full h-full object-cover object-left scale-[1.15]"
            // ↑ שני את הסקייל לפי מה שאת רוצה
            style={{ transformOrigin: "70% center" }}
            // ↑ שולט מאיזה נקודה היא מתרחבת
          />
        </div>

        {/* תוכן */}
        <div className="flex-1 flex flex-col items-center text-center px-12 relative">
          <div className="flex flex-col items-center justify-center flex-1">
            <h3 className="text-gray text-[clamp(20px,4vw,96px)] mb-[clamp(16px,3vw,32px)] text-left leading-tight">
              RUNNING A <br />
              <span className="text-green">PRINT FARM?</span>
            </h3>
            <Button
              hovering="darkBg"
              className="text-[clamp(14px,2vw,32px)] font-extrabold px-[clamp(16px,3vw,32px)] py-[clamp(8px,1.5vw,16px)] italic"
            >
              Join As a Partner!
            </Button>
          </div>

          <div className="w-full flex justify-center mb-8">
            <p className="text-gray text-[clamp(10px,1.5vw,18px)] font-bold italic leading-snug break-words text-center max-w-[min(90vw,520px)]">
              <span className="text-[clamp(12px,1.8vw,22px)]">H</span>
              EADS UP - WE&apos;RE PICKY, AND PROUD OF IT! :)
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}