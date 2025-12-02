import React from "react";
import ConnectCopy1 from "../icons/ConnectCopy1";
import Upload from "../icons/Upload";
import Sell1 from "../icons/Sell1";
import Fullfill1 from "../icons/Fullfill1";
import Button from "./Button";
import Arrow from "../icons/Arrow";
import Upload21 from "../icons/Upload";

export default function HowDoesItWork() {
  const steps = [
    {
      icon: ConnectCopy1,
      title: "CONNECT",
      subtitle: "LINK YOUR STORE TO ",
      description: "3D-FLY FOR FREE",
      iconSpacing: "mb-4",
      iconSize: "w-55 h-35",
      titleSize: "text-3xl",
      titleColor: "text-white",
      subtitleSize: "text-xs",
      subtitleColor: "text-gray",
      spacing: "",
    },
    {
      // אפשר להכניס כאן תמונה במקום האייקון, לדוגמה:
      // icon: () => <img src="/path/to/your/image.png" alt="Upload" className="w-55 h-35" />,
      icon: Upload,
      title: "UPLOAD",
      subtitle: "UPLOAD YOUR 3D FILES AND",
      description: "SYNC THEM TO YOUR STORE",
      iconSpacing: "mb-3",
      iconSize: "w-55 h-35",
      titleSize: "text-3xl",
      titleColor: "text-white",
      subtitleSize: "text-[11.5px]",
      subtitleColor: "text-gray",
      spacing: "",
    },
    {
      icon: Sell1,
      title: "SELL",
      subtitle: "ORDERS FROM YOUR STORE",
      description: "WILL AUTOMATICALLY SHOW UP IN 3D-FLY",
      iconSpacing: "mr-6",
      iconSize: "w-55 h-35",
      titleSize: "text-3xl",
      titleColor: "text-white",
      subtitleSize: "text-[11.5px]",
      subtitleColor: "text-gray",
      spacing: "",
    },
    {
      icon: Fullfill1,
      title: "FORGET",
      subtitle: "LET 3D-FLY HANDLE ",
      description: " PRODUCTION AND SHIPMENT",
      iconSpacing: "mb-14",
      iconSize: "w-70 h-50", // גדול יותר
      titleSize: "text-3xl", // כותרת גדולה יותר
      titleColor: "text-white", // צבע שונה
      subtitleSize: "text-[11px]", // טקסט גדול יותר
      subtitleColor: "text-gray", // צבע שונה
      spacing: "", // ריווח גדול יותר
    },
  ];

  return (
    <section
      className="py-16 bg-dark"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <h2
        className="text-[60px] font-extrabold italic  text-gray text-center mb-25"
        style={{ fontFamily: "Montserrat, italic" }}
      >
        <span className="text-7xl">H</span>OW DOES IT{" "}
        <span className="text-green"> WORK?</span>
      </h2>
      <div
        className="max-w-6xl mx-auto px-4 "
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <div className="flex items-center justify-center ">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Step Content */}
              <div
                className="text-center flex flex-col"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {/* Icon */}
                <div className="flex justify-center items-center h-24 mb-4">
                  <step.icon
                    className={`text-green ${step.iconSize} ${step.iconSpacing}`}
                  />
                </div>

                {/* Title */}
                <div className="h-16 flex items-center justify-center ">
                  <h3
                    className={`${step.titleColor} ${step.titleSize} ${step.spacing} font-bold font-staatliches`}
                    style={{ fontFamily: "Staatliches, sans-serif" }}
                  >
                    {step.title}
                  </h3>
                </div>

                {/* Subtitle and Description */}
                <div className="h-20 flex items-start justify-center">
                  <p
                    className={`${step.subtitleColor} ${step.subtitleSize} uppercase italic tracking-wide leading-tight max-w-[180px]`}
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {step.subtitle}
                    <br />
                    <span className={step.subtitleColor}>
                      {step.description}
                    </span>
                  </p>
                </div>
              </div>

              {/* Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="mx-10 mt-10 flex items-center">
                  <Arrow />
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          className="flex justify-center mt-22"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          <Button hovering="darkBg" className="  italic">
            TRY NOW!
          </Button>
        </div>
      </div>
    </section>
  );
}
