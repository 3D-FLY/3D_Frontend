import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Store, X } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import Input from "../../../components/ui/Input.js";
import type { OrderStatusKey } from "../../../constants/orderStatusConfig.js";
import ActiveBadge from "../../../features/dashboard/components/ActiveBadge.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import StatusBadge from "../../../features/dashboard/components/StatusBadge.js";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import { mockSellers, type Seller } from "../../../data/mockSellers.js";
import { mockProducts } from "../../../data/mockProducts.js";
import { mockOrders } from "../../../data/mockOrders.js";

// ─── Types ────────────────────────────────────────────────────────────────────
type Plan = "basic" | "pro" | "enterprise";
type ProductStatus = "published" | "draft";
type OrderStatus = OrderStatusKey;

interface StoreRecord {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  active: boolean;
  plan: Plan;
  productCount: number;
  joinedAt: string;
}

interface StoreForm {
  name: string;
  city: string;
  email: string;
  phone: string;
  plan: Plan;
  active: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: ProductStatus;
}

interface Order {
  id: string;
  customer: string;
  status: OrderStatus;
  total: number;
}

interface StoreStats {
  totalOrders: number;
  revenue: number;
  issues: number;
  completionRate: number;
  avgDeliveryDays: number;
  rating: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PLAN_BADGE: Record<Plan, string> = {
  basic:      "bg-zinc-700/60 text-zinc-400 border border-zinc-600/40",
  pro:        "bg-[#22a8c4]/15 text-[#22a8c4] border border-[#22a8c4]/30",
  enterprise: "bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30",
};


const EMPTY_FORM: StoreForm = { name: "", city: "", email: "", phone: "", plan: "basic", active: true };

// ─── Mock data ────────────────────────────────────────────────────────────────
function toStoreRecord(seller: Seller): StoreRecord {
  return {
    id: seller.id,
    name: seller.name,
    city: `${seller.city}, ${seller.country}`,
    email: seller.email,
    phone: "Unknown",
    active: seller.isActive,
    plan: seller.plan.toLowerCase() as Plan,
    productCount: mockProducts.filter((p) => p.sellerId === seller.id).length,
    joinedAt: seller.joinedAt,
  };
}

function computeAvgDeliveryDays(orders: { status: OrderStatus; timeline: { step: string; date: string | null }[] }[]): number {
  const delivered = orders.filter((o) => o.status === "delivered");
  if (delivered.length === 0) return 0;
  const totalDays = delivered.reduce((sum, o) => {
    const placed = o.timeline.find((t) => t.step === "Order Placed")?.date;
    const deliveredDate = o.timeline.find((t) => t.step === "DONE")?.date;
    if (!placed || !deliveredDate) return sum;
    return sum + (new Date(deliveredDate).getTime() - new Date(placed).getTime()) / 86400000;
  }, 0);
  return +(totalDays / delivered.length).toFixed(1);
}

function getStoreStats(sellerId: string): StoreStats {
  const orders = mockOrders.filter((o) => o.sellerId === sellerId);
  const totalOrders = orders.length;
  const revenue = orders.reduce((s, o) => s + o.sellerPrice * o.quantity, 0);
  const issues = orders.filter((o) => o.status === "issue").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  return {
    totalOrders,
    revenue,
    issues,
    completionRate: totalOrders ? Math.round((delivered / totalOrders) * 100) : 0,
    avgDeliveryDays: computeAvgDeliveryDays(orders),
    rating: 4.5,
  };
}

const MOCK_STORES: StoreRecord[] = mockSellers.map(toStoreRecord);

// ─── Modal ────────────────────────────────────────────────────────────────────
function StoreModal({
  mode,
  initial,
  onSave,
  onClose,
}: {
  mode: "add" | "edit";
  initial?: StoreForm;
  onSave: (form: StoreForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<StoreForm>(initial ?? EMPTY_FORM);

  const set =
    (key: keyof StoreForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleActive = () => setForm((f) => ({ ...f, active: !f.active }));

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(149,149,149,0.08)] backdrop-blur-[12px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(5,10,7,0.97)] p-6 flex flex-col gap-5 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-base font-bold uppercase tracking-widest text-white">
          {mode === "add" ? "Add Store" : "Edit Store"}
        </h2>

        {(
          [
            { label: "Name",  key: "name",  placeholder: "e.g. UrbanPrints NYC"        },
            { label: "City",  key: "city",  placeholder: "e.g. New York, United States" },
            { label: "Email", key: "email", placeholder: "contact@example.com"          },
            { label: "Phone", key: "phone", placeholder: "+1-555-000-0000"              },
          ] as const
        ).map(({ label, key, placeholder }) => (
          <Input
            key={key}
            label={label}
            value={form[key]}
            onChange={set(key)}
            placeholder={placeholder}
            wrapperClassName="w-full"
          />
        ))}

        {/* Plan select */}
        <div className="flex flex-col gap-1">
          <span className="text-[#22a8c4] text-sm font-medium uppercase tracking-widest select-none">
            Plan
          </span>
          <div className="pl-5">
            <select
              value={form.plan}
              onChange={set("plan")}
              className="w-full py-2 px-3 rounded-[18px] bg-[rgba(33,33,33,0.9)] border border-transparent text-[#dfdfdf] font-medium tracking-widest outline-none focus:border-zinc-500/50 transition-colors"
            >
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3 pl-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 flex-1">
            Status
          </span>
          <button
            type="button"
            onClick={toggleActive}
            aria-label="Toggle active status"
            className={`relative w-12 h-6 rounded-full transition-colors ${
              form.active ? "bg-[#22a8c4]" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                form.active ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-semibold w-14 ${
              form.active ? "text-[#22a8c4]" : "text-zinc-500"
            }`}
          >
            {form.active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-white/10 py-2 text-sm text-zinc-300 hover:text-white hover:border-white/30 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => { if (form.name.trim()) onSave(form); }}
            className="flex-1 rounded-md bg-[#22a8c4] py-2 text-sm font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const initialStore = MOCK_STORES.find((s) => s.id === id);
  const [store, setStore] = useState<StoreRecord | undefined>(initialStore);
  const [editOpen, setEditOpen] = useState(false);

  if (!store) {
    return (
      <DashboardLayout role="admin">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-zinc-400 text-sm">Store not found.</p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/users")}
            className="flex items-center gap-2 text-[#22a8c4] text-sm hover:underline"
          >
            <ArrowLeft size={15} /> Back to Stores
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const products: Product[] = mockProducts
    .filter((p) => p.sellerId === store.id)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.sellerPrice,
      category: "3D Print",
      status: p.isActive ? "published" : "draft",
    }));
  const orders: Order[] = mockOrders
    .filter((o) => o.sellerId === store.id)
    .map((o) => ({
      id: o.id,
      customer: "Unknown",
      status: o.status,
      total: o.sellerPrice * o.quantity,
    }));
  const stats = getStoreStats(store.id);

  const handleSave = (form: StoreForm) => {
    setStore((prev) => prev ? { ...prev, ...form } : prev);
    setEditOpen(false);
  };

  return (
    <DashboardLayout role="admin">
      <DashboardPage
        header={
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/users")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors shrink-0"
              title="Back to Stores"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <DashboardPageTitle className="truncate">{store.name}</DashboardPageTitle>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize shrink-0 ${PLAN_BADGE[store.plan]}`}>
                {store.plan}
              </span>
            </div>
          </div>
        }
      >
        {/* Main 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Section 1: Store Info (full width) ────────────────────────── */}
          <div className="lg:col-span-2">
            <DashboardCard
              index={0}
              title="Store Info"
              autoHeight
              withBackground={false}
              headerAction={
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[12px] text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {[
                  { label: "Name",    value: store.name                           },
                  { label: "City",    value: store.city                           },
                  { label: "Email",   value: store.email                          },
                  { label: "Phone",   value: store.phone                          },
                  { label: "Joined",  value: store.joinedAt                       },
                  { label: "Products",value: String(store.productCount)           },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      {label}
                    </span>
                    <span className="text-sm text-white">{value}</span>
                  </div>
                ))}

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Plan
                  </span>
                  <span className={`self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${PLAN_BADGE[store.plan]}`}>
                    {store.plan}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Status
                  </span>
                  <ActiveBadge active={store.active} color="#22a8c4" className="self-start" />
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Store Icon
                  </span>
                  <Store size={22} color="#22a8c4" strokeWidth={1.5} />
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* ── Section 2: Products (left column) ─────────────────────────── */}
          <DashboardCard index={1} title="Products" autoHeight withBackground={false}>
            {products.length === 0 ? (
              <p className="text-sm text-zinc-500">No products yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl border border-white/10 bg-[rgba(5,10,7,0.5)] px-4 py-3 flex flex-col gap-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[13px] font-semibold text-white leading-snug">
                        {p.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                          p.status === "published"
                            ? "bg-[#22a8c4]/15 text-[#22a8c4] border border-[#22a8c4]/30"
                            : "bg-zinc-700/60 text-zinc-400 border border-zinc-600/40"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 uppercase tracking-wider">
                      {p.category}
                    </span>
                    <span className="text-[14px] font-bold text-[#22a8c4]">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>

          {/* ── Section 3: Orders Summary (right column) ───────────────────── */}
          <DashboardCard index={2} title="Orders Summary" autoHeight withBackground={false}>
            {/* Stat row */}
            <div className="grid grid-cols-3 gap-3 mb-6 h-[120px]">
              <StatusBadge count={stats.totalOrders} label="Total Orders" color="#22a8c4" />
              <StatusBadge count={`$${stats.revenue.toLocaleString()}`} label="Revenue" color="#5ac422" />
              <StatusBadge count={stats.issues} label="Open Issues" color="#f87171" />
            </div>

            <DashboardTable
              variant="data"
              scrollable={false}
              subtle
              hoverable={false}
              columns={[
                { key: "order", header: "Order", cellClassName: "font-mono text-[12px] text-zinc-400" },
                { key: "customer", header: "Customer", cellClassName: "text-[12px] text-white" },
                { key: "status", header: "Status" },
                { key: "total", header: "Total", align: "right", cellClassName: "text-[12px] font-semibold text-white" },
              ]}
              rows={orders}
              getRowKey={(o) => o.id}
              renderCell={(o, key) => {
                if (key === "order") return o.id;
                if (key === "customer") return o.customer;
                if (key === "status") return <OrderStatusPill status={o.status} />;
                if (key === "total") return `$${o.total.toFixed(2)}`;
                return null;
              }}
            />
          </DashboardCard>

          {/* ── Section 4: Performance (full width) ───────────────────────── */}
          <div className="lg:col-span-2">
            <DashboardCard index={3} title="Performance" autoHeight withBackground={false}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-[rgba(5,10,7,0.5)] p-6 flex flex-col items-center text-center gap-2">
                  <span className="text-[clamp(32px,4vw,48px)] font-extrabold text-[#22a8c4]">
                    {stats.completionRate}%
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                    Completion Rate
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-[rgba(5,10,7,0.5)] p-6 flex flex-col items-center text-center gap-2">
                  <span className="text-[clamp(32px,4vw,48px)] font-extrabold text-amber-400">
                    {stats.avgDeliveryDays}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                    Avg. Delivery Days
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-[rgba(5,10,7,0.5)] p-6 flex flex-col items-center text-center gap-2">
                  <span className="text-[clamp(32px,4vw,48px)] font-extrabold text-[#a855f7]">
                    {stats.rating}
                    <span className="text-[clamp(16px,2vw,22px)] font-semibold text-zinc-500">/5</span>
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                    Customer Rating
                  </span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </DashboardPage>

      {editOpen && (
        <StoreModal
          mode="edit"
          initial={{
            name:   store.name,
            city:   store.city,
            email:  store.email,
            phone:  store.phone,
            plan:   store.plan,
            active: store.active,
          }}
          onSave={handleSave}
          onClose={() => setEditOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}
