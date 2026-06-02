import LogoLoader from "../components/ui/LogoLoader.js";

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(90,196,34,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-12">
        <LogoLoader gap={40} />
        <p className="font-sans text-[clamp(28px,5vw,56px)] font-extrabold italic leading-none whitespace-nowrap text-gray select-none">
          3D-FLY
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
