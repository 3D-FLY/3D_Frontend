import React from "react";
import { Link } from "react-router-dom";
import Turtle from "../ui/Turtle.jsx";
import { footerSections } from "./footerConfig.js";
import type { FooterItem } from "./footerConfig.js";

function SmartLink({
  item,
  className,
}: {
  item: FooterItem;
  className: string;
}) {
  if (item.to) {
    return (
      <Link to={item.to} className={className}>
        {item.label}
      </Link>
    );
  }

  if (item.href) {
    const isExternal = item.href.startsWith("http");
    return (
      <a
        href={item.href}
        className={className}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {item.label}
      </a>
    );
  }

  return <div className={className}>{item.label}</div>;
}

export default function Footer() {
  const baseLink =
    "block text-gray-300 hover:text-white transition-colors uppercase text-sm";

  const underlineLink =
    "block uppercase underline underline-offset-4 text-gray-200 hover:text-white transition-colors tracking-wider text-sm";

  return (
    <footer
      className="bg-dark text-white relative overflow-hidden"
      style={{ fontFamily: "Montserrat Alternates, sans-serif" }}
    >
     {/* ================== MOBILE ================== */}
      <div className="md:hidden pt-10 pb-0 relative">

      {/* Turtle background */}
      <Turtle
        bottom="0%"
        left="50%"
        translateX="-50%"
        translateY="38px"
        opacity={0.3}
        zIndex={0}
        className="absolute bottom-0 w-[80vw]"
      />

        <div className="relative z-10 w-full px-5 flex justify-between gap-6 items-start">

        {/* LEFT – Contact */}
        <div className="flex-1 text-left">
          {footerSections
            .filter((s) => s.title === "CONTACT US")
            .map((section, i) => (
              <div key={i}>
                <h3 className="text-green text-xs font-bold mb-4 uppercase tracking-wider text-[9px]">
                  {section.title}
                </h3>

                <div className="space-y-2 leading-5">
                  {section.items.map((item) => (
                    <SmartLink
                      key={item.label}
                      item={item}
                      className="block text-white text-[clamp(7px,1.8vw,11px)] pl-4 uppercase whitespace-nowrap"
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* CENTER – Legal */}
        <div className="flex-1 flex justify-center">
          {footerSections
            .filter((s) => s.mobileOnly || !s.title)
            .map((section, i) => (
              <div key={i} className="space-y-4 pt-9 text-left">
                {section.items.map((item) => (
                  <SmartLink
                    key={item.label}
                    item={item}
                    className="block uppercase underline underline-offset-4 text-white text-[clamp(7px,1.8vw,11px)] tracking-wider pl-4 whitespace-nowrap"
                  />
                ))}
              </div>
            ))}
        </div>

        {/* RIGHT – Follow (column pushed right, text left) */}
        <div className="flex-1 flex justify-end">
          {footerSections
            .filter((s) => s.title === "FOLLOW US")
            .map((section, i) => (
              <div key={i} className="text-left">
                <h3 className="text-green text-xs font-bold mb-4 uppercase tracking-wider text-[9px]">
                  {section.title}
                </h3>

                <div className="space-y-2 leading-5">
                  {section.items.map((item) => (
                    <SmartLink
                      key={item.label}
                      item={item}
                      className="block uppercase underline underline-offset-4 text-white text-[clamp(7px,1.8vw,11px)] tracking-wider pl-4 whitespace-nowrap"
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>

        </div>

      {/* BOTTOM SECTION */}
      <div className="relative z-20 w-full bg-dark border-t border-white/15 mt-6 py-3">
        <p className="text-center text-white text-[10px] tracking-wide uppercase">
          © 2025 3D-FLY | ALL RIGHTS RESERVED
        </p>
      </div>

      </div>

      {/* ================== DESKTOP ================== */}
      <div className="hidden md:flex flex-col relative min-h-[390px]">

      {/* Turtle centered background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Turtle icon className="w-[260px] lg:w-[320px] h-auto opacity-85" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full flex-1 flex items-center">
        <div className="w-full flex items-start justify-around">
          {/* LEFT column */}
          <div className="w-[280px]">
            {footerSections
              .filter((s) => s.title === "CONTACT US")
              .map((section, i) => (
                <div key={i}>
                  <h3 className="text-green text-sm font-bold mb-6 uppercase tracking-wider">
                    {section.title}
                  </h3>

                  <div className="space-y-3 pl-4">
                    {section.items.map((item) => (
                      <SmartLink key={item.label} item={item} className={baseLink} />
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* RIGHT columns */}
          <div className="flex gap-6">
            {/* MENU */}
            <div className="min-w-[170px]">
              {footerSections
                .filter((s) => s.title === "MENU")
                .map((section, i) => (
                  <div key={i}>
                    <h3 className="text-green text-sm font-bold mb-6 uppercase tracking-wider">
                      {section.title}
                    </h3>

                    <div className="space-y-3 pl-4">
                      {section.items.map((item) => (
                        <SmartLink
                          key={item.label}
                          item={item}
                          className={underlineLink}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* FOLLOW */}
            <div className="min-w-[170px]">
              {footerSections
                .filter((s) => s.title === "FOLLOW US")
                .map((section, i) => (
                  <div key={i}>
                    <h3 className="text-green text-sm font-bold mb-6 uppercase tracking-wider">
                      {section.title}
                    </h3>

                    <div className="space-y-3 pl-4">
                      {section.items.map((item) => (
                        <SmartLink
                          key={item.label}
                          item={item}
                          className={underlineLink}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="w-full border-t-2 border-white/15 mt-6 py-4">
        <p className="text-center text-white text-xs">
          © 2025 3D-FLY ALL RIGHTS RESERVED
        </p>
      </div>

      </div>
    </footer>
  );
}