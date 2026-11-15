// Copy for the Join page. Texts are verbatim from the Drive document
// ("Join page and Price Popup"); do not edit without approval.

export const JOIN_HERO = {
  title: "Be Part of Something Big.",
  paragraphs: [
    "3DFLY is an innovative platform connecting e-commerce stores with a global network of 3D printing suppliers.",
    "Connect your store to a network of professional, trusted suppliers who print and ship your products directly to your customers, anywhere in the world.",
    "Our platform matches each order with the most suitable supplier near the customer, enabling local production, faster deliveries, and lower shipping costs.",
  ],
  highlights: [
    "You focus on selling – we handle the rest.",
    "No inventory. No 3D printers. No production or shipping hassles.",
  ],
} as const;

export const JOIN_SUPPLIER_CARD = {
  question: "Wait, Are You a 3D Printing Supplier?",
  link: "Join Our Network!",
  text: "Expand your customer base, receive new orders from online stores around the world, and grow your business – all while focusing on what you do best - 3D printing.",
} as const;

export const JOIN_LAUNCH = {
  title: "We're Getting Ready to Launch!",
  paragraphs: [
    "3DFLY is currently under development, and we'd love for you to be among the first to join our network!",
    "Sign up now to receive launch updates, get the opportunity for early access, and enjoy exclusive benefits for our first members.",
    "Want to be part of it? Leave your details below, and we'll be in touch!",
  ],
} as const;

export const JOIN_FORM = {
  labels: {
    fullName: "Full Name:",
    email: "Email Address:",
    country: "Country:",
    phone: "Phone Number (Optional):",
    kind: "I Want to Join as :",
    website: "Business Website (Optional):",
  },
  kinds: [
    "Store Owner",
    "3D Printing Supplier",
    "Other (Partnership / Collaboration)",
  ],
  note: "Our team will personally reach out to you as we get closer to launch!",
  consentIntro:
    "By submitting this form, you agree to be contacted by 3DFLY and accept our ",
  consentOutro: ".",
  submit: "Get Early Access",
} as const;

export const JOIN_POPUP = {
  title: "Welcome aboard!",
  lines: [
    "You're on the list.",
    "We'll keep you updated as we get closer to launch.",
  ],
  action: "See More",
} as const;
