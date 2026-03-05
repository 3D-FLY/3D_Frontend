import GlowCircle from "../../../components/ui/GlowCircle";

export default function MainSectionGlow() {
  return (
    <>
      {/* MOBILE / TABLET – הילה בדיוק מאחורי הצב */}
      <GlowCircle
        size={700}
        blur={140}
        opacity={0.4}
        color="149, 149, 149"
        className="bottom-[28%] left-1/2 -translate-x-1/2 translate-y-[40%] z-0 xl:hidden"
      />

      {/* DESKTOP */}
      <GlowCircle
        size={356}
        blur={600}
        opacity={0.4}
        color="149, 149, 149"
        className="bottom-[-80px] right-[-80px] z-0 hidden xl:block"
      />
      <GlowCircle
        size={700}
        blur={600}
        opacity={0.4}
        color="149, 149, 149"
        className="-top-[120px] -left-[120px] z-0 hidden xl:block"
      />
    </>
  );
}
  