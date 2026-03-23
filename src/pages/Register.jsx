import RegistrationForm from "../features/auth/RegistrationForm";
import DecorativeStripe from "../auth/Rectangle 66.svg?react";

/**
 * Registration page — standalone, no Navbar / Footer.
 *
 * Layout:
 *   Desktop  →  left branding panel  |  right form panel
 *   Mobile   →  form panel only (full width)
 */
export default function Register() {
  return (
    <div className="min-h-screen bg-dark flex">
      {/* ── Left branding panel (lg+) ── */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[48%] flex-col justify-between relative overflow-hidden bg-[#191919] px-12 py-10">
        {/* Decorative green stripe */}
        <div className="absolute bottom-28 left-0 right-0 pointer-events-none opacity-70">
          <DecorativeStripe
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: 60 }}
          />
        </div>

        {/* Second stripe, offset */}
        <div className="absolute bottom-16 left-0 right-0 pointer-events-none opacity-30">
          <DecorativeStripe
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: 60 }}
          />
        </div>

        {/* Logo */}
        <a href="/" className="relative z-10 inline-flex items-center gap-2">
          <span className="text-green font-black italic text-2xl uppercase tracking-tight">
            3D Fly
          </span>
        </a>

        {/* Hero text */}
        <div className="relative z-10 max-w-sm">
          <h2 className="text-white text-[clamp(2.5rem,4vw,3.5rem)] font-black italic uppercase leading-none mb-4">
            Print the
            <br />
            <span className="text-green">future.</span>
          </h2>
          <p className="text-gray text-[15px] font-medium leading-relaxed">
            Join thousands of creators selling 3D-printed products worldwide.
            Upload your design and let our global print farm handle the rest.
          </p>
        </div>

        {/* Stats row */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: "500+", label: "Printers" },
            { value: "50+", label: "Countries" },
            { value: "10k+", label: "Creators" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-white font-black text-2xl italic leading-none">
                {value}
              </p>
              <p className="text-gray text-[11px] font-semibold uppercase tracking-widest mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <main className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-green font-black italic text-2xl uppercase tracking-tight">
              3D Fly
            </span>
          </a>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-white text-4xl sm:text-5xl font-black italic uppercase leading-none mb-2">
              Create
              <br />
              Account
            </h1>
            <p className="text-gray text-sm mt-3">
              Set up your 3D Fly account in seconds.
            </p>
          </div>

          <RegistrationForm />
        </div>
      </main>
    </div>
  );
}
