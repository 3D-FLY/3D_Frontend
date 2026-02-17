import React from "react";
import TagRow from "./TagRow";
import Button from "../../components/ui/Button";

export default function ProductCard({ product: p }) {
  return (
    <div
      className="
        w-[370px] flex-shrink-0 h-[507px]
        rounded-2xl border border-white/15
        bg-[radial-gradient(circle_at_center,_#95959582_0%,_#FFFFFF29_100%)]
        p-[30px]
        grid
        grid-rows-[240px_61px_1fr]
        group
        gap-y-3
        overflow-hidden
      "
    >
      {/* תמונה (שורה 1) */}
      <img
        src={p.image}
        alt={p.title}
        className="w-full h-full object-cover rounded-xl"
      />

      {/* כותרת (שורה 2) */}
      <div className="h-[61px] flex flex-col justify-between overflow-hidden">
        <div
          className="text-white font-medium text-[20px] leading-[26px] line-clamp-2"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {p.title}
        </div>
        <TagRow tags={p.tags} />
      </div>

      {/* בלוק מתחלף: רגיל = תיאור+מחיר, hover = מחיר+כפתור */}
      <div className="relative overflow-hidden">
        {/* מצב רגיל */}
        <div className="h-full flex flex-col opacity-100 transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-y-1">
          <div className="text-[#B6B6B3] font-inter text-[14px] leading-[24px] overflow-hidden">
            <span className="line-clamp-3">{p.description}</span>
          </div>
          <div className="mt-auto flex items-center gap-2 sm:gap-4 flex-wrap leading-none">
            <span
              className="text-white font-medium"
              style={{ fontSize: "clamp(1.25rem, 3vw, 2.25rem)" }}
            >
              ${p.price.toFixed(2)}
            </span>
            {p.oldPrice != null && (
              <span
                className="font-inter font-semibold text-[#4D4D4D] line-through"
                style={{
                  fontSize: "clamp(0.9375rem, 1.75vw, 1.125rem)",
                }}
              >
                ${p.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* מצב hover */}
        <div className="absolute inset-0 h-full justify-center flex flex-col opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap leading-none">
            <span
              className="text-white font-medium"
              style={{ fontSize: "clamp(1.25rem, 3vw, 2.25rem)" }}
            >
              ${p.price.toFixed(2)}
            </span>
            {p.oldPrice != null && (
              <span
                className="font-inter font-semibold text-[#4D4D4D] line-through"
                style={{
                  fontSize: "clamp(0.9375rem, 1.75vw, 1.125rem)",
                }}
              >
                ${p.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            className="mt-4 w-full !text-black py-3 font-inter"
            style={{ backgroundColor: "#baea2b", borderRadius: "15px" }}
          >
            Buy now <span aria-hidden>→</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
