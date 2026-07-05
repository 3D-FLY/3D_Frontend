import type { OrderStatusKey } from "../../../constants/orderStatusConfig.js";

export interface PrintSettings {
  tech: string;
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

export interface RecentOrder {
  id: string;
  date: string;
  status: OrderStatusKey;
  total: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  cost: number;
  price: number;
  stores: string[];
  printSettings: PrintSettings;
  details: {
    printTime: string;
    weight: string;
    colors: string[];
  };
  recentOrders: RecentOrder[];
}

export interface ProductForm {
  name: string;
  sku: string;
  cost: string;
  price: string;
  stores: string[];
}

const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  tech: "FDM", material: "PLA", layerHeight: 0.2, shells: 2, infill: 15,
  infillPattern: "Grid", topShellLayers: 4, bottomShellLayers: 3,
  support: false, brim: "None", brimWidth: 0, seam: "Aligned",
};

export { DEFAULT_PRINT_SETTINGS };

const STORAGE_KEY = "seller_products";

export function getProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Product[]) : mockProducts;
  } catch {
    return mockProducts;
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const mockProducts: Product[] = [
  {
    id: "p001",
    name: "SoldierXPT",
    sku: "#001",
    image: "/mock/soldier.png",
    cost: 8,
    price: 22,
    stores: ["shopify", "ebay", "woocommerce"],
    printSettings: {
      tech: "FDM", material: "PLA", layerHeight: 0.24, shells: 2, infill: 15,
      infillPattern: "Grid", topShellLayers: 5, bottomShellLayers: 3,
      support: true, brim: "Auto", brimWidth: 5, seam: "Aligned",
    },
    details: { printTime: "12:30 Hours", weight: "300 Grams", colors: ["Black", "Yellow", "Blue"] },
    recentOrders: [
      { id: "#0041", date: "2025-05-12", status: "in_production", total: 22 },
      { id: "#0037", date: "2025-05-03", status: "delivered",     total: 22 },
    ],
  },
  {
    id: "p002",
    name: "WarriorX",
    sku: "#002",
    image: "/mock/warrior.png",
    cost: 10,
    price: 28,
    stores: ["shopify", "wix"],
    printSettings: {
      tech: "SLS", material: "ABS", layerHeight: 0.2, shells: 3, infill: 20,
      infillPattern: "Honeycomb", topShellLayers: 4, bottomShellLayers: 4,
      support: false, brim: "Manual", brimWidth: 3, seam: "Random",
    },
    details: { printTime: "9:00 Hours", weight: "220 Grams", colors: ["Gray", "White"] },
    recentOrders: [
      { id: "#0040", date: "2025-05-10", status: "shipped", total: 28 },
    ],
  },
  {
    id: "p003",
    name: "DragonMini",
    sku: "#003",
    image: "/mock/dragon.png",
    cost: 6,
    price: 18,
    stores: ["wix", "ebay"],
    printSettings: {
      tech: "FDM", material: "PETG", layerHeight: 0.2, shells: 2, infill: 15,
      infillPattern: "Lines", topShellLayers: 4, bottomShellLayers: 3,
      support: true, brim: "Auto", brimWidth: 4, seam: "Back",
    },
    details: { printTime: "8:45 Hours", weight: "180 Grams", colors: ["Green", "Red", "Black"] },
    recentOrders: [
      { id: "#0039", date: "2025-05-08", status: "delivered", total: 18 },
      { id: "#0036", date: "2025-04-30", status: "shipped",   total: 18 },
    ],
  },
  {
    id: "p004",
    name: "RocketBase",
    sku: "#004",
    image: "/mock/rocket.png",
    cost: 14,
    price: 35,
    stores: ["amazon", "shopify"],
    printSettings: {
      tech: "SLS", material: "ABS", layerHeight: 0.15, shells: 3, infill: 25,
      infillPattern: "Hexagon", topShellLayers: 5, bottomShellLayers: 4,
      support: false, brim: "Manual", brimWidth: 3, seam: "Random",
    },
    details: { printTime: "15:20 Hours", weight: "450 Grams", colors: ["Gray", "White"] },
    recentOrders: [
      { id: "#0038", date: "2025-05-06", status: "issue",     total: 35 },
      { id: "#0033", date: "2025-04-22", status: "delivered", total: 35 },
    ],
  },
  {
    id: "p005",
    name: "MechBot",
    sku: "#005",
    image: "/mock/mech.png",
    cost: 12,
    price: 30,
    stores: ["shopify", "woocommerce", "amazon"],
    printSettings: {
      tech: "FDM", material: "PETG", layerHeight: 0.28, shells: 2, infill: 20,
      infillPattern: "Lines", topShellLayers: 4, bottomShellLayers: 3,
      support: true, brim: "None", brimWidth: 0, seam: "Back",
    },
    details: { printTime: "10:15 Hours", weight: "280 Grams", colors: ["Silver", "Orange", "Black"] },
    recentOrders: [
      { id: "#0035", date: "2025-04-28", status: "delivered", total: 30 },
    ],
  },
];
