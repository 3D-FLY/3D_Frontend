import React from "react";
import Background from "../components/ui/Background";
import ExploreSection from "../features/Explore/ExploreSection";
import { exploreSteps } from "../features/Explore/mockSteps";

export default function Explore() {
  return (
    <Background variant="dark">
      <div className="explorePage flex flex-col min-h-screen text-gray">
        <h1
          className="py-18 w-full text-center max-w-[88vw] mx-auto px-[5%]"
          style={{fontSize: "clamp(2rem, 8vw, 80px)", lineHeight: 1}}>
          <span style={{ fontSize: "1.2em" }}>H</span>OW DOES{" "}
          <span style={{ fontSize: "1.2em" }}>3D-FLY</span>{" "}
          <span className="text-green">WORK?</span>
        </h1>

        <div className="flex flex-col flex-1 pb-12">
          {exploreSteps.map((step) => (
            <ExploreSection key={step.id} step={step} />
          ))}
        </div>
      </div>
    </Background>
  );
}
