import type { OrderStatusKey } from "../constants/orderStatusConfig.js";

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
}

export interface TimelineStep {
  step: string;
  date: string | null;
  done: boolean;
  active?: boolean;
}

export interface Order {
  id: string;
  productId: string;
  sellerId: string;
  supplierId: string;
  platform: string;
  material: string;
  color: string;
  colorName: string;
  quantity: number;
  shippingAddress: ShippingAddress;
  status: OrderStatusKey;
  createdAt: string;
  sellerPrice: number;
  supplierCost: number;
  platformFee: number;
  timeline: TimelineStep[];
}

const DONE_TIMELINE = (d1: string, d2: string, d3: string, d4: string, d5: string): TimelineStep[] => [
  { step: "Order Placed",     date: d1, done: true  },
  { step: "Sent to Supplier", date: d2, done: true  },
  { step: "Printer",          date: d3, done: true  },
  { step: "Shipped",          date: d4, done: true  },
  { step: "DONE",        date: d5, done: true  },
];

const SHIPPED_TIMELINE = (d1: string, d2: string, d3: string, d4: string): TimelineStep[] => [
  { step: "Order Placed",     date: d1, done: true  },
  { step: "Sent to Supplier", date: d2, done: true  },
  { step: "Printer",          date: d3, done: true  },
  { step: "Shipped",          date: d4, done: true, active: true },
  { step: "DONE",        date: null, done: false },
];

const PRINTING_TIMELINE = (d1: string, d2: string): TimelineStep[] => [
  { step: "Order Placed",     date: d1, done: true  },
  { step: "Sent to Supplier", date: d2, done: true  },
  { step: "Printer",          date: null, done: false, active: true },
  { step: "Shipped",          date: null, done: false },
  { step: "DONE",        date: null, done: false },
];

const ISSUE_TIMELINE = (d1: string, d2: string, d3: string): TimelineStep[] => [
  { step: "Order Placed",     date: d1, done: true  },
  { step: "Sent to Supplier", date: d2, done: true  },
  { step: "Printer",          date: d3, done: true  },
  { step: "Shipped",          date: null, done: false, active: true },
  { step: "DONE",        date: null, done: false },
];

const PENDING_TIMELINE = (d1: string): TimelineStep[] => [
  { step: "Order Placed",     date: d1, done: true, active: true },
  { step: "Sent to Supplier", date: null, done: false },
  { step: "Printer",          date: null, done: false },
  { step: "Shipped",          date: null, done: false },
  { step: "DONE",        date: null, done: false },
];

const ACCEPTED_TIMELINE = (d1: string, d2: string): TimelineStep[] => [
  { step: "Order Placed",     date: d1, done: true  },
  { step: "Sent to Supplier", date: d2, done: true, active: true },
  { step: "Printer",          date: null, done: false },
  { step: "Shipped",          date: null, done: false },
  { step: "DONE",        date: null, done: false },
];

const READY_TIMELINE = (d1: string, d2: string, d3: string): TimelineStep[] => [
  { step: "Order Placed",     date: d1, done: true  },
  { step: "Sent to Supplier", date: d2, done: true  },
  { step: "Printer",          date: d3, done: true, active: true },
  { step: "Shipped",          date: null, done: false },
  { step: "DONE",        date: null, done: false },
];

const CANCELLED_TIMELINE = (d1: string): TimelineStep[] => [
  { step: "Order Placed",     date: d1, done: true  },
  { step: "Sent to Supplier", date: null, done: false },
  { step: "Printer",          date: null, done: false },
  { step: "Shipped",          date: null, done: false },
  { step: "DONE",        date: null, done: false },
];

export const mockOrders: Order[] = [
  {
    id: "#0041", productId: "SEL-001-PRD-001", sellerId: "SEL-001", supplierId: "SUP-001",
    platform: "shopify", material: "PLA", color: "#222222", colorName: "Black", quantity: 2,
    shippingAddress: { street: "45 Baker Street", city: "London", country: "UK" },
    status: "in_production", createdAt: "2025-05-12T09:14:00Z",
    sellerPrice: 22, supplierCost: 8, platformFee: 4.4,
    timeline: PRINTING_TIMELINE("2025-05-12 09:14", "2025-05-12 09:20"),
  },
  {
    id: "#0040", productId: "SEL-001-PRD-002", sellerId: "SEL-001", supplierId: "SUP-002",
    platform: "woocommerce", material: "PETG", color: "#d1d5db", colorName: "Silver", quantity: 1,
    shippingAddress: { street: "12 Fifth Avenue", city: "New York", country: "USA" },
    status: "shipped", createdAt: "2025-05-10T11:02:00Z",
    sellerPrice: 67.5, supplierCost: 10, platformFee: 6.75,
    timeline: SHIPPED_TIMELINE("2025-05-10 11:02", "2025-05-10 11:15", "2025-05-11 08:00", "2025-05-12 14:30"),
  },
  {
    id: "#0039", productId: "SEL-001-PRD-003", sellerId: "SEL-001", supplierId: "SUP-003",
    platform: "wix", material: "Nylon", color: "#22c55e", colorName: "Green", quantity: 1,
    shippingAddress: { street: "8 Rothschild Blvd", city: "Tel Aviv", country: "Israel" },
    status: "delivered", createdAt: "2025-05-08T10:05:00Z",
    sellerPrice: 34.99, supplierCost: 6, platformFee: 3.5,
    timeline: DONE_TIMELINE("2025-05-08 10:05", "2025-05-08 10:22", "2025-05-09 07:30", "2025-05-10 13:00", "2025-05-12 16:45"),
  },
  {
    id: "#0038", productId: "SEL-001-PRD-004", sellerId: "SEL-001", supplierId: "SUP-001",
    platform: "amazon", material: "Resin", color: "#ef4444", colorName: "Red", quantity: 3,
    shippingAddress: { street: "22 Friedrichstraße", city: "Berlin", country: "Germany" },
    status: "issue", createdAt: "2025-05-06T08:55:00Z",
    sellerPrice: 29.67, supplierCost: 14, platformFee: 8.9,
    timeline: ISSUE_TIMELINE("2025-05-06 08:55", "2025-05-06 09:10", "2025-05-07 10:00"),
  },
  {
    id: "#0037", productId: "SEL-001-PRD-001", sellerId: "SEL-001", supplierId: "SUP-002",
    platform: "shopify", material: "PLA", color: "#f9fafb", colorName: "White", quantity: 1,
    shippingAddress: { street: "200 Broadway", city: "New York", country: "USA" },
    status: "delivered", createdAt: "2025-05-03T08:00:00Z",
    sellerPrice: 42, supplierCost: 8, platformFee: 4.2,
    timeline: DONE_TIMELINE("2025-05-03 08:00", "2025-05-03 08:15", "2025-05-04 09:00", "2025-05-05 11:30", "2025-05-07 14:20"),
  },
  {
    id: "#0036", productId: "SEL-001-PRD-003", sellerId: "SEL-001", supplierId: "SUP-003",
    platform: "etsy", material: "PETG", color: "#3b82f6", colorName: "Blue", quantity: 2,
    shippingAddress: { street: "5 HaYarkon Street", city: "Tel Aviv", country: "Israel" },
    status: "shipped", createdAt: "2025-04-30T09:40:00Z",
    sellerPrice: 34.99, supplierCost: 6, platformFee: 7.0,
    timeline: SHIPPED_TIMELINE("2025-04-30 09:40", "2025-04-30 10:00", "2025-05-01 08:00", "2025-05-02 12:00"),
  },
  {
    id: "#0035", productId: "SEL-001-PRD-005", sellerId: "SEL-001", supplierId: "SUP-001",
    platform: "shopify", material: "ABS", color: "#9ca3af", colorName: "Gray", quantity: 1,
    shippingAddress: { street: "31 Unter den Linden", city: "Berlin", country: "Germany" },
    status: "delivered", createdAt: "2025-04-28T11:00:00Z",
    sellerPrice: 58, supplierCost: 12, platformFee: 5.8,
    timeline: DONE_TIMELINE("2025-04-28 11:00", "2025-04-28 11:20", "2025-04-29 09:00", "2025-04-30 10:00", "2025-05-02 15:30"),
  },
  {
    id: "#0034", productId: "SEL-001-PRD-002", sellerId: "SEL-001", supplierId: "SUP-002",
    platform: "woocommerce", material: "PETG", color: "#f97316", colorName: "Orange", quantity: 1,
    shippingAddress: { street: "88 Wall Street", city: "New York", country: "USA" },
    status: "in_production", createdAt: "2025-04-25T10:30:00Z",
    sellerPrice: 67.5, supplierCost: 10, platformFee: 6.75,
    timeline: PRINTING_TIMELINE("2025-04-25 10:30", "2025-04-25 10:45"),
  },
  {
    id: "#0033", productId: "SEL-001-PRD-004", sellerId: "SEL-001", supplierId: "SUP-001",
    platform: "shopify", material: "Resin", color: "#a855f7", colorName: "Purple", quantity: 1,
    shippingAddress: { street: "14 Alexanderplatz", city: "Berlin", country: "Germany" },
    status: "delivered", createdAt: "2025-04-22T09:00:00Z",
    sellerPrice: 89, supplierCost: 14, platformFee: 8.9,
    timeline: DONE_TIMELINE("2025-04-22 09:00", "2025-04-22 09:15", "2025-04-23 08:00", "2025-04-24 12:30", "2025-04-26 17:00"),
  },
  {
    id: "#0032", productId: "SEL-001-PRD-006", sellerId: "SEL-001", supplierId: "SUP-003",
    platform: "ebay", material: "Nylon", color: "#eab308", colorName: "Yellow", quantity: 1,
    shippingAddress: { street: "17 Dizengoff Street", city: "Tel Aviv", country: "Israel" },
    status: "issue", createdAt: "2025-04-19T08:30:00Z",
    sellerPrice: 75, supplierCost: 18, platformFee: 7.5,
    timeline: ISSUE_TIMELINE("2025-04-19 08:30", "2025-04-19 08:50", "2025-04-20 09:00"),
  },
  {
    id: "#0042", productId: "SEL-001-PRD-001", sellerId: "SEL-001", supplierId: "SUP-001",
    platform: "shopify", material: "PLA", color: "#3b82f6", colorName: "Blue", quantity: 1,
    shippingAddress: { street: "9 Kurfürstendamm", city: "Berlin", country: "Germany" },
    status: "pending", createdAt: "2025-05-14T09:00:00Z",
    sellerPrice: 22, supplierCost: 8, platformFee: 2.2,
    timeline: PENDING_TIMELINE("2025-05-14 09:00"),
  },
  {
    id: "#0046", productId: "SEL-003-PRD-004", sellerId: "SEL-003", supplierId: "SUP-001",
    platform: "amazon", material: "ABS", color: "#6b7280", colorName: "Gray", quantity: 2,
    shippingAddress: { street: "55 Potsdamer Platz", city: "Berlin", country: "Germany" },
    status: "pending", createdAt: "2025-05-14T13:20:00Z",
    sellerPrice: 35, supplierCost: 14, platformFee: 7.0,
    timeline: PENDING_TIMELINE("2025-05-14 13:20"),
  },
  {
    id: "#0043", productId: "SEL-002-PRD-003", sellerId: "SEL-002", supplierId: "SUP-001",
    platform: "wix", material: "PLA", color: "#5ac422", colorName: "Green", quantity: 1,
    shippingAddress: { street: "3 Torstraße", city: "Berlin", country: "Germany" },
    status: "accepted", createdAt: "2025-05-13T10:00:00Z",
    sellerPrice: 18, supplierCost: 6, platformFee: 1.8,
    timeline: ACCEPTED_TIMELINE("2025-05-13 10:00", "2025-05-13 10:10"),
  },
  {
    id: "#0047", productId: "SEL-001-PRD-002", sellerId: "SEL-001", supplierId: "SUP-001",
    platform: "ebay", material: "ABS", color: "#6b7280", colorName: "Gray", quantity: 1,
    shippingAddress: { street: "77 Prenzlauer Allee", city: "Berlin", country: "Germany" },
    status: "shipped", createdAt: "2025-05-14T08:00:00Z",
    sellerPrice: 28, supplierCost: 10, platformFee: 2.8,
    timeline: SHIPPED_TIMELINE("2025-05-14 08:00", "2025-05-14 08:15", "2025-05-14 20:00", "2025-05-15 09:00"),
  },
  {
    id: "#0044", productId: "SEL-003-PRD-002", sellerId: "SEL-003", supplierId: "SUP-004",
    platform: "amazon", material: "ABS", color: "#ffffff", colorName: "White", quantity: 1,
    shippingAddress: { street: "10 Oxford Street", city: "London", country: "UK" },
    status: "ready", createdAt: "2025-05-11T09:00:00Z",
    sellerPrice: 28, supplierCost: 10, platformFee: 2.8,
    timeline: READY_TIMELINE("2025-05-11 09:00", "2025-05-11 09:20", "2025-05-12 12:00"),
  },
  {
    id: "#0045", productId: "SEL-002-PRD-001", sellerId: "SEL-002", supplierId: "SUP-005",
    platform: "etsy", material: "PLA", color: "#facc15", colorName: "Yellow", quantity: 1,
    shippingAddress: { street: "2-1 Shibuya", city: "Tokyo", country: "Japan" },
    status: "cancelled", createdAt: "2025-05-04T09:00:00Z",
    sellerPrice: 22, supplierCost: 8, platformFee: 0,
    timeline: CANCELLED_TIMELINE("2025-05-04 09:00"),
  },
];

export function getOrdersByProductId(productId: string): Order[] {
  return mockOrders.filter((o) => o.productId === productId);
}

export function updateOrderStatus(orderId: string, status: OrderStatusKey): void {
  const order = mockOrders.find((o) => o.id === orderId || o.id.replace("#", "") === orderId);
  if (order) order.status = status;
}
