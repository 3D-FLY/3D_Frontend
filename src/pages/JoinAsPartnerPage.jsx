import Background from "../components/ui/Background.jsx";
import SectionTitle from "../components/ui/SectionTitle.js";

/** עמוד יעד ל־"Join as a partner" — ניתן להרחיב בתוכן טפסים / מידע. */
export default function JoinAsPartnerPage() {
  return (
    <Background variant="dark">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-16 text-center text-gray">
        <SectionTitle className="w-full" variant="flat">
          Join as a partner
        </SectionTitle>
        <p className="text-base leading-relaxed text-[#dbdada] md:text-lg">
          Partner program details and signup will appear here.
        </p>
      </div>
    </Background>
  );
}
