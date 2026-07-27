import React from "react";
import { Link } from "react-router-dom";
import PrintFarmImage from "../assets/images/PrintFarm3D-Fly2.png";
import Button from "../../../components/ui/Button";
import GlowCircle from "../../../components/ui/GlowCircle";
import GlobalIcon from "../../../components/icons/GlobalIcon.js";

const contentGap = "gap-[clamp(16px,4vw,24px)]";

function HeadsUpNote({ className = "" }) {
  return (
    <p className={`text-gray m-0 text-center font-bold italic leading-snug opacity-80 ${className}`}>
      <span className="text-[clamp(13px,3.5vw,17px)] 2xl:text-[clamp(12px,1.8vw,22px)]">H</span>
      EADS UP – WE&apos;RE PICKY, AND PROUD OF IT! :)
    </p>
  );
}

function NetworkMapLink({ iconSize, textClassName = "" }) {
  return (
    <Link
      to="/partner-map"
      className="mt-auto flex w-full items-center justify-center gap-3 pb-[clamp(12px,3vw,24px)] text-green transition-opacity hover:opacity-80"
    >
      <GlobalIcon size={iconSize} className="shrink-0" />
      <span className={`font-bold uppercase italic leading-snug ${textClassName}`}>
        View 3D-FLY&apos;s Worldwide Network
      </span>
    </Link>
  );
}

export default function PrintFarmSection() {
  return (
    <section
      className="relative h-[90svh] w-full overflow-hidden min-h-0 2xl:h-auto 2xl:min-h-[calc(100dvh-var(--nav-h))]"
    >

      {/* ========== MOBILE + TABLET (עד מסכים רחבים — כולל אייפדים בכל הכיוונים) ========== */}
      <div className="flex h-full min-h-0 flex-col 2xl:hidden">

        {/* תמונה (~55% מתוך 90svh; אחוזים מההורה כדי שלא יחרוג מ־h-[90svh]) */}
        <div className="h-[55%] min-h-0 w-full shrink-0 overflow-hidden">
          <img
            src={PrintFarmImage}
            alt="printFarmPic"
            className="h-full w-full scale-[1.4] object-cover object-left"
            style={{ transformOrigin: "65% 80%" }}
          />
        </div>

        {/* כרטיס תוכן (~50%) + חפיפה (svh — לא אחוז margin, שב־CSS יחסי לרוחב) */}
        <div
          className="relative z-10 flex h-[50%] min-h-0 shrink-0 flex-col items-center rounded-tr-[60px] bg-dark px-6 pt-8 pb-3"
          style={{ marginTop: "-2rem" }}
        >
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <div className={`flex w-fit flex-col items-center ${contentGap}`}>
            <h3 className="text-gray m-0 self-start text-left text-[clamp(38px,11vw,60px)] font-extrabold italic leading-tight">
              RUNNING A <br />
              <span className="text-green">PRINT FARM?</span>
            </h3>

            <Button
              hovering="darkBg"
              className="px-[clamp(22px,6vw,34px)] py-[clamp(10px,2.5vw,14px)] text-[clamp(15px,4.5vw,22px)] font-extrabold italic"
            >
              Join As a Parter!
            </Button>

            <HeadsUpNote className="text-[clamp(11px,3vw,15px)]" />
            </div>
          </div>

          <NetworkMapLink
            iconSize={34}
            textClassName="text-[clamp(13px,3.2vw,18px)]"
          />
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
            className="h-full w-full scale-[1.15] object-cover object-left"
            style={{ transformOrigin: "70% center" }}
          />
        </div>

        {/* תוכן */}
        <div className="relative flex flex-1 flex-col items-center px-12">
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <div className={`flex w-fit flex-col items-center ${contentGap}`}>
              <h3 className="text-gray m-0 self-start text-left text-[clamp(20px,4vw,96px)] leading-tight">
                RUNNING A <br />
                <span className="text-green">PRINT FARM?</span>
              </h3>

              <Button
                hovering="darkBg"
                className="px-[clamp(16px,3vw,32px)] py-[clamp(8px,1.5vw,16px)] text-[clamp(14px,2vw,32px)] font-extrabold italic"
              >
                Join As a Partner!
              </Button>

              <HeadsUpNote className="max-w-[min(90vw,520px)] text-[clamp(10px,1.5vw,18px)]" />
            </div>
          </div>

          <NetworkMapLink
            iconSize={40}
            textClassName="text-[clamp(14px,1.7vw,22px)]"
          />
        </div>
      </div>

    </section>
  );
}
