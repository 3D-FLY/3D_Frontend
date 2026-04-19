import { Link } from "react-router-dom";
import { footerSections } from "./footerConfig.js";
import type { FooterItem } from "./footerConfig.js";
import { FooterSocialIcons } from "./SocialIcons.js";
import Turtle from "../ui/Turtle.jsx";

function SmartLink({ item, className }: { item: FooterItem; className: string }) {
  if (item.to) return <Link to={item.to} className={className}>{item.label}</Link>;
  if (item.href) {
    const isExternal = item.href.startsWith("http");
    return (
      <a href={item.href} className={className} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
        {item.label}
      </a>
    );
  }
  return <span className={className}>{item.label}</span>;
}

export default function FooterSlim() {
  const menuItems = footerSections.find((s) => s.title === "MENU")?.items ?? [];

  return (
    <footer
      className="bg-dark text-white relative overflow-hidden"
      style={{ fontFamily: "Montserrat Alternates, sans-serif", borderTop: "0.5px solid rgba(255,255,255,0.12)" }}
    >
      {/* צב
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-0"
        style={{ height: "90%", aspectRatio: "2475 / 1683.7" }}
      >
        <Turtle icon className="relative z-10 w-full h-auto opacity-20" />
      </div> */}

      {/* תוכן */}
      <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap px-6 py-3">

        {/* copyright */}
        <span className="text-[11px] uppercase tracking-widest text-white/45 whitespace-nowrap">
          © 2025 3D-FLY
        </span>

        {/* לינקים מהקונפיג */}
        <nav className="flex items-center gap-4 flex-wrap">
          {menuItems.map((item) => (
            <SmartLink
              key={item.label}
              item={item}
              className="text-[11px] uppercase tracking-wider text-white/55 underline underline-offset-4 hover:text-white transition-colors whitespace-nowrap"
            />
          ))}
        </nav>

        {/* סושיאל */}
        <FooterSocialIcons className="flex items-center gap-2 [&_a]:w-7 [&_a]:h-7" />

      </div>
    </footer>
  );
}