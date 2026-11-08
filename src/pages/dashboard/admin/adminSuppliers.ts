import { mockSuppliers } from "../../../data/mockSuppliers.js";

// Admin adapter: in-memory supplier list derived from src/data. Edits live for the session only.

export interface AdminSupplierRecord {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  active: boolean;
}

export type AdminSupplierInput = Omit<AdminSupplierRecord, "id">;

let suppliers: AdminSupplierRecord[] = mockSuppliers.map((s) => ({
  id: s.id,
  name: s.name,
  city: `${s.city}, ${s.country}`,
  email: s.email,
  phone: "Unknown",
  active: s.isActive,
}));

function nextId(): string {
  const max = suppliers.reduce((m, s) => {
    const n = Number(s.id.replace("SUP-", ""));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `SUP-${String(max + 1).padStart(3, "0")}`;
}

export function getAdminSuppliers(): AdminSupplierRecord[] {
  return [...suppliers];
}

export function getAdminSupplierById(id: string | undefined): AdminSupplierRecord | undefined {
  return suppliers.find((s) => s.id === id);
}

export function addAdminSupplier(input: AdminSupplierInput): AdminSupplierRecord {
  const record = { ...input, id: nextId() };
  suppliers = [...suppliers, record];
  return record;
}

export function updateAdminSupplier(id: string, input: AdminSupplierInput): void {
  suppliers = suppliers.map((s) => (s.id === id ? { ...s, ...input } : s));
}

export function removeAdminSupplier(id: string): void {
  suppliers = suppliers.filter((s) => s.id !== id);
}
