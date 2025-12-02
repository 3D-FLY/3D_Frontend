import React from "react";
import "../App.css";
import Features from "../components/Features";
import HowDoesItWork from "../components/HowDoesItWork";
import FileUploader from "../components/FileUploader";
import WhatCanYouSell from "../components/WhatCanYouSell";
import Footer from "../components/Footer";
import MainSection from "../components/MainSection";
import PrintFarmSection from "../components/PrintFarmSection";

export default function Home() {
  return (
    <div style={{ fontFamily: "Montserrat" }}>
      <section
        className="home-section flex flex-col items-center justify-center h-screen text-center bg-dark relative"
        style={{ fontFamily: "Montserrat" }}
      >
        <MainSection />
      </section>
      <section className="section-2" style={{ fontFamily: "Montserrat" }}>
        <Features />
      </section>
      <section className="section-3" style={{ fontFamily: "Montserrat" }}>
        <HowDoesItWork />
      </section>
      <section
        className="section-4 bg-gray"
        style={{ fontFamily: "Montserrat" }}
      >
        <FileUploader />
      </section>
      <section className="section-5 bg-dark flex items-center min-h-lh h-screen overflow-hidden">
        <PrintFarmSection />
      </section>
      <WhatCanYouSell />
      <Footer />
    </div>
  );
}
