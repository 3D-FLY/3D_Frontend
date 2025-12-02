import React, { useState } from "react";
import Button from "./Button";
import UploadFile from "../icons/UploadFile";

export default function FileUploader() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [tech, setTech] = useState("FDM");
  const [material, setMaterial] = useState("PLA");
  const [layerHeight, setLayerHeight] = useState(0.24);
  const [scale, setScale] = useState(1);
  const [infill, setInfill] = useState("5%");

  const acceptedFileTypes = ".stl,.obj,.3mf";
  const techOptions = ["FDM", "SLS", "SLA"];
  const materialOptions = ["PLA", "ABS", "PETG", "TPU"];
  const scaleOptions = [1, 2, 3, 4, 5];
  const infillOptions = ["5%", "10%", "15%", "20%"];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleLayerHeightChange = (event) => {
    setLayerHeight(parseFloat(event.target.value));
  };

  return (
    <section
      className="section-4 py-6 min-h-screen flex items-center justify-center relative"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div
        className="section4-1 max-w-6xl mx-auto px-2 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        {/* Left Side - File Upload */}
        <div className="relative">
          <div
            className="h-[600px] bg-dark rounded-3xl w-[450px] p-12 text-center flex flex-col justify-center items-center hover:border-gray-500 transition-colors relative overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at center, #353535 10%, #222222 70%, #1a1a1a 100%)",
            }}
          >
            <input
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="file-upload"
            />

            {/* Upload Icon */}
            {/* להמיר את האייקון לקומפוננטה */}
            <div className="mb-2">
              <UploadFile />
            </div>

            {/* File Format */}
            <p className="text-gray-400 text-sm mb-2">STL, OBJ, 3MF</p>

            {/* Upload Text */}
            <div className="absolute bottom-16">
              <p className="text-green text-lg italic  ">UPLOAD YOUR FILE</p>
              <p className="text-gray-400 text-sm ">
                TO GET AN INSTANT QUOTATION
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - File Configuration */}
        <div className=" rounded-3xl p-2">
          {/* File Name */}
          <h2 className="text-white text-2xl font-bold mb-4">
            {uploadedFile ? uploadedFile.name.toUpperCase() : "YOUR_FILE.STL"}
          </h2>

          {/* Tech Selection */}
          <div className="mb-2">
            <label className="block text-green text-sm font-semibold mb-3 uppercase">
              Tech
            </label>
            <div className="flex gap-3">
              {techOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setTech(option)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    tech === option
                      ? "bg-dark text-green"
                      : "bg-gray text-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Material Selection */}
          <div className="mb-2">
            <label className="block text-green text-sm font-semibold mb-3 uppercase">
              Material
            </label>
            <div className="flex gap-3">
              {materialOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setMaterial(option)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    material === option
                      ? "bg-dark text-green"
                      : "bg-gray text-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Layer Height Slider */}
          <div className="mb-2">
            <label className="block text-green text-sm font-semibold mb-3 uppercase">
              Layer Height
            </label>
            <div className="flex items-center gap-4">
              <span className="text-green text-sm border-dark bg-dark p-2 rounded-md">
                {layerHeight.toFixed(2)}
              </span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0.1"
                  max="0.6"
                  step="0.02"
                  value={layerHeight}
                  onChange={handleLayerHeightChange}
                  className="w-3xs h-2 bg-dark rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Scale Selection */}
          <div className="mb-2">
            <label className="block text-green text-sm font-semibold mb-3 uppercase">
              Shells
            </label>
            <div className="flex gap-3">
              {scaleOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setScale(option)}
                  className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                    scale === option
                      ? "bg-dark text-green"
                      : "bg-gray text-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Infill Selection */}
          <div className="mb-2">
            <label className="block text-green text-sm font-semibold mb-3 uppercase">
              Infill
            </label>
            <div className="flex gap-3">
              {infillOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setInfill(option)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    infill === option
                      ? "bg-dark text-green"
                      : "bg-gray text-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              variant="tertiary"
              className=" mt-7 font-light w-2xs h-20 py-4 text-[35px] relative italic overflow-hidden"
              onClick={() => console.log("Check price clicked")}
              style={{
                background:
                  "radial-gradient(circle at center, #353535 0%, #222222 70%, #1a1a1a 100%)",
              }}
            >
              CHECK PRICE
            </Button>
            <Button
            hovering="garyBg"
              className=" w-2xs italic py-4 text-lg"
              onClick={() => console.log("Start selling clicked")}
            >
              START SELLING
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
