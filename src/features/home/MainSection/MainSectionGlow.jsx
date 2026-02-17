import GlowCircle from "../../../components/ui/GlowCircle";

export default function MainSectionGlow() {
  return (
    <>
      {/* MOBILE */}
      <GlowCircle
        size={700}
        blur={140}
        opacity={0.4}
        color="149, 149, 149"
        className="bottom-0 left-1/2 -translate-x-1/2 translate-y-[30%] z-0 md:hidden"
      />

      {/* DESKTOP */}
      <GlowCircle
        size={356}
        blur={600}
        opacity={0.4}
        color="149, 149, 149"
        className="bottom-[-80px] right-[-80px] z-0 hidden lg:block"
      />
      <GlowCircle
        size={700}
        blur={600}
        opacity={0.4}
        color="149, 149, 149"
        className="-top-[120px] -left-[120px] z-0 hidden lg:block"
      />
    </>
  );
}
  