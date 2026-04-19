import React, { lazy, Suspense } from "react";
import MainSection from "../features/home/MainSection/MainSection";

const Features = lazy(() => import("../features/home/Features/Features"));
const HowDoesItWork = lazy(() => import("../features/home/HowItWorks/HowItWorks"));
const FileUploader = lazy(() => import("../features/home/FileUploader/FileUploader"));
const PrintFarmSection = lazy(() => import("../features/home/PrintFarmSection/PrintFarmSection"));
const WhatCanYouSell = lazy(() => import("../features/home/WhatCanYouSell/WhatCanYouSell"));

export default function Home() {
  return (
    <div className="font-sans w-full max-w-full overflow-x-hidden">
      {/* HERO — נטען מיד */}
      <section className="relative isolate z-0 flex h-[calc(100dvh-var(--nav-h))] w-full items-center justify-center overflow-hidden bg-dark">
        <MainSection />
      </section>

      <Suspense fallback={null}>
        {/* Features: מובייל/טאבלט גובה לפי תוכן; דסקטופ גובה מסך */}
        <section className="relative isolate z-0 w-full min-h-0 overflow-hidden bg-gray lg:h-[calc(100dvh-var(--nav-h))]">
          <Features />
        </section>

        {/* מובייל: min-h כדי שהתוכן לא ייחתך; דסקטופ: גובה מסך + clip לזוהר */}
        <section className="relative isolate z-0 w-full min-h-[calc(100dvh-var(--nav-h))] overflow-x-hidden bg-dark lg:h-[calc(100dvh-var(--nav-h))] lg:overflow-hidden">
          <HowDoesItWork />
        </section>

        <section className="relative isolate z-0 w-full min-h-[calc(100dvh-var(--nav-h))] overflow-x-hidden bg-gray lg:h-[calc(100dvh-var(--nav-h))] lg:overflow-hidden">
          <FileUploader />
        </section>

        <section className="relative isolate z-0 flex h-[calc(100dvh-var(--nav-h))] w-full items-stretch overflow-hidden bg-dark">
          <PrintFarmSection />
        </section>

        <section className="relative isolate z-0 w-full overflow-hidden">
          <WhatCanYouSell />
        </section>
      </Suspense>
    </div>
  );
}
