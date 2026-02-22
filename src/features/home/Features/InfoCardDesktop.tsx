// src/sections/home/features/InfoCardDesktop.tsx
import React from "react";

type Props = {
  imageSrc: string;
  title: string;
  text: React.ReactNode;
};

export default function InfoCardDesktop({ imageSrc, title, text }: Props) {
  return (
    <div
      className="
        flex flex-col items-center justify-center text-center
        w-full h-[296px]
        p-[30px]
        rounded-[35px]
        hover:-translate-y-1 transition
        bg-[#222222]
        bg-[radial-gradient(circle_at_50%_35%,_#3a3a3a_0%,_#222222_60%,_#222222_100%)]
        opacity-90
      "
      style={{ fontFamily: "Montserrat" }}
    >
      <div className="mb-5 flex items-center justify-center size-[108px]">
        <img src={imageSrc} alt="" className="w-full h-full object-contain" />
      </div>

      <h3 className="text-green font-sans font-medium italic text-[18px] leading-[26px] text-center mb-4">
        {title}
      </h3>

      <div
        className="text-gray font-sans font-bold text-[14px] leading-[24px] text-center w-full min-h-[48px]"
        style={{ fontFamily: "Montserrat" }}
      >
        {text}
      </div>
    </div>
  );
}
