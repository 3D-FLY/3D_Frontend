import React, { useState } from "react";
import Background from "../components/ui/Background";
import UploadDropCard from "../features/home/FileUploader/UploadDropCard";
import FieldLabel from "../features/home/FileUploader/FieldLabel";
import OptionGroup from "../features/home/FileUploader/OptionGroup";
import LabeledSlider from "../features/home/FileUploader/LabeledSlider";
import ShellsStepper from "../features/home/FileUploader/ShellsStepper";
import Button from "../components/ui/Button";

export default function STLPricing() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [tech, setTech] = useState("FDM");
  const [material, setMaterial] = useState("PLA");
  const [layerHeight, setLayerHeight] = useState(0.24);
  const [shells, setShells] = useState(2);
  const [infill, setInfill] = useState(15);
  const [infillPattern, setInfillPattern] = useState("Grid");
  const [topInfillLayers, setTopInfillLayers] = useState(5);
  const [bottomInfillLayers, setBottomInfillLayers] = useState(3);
  const [supports, setSupports] = useState(true);
  const [brim, setBrim] = useState("Auto");
  const [brimWidth, setBrimWidth] = useState(5);
  const [skirt, setSkirt] = useState("Aligned");
  const [skirtLines, setSkirtLines] = useState(4);
  const [comments, setComments] = useState("");

  const acceptedFileTypes = ".stl,.obj,.3mf";
  const techOptions = ["FDM", "SLS", "SLA"];
  const materialOptions = ["PLA", "ABS", "PETG", "TPU", "ASA"];
  const infillPatternOptions = ["Grid", "Lines", "Triangles", "Cubic"];
  const brimOptions = ["Auto", "None", "Manual"];
  const skirtOptions = ["Aligned", "None"];

  return (
    <Background variant="gray">
      <div className="stl-pricing-page min-h-screen py-12 px-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
        {/* Page Title */}
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-dark text-6xl md:text-7xl my-16">
              STL PRICING
            </h1>
            <p className="text-center text-white w-full font-bold italic text-[36px] leading-[36px] tracking-[0%] [font-variant:small-caps]">
              UPLOADING A 3MF FILE LETS US AUTOMATICALLY DETECT ALL PRINT SETTINGS, INCLUDING THOSE NOT SHOWN HERE
            </p>
          </div>

          {/* File Upload Section */}
          <div className="mb-12">
            <UploadDropCard
              accept={acceptedFileTypes}
              onFile={(file) => setUploadedFile(file)}
              className="h-160"
            />
            <p className="text-gray-400 text-xs text-center mt-2">
              WE RECOMMEND UPLOADING A 3MF FILE FOR THE BEST RESULTS.
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12">
          {/* Left Column - File Settings */}
          <div className="pb-16 grid gap-y-10">
            <h2 className="text-white text-4xl font-bold mb-6">
              {uploadedFile ? uploadedFile.name.toUpperCase() : "YOUR_FILE.STL"}
            </h2>

            {/* TYPE */}
            <div>
              <FieldLabel>Type</FieldLabel>
              <OptionGroup options={techOptions} value={tech} onChange={setTech} />
            </div>

            {/* MATERIAL */}
            <div>
              <FieldLabel>Material</FieldLabel>
              <OptionGroup options={materialOptions} value={material} onChange={setMaterial} />
            </div>

            {/* LAYER HEIGHT */}
            <div>
              <FieldLabel>Layer Height</FieldLabel>
              <LabeledSlider
                value={layerHeight}
                onChange={setLayerHeight}
                min={0.1}
                max={0.6}
                step={0.02}
                format={(v) => v.toFixed(2)}
              />
            </div>

            {/* SHELLS */}
            <div>
              <FieldLabel>Shells</FieldLabel>
              <ShellsStepper value={shells} onChange={setShells} min={1} max={10} />
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* INFILL */}
            <div>
              <FieldLabel>Infill</FieldLabel>
              <div className="flex items-center gap-4">
                <span className="w-[64px] text-center text-green text-sm bg-dark p-2 rounded-md tabular-nums">
                  {infill}%
                </span>
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={infill}
                    onChange={(e) => setInfill(parseInt(e.target.value))}
                    className="w-full h-1 bg-dark rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* INFILL PATTERN */}
            <div>
              <FieldLabel>Infill Pattern</FieldLabel>
              <select
                value={infillPattern}
                onChange={(e) => setInfillPattern(e.target.value)}
                className="w-[40%] min-w-[170px] bg-dark text-green px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-green"
              >
                {infillPatternOptions.map((option) => (
                  <option key={option} value={option} className="bg-dark">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <FieldLabel>Top Shell Layers</FieldLabel>
              <ShellsStepper value={topInfillLayers} onChange={setTopInfillLayers} min={0} max={20} />
            </div>

            <div>
              <FieldLabel>Bottom Shell Layers</FieldLabel>
              <ShellsStepper value={bottomInfillLayers} onChange={setBottomInfillLayers} min={0} max={20} />
            </div>
          </div>


            {/* SUPPORTS */}
            <div>
              <FieldLabel>We Use Tree Supports</FieldLabel>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSupports(true)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    supports ? "bg-green text-white" : "bg-dark text-gray-400"
                  }`}
                >
                  ON
                </button>
                <button
                  type="button"
                  onClick={() => setSupports(false)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    !supports ? "bg-green text-white" : "bg-dark text-gray-400"
                  }`}
                >
                  OFF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <FieldLabel>Brim</FieldLabel>
              <select
                value={brim}
                onChange={(e) => setBrim(e.target.value)}
                className="w-[40%] min-w-[170px] bg-dark text-gray-400 px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-green"
              >
                {brimOptions.map((option) => (
                  <option key={option} value={option} className="bg-dark">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>Brim width</FieldLabel>
              <ShellsStepper value={brimWidth} onChange={setBrimWidth} min={0} max={20} />
            </div>
          </div>

            {/* SKIRT */}
            <div>
              <FieldLabel>Skirt</FieldLabel>
              <select
                value={skirt}
                onChange={(e) => setSkirt(e.target.value)}
                className="w-[40%] min-w-[170px] bg-dark text-gray-400 px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-green"
              >
                {skirtOptions.map((option) => (
                  <option key={option} value={option} className="bg-dark">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* SKIRT LINES */}
            <div>
              <FieldLabel>Skirt Lines</FieldLabel>
              <ShellsStepper value={skirtLines} onChange={setSkirtLines} min={0} max={20} />
            </div>
          </div>

          {/* Right Column - Comments and Photos */}
          <div className="space-y-6">
            <h2 className="text-white text-4xl font-bold mb-6">COMMENTS</h2>

            {/* Comments Textarea */}
            <div>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="ANY OTHER INFORMATION RELEVANT FOR BEST PRINTING RESULTS."
                className="w-full h-48 bg-dark text-gray-400 px-4 py-3 rounded-3xl border border-gray-600 focus:outline-none focus:border-green resize-none"
                style={{
                  background: "radial-gradient(circle at center, #353535 10%, #222222 70%, #1a1a1a 100%)",
                }}
              />
            </div>

            {/* Add Photos Button */}
            <div>
              <label className="cursor-pointer">
                <div
                  className="w-full h-32 bg-dark rounded-3xl flex flex-col items-center justify-center border border-gray-600 hover:border-green transition-colors"
                  style={{
                    background: "radial-gradient(circle at center, #353535 10%, #222222 70%, #1a1a1a 100%)",
                  }}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400 mb-2"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className="text-gray-400 text-sm">ADD PHOTOS</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => console.log("Photos selected:", e.target.files)}
                />
              </label>
            </div>

            {/* Estimated Price Button */}
            <div>
              <Button
                variant="tertiary"
                className="w-full h-20 py-4 text-2xl font-medium italic"
                onClick={() => console.log("Estimated price clicked")}
                style={{
                  background: "radial-gradient(circle at center, #353535 0%, #222222 70%, #1a1a1a 100%)",
                }}
              >
                ESTIMATED PRICE
              </Button>
            </div>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="max-w-4xl mx-auto">
          <Button
            variant="tertiary"
            className="w-full h-16 py-4 text-xl font-medium italic"
            onClick={() => console.log("Add product clicked")}
            style={{
              background: "radial-gradient(circle at center, #353535 0%, #222222 70%, #1a1a1a 100%)",
            }}
          >
            ADD PRODUCT
          </Button>
        </div>
      </div>
    </Background>
  );
}
