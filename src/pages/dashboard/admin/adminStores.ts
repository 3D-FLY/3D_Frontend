import { mockSellers, type Seller } from "../../../data/mockSellers.js";
import { getProductsBySellerId } from "../../../data/mockProducts.js";

// Admin adapter: in-memory store (seller) list derived from src/data. Edits live for the session only.

export type StorePlan = "basic" | "pro" | "enterprise";

export interface AdminStoreRecord {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  active: boolean;
  plan: StorePlan;
  productCount: number;
  joinedAt: string;
}

export type AdminStoreInput = Pick<AdminStoreRecord, "name" | "city" | "email" | "phone" | "plan" | "active">;

function toStoreRecord(seller: Seller): AdminStoreRecord {
  return {
    id: seller.id,
    name: seller.name,
    city: `${seller.city}, ${seller.country}`,
    email: seller.email,
    phone: "Unknown",
    active: seller.isActive,
    plan: seller.plan.toLowerCase() as StorePlan,
    productCount: getProductsBySellerId(seller.id).length,
    joinedAt: seller.joinedAt,
  };
}

let stores: AdminStoreRecord[] = mockSellers.map(toStoreRecord);

function nextId(): string {
  const max = stores.reduce((m, s) => {
    const n = Number(s.id.replace("SEL-", ""));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `SEL-${String(max + 1).padStart(3, "0")}`;
}

export function getAdminStores(): AdminStoreRecord[] {
  return [...stores];
}

export function getAdminStoreById(id: string | undefined): AdminStoreRecord | undefined {
  return stores.find((s) => s.id === id);
}

export function addAdminStore(input: AdminStoreInput): AdminStoreRecord {
  const record: AdminStoreRecord = {
    ...input,
    id: nextId(),
    productCount: 0,
    joinedAt: new Date().toISOString().slice(0, 10),
  };
  stores = [...stores, record];
  return record;
}

export function updateAdminStore(id: string, input: AdminStoreInput): void {
  stores = stores.map((s) => (s.id === id ? { ...s, ...input } : s));
}

export function removeAdminStore(id: string): void {
  stores = stores.filter((s) => s.id !== id);
}
