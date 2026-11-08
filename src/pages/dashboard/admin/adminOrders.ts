import type { OrderStatusKey } from "../../../constants/orderStatusConfig.js";
import { mockOrders, type Order } from "../../../data/mockOrders.js";
import { mockSellers } from "../../../data/mockSellers.js";
import { mockSuppliers } from "../../../data/mockSuppliers.js";
import { mockProducts } from "../../../data/mockProducts.js";

// Admin adapter: derives the admin order rows from the shared mock data in src/data.

export interface AdminOrderItem {
  name: string;
  material: string;
  color: string;
  qty: number;
  unitPrice: string;
}

export interface AdminOrderIssue {
  type: string;
  detail: string;
}

export interface AdminOrderRow {
  id: string;
  orderId: string;
  store: string;
  status: OrderStatusKey;
  date: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  total: string;
  supplier: string | null;
  tracking: string | null;
  issue: AdminOrderIssue | null;
  items: AdminOrderItem[];
}

function buildOrderRow(o: Order): AdminOrderRow {
  const seller = mockSellers.find((s) => s.id === o.sellerId);
  const supplier = mockSuppliers.find((s) => s.id === o.supplierId);
  const product = mockProducts.find((p) => p.id === o.productId);

  return {
    id: o.id.replace("#", ""),
    orderId: o.id.replace("#", ""),
    store: seller?.name ?? "Unknown",
    status: o.status,
    date: o.createdAt,
    customer: "Unknown",
    email: "Unknown",
    phone: "Unknown",
    address: `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.country}`,
    total: `$${(o.sellerPrice * o.quantity).toFixed(2)}`,
    supplier: supplier?.name ?? null,
    tracking: null,
    issue:
      o.status === "issue"
        ? { type: "shipping_issue", detail: "There is an issue with this order that requires attention." }
        : null,
    items: [
      {
        name: product?.name ?? "Unknown",
        material: o.material,
        color: o.colorName,
        qty: o.quantity,
        unitPrice: `$${o.sellerPrice.toFixed(2)}`,
      },
    ],
  };
}

export const ADMIN_ORDERS: AdminOrderRow[] = mockOrders.map(buildOrderRow);

/** Looks up an order by its id without the "#" (the form used in URLs). */
export function getAdminOrderById(id: string | undefined): AdminOrderRow | undefined {
  return ADMIN_ORDERS.find((o) => o.orderId === id);
}

export function adminOrderPath(orderId: string): string {
  return `/dashboard/admin/orders/${orderId}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export const ISSUE_TYPE_LABEL: Record<string, string> = {
  supplier_rejected: "Supplier Rejected",
  shipping_issue:    "Shipping Issue",
  missing_data:      "Missing Data",
  no_supplier:       "No Supplier Found",
  production_delay:  "Production Delay",
};
