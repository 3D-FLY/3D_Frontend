import React from "react";

type Props = {
  imageSrc: string;
  title: string;
  text: React.ReactNode;
  animationDelay?: number;
  shouldAnimate?: boolean;
};

export default function InfoCardMobile({
  imageSrc,
  title,
  text,
  animationDelay = 0,
  shouldAnimate = false,
}: Props) {
  const leftOffset = "25%";
  const rightGap = "7px";

  return (
    <div
      className="relative w-full overflow-visible"
      style={{
        opacity: shouldAnimate ? 1 : 0.6,
        transform: shouldAnimate ? "translateX(0)" : "translateX(-100vw)",
        transition: shouldAnimate
        ? `opacity 3s cubic-bezier(0.16, 1, 0.3, 1) ${animationDelay}s, transform 2s cubic-bezier(0.16, 1, 0.3, 1) ${animationDelay}s`
        : "none",
      }}
    >
      <div
        className="
          relative
          flex items-center
          opacity-90
          rounded-[999px]
          transition
          active:scale-[0.99]
          bg-[radial-gradient(ellipse_120%_70%_at_50%_50%,#3a3a3a_0%,#222222_85%,#222222_100%)]
        "
        style={{
          fontFamily: "Montserrat",
          height: "clamp(52px, 17.5vw, 90px)",
          marginLeft: `-${leftOffset}`,
          width: `calc(100% - ${rightGap} + ${leftOffset})`,
          paddingLeft: `calc(${leftOffset} + 3%)`,
          paddingRight: "0",
        }}
      >
        {/* טקסט */}
        <div
          className="relative z-10 flex flex-col items-start"
          style={{
            gap: "0.3em",
            width: "calc(100% - 14vw - 5%)",
            maxWidth: "calc(100% - 14vw - 5%)",
            overflow: "hidden",
          }}
        >
          <h3
            className="italic uppercase font-semibold leading-[1.3] tracking-wide text-green m-0 p-0 text-left w-full"
            style={{
              fontSize: "clamp(24px, 4vw, 28px)",
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </h3>

          <p
            className="uppercase font-bold text-gray m-0 p-0 text-left w-full leading-[1.1]"
            style={{
              fontSize: "clamp(6px, 1.94vw, 11px)",
              letterSpacing: "0.07em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </p>
        </div>

        {/* אייקון */}
        <div
          className="absolute top-0 right-0 bottom-0 z-20 flex items-center justify-center"
          style={{ aspectRatio: "1 / 1" }}
        >
          <img
            src={imageSrc}
            alt=""
            style={{
              width: "76%",
              height: "76%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}