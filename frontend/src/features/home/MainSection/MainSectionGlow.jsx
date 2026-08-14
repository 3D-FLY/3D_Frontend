import GlowCircle from "../../../components/ui/GlowCircle";

export default function MainSectionGlow() {
  return (
    <>
      {/* MOBILE / TABLET – corner ambient glows (match Figma Ellipse2 / Ellipse3) */}
      {/* Top-right corner glow (Ellipse3) */}
      <GlowCircle
        size={380}
        blur={180}
        opacity={0.25}
        color="149, 149, 149"
        className="-top-[95px] -right-[95px] z-0 xl:hidden"
      />
      {/* Top-left corner glow (Ellipse2) */}
      <GlowCircle
        size={380}
        blur={180}
        opacity={0.25}
        color="149, 149, 149"
        className="-top-[105px] -left-[95px] z-0 xl:hidden"
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
  