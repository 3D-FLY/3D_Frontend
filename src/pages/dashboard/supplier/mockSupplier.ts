import { mockSuppliers } from "../../../data/mockSuppliers.js";
import { mockOrders } from "../../../data/mockOrders.js";
import { mockProducts } from "../../../data/mockProducts.js";
import { CURRENT_SUPPLIER_ID } from "../../../data/currentUser.js";
import type { OrderStatusKey } from "../../../constants/orderStatusConfig.js";

export interface SupplierOrder {
  id: string;
  productName: string;
  productImage: string;
  // storeName is intentionally hidden from the supplier UI
  storeName: string;
  tech: string;
  material: string;
  color: string;
  colorHex: string;
  quantity: number;
  shippingAddress: string;
  deadline: string;
  date: string;
  status: OrderStatusKey;
  payment: number;
  printSettings: {
    tech: string; material: string; layerHeight: number; shells: number;
    infill: number; infillPattern: string; support: boolean; brim: string;
  };
  supplierInstructionImages: string[];
  modelFileName: string;
}

export function getSupplierOrders(supplierId = CURRENT_SUPPLIER_ID): SupplierOrder[] {
  return mockOrders
    .filter((o) => o.supplierId === supplierId)
    .map((o) => {
      const product = mockProducts.find((p) => p.id === o.productId);
      return {
        id: o.id,
        productName: product?.name ?? "Unknown",
        productImage: product?.image ?? "",
        storeName: "Unknown",
        tech: product?.printSettings.tech ?? "—",
        material: o.material,
        color: o.colorName,
        colorHex: o.color,
        quantity: o.quantity,
        shippingAddress: `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.country}`,
        deadline: o.createdAt,
        date: o.createdAt,
        status: o.status,
        payment: o.supplierCost * o.quantity,
        printSettings: product?.printSettings ?? {
          tech: "FDM", material: "PLA", layerHeight: 0.2, shells: 2,
          infill: 15, infillPattern: "Grid", support: false, brim: "None",
        },
        supplierInstructionImages: product?.supplierInstructionImages ?? [],
        modelFileName: product?.modelFileName ?? "",
      };
    });
}

export interface SupplierCapabilities {
  isActive: boolean;
  technologies: string[];
  materials: string[];
  colors: string[];
  printerCount: number;
  maxParallelJobs: number;
  workingHours: { from: string; to: string };
}

const currentSupplier = mockSuppliers.find((s) => s.id === CURRENT_SUPPLIER_ID);

export const mockCapabilities: SupplierCapabilities = {
  isActive: currentSupplier?.capabilities?.isActive ?? true,
  technologies: currentSupplier?.technologies ?? ["FDM", "SLS"],
  materials: currentSupplier?.materials ?? ["PLA", "ABS", "PETG", "TPU"],
  colors: currentSupplier?.colors ?? ["#222222", "#ffffff", "#facc15", "#3b82f6", "#5ac422"],
  printerCount: currentSupplier?.capabilities?.printerCount ?? 1,
  maxParallelJobs: currentSupplier?.capabilities?.maxParallelJobs ?? 1,
  workingHours: currentSupplier?.capabilities?.workingHours ?? { from: "09:00", to: "17:00" },
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
