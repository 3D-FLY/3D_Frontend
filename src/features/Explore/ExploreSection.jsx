import React from "react";

export default function ExploreSection({ step }) {
  const { image, title, subtitle, bodyText } = step;
  return (
    <section className="flex flex-row gap-16 w-full max-w-6xl mx-auto py-12">

      <div className="flex flex-col w-[210px] gap-4">
        <img
          src={image}
          alt=""
          className="w-full h-140px aspect-video object-cover rounded-[8px]"
        />
        <h2
          className="text-green font-sans font-semibold italic text-[18px] leading-[26px] tracking-normal capitalize"
        >
          {title}
        </h2>
        <p className="text-gray text-[#B6B6B3] font-sans font-normal text-[16px] leading-[24px] tracking-normal">
          {subtitle}
        </p>
      </div>

      <div className="flex-1 flex items-start pt-2">
        <p className="text-gray text-sm leading-relaxed">{bodyText}</p>
      </div>

    </section>
  );
}
