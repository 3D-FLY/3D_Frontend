import type { OrderStatusKey } from "../../../constants/orderStatusConfig.js";

export interface PrintSettings {
  tech: "FDM" | "SLS" | "SLA";
  material: string;
  layerHeight: number;
  shells: number;
  infill: number;
  infillPattern: string;
  topShellLayers: number;
  bottomShellLayers: number;
  support: boolean;
  brim: string;
  brimWidth: number;
  seam: string;
}

export interface TimelineStep {
  step: string;
  date: string | null;
  done: boolean;
  active?: boolean;
}

export interface SellerOrderDetail {
  id: string;
  product: {
    name: string;
    sku: string;
    image: string;
    printSettings: PrintSettings;
  };
  customerSelection: {
    color: string;
    colorHex: string;
    quantity: number;
  };
  platforms: string[];
  supplier: { name: string; city: string };
  printTime: string;
  weight: string;
  date: string;
  status: OrderStatusKey;
  pricing: {
    unitPrice: number;
    quantity: number;
    platformFeePercent: number;
  };
  timeline: TimelineStep[];
}

export const mockOrderDetails: SellerOrderDetail[] = [
  // ── #0041 — In Production ─────────────────────────────────────────────────
  {
    id: "#0041",
    product: {
      name: "SoldierXPT",
      sku: "#001",
      image: "/mock/soldier.png",
      printSettings: {
        tech: "FDM", material: "PLA", layerHeight: 0.24, shells: 2, infill: 15,
        infillPattern: "Grid", topShellLayers: 5, bottomShellLayers: 3,
        support: true, brim: "Auto", brimWidth: 5, seam: "Aligned",
      },
    },
    customerSelection: { color: "Black", colorHex: "#222222", quantity: 2 },
    platforms: ["shopify"],
    supplier: { name: "PrintLab Berlin", city: "Berlin" },
    printTime: "12:30 Hours",
    weight: "300 Grams",
    date: "2025-05-12",
    status: "in_production",
    pricing: { unitPrice: 22, quantity: 2, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-05-12 09:14", done: true  },
      { step: "Sent to Supplier", date: "2025-05-12 09:20", done: true  },
      { step: "Printing",         date: null,               done: false, active: true },
      { step: "Shipped",          date: null,               done: false },
      { step: "Delivered",        date: null,               done: false },
    ],
  },

  // ── #0040 — Shipped ───────────────────────────────────────────────────────
  {
    id: "#0040",
    product: {
      name: "WarriorX",
      sku: "#002",
      image: "/mock/warrior.png",
      printSettings: {
        tech: "FDM", material: "PETG", layerHeight: 0.2, shells: 3, infill: 20,
        infillPattern: "Gyroid", topShellLayers: 4, bottomShellLayers: 4,
        support: false, brim: "Manual", brimWidth: 8, seam: "Random",
      },
    },
    customerSelection: { color: "Silver", colorHex: "#d1d5db", quantity: 1 },
    platforms: ["woocommerce", "ebay"],
    supplier: { name: "3D Masters NY", city: "New York" },
    printTime: "09:45 Hours",
    weight: "240 Grams",
    date: "2025-05-10",
    status: "shipped",
    pricing: { unitPrice: 67.5, quantity: 1, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-05-10 11:02", done: true  },
      { step: "Sent to Supplier", date: "2025-05-10 11:15", done: true  },
      { step: "Printing",         date: "2025-05-11 08:00", done: true  },
      { step: "Shipped",          date: "2025-05-12 14:30", done: true, active: true },
      { step: "Delivered",        date: null,               done: false },
    ],
  },

  // ── #0039 — Delivered ─────────────────────────────────────────────────────
  {
    id: "#0039",
    product: {
      name: "DragonMini",
      sku: "#003",
      image: "/mock/dragon.png",
      printSettings: {
        tech: "SLS", material: "Nylon", layerHeight: 0.1, shells: 2, infill: 25,
        infillPattern: "Triangle", topShellLayers: 3, bottomShellLayers: 3,
        support: false, brim: "None", brimWidth: 0, seam: "Sharpest Corner",
      },
    },
    customerSelection: { color: "Green", colorHex: "#22c55e", quantity: 1 },
    platforms: ["wix"],
    supplier: { name: "FormLabs TLV", city: "Tel Aviv" },
    printTime: "07:15 Hours",
    weight: "180 Grams",
    date: "2025-05-08",
    status: "delivered",
    pricing: { unitPrice: 34.99, quantity: 1, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-05-08 10:05", done: true  },
      { step: "Sent to Supplier", date: "2025-05-08 10:22", done: true  },
      { step: "Printing",         date: "2025-05-09 07:30", done: true  },
      { step: "Shipped",          date: "2025-05-10 13:00", done: true  },
      { step: "Delivered",        date: "2025-05-12 16:45", done: true, active: true },
    ],
  },

  // ── #0038 — Issue ─────────────────────────────────────────────────────────
  {
    id: "#0038",
    product: {
      name: "RocketBase",
      sku: "#004",
      image: "/mock/rocket.png",
      printSettings: {
        tech: "SLA", material: "Resin", layerHeight: 0.05, shells: 4, infill: 30,
        infillPattern: "Honeycomb", topShellLayers: 6, bottomShellLayers: 5,
        support: true, brim: "None", brimWidth: 0, seam: "Sharpest Corner",
      },
    },
    customerSelection: { color: "Red", colorHex: "#ef4444", quantity: 3 },
    platforms: ["amazon"],
    supplier: { name: "PrintLab Berlin", city: "Berlin" },
    printTime: "18:00 Hours",
    weight: "450 Grams",
    date: "2025-05-06",
    status: "issue",
    pricing: { unitPrice: 29.67, quantity: 3, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-05-06 08:55", done: true  },
      { step: "Sent to Supplier", date: "2025-05-06 09:10", done: true  },
      { step: "Printing",         date: "2025-05-07 10:00", done: true  },
      { step: "Shipped",          date: null,               done: false, active: true },
      { step: "Delivered",        date: null,               done: false },
    ],
  },

  // ── #0037 — Delivered ─────────────────────────────────────────────────────
  {
    id: "#0037",
    product: {
      name: "SoldierXPT",
      sku: "#001",
      image: "/mock/soldier.png",
      printSettings: {
        tech: "FDM", material: "PLA", layerHeight: 0.24, shells: 2, infill: 15,
        infillPattern: "Grid", topShellLayers: 5, bottomShellLayers: 3,
        support: true, brim: "Auto", brimWidth: 5, seam: "Aligned",
      },
    },
    customerSelection: { color: "White", colorHex: "#f9fafb", quantity: 1 },
    platforms: ["shopify", "ebay"],
    supplier: { name: "3D Masters NY", city: "New York" },
    printTime: "12:30 Hours",
    weight: "300 Grams",
    date: "2025-05-03",
    status: "delivered",
    pricing: { unitPrice: 42, quantity: 1, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-05-03 08:00", done: true  },
      { step: "Sent to Supplier", date: "2025-05-03 08:15", done: true  },
      { step: "Printing",         date: "2025-05-04 09:00", done: true  },
      { step: "Shipped",          date: "2025-05-05 11:30", done: true  },
      { step: "Delivered",        date: "2025-05-07 14:20", done: true, active: true },
    ],
  },

  // ── #0036 — Shipped ───────────────────────────────────────────────────────
  {
    id: "#0036",
    product: {
      name: "DragonMini",
      sku: "#003",
      image: "/mock/dragon.png",
      printSettings: {
        tech: "SLS", material: "Nylon", layerHeight: 0.1, shells: 2, infill: 25,
        infillPattern: "Triangle", topShellLayers: 3, bottomShellLayers: 3,
        support: false, brim: "None", brimWidth: 0, seam: "Sharpest Corner",
      },
    },
    customerSelection: { color: "Blue", colorHex: "#3b82f6", quantity: 2 },
    platforms: ["etsy"],
    supplier: { name: "FormLabs TLV", city: "Tel Aviv" },
    printTime: "07:15 Hours",
    weight: "360 Grams",
    date: "2025-04-30",
    status: "shipped",
    pricing: { unitPrice: 34.99, quantity: 2, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-04-30 09:40", done: true  },
      { step: "Sent to Supplier", date: "2025-04-30 10:00", done: true  },
      { step: "Printing",         date: "2025-05-01 08:00", done: true  },
      { step: "Shipped",          date: "2025-05-02 12:00", done: true, active: true },
      { step: "Delivered",        date: null,               done: false },
    ],
  },

  // ── #0035 — Delivered ─────────────────────────────────────────────────────
  {
    id: "#0035",
    product: {
      name: "MechBot",
      sku: "#005",
      image: "/mock/mech.png",
      printSettings: {
        tech: "FDM", material: "ABS", layerHeight: 0.3, shells: 3, infill: 20,
        infillPattern: "Lines", topShellLayers: 4, bottomShellLayers: 4,
        support: true, brim: "Auto", brimWidth: 6, seam: "Random",
      },
    },
    customerSelection: { color: "Gray", colorHex: "#9ca3af", quantity: 1 },
    platforms: ["shopify"],
    supplier: { name: "PrintLab Berlin", city: "Berlin" },
    printTime: "15:00 Hours",
    weight: "420 Grams",
    date: "2025-04-28",
    status: "delivered",
    pricing: { unitPrice: 58, quantity: 1, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-04-28 11:00", done: true  },
      { step: "Sent to Supplier", date: "2025-04-28 11:20", done: true  },
      { step: "Printing",         date: "2025-04-29 09:00", done: true  },
      { step: "Shipped",          date: "2025-04-30 10:00", done: true  },
      { step: "Delivered",        date: "2025-05-02 15:30", done: true, active: true },
    ],
  },

  // ── #0034 — In Production ─────────────────────────────────────────────────
  {
    id: "#0034",
    product: {
      name: "WarriorX",
      sku: "#002",
      image: "/mock/warrior.png",
      printSettings: {
        tech: "FDM", material: "PETG", layerHeight: 0.2, shells: 3, infill: 20,
        infillPattern: "Gyroid", topShellLayers: 4, bottomShellLayers: 4,
        support: false, brim: "Manual", brimWidth: 8, seam: "Random",
      },
    },
    customerSelection: { color: "Orange", colorHex: "#f97316", quantity: 1 },
    platforms: ["woocommerce"],
    supplier: { name: "3D Masters NY", city: "New York" },
    printTime: "09:45 Hours",
    weight: "240 Grams",
    date: "2025-04-25",
    status: "in_production",
    pricing: { unitPrice: 67.5, quantity: 1, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-04-25 10:30", done: true  },
      { step: "Sent to Supplier", date: "2025-04-25 10:45", done: true  },
      { step: "Printing",         date: null,               done: false, active: true },
      { step: "Shipped",          date: null,               done: false },
      { step: "Delivered",        date: null,               done: false },
    ],
  },

  // ── #0033 — Delivered ─────────────────────────────────────────────────────
  {
    id: "#0033",
    product: {
      name: "RocketBase",
      sku: "#004",
      image: "/mock/rocket.png",
      printSettings: {
        tech: "SLA", material: "Resin", layerHeight: 0.05, shells: 4, infill: 30,
        infillPattern: "Honeycomb", topShellLayers: 6, bottomShellLayers: 5,
        support: true, brim: "None", brimWidth: 0, seam: "Sharpest Corner",
      },
    },
    customerSelection: { color: "Purple", colorHex: "#a855f7", quantity: 1 },
    platforms: ["shopify", "amazon"],
    supplier: { name: "PrintLab Berlin", city: "Berlin" },
    printTime: "18:00 Hours",
    weight: "450 Grams",
    date: "2025-04-22",
    status: "delivered",
    pricing: { unitPrice: 89, quantity: 1, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-04-22 09:00", done: true  },
      { step: "Sent to Supplier", date: "2025-04-22 09:15", done: true  },
      { step: "Printing",         date: "2025-04-23 08:00", done: true  },
      { step: "Shipped",          date: "2025-04-24 12:30", done: true  },
      { step: "Delivered",        date: "2025-04-26 17:00", done: true, active: true },
    ],
  },

  // ── #0032 — Issue ─────────────────────────────────────────────────────────
  {
    id: "#0032",
    product: {
      name: "PhoenixV2",
      sku: "#006",
      image: "/mock/phoenix.png",
      printSettings: {
        tech: "SLS", material: "Nylon", layerHeight: 0.12, shells: 3, infill: 18,
        infillPattern: "Stars", topShellLayers: 4, bottomShellLayers: 3,
        support: true, brim: "Auto", brimWidth: 4, seam: "Aligned",
      },
    },
    customerSelection: { color: "Yellow", colorHex: "#eab308", quantity: 1 },
    platforms: ["ebay"],
    supplier: { name: "FormLabs TLV", city: "Tel Aviv" },
    printTime: "14:20 Hours",
    weight: "390 Grams",
    date: "2025-04-19",
    status: "issue",
    pricing: { unitPrice: 75, quantity: 1, platformFeePercent: 10 },
    timeline: [
      { step: "Order Placed",     date: "2025-04-19 08:30", done: true  },
      { step: "Sent to Supplier", date: "2025-04-19 08:50", done: true  },
      { step: "Printing",         date: "2025-04-20 09:00", done: true  },
      { step: "Shipped",          date: null,               done: false, active: true },
      { step: "Delivered",        date: null,               done: false },
    ],
  },
];
