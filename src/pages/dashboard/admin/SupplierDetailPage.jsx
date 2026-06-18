import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Printer } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import Input from "../../../components/ui/Input.tsx";
import OrderStatusPill from "../../../features/dashboard/components/OrderStatusPill.js";
import DashboardTable from "../../../features/dashboard/components/DashboardTable.js";
import ActiveBadge from "../../../features/dashboard/components/ActiveBadge.js";
import Modal from "../../../features/dashboard/components/Modal.js";

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
    { id: "1", orderId: "3011", store: "Mini World",       status: "delivered",       total: 89.97  },
    { id: "2", orderId: "3010", store: "Galaxy Toys",      status: "shipped",         total: 34.99  },
    { id: "3", orderId: "3009", store: "Print & Play",     status: "in_production",   total: 54.98  },
    { id: "4", orderId: "3008", store: "Mini World",       status: "delivered",       total: 149.99 },
    { id: "5", orderId: "3012", store: "Print & Play",     status: "issue",           total: 19.99  },
  ],
  "3D Masters London": [
    { id: "1", orderId: "3015", store: "Galaxy Toys",      status: "pending",         total: 79.99  },
    { id: "2", orderId: "3014", store: "Mini World",       status: "in_production",   total: 22.99  },
    { id: "3", orderId: "3013", store: "Galaxy Toys",      status: "shipped",         total: 39.99  },
  ],
  "FabLab Tokyo": [
    { id: "1", orderId: "3007", store: "Galaxy Toys",      status: "issue",           total: 44.99  },
    { id: "2", orderId: "3006", store: "Print & Play",     status: "delivered",       total: 59.99  },
    { id: "3", orderId: "3005", store: "Mini World",       status: "shipped",         total: 79.99  },
  ],
};

const SUPPLIER_STATS = {
  "PrintHub TLV":      { totalOrders: 412, completionRate: 98, avgDeliveryDays: 3.8, rating: 4.9 },
  "3D Masters London": { totalOrders: 287, completionRate: 97, avgDeliveryDays: 4.5, rating: 4.7 },
  "FabLab Tokyo":      { totalOrders: 198, completionRate: 95, avgDeliveryDays: 5.2, rating: 4.5 },
};


const EMPTY_FORM = { name: "", city: "", email: "", phone: "", active: true };

// ─── Modal ────────────────────────────────────────────────────────────────────
function SupplierModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleActive = () => setForm((f) => ({ ...f, active: !f.active }));

  return (
    <Modal onClose={onClose}>
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
    </Modal>
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
              <ActiveBadge active={supplier.active} color="#5ac422" className="shrink-0" />
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
              <DashboardTable
                variant="list"
                scrollable={false}
                gridTemplateColumns="0.75fr 1.5fr 1.2fr 0.75fr 24px"
                columns={[
                  { key: "order", header: "Order" },
                  { key: "store", header: "Store" },
                  { key: "status", header: "Status" },
                  { key: "total", header: "Total" },
                  { key: "arrow", header: "" },
                ]}
                rows={orders}
                getRowKey={(order) => order.id}
                onRowClick={(order) =>
                  navigate(`/dashboard/admin/orders?order=${order.orderId}`)
                }
                renderCell={(order, key) => {
                  if (key === "order") {
                    return (
                      <span className="truncate text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100">
                        #{order.orderId}
                      </span>
                    );
                  }
                  if (key === "store") {
                    return (
                      <span className="truncate text-[clamp(12px,1vw,14px)] text-zinc-200">
                        {order.store}
                      </span>
                    );
                  }
                  if (key === "status") {
                    return <OrderStatusPill status={order.status} />;
                  }
                  if (key === "total") {
                    return (
                      <span className="text-[clamp(12px,1vw,14px)] font-semibold text-[#5ac422]">
                        ${order.total.toFixed(2)}
                      </span>
                    );
                  }
                  if (key === "arrow") {
                    return <span className="text-sm text-zinc-300">→</span>;
                  }
                  return null;
                }}
              />
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
