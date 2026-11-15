import type { ReactNode } from "react";
import type { LegalBlock, LegalDocument } from "./legalTypes.js";

interface LegalPageProps {
  document: LegalDocument;
  className?: string;
}

const EMAIL_RE = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
const BODY_CLASS =
  "text-[15px] font-medium leading-relaxed text-white/60 md:text-lg";

// Turns **bold** segments and email addresses into elements.
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).flatMap((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return [
        <strong key={`b${i}`} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>,
      ];
    }
    return part.split(EMAIL_RE).map((seg, j) =>
      j % 2 === 1 ? (
        <a
          key={`e${i}-${j}`}
          href={`mailto:${seg}`}
          className="text-green-500 hover:underline"
        >
          {seg}
        </a>
      ) : (
        seg
      ),
    );
  });
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "h3") {
    return <h3 className="pt-2 text-base font-bold text-white md:text-lg">{block.text}</h3>;
  }
  if (block.type === "ul") {
    return (
      <ul className={`list-disc space-y-2 pl-5 marker:text-green-500 ${BODY_CLASS}`}>
        {block.items.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ul>
    );
  }
  return <p className={BODY_CLASS}>{renderInline(block.text)}</p>;
}

export default function LegalPage({ document, className = "" }: LegalPageProps) {
  return (
    <div className={`mx-auto max-w-4xl px-6 pb-20 pt-10 md:pb-32 md:pt-24 ${className}`}>
      <header className="text-center">
        {/* Title stays on one line; font size scales down with the viewport */}
        <h1 className="whitespace-nowrap text-[clamp(10px,4.6vw,42px)] font-bold uppercase leading-tight text-white">
          {document.title}
        </h1>
        <p className="mt-4 text-sm text-white/40">{document.lastUpdated}</p>
      </header>

      <div className="mt-8 space-y-5 md:mt-12">
        {document.intro.map((text) => (
          <p key={text} className={BODY_CLASS}>
            {renderInline(text)}
          </p>
        ))}
      </div>

      {/* TABLE OF CONTENTS — anchor links to every section */}
      <nav
        aria-label="Table of contents"
        className="mt-10 rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.08)] p-5 md:mt-14 md:p-6"
      >
        <ul className="grid gap-x-8 gap-y-2 md:grid-cols-2">
          {document.sections.map((section, i) => (
            <li key={section.heading}>
              <a
                href={`#section-${i + 1}`}
                className="text-[15px] font-medium text-white/60 transition-colors hover:text-green-500"
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-12 md:mt-14 md:space-y-16">
        {document.sections.map((section, i) => (
          <section
            key={section.heading}
            id={`section-${i + 1}`}
            className="scroll-mt-[calc(var(--nav-h)+16px)] space-y-5"
          >
            <h2 className="text-xl font-extrabold italic text-white md:text-2xl">
              {section.heading}
            </h2>
            {section.blocks.map((block, j) => (
              <Block key={j} block={block} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
