export interface ProductVariant {
  id: string;
  color: string;
  colorName: string;
  material: string;
  size?: string; // optional, for future use
}

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

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  sku: string;
  image: string;
  description?: string;
  sellerPrice: number;
  supplierCost: number;
  variants: ProductVariant[];
  printSettings: PrintSettings;
  estimatedPrintTime: string;
  estimatedWeight: string;
  platforms: string[];
  createdAt: string;
  isActive: boolean;
  /** Images for the supplier only — assembly/finishing guidance, not shown to customers. */
  supplierInstructionImages?: string[] | undefined;
  /** Filename of the 3D model (STL/OBJ/3MF) the supplier prints. */
  modelFileName?: string | undefined;
}

// Helper to clone 6 base products for a given seller
function makeProductsForSeller(sellerId: string, platforms: string[]): Product[] {
  return [
    {
      id: `${sellerId}-PRD-001`, sellerId,
      name: "SoldierXPT", sku: "#001", image: "/assets/soldierxpt.png",
      description: "Highly detailed miniature soldier figure.",
      sellerPrice: 22, supplierCost: 8,
      variants: [
        { id: `${sellerId}-PRD-001-V1`, color: "#222222", colorName: "Black",  material: "PLA" },
        { id: `${sellerId}-PRD-001-V2`, color: "#facc15", colorName: "Yellow", material: "PLA" },
        { id: `${sellerId}-PRD-001-V3`, color: "#3b82f6", colorName: "Blue",   material: "ABS" },
      ],
      printSettings: { tech: "FDM", material: "PLA", layerHeight: 0.24, shells: 2, infill: 15, infillPattern: "Grid", topShellLayers: 5, bottomShellLayers: 3, support: true, brim: "Auto", brimWidth: 5, seam: "Aligned" },
      estimatedPrintTime: "12:30 Hours", estimatedWeight: "300 Grams",
      platforms, createdAt: "2025-01-15", isActive: true,
      supplierInstructionImages: ["/assets/soldierxpt.png"],
      modelFileName: "soldierxpt_v2.stl",
    },
    {
      id: `${sellerId}-PRD-002`, sellerId,
      name: "WarriorX", sku: "#002", image: "/assets/warriorx.png",
      description: "Armored warrior miniature.",
      sellerPrice: 28, supplierCost: 10,
      variants: [
        { id: `${sellerId}-PRD-002-V1`, color: "#6b7280", colorName: "Gray",  material: "ABS"  },
        { id: `${sellerId}-PRD-002-V2`, color: "#ffffff", colorName: "White", material: "PETG" },
      ],
      printSettings: { tech: "SLS", material: "ABS", layerHeight: 0.2, shells: 3, infill: 20, infillPattern: "Honeycomb", topShellLayers: 4, bottomShellLayers: 4, support: false, brim: "None", brimWidth: 0, seam: "Random" },
      estimatedPrintTime: "9:00 Hours", estimatedWeight: "220 Grams",
      platforms, createdAt: "2025-02-01", isActive: true,
    },
    {
      id: `${sellerId}-PRD-003`, sellerId,
      name: "DragonMini", sku: "#003", image: "/assets/dragonmini.png",
      description: "Detailed dragon miniature.",
      sellerPrice: 18, supplierCost: 6,
      variants: [
        { id: `${sellerId}-PRD-003-V1`, color: "#5ac422", colorName: "Green", material: "PLA"  },
        { id: `${sellerId}-PRD-003-V2`, color: "#ef4444", colorName: "Red",   material: "PLA"  },
        { id: `${sellerId}-PRD-003-V3`, color: "#3b82f6", colorName: "Blue",  material: "PETG" },
      ],
      printSettings: { tech: "FDM", material: "PLA", layerHeight: 0.2, shells: 2, infill: 10, infillPattern: "Lines", topShellLayers: 3, bottomShellLayers: 3, support: true, brim: "Auto", brimWidth: 3, seam: "Aligned" },
      estimatedPrintTime: "8:45 Hours", estimatedWeight: "180 Grams",
      platforms, createdAt: "2025-02-20", isActive: true,
    },
    {
      id: `${sellerId}-PRD-004`, sellerId,
      name: "RocketBase", sku: "#004", image: "/assets/rocketbase.png",
      description: "Rocket launch base model.",
      sellerPrice: 35, supplierCost: 14,
      variants: [
        { id: `${sellerId}-PRD-004-V1`, color: "#6b7280", colorName: "Gray",  material: "ABS" },
        { id: `${sellerId}-PRD-004-V2`, color: "#ffffff", colorName: "White", material: "ABS" },
      ],
      printSettings: { tech: "SLS", material: "ABS", layerHeight: 0.2, shells: 2, infill: 25, infillPattern: "Grid", topShellLayers: 4, bottomShellLayers: 4, support: true, brim: "Auto", brimWidth: 5, seam: "Rear" },
      estimatedPrintTime: "15:20 Hours", estimatedWeight: "450 Grams",
      platforms, createdAt: "2025-03-05", isActive: true,
    },
    {
      id: `${sellerId}-PRD-005`, sellerId,
      name: "MechBot", sku: "#005", image: "/assets/mechbot.png",
      description: "Articulated robot figure.",
      sellerPrice: 30, supplierCost: 12,
      variants: [
        { id: `${sellerId}-PRD-005-V1`, color: "#6b7280", colorName: "Gray",   material: "TPU" },
        { id: `${sellerId}-PRD-005-V2`, color: "#f97316", colorName: "Orange", material: "TPU" },
        { id: `${sellerId}-PRD-005-V3`, color: "#3b82f6", colorName: "Blue",   material: "PLA" },
      ],
      printSettings: { tech: "FDM", material: "TPU", layerHeight: 0.3, shells: 2, infill: 10, infillPattern: "Lines", topShellLayers: 3, bottomShellLayers: 3, support: false, brim: "None", brimWidth: 0, seam: "Random" },
      estimatedPrintTime: "10:15 Hours", estimatedWeight: "280 Grams",
      platforms, createdAt: "2025-03-20", isActive: true,
    },
    {
      id: `${sellerId}-PRD-006`, sellerId,
      name: "PhoenixV2", sku: "#006", image: "/assets/phoenix.png",
      description: "Phoenix bird sculpture, two-part assembly.",
      sellerPrice: 45, supplierCost: 18,
      variants: [
        { id: `${sellerId}-PRD-006-V1`, color: "#f97316", colorName: "Orange", material: "PETG" },
        { id: `${sellerId}-PRD-006-V2`, color: "#ef4444", colorName: "Red",    material: "PETG" },
        { id: `${sellerId}-PRD-006-V3`, color: "#facc15", colorName: "Gold",   material: "PLA"  },
      ],
      printSettings: { tech: "FDM", material: "PETG", layerHeight: 0.2, shells: 3, infill: 20, infillPattern: "Honeycomb", topShellLayers: 4, bottomShellLayers: 4, support: true, brim: "Auto", brimWidth: 5, seam: "Aligned" },
      estimatedPrintTime: "18:00 Hours", estimatedWeight: "520 Grams",
      platforms, createdAt: "2025-04-01", isActive: true,
    },
  ];
}

export const mockProducts: Product[] = [
  ...makeProductsForSeller("SEL-001", ["shopify", "ebay", "woocommerce"]),
  ...makeProductsForSeller("SEL-002", ["wix", "etsy"]),
  ...makeProductsForSeller("SEL-003", ["shopify", "amazon", "ebay"]),
];

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductsBySellerId(sellerId: string): Product[] {
  return mockProducts.filter((p) => p.sellerId === sellerId);
}
