import {
  Icon3DPrint,
  IconEarth,
  IconFast,
  IconIntegration,
  IconLocally,
  IconNoCost,
} from "../../icons/features";
import GlowCircle from "../../components/ui/GlowCircle";
import Turtle from "../../components/ui/Turtle";

function InfoCard({ icon, title, text }) {
  const Icon = icon;
  return (
    <div
      className="
        flex flex-col items-center justify-center text-center
        w-full h-[296px]
        p-[30px]
        rounded-[35px]
        hover:-translate-y-1 transition
        bg-[#222222]
        bg-[radial-gradient(circle_at_50%_35%,_#3a3a3a_0%,_#222222_60%,_#222222_100%)]
        opacity-90"
      style={{ fontFamily: 'Montserrat' }}
    >

      <div className="mb-5 flex items-center justify-center">
        <Icon className="w-27 h-27 " />
      </div>
      <h3 className="text-green font-sans font-medium italic text-[18px] leading-[26px] tracking-normal text-center mb-4">{title}</h3>
      <p
        className="text-gray font-sans font-bold text-[14px] leading-[24px] tracking-normal text-center w-full min-h-[48px]"
        style={{ fontFamily: "Montserrat" }}
      >
        {text}
      </p>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      icon: IconIntegration,
      title: "Full Integration",
      text: (
        <div className="uppercase">
          Connect your store to any
          <br /> e-commerce platform!
        </div>
      ),
    },
    {
      icon: IconNoCost,
      title: "No Startup Cost",
      text: (
        <div className="uppercase">
          You get profit from <br />
          the first sale!
        </div>
      ),
    },
    {
      icon: IconEarth,
      title: "Global Network",
      text: (
        <div className="uppercase">
          50+ trusted printing <br />
          partners worldwide.
        </div>
      ),
    },
    {
      icon: IconFast,
      title: "Instant Fulfillment",
      text: (
        <div className="uppercase">
          From checkout to production in <br />
          no time - a fully automated workflow.
        </div>
      ),
    },
    {
      icon: Icon3DPrint,
      title: "Multiple Technologies",
      text: <div className="uppercase">Print with FDM, SLA, SLS and more!</div>,
    },
    {
      icon: IconLocally,
      title: "Local Manufacturing",
      text: (
        <div className="uppercase">
          Orders are produced by the closest partner to your customer.
        </div>
      ),
    },
  ];

  return (
    <section
      className="flex flex-col relative text-center items-center justify-center min-h-[calc(100vh-72px)] overflow-hidden bg-gray"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
  


      {/* Glow circle behind the turtle */}
      <GlowCircle
        size={481}
        blur={600}
        opacity={0.4}
        className="bottom-0 left-1/2 -translate-x-1/2 translate-y-1/5 z-5"
      />

      {/* צב ברקע */}
      <Turtle
        bottom="0%"
        translateY="37%"
        opacity={0.3}
        zIndex={6}
        className="w-[120vw] sm:w-[105vw] md:w-[90vw] lg:w-[70vw]"
      />

      <div
        className="
          relative z-10
          mx-auto
          w-full max-w-[1400px]
          px-6 md:px-10
          py-12 md:py-16 lg:py-20
          grid
          gap-x-[40px] gap-y-[48px]
          justify-items-stretch
          [grid-template-columns:repeat(auto-fit,minmax(min(400px,100%),1fr))]
        "
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >


        {features.map((f) => (
          <InfoCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
