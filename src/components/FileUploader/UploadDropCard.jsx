import React from "react";
import UploadFile from "../../icons/UploadFile";

export default function UploadDropCard({ accept, onFile, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="h-full bg-dark rounded-3xl h-full w-full p-12 text-center flex flex-col justify-center items-center transition-colors relative overflow-hidden"
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

        <div className="mb-2">
          <UploadFile />
        </div>

        <p className="text-gray-400 text-sm mb-2">STL, OBJ, 3MF</p>

        <div className="absolute bottom-16">
          <p className="text-green text-lg italic">UPLOAD YOUR FILE</p>
          <p className="text-gray-400 text-sm">TO GET AN INSTANT QUOTATION</p>
        </div>
      </div>
    </div>
  );
}
