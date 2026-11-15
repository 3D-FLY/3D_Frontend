// Copy and options for the supplier application. Texts are verbatim from the Drive
// document ("Supplier Form"); do not edit without approval.

export const SUPPLIER_HERO = {
  title: "Join Our Global 3D Printing Network!",
  paragraphs: [
    "Join 3DFLY's global network of 3D printing suppliers and turn your production capabilities into new business opportunities!",
    "Connect with e-commerce stores worldwide, receive orders that match your capabilities and availability, and grow your business – all while focusing on what you do best - 3D printing.",
    "We're getting ready to launch and looking for professional 3D printing suppliers to join our network from day one.",
    "Fill out the form below so we can learn more about your business and explore potential collaboration opportunities.",
  ],
} as const;

export const SUPPLIER_LABELS = {
  fullName: "Full Name:",
  businessName: "Business Name:",
  email: "Email Address:",
  phone: "Phone Number (Optional):",
  country: "Country:",
  city: "City:",
  website: "Business Website (Optional):",
  technologies: "Available 3D Printing Technologies:",
  printersAmount: "Number of 3D Printers:",
  printerType: "Which 3D Printers Do You Own?",
  materials: "Available Printing Materials:",
  packAndShip: "Are You Able to Package and Ship Products Directly to Customers?",
  packAndShipDetail: "Please Specify:",
  multipleOrders: "Can You Handle Multiple Orders Simultaneously?",
  productionTime: "What Is Your Average Production Time for a Standard Order?",
  shippingDestiny: "Where Can You Ship Orders?",
  selfPickup: "Do You Offer Local Pickup?",
  // The document marks this field "(Optional)"; shown as in the other optional labels.
  shippingCarrier: "Shipping Carrier (Optional):",
  packagingMethod: "Please Describe Your Packaging Method:",
  services: "Do You Offer Any Additional Services?",
  additionalText: "Anything Else You'd Like Us to Know About Your Business?",
} as const;

export const SUPPLIER_PLACEHOLDERS = {
  shippingCarrier: "e.g., Fedex",
  packagingMethod: "e.g., Bubble wrap inside a cardboard box.",
} as const;

export interface TechOption {
  id: string;
  label: string;
}

export const OTHER_TECH_ID = "other";

// Layout of the document's two-column grid, read row by row.
// "Other" is the English counterpart of the Hebrew "אחר - פרט" used in the document.
export const TECH_OPTIONS: readonly TechOption[] = [
  { id: "fdm", label: "FDM" },
  { id: "polyjet", label: "PolyJet" },
  { id: "sls", label: "SLS" },
  { id: "lpbf", label: "LPBF / DMLS / SLM" },
  { id: "sla", label: "SLA / DLP / MSLA" },
  { id: "ceramic", label: "Ceramic / Concrete" },
  { id: "mjf", label: "MJF" },
  { id: OTHER_TECH_ID, label: "Other (Please Specify)" },
];

export interface MaterialGroup {
  techId: string;
  heading: string;
  materials: readonly string[];
}

// Order and headings as printed in the document.
export const MATERIAL_GROUPS: readonly MaterialGroup[] = [
  {
    techId: "fdm",
    heading: "FDM:",
    materials: [
      "PLA", "PETG", "ABS", "ASA", "TPU", "TPE", "PA (Nylon)", "PC", "PP",
      "PEEK", "PEI (ULTEM)", "PLA-CF", "PETG-CF", "PA-CF", "PA-GF",
    ],
  },
  {
    techId: "sla",
    heading: "SLA / DLP / MSLA:",
    materials: [
      "Standard Resin", "ABS-Like", "Tough", "Durable", "Flexible", "Elastic",
      "Rigid", "Clear", "High Temp", "Castable", "Dental", "Biocompatible",
    ],
  },
  {
    techId: "sls",
    heading: "SLS:",
    materials: ["PA12", "PA11", "TPU", "PP", "PA12-GF", "PA-CF"],
  },
  {
    techId: "mjf",
    heading: "MJF:",
    materials: ["PA12", "PA11", "TPU", "PP"],
  },
  {
    techId: "polyjet",
    heading: "PolyJet:",
    materials: [
      "Rigid Resin", "Flexible / Rubber-Like", "Clear", "Full-Color",
      "High Temp", "Biocompatible", "Digital Materials",
    ],
  },
  {
    techId: "lpbf",
    heading: "LPBF / DMLS / SLM:",
    materials: [
      "Stainless Steel (316L, 17-4PH)", "Aluminum (AlSi10Mg)", "Titanium (Ti64)",
      "Inconel (625, 718)", "Tool Steel", "Cobalt Chrome", "Copper",
    ],
  },
  {
    techId: "ceramic",
    heading: "Concrete / Ceramic:",
    materials: [
      "Concrete", "Cementitious Materials", "Clay", "Alumina", "Zirconia",
      "Silicon Carbide", "Ceramic-Filled Resin",
    ],
  },
];

export const MATERIALS_OTHER = {
  heading: "Other:",
  label: "Other Material (Please Specify)",
} as const;

export const PRINTERS_AMOUNT_OPTIONS = [
  "Up to 10 Printers",
  "11–25 Printers",
  "More than 25 Printers",
] as const;

export const PACK_AND_SHIP_OPTIONS = ["Yes", "No"] as const;

export const MULTIPLE_ORDERS_OPTIONS = [
  "Yes, on a regular basis",
  "Yes, but only a limited number",
  "No",
] as const;

export const PRODUCTION_TIME_OPTIONS = [
  "Within 1 Business Day",
  "2–3 Business Days",
  "4–7 Business Days",
  "More than 7 Business Days",
] as const;

export const SHIPPING_DESTINY_OPTIONS = [
  "Domestic Shipping Only",
  "International Shipping",
] as const;

export const YES_NO_OPTIONS = ["Yes", "No"] as const;

export const SERVICE_OPTIONS = [
  "Post-Processing & Painting",
  "Assembly & Bonding",
  "3D Modeling & Design",
  "Quality Inspection",
] as const;

export const SERVICES_OTHER_LABEL = "Other (Please Specify)";

export const SUPPLIER_CONSENT = {
  intro: "By submitting this form, you agree to our ",
  submit: "Submit Supplier Application",
} as const;

export const SUPPLIER_CONFIRMATION = {
  title: "Thank you for your interest in joining 3D-FLY!",
  text: "We've received your application. Our team will review your details and reach out to you personally to discuss the next steps.",
  action: "Confirm",
} as const;
