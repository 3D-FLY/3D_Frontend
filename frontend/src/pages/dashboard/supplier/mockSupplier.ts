export type SupplierOrderStatus = "proposed" | "accepted" | "printing" | "done" | "shipped" | "cancelled";

export interface SupplierOrder {
  id: string;
  productName: string;
  productImage: string;
  // storeName is intentionally hidden from the supplier UI
  storeName: string;
  tech: string;
  material: string;
  color: string;
  quantity: number;
  shippingAddress: string;
  deadline: string;
  date: string;
  status: SupplierOrderStatus;
  payment: number;
  printSettings: {
    tech: string; material: string; layerHeight: number; shells: number;
    infill: number; infillPattern: string; support: boolean; brim: string;
  };
}

export const mockSupplierOrders: SupplierOrder[] = [
  {
    id: "#0041", productName: "SoldierXPT", productImage: "",
    // storeName is intentionally hidden from the supplier UI
    storeName: "Raz3DPrints",
    tech: "FDM", material: "PLA", color: "Black", quantity: 2,
    shippingAddress: "123 Main St, Tel Aviv, Israel",
    deadline: "2025-05-15", date: "2025-05-12", status: "proposed", payment: 42.00,
    printSettings: { tech: "FDM", material: "PLA", layerHeight: 0.24, shells: 2, infill: 15, infillPattern: "Grid", support: true, brim: "Auto" },
  },
  {
    id: "#0039", productName: "DragonMini", productImage: "",
    // storeName is intentionally hidden from the supplier UI
    storeName: "Mini World",
    tech: "FDM", material: "PETG", color: "Green", quantity: 1,
    shippingAddress: "45 Oak Ave, Berlin, Germany",
    deadline: "2025-05-14", date: "2025-05-10", status: "printing", payment: 34.99,
    printSettings: { tech: "FDM", material: "PETG", layerHeight: 0.2, shells: 3, infill: 20, infillPattern: "Honeycomb", support: false, brim: "None" },
  },
  {
    id: "#0038", productName: "RocketBase", productImage: "",
    // storeName is intentionally hidden from the supplier UI
    storeName: "Galaxy Toys",
    tech: "SLS", material: "ABS", color: "White", quantity: 3,
    shippingAddress: "78 Park Rd, New York, USA",
    deadline: "2025-05-16", date: "2025-05-08", status: "accepted", payment: 89.00,
    printSettings: { tech: "SLS", material: "ABS", layerHeight: 0.2, shells: 2, infill: 25, infillPattern: "Grid", support: true, brim: "Auto" },
  },
  {
    id: "#0037", productName: "SoldierXPT", productImage: "",
    // storeName is intentionally hidden from the supplier UI
    storeName: "Raz3DPrints",
    tech: "FDM", material: "PLA", color: "Yellow", quantity: 1,
    shippingAddress: "123 Main St, Tel Aviv, Israel",
    deadline: "2025-05-10", date: "2025-05-03", status: "shipped", payment: 42.00,
    printSettings: { tech: "FDM", material: "PLA", layerHeight: 0.24, shells: 2, infill: 15, infillPattern: "Grid", support: true, brim: "Auto" },
  },
  {
    id: "#0036", productName: "MechBot", productImage: "",
    // storeName is intentionally hidden from the supplier UI
    storeName: "Print & Play",
    tech: "FDM", material: "TPU", color: "Gray", quantity: 2,
    shippingAddress: "90 River St, London, UK",
    deadline: "2025-05-09", date: "2025-04-30", status: "done", payment: 58.00,
    printSettings: { tech: "FDM", material: "TPU", layerHeight: 0.3, shells: 2, infill: 10, infillPattern: "Lines", support: false, brim: "None" },
  },
];

export interface SupplierCapabilities {
  isActive: boolean;
  technologies: string[];
  materials: string[];
  colors: string[];
  printerCount: number;
  maxParallelJobs: number;
  workingHours: { from: string; to: string };
}

export const mockCapabilities: SupplierCapabilities = {
  isActive: true,
  technologies: ["FDM", "SLS"],
  materials: ["PLA", "ABS", "PETG", "TPU"],
  colors: ["#222222", "#ffffff", "#facc15", "#3b82f6", "#5ac422"],
  printerCount: 3,
  maxParallelJobs: 2,
  workingHours: { from: "08:00", to: "18:00" },
};

// ─── Status display config ─────────────────────────────────────────────────────

export const SUPPLIER_STATUS_LABEL: Record<SupplierOrderStatus, string> = {
  proposed: "Proposed",
  accepted: "Accepted",
  printing: "Printing",
  done: "Done",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

export const SUPPLIER_STATUS_COLOR: Record<SupplierOrderStatus, string> = {
  proposed: "#3b82f6",
  accepted: "#22a8c4",
  printing: "#5ac422",
  done: "#a855f7",
  shipped: "#6b7280",
  cancelled: "#ef4444",
};

// ─── Payment history (mock) ────────────────────────────────────────────────────

export type SupplierPaymentStatus = "paid" | "pending";

export interface SupplierPayment {
  orderId: string;
  date: string;
  amount: string;
  status: SupplierPaymentStatus;
}

export const mockSupplierPayments: SupplierPayment[] = [
  { orderId: "#0037", date: "2025-05-08", amount: "$42.00", status: "paid" },
  { orderId: "#0035", date: "2025-05-01", amount: "$58.00", status: "paid" },
  { orderId: "#0033", date: "2025-04-22", amount: "$34.99", status: "paid" },
  { orderId: "#0041", date: "2025-05-12", amount: "$42.00", status: "pending" },
  { orderId: "#0038", date: "2025-05-08", amount: "$89.00", status: "pending" },
];

export const mockSupplierRevenue = [
  { month: "Dec", earnings: 210 },
  { month: "Jan", earnings: 260 },
  { month: "Feb", earnings: 300 },
  { month: "Mar", earnings: 280 },
  { month: "Apr", earnings: 360 },
  { month: "May", earnings: 340 },
];
