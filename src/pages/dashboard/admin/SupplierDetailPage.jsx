import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Printer, X } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import Input from "../../../components/ui/Input.tsx";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_SUPPLIERS = [
  { id: "sup1", name: "PrintHub TLV",      city: "Tel Aviv, Israel",            email: "contact@printhub.io",     phone: "+972-3-555-0100",   active: true  },
  { id: "sup2", name: "3D Masters London", city: "London, United Kingdom",       email: "hello@3dmasters.co.uk",   phone: "+44-20-7946-0958",  active: true  },
  { id: "sup3", name: "FabLab Tokyo",      city: "Tokyo, Japan",                 email: "info@fablabtkyo.jp",      phone: "+81-3-1234-5678",   active: true  },
  { id: "sup4", name: "MakerSpace NYC",    city: "New York City, United States", email: "ops@makerspacenyc.com",   phone: "+1-212-555-0174",   active: true  },
  { id: "sup5", name: "Imprimerie Paris",  city: "Paris, France",                email: "bonjour@imprimerie3d.fr", phone: "+33-1-40-00-01-02", active: true  },
  { id: "sup6", name: "PrintForge Dubai",  city: "Dubai, United Arab Emirates",  email: "info@printforgedxb.ae",   phone: "+971-4-555-0200",   active: true  },
  { id: "sup7", name: "SGPrint Co.",       city: "Singapore, Singapore",         email: "sales@sgprint.sg",        phone: "+65-6321-4567",     active: false },
  { id: "sup8", name: "FabBrasil",         city: "São Paulo, Brazil",            email: "contato@fabbrasil.com",   phone: "+55-11-2345-6789",  active: false },
];

const SUPPLIER_ORDERS = {
  "PrintHub TLV": [
    { id: "#00441", store: "UrbanPrints NYC", status: "delivered",  total: 89.97  },
    { id: "#00440", store: "Tokyo 3D Shop",   status: "shipped",    total: 34.99  },
    { id: "#00439", store: "Berlin Makers",   status: "processing", total: 54.98  },
    { id: "#00438", store: "Dubai 3D Hub",    status: "delivered",  total: 149.99 },
    { id: "#00437", store: "Paris Design Lab",status: "issue",      total: 19.99  },
  ],
  "3D Masters London": [
    { id: "#00321", store: "UrbanPrints NYC", status: "delivered", total: 79.99 },
    { id: "#00320", store: "Sydney Space Print", status: "shipped", total: 22.99 },
    { id: "#00319", store: "Cape Crafts Co.", status: "delivered", total: 39.99 },
  ],
  "FabLab Tokyo": [
    { id: "#00281", store: "Tokyo 3D Shop", status: "delivered", total: 44.99 },
    { id: "#00280", store: "Berlin Makers", status: "shipped",   total: 59.99 },
    { id: "#00279", store: "UrbanPrints NYC", status: "issue", total: 79.99 },
  ],
};

const SUPPLIER_STATS = {
  "PrintHub TLV":      { totalOrders: 412, completionRate: 98, avgDeliveryDays: 3.8, rating: 4.9 },
  "3D Masters London": { totalOrders: 287, completionRate: 97, avgDeliveryDays: 4.5, rating: 4.7 },
  "FabLab Tokyo":      { totalOrders: 198, completionRate: 95, avgDeliveryDays: 5.2, rating: 4.5 },
};

const ORDER_STATUS_DOT = {
  delivered:  "bg-[#5ac422]",
  shipped:    "bg-amber-400",
  processing: "bg-zinc-400",
  issue:      "bg-rose-400",
};

const ORDER_STATUS_LABEL = {
  delivered:  "Delivered",
  shipped:    "Shipped",
  processing: "Processing",
  issue:      "Issue",
};

const EMPTY_FORM = { name: "", city: "", email: "", phone: "", active: true };

// ─── Modal ────────────────────────────────────────────────────────────────────
function SupplierModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleActive = () => setForm((f) => ({ ...f, active: !f.active }));

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(149,149,149,0.08)] backdrop-blur-[12px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(5,10,7,0.97)] p-6 flex flex-col gap-5 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
        <h2 className="text-base font-bold uppercase tracking-widest text-white">Edit Supplier</h2>
        {[
          { label: "Name",  key: "name",  placeholder: "e.g. PrintHub TLV" },
          { label: "City",  key: "city",  placeholder: "e.g. Tel Aviv, Israel" },
          { label: "Email", key: "email", placeholder: "contact@example.com" },
          { label: "Phone", key: "phone", placeholder: "+972-3-555-0100" },
        ].map(({ label, key, placeholder }) => (
          <Input key={key} label={label} value={form[key]} onChange={set(key)} placeholder={placeholder} wrapperClassName="w-full" />
        ))}
        <div className="flex items-center justify-between">
          <span className="text-[#5ac422] text-sm font-medium uppercase tracking-widest">Status</span>
          <button type="button" onClick={toggleActive} className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${form.active ? "bg-[#5ac422]/15 text-[#5ac422] border border-[#5ac422]/30" : "bg-zinc-700/60 text-zinc-400 border border-zinc-600/40"}`}>
            {form.active ? "Active" : "Inactive"}
          </button>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-md border border-white/10 py-2 text-sm text-zinc-300 hover:text-white hover:border-white/30 transition-colors">Cancel</button>
          <button type="button" onClick={() => { if (form.name.trim()) onSave(form); }} className="flex-1 rounded-md bg-[#5ac422] py-2 text-sm font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-all">Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialSupplier = MOCK_SUPPLIERS.find((s) => s.id === id);
  const [supplier, setSupplier] = useState(initialSupplier);
  const [editOpen, setEditOpen] = useState(false);

  if (!supplier) {
    return (
      <DashboardLayout role="admin">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-zinc-400 text-sm">Supplier not found.</p>
          <button type="button" onClick={() => navigate("/dashboard/admin/suppliers")} className="flex items-center gap-2 text-[#5ac422] text-sm hover:underline">
            <ArrowLeft size={15} /> Back to Suppliers
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const orders = SUPPLIER_ORDERS[supplier.name] ?? [];
  const stats  = SUPPLIER_STATS[supplier.name]  ?? { totalOrders: 0, completionRate: 0, avgDeliveryDays: 0, rating: 0 };

  const handleSave = (form) => {
    setSupplier((prev) => (prev ? { ...prev, ...form } : prev));
    setEditOpen(false);
  };

  return (
    <DashboardLayout role="admin">
      <DashboardPage
        header={
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/suppliers")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors shrink-0"
              title="Back to Suppliers"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <Printer size={28} color="#5ac422" strokeWidth={1.5} className="shrink-0" />
              <DashboardPageTitle className="truncate">{supplier.name}</DashboardPageTitle>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold shrink-0 ${supplier.active ? "bg-[#5ac422]/15 text-[#5ac422] border border-[#5ac422]/30" : "bg-zinc-700/60 text-zinc-400 border border-zinc-600/40"}`}>
                {supplier.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="lg:col-span-2">
            <DashboardCard
              index={0}
              title="Supplier Info"
              autoHeight
              withBackground={false}
              headerAction={
                <button type="button" onClick={() => setEditOpen(true)} className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[12px] text-zinc-400 hover:text-white hover:border-white/30 transition-colors">
                  <Pencil size={13} /> Edit
                </button>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {[
                  { label: "Name",  value: supplier.name  },
                  { label: "City",  value: supplier.city  },
                  { label: "Email", value: supplier.email },
                  { label: "Phone", value: supplier.phone },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
                    <span className="text-sm text-white">{value}</span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          <DashboardCard index={1} title="Performance" autoHeight withBackground={false}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Orders",    value: stats.totalOrders },
                { label: "Completion Rate", value: `${stats.completionRate}%` },
                { label: "Avg Delivery",    value: `${stats.avgDeliveryDays} days` },
                { label: "Rating",          value: stats.rating ? `${stats.rating} / 5` : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
                  <span className="text-lg font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard index={2} title="Recent Orders" autoHeight withBackground={false}>
            {orders.length === 0 ? (
              <p className="text-sm text-zinc-500">No orders yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-semibold text-white">{order.id}</span>
                      <span className="text-xs text-zinc-400 truncate">{order.store}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                        <span className={`h-1.5 w-1.5 rounded-full ${ORDER_STATUS_DOT[order.status]}`} />
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                      <span className="text-sm font-semibold text-white">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>

        </div>
      </DashboardPage>

      {editOpen && (
        <SupplierModal
          initial={{ name: supplier.name, city: supplier.city, email: supplier.email, phone: supplier.phone, active: supplier.active }}
          onSave={handleSave}
          onClose={() => setEditOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}
