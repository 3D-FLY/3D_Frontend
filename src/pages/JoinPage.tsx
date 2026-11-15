import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import Background from "../components/ui/Background.jsx";
import useNavbarHeight from "../components/layout/useNavbarHeight.js";
import JoinForm from "../features/Join/JoinForm.js";
import {
  JOIN_HERO,
  JOIN_LAUNCH,
  JOIN_SUPPLIER_CARD,
} from "../features/Join/joinContent.js";

const BODY_CLASS =
  "text-[15px] font-medium leading-relaxed text-white/60 md:text-lg";

export default function JoinPage() {
  const navHeight = useNavbarHeight();

  return (
    <div dir="ltr" style={{ "--nav-h": `${navHeight}px` } as CSSProperties}>
      <Background variant="dark" className="overflow-clip!">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pb-32 md:pt-24">
          {/* HERO */}
          <header className="text-center">
            {/* Title stays on one line; font size scales down with the viewport */}
            <h1 className="whitespace-nowrap text-[clamp(10px,4.2vw,48px)] font-bold uppercase leading-tight text-white">
              {JOIN_HERO.title}
            </h1>
          </header>

          <div className="mx-auto mt-6 max-w-3xl space-y-5 text-center md:mt-10">
            {JOIN_HERO.paragraphs.map((text) => (
              <p key={text} className={BODY_CLASS}>
                {text}
              </p>
            ))}
            {JOIN_HERO.highlights.map((text) => (
              <p
                key={text}
                className="text-lg font-extrabold italic text-white md:text-2xl"
              >
                {text}
              </p>
            ))}
          </div>

          {/* SUPPLIER CALLOUT — links to the supplier application */}
          <div className="mx-auto mt-12 max-w-5xl rounded-2xl border border-green-500/20 bg-green-500/5 px-6 py-8 text-center md:mt-16 md:px-12 md:py-10">
            <h2 className="text-xl font-extrabold italic text-white md:text-3xl">
              {JOIN_SUPPLIER_CARD.question}{" "}
              <Link
                to="/join-as-partner"
                className="text-green-500 underline-offset-4 hover:underline"
              >
                {JOIN_SUPPLIER_CARD.link}
              </Link>
            </h2>
            <p className={`mt-4 ${BODY_CLASS}`}>{JOIN_SUPPLIER_CARD.text}</p>
          </div>

          {/* LAUNCH + FORM */}
          <section className="mx-auto mt-14 max-w-5xl md:mt-20">
            <h2 className="text-center text-2xl font-extrabold italic text-white md:text-4xl">
              {JOIN_LAUNCH.title}
            </h2>
            <div className="mx-auto mt-6 max-w-3xl space-y-5 text-center md:mt-8">
              {JOIN_LAUNCH.paragraphs.map((text) => (
                <p key={text} className={BODY_CLASS}>
                  {text}
                </p>
              ))}
            </div>
            <JoinForm className="mt-8 md:mt-12" />
          </section>
        </div>
      </Background>
    </div>
  );
}
