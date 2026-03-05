import React from "react";
import UploadFile from "../../icons/UploadFile";

export default function UploadDropCard({ accept, onFile, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="h-full min-h-[min(36vh,320px)] lg:min-h-0 bg-dark rounded-3xl w-full p-6 sm:p-8 lg:p-12 text-center flex flex-col justify-center items-center transition-colors relative overflow-hidden"
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

        <div className="mb-1 lg:mb-2 scale-75 lg:scale-100 origin-center shrink-0">
          <UploadFile />
        </div>

        <p className="text-gray-400 text-xs lg:text-sm mb-1 lg:mb-2">STL, OBJ, 3MF</p>

        <div className="mt-auto pt-4 lg:pt-0 lg:absolute lg:bottom-16">
          <p className="text-green text-sm sm:text-base lg:text-lg italic">UPLOAD YOUR FILE</p>
          <p className="text-gray-400 text-xs lg:text-sm">TO GET AN INSTANT QUOTATION</p>
        </div>
      </div>
    </div>
  );
}
