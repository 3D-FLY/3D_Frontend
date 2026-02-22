import React, { lazy, Suspense } from "react";
import MainSection from "../features/home/MainSection/MainSection";

const Features = lazy(() => import("../features/home/Features/Features"));
const HowDoesItWork = lazy(() => import("../features/home/HowDoesItWork/HowDoesItWork"));
const FileUploader = lazy(() => import("../features/home/FileUploader"));
const PrintFarmSection = lazy(() => import("../features/home/PrintFarmSection"));
const WhatCanYouSell = lazy(() => import("../features/home/WhatCanYouSell"));
const Footer = lazy(() => import("../components/ui/Footer"));

export default function Home() {
  return (
    <div className="font-sans w-full max-w-full overflow-x-hidden">
      {/* HERO — נטען מיד */}
      <section className="relative w-full bg-dark overflow-hidden flex items-center justify-center h-[calc(100dvh-var(--nav-h))]">
        <MainSection />
      </section>

      <Suspense fallback={null}>
        <section className="relative w-full bg-gray h-[calc(100dvh-var(--nav-h))]">
          <Features />
        </section>

        <section className="relative w-full bg-dark h-[calc(100dvh-var(--nav-h))]">
          <HowDoesItWork />
        </section>

        <section className="relative w-full bg-gray h-[calc(100dvh-var(--nav-h))]">
          <FileUploader />
        </section>

        <section className="relative w-full bg-dark h-[calc(100dvh-var(--nav-h))] overflow-hidden flex items-stretch">
          <PrintFarmSection />
        </section>

        <WhatCanYouSell />
        <Footer />
      </Suspense>
    </div>
  );
}
