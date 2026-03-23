import React from "react";
import { Link } from "react-router-dom";
import Turtle from "../ui/Turtle.jsx";
import { footerSections } from "./footerConfig.js";
import type { FooterItem } from "./footerConfig.js";
import { FooterSocialIcons } from "./SocialIcons.js";

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
    "block text-white hover:text-white transition-colors uppercase text-sm xl:text-base";

  const underlineLink =
    "block uppercase underline underline-offset-4 text-white text-medium hover:text-white/80 transition-colors tracking-wider text-xs xl:text-sm";

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

        {/* 2x2 grid */}
        <div className="relative z-10 w-full px-6 grid grid-cols-2 gap-y-5">

          {/* ROW 1 – LEFT: email + phone */}
          <div className="flex flex-col gap-1 items-start">
            {footerSections
              .filter((s) => s.title === "CONTACT US")
              .flatMap((s) => s.items)
              .filter((item) => ["info@3d-fly.com", "+972-5000000"].includes(item.label))
              .map((item) => (
                <SmartLink
                  key={item.label}
                  item={item}
                  className="block text-white text-[clamp(11px,2.5vw,12px)] uppercase whitespace-nowrap leading-6"
                />
              ))}
          </div>

          {/* ROW 1 – RIGHT: Privacy Policy + Terms of Use */}
          <div className="justify-self-end flex flex-col gap-1 items-start">
            {footerSections
              .filter((s) => s.mobileOnly)
              .flatMap((s) => s.items)
              .map((item) => (
                <SmartLink
                  key={item.label}
                  item={item}
                  className="block uppercase underline underline-offset-4 text-white text-[clamp(11px,2.5vw,12px)] tracking-wider whitespace-nowrap leading-6"
                />
              ))}
          </div>

          {/* ROW 2 – LEFT: working days + hours */}
          <div className="flex flex-col gap-1 items-start">
            {footerSections
              .filter((s) => s.title === "CONTACT US")
              .flatMap((s) => s.items)
              .filter((item) => ["Sunday-Thursday", "09:00-18:00"].includes(item.label))
              .map((item) => (
                <SmartLink
                  key={item.label}
                  item={item}
                  className="block text-white text-[clamp(11px,2.5vw,12px)] uppercase whitespace-nowrap leading-6"
                />
              ))}
          </div>

          {/* ROW 2 – RIGHT: social icons */}
          <div className="justify-self-end flex items-start">
            <FooterSocialIcons />
          </div>

        </div>

      {/* BOTTOM SECTION */}
      <div className="relative z-20 w-full bg-dark border-t border-white/15 mt-8 py-2">
        <p className="text-center text-white text-[10px] tracking-wide uppercase">
          © 2025 3D-FLY | ALL RIGHTS RESERVED
        </p>
      </div>

      </div>

      {/* ================== DESKTOP ================== */}
      <div className="hidden md:flex flex-col relative h-[40dvh] min-h-[300px]">

        {/* Turtle centered background */}
        <Turtle
          bottom="0%"
          left="50%"
          translateX="-50%"
          translateY="28%"
          opacity={0.3}
          zIndex={0}
          className="absolute bottom-0 w-[40vw] max-w-[650px]"
        />

        {/* CONTENT */}
        <div className="relative z-10 w-full flex-1 flex items-center px-[5%] xl:px-[15%]">
          <div className="w-full h-[80%] flex items-stretch justify-between">

            {/* LEFT – Contact info + social icons */}
            <div className="flex flex-col justify-between h-full justify-self-start py-3">
              {/* Email + phone */}
              <div className="flex flex-col gap-1">
                {footerSections
                  .filter((s) => s.title === "CONTACT US")
                  .flatMap((s) => s.items)
                  .filter((item) => ["info@3d-fly.com", "+972-5000000"].includes(item.label))
                  .map((item) => (
                    <SmartLink key={item.label} item={item} className={baseLink} />
                  ))}
              </div>

              {/* Hours */}
              <div className="flex flex-col gap-1">
                {footerSections
                  .filter((s) => s.title === "CONTACT US")
                  .flatMap((s) => s.items)
                  .filter((item) => ["Sunday-Thursday", "09:00-18:00"].includes(item.label))
                  .map((item) => (
                    <SmartLink key={item.label} item={item} className={baseLink} />
                  ))}
              </div>

              {/* Social icons */}
              <FooterSocialIcons />
            </div>

            {/* CENTER – empty (turtle is absolute) */}
            <div />

            {/* RIGHT – Menu links */}
            <div className="flex flex-col justify-between h-full justify-self-end py-3">
              {footerSections
                .filter((s) => s.title === "MENU")
                .flatMap((s) => s.items)
                .map((item) => (
                  <SmartLink key={item.label} item={item} className={underlineLink} />
                ))}
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="relative z-20 w-full bg-dark border-t border-white/15 py-3">
          <p className="text-center text-white text-[12px] text-medium tracking-wide uppercase">
            © 2025 3D-FLY | ALL RIGHTS RESERVED
          </p>
        </div>

      </div>
    </footer>
  );
}
