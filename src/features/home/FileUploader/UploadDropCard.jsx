import React from "react";
import UploadFile from "./icons/UploadFile";

export default function UploadDropCard({ accept, onFile, className = "", fill = false, fileName = null }) {
  const hasFile = Boolean(fileName);

  return (
    <div className={`relative ${fill ? "h-full w-full" : "lg:h-full"} ${className}`}>
      <div
        className={`${
          fill
            ? "h-full w-full"
            : "aspect-[4/3] lg:aspect-auto lg:h-full"
        } bg-dark rounded-3xl w-full text-center flex flex-col items-center transition-colors relative overflow-hidden`}
        style={{
          background:
            "radial-gradient(circle at center, #353535 10%, #222222 70%, #1a1a1a 100%)",
        }}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {hasFile ? (
          <div className="absolute top-1/2 left-1/2 flex max-w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4">
            <p className="truncate text-gray-400 text-[clamp(8px,1.5vw,14px)]">{fileName}</p>
          </div>
        ) : (
          <>
            {/* אייקון + STL — ממורכז בדיוק במרכז הכרטיס */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="scale-75 lg:scale-100 origin-center shrink-0 mb-[-15px] lg:mb-0">
                <UploadFile />
              </div>
              <p className="text-gray text-xs text-medium lg:text-sm mt-0 lg:mt-1">STL, OBJ, 3MF</p>
            </div>

            {/* בלוק תחתון — תמיד בתחתית */}
            <div className="mt-auto w-full pb-4 lg:pb-8 flex flex-col items-center">
              <p className="text-green text-[clamp(10px,2vw,18px)] italic">UPLOAD YOUR FILE</p>
              <p className="text-gray-400 text-[clamp(8px,1.5vw,14px)]">TO GET AN INSTANT QUOTATION</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
