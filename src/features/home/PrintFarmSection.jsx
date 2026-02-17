import React from "react";
import PrintFarmImage from "../../Gallery/PrintFarm1.png";
import Button from "../../components/ui/Button";
import GlowCircle from "../../components/ui/GlowCircle";

export default function PrintFarmSection() {
  return (
    <>
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
      <div className="flex-1 self-stretch">
        <img
          src={PrintFarmImage}
          alt="printFarmPic"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-center text-center px-12 relative">
        {/* Centered Content */}
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
        
        {/* Bottom Message */}
        <div className="w-full flex justify-center mb-8">
          <p className="text-gray text-[clamp(10px,1.5vw,18px)] font-bold italic leading-snug break-words text-center max-w-[min(90vw,520px)]">
            <span className="text-[clamp(12px,1.8vw,22px)]">H</span>
            EADS UP - WE&apos;RE PICKY, AND PROUD OF IT! :)
          </p>
        </div>
      </div>
    </>
  );
}
