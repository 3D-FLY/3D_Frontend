import { useState, useMemo } from "react";
import { Printer, Pencil, Trash2, ArrowRight, X } from "lucide-react";
import DashboardLayout from "../../features/dashboard/DashboardLayout.js";
import Input from "../../components/ui/Input.tsx";

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_SUPPLIERS = [
  { id: "sup1", name: "PrintHub TLV",      city: "Tel Aviv, Israel",            email: "contact@printhub.io",     phone: "+972-3-555-0100",   active: true  },
  { id: "sup2", name: "3D Masters London", city: "London, United Kingdom",       email: "hello@3dmasters.co.uk",   phone: "+44-20-7946-0958",  active: true  },
  { id: "sup3", name: "FabLab Tokyo",      city: "Tokyo, Japan",                 email: "info@fablabtkyo.jp",      phone: "+81-3-1234-5678",   active: true  },
  { id: "sup4", name: "MakerSpace NYC",    city: "New York City, United States", email: "ops@makerspacenyc.com",   phone: "+1-212-555-0174",   active: true  },
  { id: "sup5", name: "Imprimerie Paris",  city: "Paris, France",                email: "bonjour@imprimerie3d.fr", phone: "+33-1-40-00-01-02", active: true  },
  { id: "sup6", name: "PrintForge Dubai",  city: "Dubai, United Arab Emirates",  email: "info@printforgedxb.ae",   phone: "+971-4-555-0200",   active: true  },
  { id: "sup7", name: "SGPrint Co.",       city: "Singapore, Singapore",         email: "sales@sgprint.sg",        phone: "+65-6321-4567",     active: false },
  { id: "sup8", name: "FabBrasil",         city: "São Paulo, Brazil",            email: "contato@fabbrasil.com",   phone: "+55-11-2345-6789",  active: false },
];

const EMPTY_FORM = { name: "", city: "", email: "", phone: "", active: true };

// ─── Modal ────────────────────────────────────────────────────────────────────
function SupplierModal({ mode, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleActive = () => setForm((f) => ({ ...f, active: !f.active }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    /* Full-screen glass backdrop — sits above everything including the banner */
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(149,149,149,0.08)] backdrop-blur-[12px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Small card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(5,10,7,0.97)] p-6 flex flex-col gap-5 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-base font-bold uppercase tracking-widest text-white">
          {mode === "add" ? "Add Supplier" : "Edit Supplier"}
        </h2>

        {[
          { label: "Name",  key: "name",  placeholder: "e.g. PrintHub TLV" },
          { label: "City",  key: "city",  placeholder: "e.g. Tel Aviv, Israel" },
          { label: "Email", key: "email", placeholder: "contact@example.com" },
          { label: "Phone", key: "phone", placeholder: "+1-555-000-0000" },
        ].map(({ label, key, placeholder }) => (
          <Input
            key={key}
            label={label}
            value={form[key]}
            onChange={set(key)}
            placeholder={placeholder}
            wrapperClassName="w-full"
          />
        ))}

        {/* Status toggle */}
        <div className="flex items-center gap-3 pl-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 flex-1">
            Status
          </span>
          <button
            type="button"
            onClick={toggleActive}
            aria-label="Toggle active status"
            className={`relative w-12 h-6 rounded-full transition-colors ${
              form.active ? "bg-[#5ac422]" : "bg-zinc-700"
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
              form.active ? "text-[#5ac422]" : "text-zinc-500"
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
            onClick={handleSave}
            className="flex-1 rounded-md bg-[#5ac422] py-2 text-sm font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Supplier card ────────────────────────────────────────────────────────────
function SupplierCard({ supplier, onEdit, onDelete, onViewOrders }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.1)] backdrop-blur-[12px] hover:border-[#5ac422]/50 hover:brightness-110 transition-all">

      {/* Top */}
      <div className="flex flex-col gap-2 px-5 pt-5 pb-4">
        <Printer size={32} color="#5ac422" strokeWidth={1.5} />

        <div className="flex flex-col gap-0.5 mt-1">
          <span className="font-bold text-white leading-snug" style={{ fontSize: 15 }}>
            {supplier.name}
          </span>
          <span className="text-[#5ac422]" style={{ fontSize: 12 }}>
            {supplier.city}
          </span>
        </div>

        <span
          className={`self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            supplier.active
              ? "bg-[#5ac422]/15 text-[#5ac422] border border-[#5ac422]/30"
              : "bg-zinc-700/60 text-zinc-400 border border-zinc-600/40"
          }`}
        >
          {supplier.active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Action row */}
      <div className="flex items-center justify-between px-4 py-3">
        {confirmDelete ? (
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] text-zinc-300 flex-1">Delete?</span>
            <button
              type="button"
              onClick={() => onDelete(supplier.id)}
              className="rounded px-2 py-1 text-[11px] font-bold text-rose-400 border border-rose-400/40 hover:bg-rose-400/10 transition-colors"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded px-2 py-1 text-[11px] font-bold text-zinc-400 border border-zinc-600/40 hover:bg-zinc-700/40 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onEdit(supplier)}
              title="Edit"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              title="Delete"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => onViewOrders(supplier.id)}
              title="View Orders"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-[#5ac422] hover:bg-[#5ac422]/10 transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState(null); // null | {mode:"add"} | {mode:"edit", supplier}

  const filtered = useMemo(() => {
    if (!search.trim()) return suppliers;
    const q = search.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [suppliers, search]);

  const handleSave = (form) => {
    if (modal.mode === "add") {
      setSuppliers((prev) => [...prev, { ...form, id: crypto.randomUUID() }]);
    } else {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === modal.supplier.id ? { ...modal.supplier, ...form } : s)),
      );
    }
    setModal(null);
  };

  const handleDelete     = (id) => setSuppliers((prev) => prev.filter((s) => s.id !== id));
  const handleViewOrders = (id) => console.log("View orders for supplier:", id);

  return (
    <DashboardLayout role="admin">
      <div className="w-full flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-[clamp(18px,2vw,24px)] font-semibold text-white">
              Suppliers
            </h1>
            <span className="rounded-full bg-[#5ac422]/15 border border-[#5ac422]/30 px-2.5 py-0.5 text-[13px] font-bold text-[#5ac422]">
              {suppliers.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setModal({ mode: "add" })}
            className="h-10 rounded-md bg-[#5ac422] px-5 text-[13px] font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-all whitespace-nowrap"
          >
            Add Supplier
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, city, or email…"
          className="w-full rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#5ac422] transition-colors"
        />

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">No suppliers found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onEdit={(s) => setModal({ mode: "edit", supplier: s })}
                onDelete={handleDelete}
                onViewOrders={handleViewOrders}
              />
            ))}
          </div>
        )}
      </div>

      {modal && (
        <SupplierModal
          mode={modal.mode}
          initial={modal.mode === "edit" ? { ...modal.supplier } : undefined}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </DashboardLayout>
  );
}
