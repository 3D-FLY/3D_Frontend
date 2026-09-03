import type { OrderStatusKey } from "../constants/orderStatusConfig.js";

export type NotificationReason =
  | "supplier_rejected"
  | "no_supplier"
  | "production_delay"
  | "missing_data"
  | "shipping_issue"
  | "dispute_opened"
  | "order_delivered"
  | "new_order"
  | "deadline_soon"
  | "payment_received"
  | "order_cancelled";

export type NotificationStatus = "open" | "in_progress" | "resolved";

export type NotificationRole = "admin" | "seller" | "supplier";

export interface Notification {
  id: string;
  orderId: string;
  reason: NotificationReason;
  title: string;
  description: string;
  date: string;
  status: NotificationStatus;
  isNew: boolean;
  role: NotificationRole;
}

export const mockNotifications: Notification[] = [
  { id: "a1", orderId: "#3012", reason: "supplier_rejected", title: "Supplier Rejected",    description: "Rejected by: Supplier A — reason: capacity full",     date: "2025-05-13", status: "open",        isNew: true,  role: "admin"  },
  { id: "a2", orderId: "#3015", reason: "no_supplier",       title: "No Supplier Found",   description: "No match found in Tel Aviv area for FDM/PLA",          date: "2025-05-12", status: "open",        isNew: true,  role: "admin"  },
  { id: "a3", orderId: "#3009", reason: "missing_data",      title: "Missing Data",        description: "Missing: print file for product SoldierXPT",           date: "2025-05-11", status: "in_progress", isNew: false, role: "admin"  },
  { id: "a4", orderId: "#3007", reason: "shipping_issue",    title: "Shipping Delay",      description: "Package stuck at courier for 3 days",                  date: "2025-05-10", status: "open",        isNew: true,  role: "admin"  },
  { id: "a5", orderId: "#3005", reason: "production_delay",  title: "Production Delay",    description: "Supplier reported 2-day delay on order #3005",         date: "2025-05-09", status: "resolved",    isNew: false, role: "admin"  },
  { id: "a6", orderId: "#0041", reason: "supplier_rejected", title: "Supplier Rejected",   description: "Your order was rejected by PrintLab Berlin",           date: "2025-05-13", status: "open",        isNew: true,  role: "seller" },
  { id: "a7", orderId: "#0038", reason: "shipping_issue",    title: "Shipping Delay",      description: "Your package has been delayed at the courier",         date: "2025-05-10", status: "open",        isNew: true,  role: "seller" },
  { id: "a8", orderId: "#0036", reason: "dispute_opened",    title: "Dispute Opened",      description: "A dispute has been opened on order #0036",             date: "2025-05-08", status: "in_progress", isNew: false, role: "seller" },
  { id: "a9", orderId: "#0035", reason: "order_delivered",   title: "Order Delivered",     description: "Order #0035 has been delivered successfully",          date: "2025-05-07", status: "resolved",    isNew: false, role: "seller" },
  { id: "s1", orderId: "#0041", reason: "new_order",         title: "New Order Proposed",  description: "A new print order has been assigned to you",           date: "2025-05-13", status: "open",        isNew: true,  role: "supplier" },
  { id: "s2", orderId: "#0039", reason: "deadline_soon",     title: "Deadline Approaching", description: "Order #0039 must be shipped by tomorrow",             date: "2025-05-12", status: "open",        isNew: true,  role: "supplier" },
  { id: "s3", orderId: "#0038", reason: "dispute_opened",    title: "Dispute Opened",      description: "A dispute has been opened on order #0038",             date: "2025-05-10", status: "in_progress", isNew: false, role: "supplier" },
  { id: "s4", orderId: "#0037", reason: "payment_received",  title: "Payment Received",    description: "Payment of $42.00 received for order #0037",           date: "2025-05-08", status: "resolved",    isNew: false, role: "supplier" },
  { id: "s5", orderId: "#0036", reason: "order_cancelled",   title: "Order Cancelled",     description: "Order #0036 has been cancelled by the platform",       date: "2025-05-07", status: "resolved",    isNew: false, role: "supplier" },
];

export function getNotificationsByRole(role: NotificationRole): Notification[] {
  return mockNotifications.filter((a) => a.role === role);
}

export function getNewNotificationsCount(role: NotificationRole): number {
  return mockNotifications.filter((a) => a.role === role && a.isNew).length;
}

export const NOTIFICATIONS_UPDATED_EVENT = "notifications:updated";

/** Marks all notifications for a role as seen — mutates the shared mock array in place. */
export function markNotificationsSeen(role: NotificationRole): void {
  mockNotifications.forEach((a) => {
    if (a.role === role) a.isNew = false;
  });
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}

// ─── Display config ───────────────────────────────────────────────────────────

export const NOTIFICATION_STATUS_LABEL: Record<NotificationStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export const NOTIFICATION_STATUS_DOT: Record<NotificationStatus, string> = {
  open: "bg-red-400",
  in_progress: "bg-yellow-400",
  resolved: "bg-green-400",
};

export const NOTIFICATION_STATUS_TEXT: Record<NotificationStatus, string> = {
  open: "text-red-400",
  in_progress: "text-yellow-400",
  resolved: "text-green-500",
};

export const NOTIFICATION_STATUS_BORDER: Record<NotificationStatus, string> = {
  open: "border-red-400/30",
  in_progress: "border-yellow-400/30",
  resolved: "border-green-400/30",
};

export const NOTIFICATION_STATUS_BG: Record<NotificationStatus, string> = {
  open: "bg-red-400/10",
  in_progress: "bg-yellow-400/10",
  resolved: "bg-green-400/10",
};

export const NOTIFICATION_REASON_LABEL: Record<NotificationReason, string> = {
  supplier_rejected: "Supplier Rejected",
  no_supplier:       "No Supplier Found",
  production_delay:  "Production Delay",
  missing_data:      "Missing Data",
  shipping_issue:    "Shipping Issue",
  dispute_opened:    "Dispute Opened",
  order_delivered:   "Order Delivered",
  new_order:         "New Order",
  deadline_soon:     "Deadline Approaching",
  payment_received:  "Payment Received",
  order_cancelled:   "Order Cancelled",
};

export const NOTIFICATION_REASON_ACCENT: Record<NotificationReason, string> = {
  supplier_rejected: "border-l-red-400",
  no_supplier:       "border-l-orange-400",
  production_delay:  "border-l-orange-400",
  missing_data:      "border-l-yellow-400",
  shipping_issue:    "border-l-sky-400",
  dispute_opened:    "border-l-purple-400",
  order_delivered:   "border-l-green-400",
  new_order:         "border-l-green-400",
  deadline_soon:     "border-l-yellow-400",
  payment_received:  "border-l-green-400",
  order_cancelled:   "border-l-red-400",
};

/** Returns card classes — left border = notification type. */
export function getNotificationCardClasses(reason: NotificationReason): string {
  return [
    "mb-3 flex min-h-[60px] cursor-pointer items-center gap-3 rounded-2xl",
    "border border-white/10 border-l-4 bg-[rgba(149,149,149,0.05)] px-5 py-2",
    "transition-colors hover:bg-[rgba(149,149,149,0.1)]",
    NOTIFICATION_REASON_ACCENT[reason],
  ].join(" ");
}

// ─── Linked order info (mock) ──────────────────────────────────────────────────

export interface LinkedOrderInfo {
  product: string;
  supplier: string;
  status: OrderStatusKey;
  total: number;
}

export const mockLinkedOrders: Record<string, LinkedOrderInfo> = {
  "#3012": { product: "Anime Character",    supplier: "FabLab Tokyo",     status: "issue",         total: 55.00 },
  "#3015": { product: "Robot Warrior",      supplier: "Unassigned",       status: "pending",       total: 57.00 },
  "#3009": { product: "Samurai Warrior",    supplier: "FabLab Tokyo",     status: "in_production", total: 74.00 },
  "#3007": { product: "Eiffel Tower Model", supplier: "Imprimerie Paris", status: "issue",         total: 48.50 },
  "#3005": { product: "Pirate Ship Mini",   supplier: "PrintHub TLV",     status: "shipped",       total: 29.99 },
  "#0041": { product: "SoldierXPT",         supplier: "PrintLab Berlin",  status: "in_production", total: 42.00 },
  "#0038": { product: "RocketBase",         supplier: "FabLab Tokyo",     status: "issue",         total: 89.00 },
  "#0036": { product: "DragonMini",         supplier: "PrintHub TLV",     status: "shipped",       total: 34.99 },
  "#0035": { product: "MechBot",            supplier: "PrintLab Berlin",  status: "delivered",     total: 58.00 },
  "#0039": { product: "DragonMini",         supplier: "PrintLab Berlin",  status: "in_production", total: 34.99 },
  "#0037": { product: "SoldierXPT",         supplier: "PrintLab Berlin",  status: "delivered",     total: 42.00 },
};
