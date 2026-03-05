// src/components/Footer/footerConfig.ts

export type FooterItem = {
    label: string;
    to?: string;     // internal route
    href?: string;   // external link
  };
  
  export type FooterSection = {
    title?: string;
    align?: "left" | "center" | "right";
    desktopOnly?: boolean;
    mobileOnly?: boolean;
    items: FooterItem[];
  };
  
  export const footerSections: FooterSection[] = [
    {
      title: "CONTACT US",
      align: "left",
      items: [
        { label: "info@3d-fly.com", href: "mailto:info@3d-fly.com" },
        { label: "+972-5000000", href: "tel:+9725000000" },
        { label: "Sunday-Thursday" },
        { label: "09:00-18:00" },
      ],
    },
    {
      align: "center",
      mobileOnly: true,
      items: [
        { label: "PRIVACY POLICY", to: "/privacy" },
        { label: "TERMS OF USE", to: "/terms" },
      ],
    },
    {
      title: "MENU",
      align: "left",
      desktopOnly: true,
      items: [
        { label: "HOME", to: "/" },
        { label: "EXPLORE", to: "/explore" },
        { label: "FAQ", to: "/faq" },
        { label: "STORE", to: "/store" },
        { label: "ABOUT", to: "/about" },
        { label: "PRIVACY POLICY", to: "/privacy" },
        { label: "TERMS OF USE", to: "/terms" },
      ],
    },
    {
      title: "FOLLOW US",
      align: "right",
      items: [
        { label: "FACEBOOK", href: "https://facebook.com/" },
        { label: "INSTAGRAM", href: "https://instagram.com/" },
        { label: "LINKEDIN", href: "https://linkedin.com/" },
      ],
    },
  ];