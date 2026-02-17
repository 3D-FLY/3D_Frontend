import React, { useState } from "react";
import Button from "../../components/ui/Button";
import UploadFile from "../../icons/UploadFile";
import Turtle from "../../components/ui/Turtle";
import ShellsStepper from "../../components/FileUploader/ShellsStepper";
import FieldLabel from "../../components/FileUploader/FieldLabel";
import OptionGroup from "../../components/FileUploader/OptionGroup";
import LabeledSlider from "../../components/FileUploader/LabeledSlider";
import UploadDropCard from "../../components/FileUploader/UploadDropCard";

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
      className="section-4 py-6 min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* צב ברקע - צד ימין, 50% מחוץ, במרכז האנכי */}
      <Turtle
        right="0"
        top="50%"
        translateX="50%"
        translateY="-50%"
        height="75%"
        opacity={0.2}
        zIndex={0}
        className="
          w-auto
          sm:h-[75%]
        "
      />

        <div className="section4-1 w-full px-4 flex justify-center relative z-10">
        <div className="w-full max-w-[901px] lg:h-[709px] grid grid-cols-1 lg:grid-cols-[minmax(0,582px)_minmax(0,319px)] gap-16 items-stretch">
        {/* Left Side - File Upload */}
        <UploadDropCard
          accept={acceptedFileTypes}
          onFile={(file) => setUploadedFile(file)}
          className="h-full"
        />


        {/* Right Side - File Configuration */}
        <div className="rounded-3xl px-2 w-full max-w-[319px] h-full flex flex-col">
          {/* File Name */}
          <h2 className="text-white text-[40px] leading-[100%] font-bold mb-4">
            {uploadedFile ? uploadedFile.name.toUpperCase() : "YOUR_FILE.STL"}
          </h2>

          {/* Tech Selection */}
          <div className="mb-3">
            <FieldLabel>Tech</FieldLabel>
            <OptionGroup options={techOptions} value={tech} onChange={setTech} />
          </div>

          {/* Material Selection */}
          <div className="mb-3">
            <FieldLabel>Material</FieldLabel>
            <OptionGroup options={materialOptions} value={material} onChange={setMaterial} />
          </div>

          {/* Layer Height Slider */}
          <div className="mb-3">
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
          <div className="mb-3">
            <FieldLabel>Shells</FieldLabel>
            <ShellsStepper value={shells} onChange={setShells} min={1} max={10} />
          </div>

          {/* Infill Selection */}
          <div className="mb-3">
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

          {/* Action Buttons */}
          <div className="space-y-4 mt-auto">
            <Button
              variant="tertiary"
              className=" mt-7 font-medium w-full h-20 py-4 text-[35px] relative italic overflow-hidden"
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
              className="w-full italic py-4 text-lg"
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
