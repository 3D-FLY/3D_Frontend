import Earth from "../icons/Earth.jsx";
import Fast from "../icons/Fast.jsx";
import Integration from "../icons/Integration.jsx";
import Locally from "../icons/Locally.jsx";
import NoCost from "../icons/NoCost.jsx";
import Print3D from "../icons/3DPrint.jsx";

function InfoCard({ icon, title, text }) {
  const Icon = icon;
  return (
    <div
      className="rounded-3xl w-full h-64 p-10 ring-dark hover:-translate-y-1 transition"
      style={{
        background: "radial-gradient(circle, #222222b0 10%, #222222 80%)",
        fontFamily: "Montserrat",
      }}
    >
      <div className="mb-4 flex items-center justify-center">
        <Icon className="w-25 h-25 " />
      </div>
      <h3 className="text-green  uppercase italic">{title}</h3>
      <p
        className="text-gray mt-2 font-semibold text-xs leading-relaxed"
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
      icon: Integration,
      title: "Full Integration",
      text: (
        <div className="uppercase">
          Connect your store to any
          <br /> e-commerce platform!
        </div>
      ),
    },
    {
      icon: NoCost,
      title: "No Startup Cost",
      text: (
        <div className="uppercase">
          You get profit from <br />
          the first sale!
        </div>
      ),
    },
    {
      icon: Earth,
      title: "Global Network",
      text: (
        <div className="uppercase">
          50+ trusted printing <br />
          partners worldwide.
        </div>
      ),
    },
    {
      icon: Fast,
      title: "Instant Fulfillment",
      text: (
        <div className="uppercase text-[11px]">
          From checkout to production in <br />
          no time - a fully automated workflow.
        </div>
      ),
    },
    {
      icon: Print3D,
      title: "Multiple Technologies",
      text: <div className="uppercase">Print with FDM, SLA, SLS and more!</div>,
    },
    {
      icon: Locally,
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
      className="flex flex-col  relative py-16 text-center items-center justify-center min-h-screen"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <div
        className="text-green relative  mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 md:px-6 items-center"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        {features.map((f) => (
          <InfoCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
