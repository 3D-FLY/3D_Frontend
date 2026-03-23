// src/sections/home/features/featuresData.tsx
import React from "react";

import NoCostImg from "./assets/images/No Cost.png";
import IntegrationImg from "./assets/images/Integration.png";
import EarthImg from "./assets/images/Earth.png";
import FastImg from "./assets/images/Fast.png";
import Print3DImg from "./assets/images/3D Print.png";
import LocallyImg from "./assets/images/Locally.png";

export type FeatureItem = {
  imageSrc: string;
  title: string;
  text: React.ReactNode;
};

export const featuresData: FeatureItem[] = [
  {
    imageSrc: NoCostImg,
    title: "No Startup Cost",
    text: (
      <div className="uppercase">
        You get profit from <br className="hidden md:block" />
        the first sale!
      </div>
    ),
  },
  {
    imageSrc: IntegrationImg,
    title: "Full Integration",
    text: (
      <div className="uppercase">
        Connect your store to any
        <br className="hidden md:block" /> e-commerce platform!
      </div>
    ),
  },
  {
    imageSrc: EarthImg,
    title: "Global Network",
    text: (
      <div className="uppercase">
        50+ trusted printing <br className="hidden md:block" />
        partners worldwide.
      </div>
    ),
  },
  {
    imageSrc: FastImg,
    title: "Instant Fulfillment",
    text: (
      <div className="uppercase">
        From checkout to production in <br className="hidden md:block" />
        no time - a fully automated workflow.
      </div>
    ),
  },
  {
    imageSrc: Print3DImg,
    title: "Multiple Technologies",
    text: <div className="uppercase">Print with FDM, SLA, SLS and more!</div>,
  },
  {
    imageSrc: LocallyImg,
    title: "Local Manufacturing",
    text: (
      <div className="uppercase">
        Orders are produced by the closest partner to your customer.
      </div>
    ),
  },
];
