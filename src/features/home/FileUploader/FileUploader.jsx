import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Turtle from "../../../components/ui/Turtle";
import ShellsStepper from "./ShellsStepper";
import FieldLabel from "./FieldLabel";
import OptionGroup from "./OptionGroup";
import LabeledSlider from "./LabeledSlider";
import UploadDropCard from "./UploadDropCard";

export default function FileUploader() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [tech, setTech] = useState("FDM");
  const [material, setMaterial] = useState("PLA");
  const [layerHeight, setLayerHeight] = useState(0.24);
  const [shells, setShells] = useState(2);
  const [infill, setInfill] = useState(5);

  const acceptedFileTypes = ".stl,.obj,.3mf";
  const techOptions = ["FDM", "SLS", "SLA"];
  const materialOptions = ["PLA", "ABS", "PETG", "TPU"];
  

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
      className="section-4 relative flex min-h-[calc(100svh-var(--nav-h))] w-full flex-col items-center justify-center overflow-hidden py-6"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* צב ברקע — מובייל: גובה 70vh (נקבע לפי גובה, לא רוחב); דסקטופ: במרכז אנכי */}
      <Turtle
        right="0"
        top="65%"
        translateX="50%"
        translateY="-50%"
        height="60vh"
        opacity={0.2}
        zIndex={0}
        className="lg:hidden"
        style={{
          height: "45vh",
          minHeight: "45vh",
          width: "auto",
          maxWidth: "none",
        }}
      />
      <Turtle
        right="0"
        top="50%"
        translateX="50%"
        translateY="-50%"
        height="75%"
        opacity={0.2}
        zIndex={0}
        className="w-auto sm:h-[75%] hidden lg:block"
      />

        <div className="section4-1 w-full px-4 flex justify-center relative z-10 min-h-[min(85vh,800px)] lg:min-h-0">
        <div className="w-full max-w-[901px] lg:h-[709px] grid grid-cols-1 lg:grid-cols-[minmax(0,582px)_minmax(0,319px)] gap-8 lg:gap-16 items-stretch">
        {/* Left Side - File Upload */}
        <UploadDropCard
          accept={acceptedFileTypes}
          onFile={(file) => setUploadedFile(file)}
          className="w-full max-w-[500px] mx-auto lg:max-w-none lg:h-full"
        />


        {/* Right Side - File Configuration — מובייל בלבד: רוחב מלא; טאבלט+דסקטופ: כמו דסקטופ (max 319px) */}
        <div className="rounded-3xl px-2 w-full max-w-[319px] mx-auto lg:mx-0 lg:max-w-[319px] h-full flex flex-col">
          {/* File Name */}
          <h2 className="text-white text-[40px] leading-[100%] font-bold mb-5">
            {uploadedFile ? uploadedFile.name.toUpperCase() : "YOUR_FILE.STL"}
          </h2>

          {/* Tech Selection */}
          <div className="mb-4">
            <FieldLabel>Tech</FieldLabel>
            <OptionGroup options={techOptions} value={tech} onChange={setTech} disabledOptions={techOptions.slice(1)} />
          </div>

          {/* Material Selection */}
          <div className="mb-4">
            <FieldLabel>Material</FieldLabel>
            <OptionGroup options={materialOptions} value={material} onChange={setMaterial} />
          </div>

          {/* Layer Height Slider */}
          <div className="mb-4">
            <FieldLabel>Layer Height</FieldLabel>
            <LabeledSlider
              value={layerHeight}
              onChange={setLayerHeight}
              min={0.1}
              max={0.6}
              step={0.04}
              format={(v) => v.toFixed(2)}
            />
          </div>

          {/* Scale Selection */}
          <div className="mb-4">
            <FieldLabel>Shells</FieldLabel>
            <ShellsStepper value={shells} onChange={setShells} min={1} max={10} />
          </div>

          {/* Infill Selection */}
          <div className="mb-4">
            <FieldLabel>Infill</FieldLabel>
            <LabeledSlider
              value={infill}
              onChange={setInfill}
              min={1}
              max={100}
              step={1}
              format={(v) => `${v}%`}
            />
          </div>

          {/* Action Buttons — מובייל/טאבלט: רק CHECK PRICE, קטן וצר; דסקטופ: שני כפתורים; אובר מהרכיב */}
          <div className="space-y-4 mt-auto flex flex-col items-center lg:items-stretch">
            <Button
              variant="tertiary"
              hovering="garyBg"
              className="mt-7 font-medium w-full max-w-[200px] lg:max-w-none h-11 py-2.5 text-base lg:h-20 lg:py-4 lg:text-[35px] relative italic overflow-hidden"
              onClick={() => console.log("Check price clicked")}
            >
              CHECK PRICE
            </Button>
            <Button
              hovering="garyBg"
              className="w-full italic py-4 text-lg hidden lg:inline-flex"
              onClick={() => console.log("Start selling clicked")}
            >
              START SELLING
            </Button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
