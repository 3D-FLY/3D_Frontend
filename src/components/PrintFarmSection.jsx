import React from "react";
import PrintFarmImage from "../Gallery/PrintFarm1.png";
import Button from "./Button";

export default function PrintFarmSection() {
  return (
    <>
      <div className="flex-1 h-full">
        <img
          src={PrintFarmImage}
          alt="printFarmPic"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center text-center px-12">
        <h3 className="text-gray text-7xl italic font-extrabold mb-8 text-left leading-tight">
          RUNNING A <br />
          <span className="text-green">PRINT FARM?</span>
        </h3>
        <Button
          hovering="darkBg"
          className="text-xl px-8 italic py-4 "
          style={{
            background:
              "radial-gradient(circle at center, #7bd445 0%, #5ac422 70%, #4a9c1b 100%)",
          }}
        >
          Join As a Partner!
        </Button>
      </div>

      {/* Bottom Message */}
      <div className="absolute bottom-12 right-55">
        <p className="text-gray text-sm font-bold italic">
          <span className="text-xl">H</span>EADS UP - WE'RE PICKY, AND PROUD OF
          IT! :)
        </p>
      </div>
    </>
  );
}
