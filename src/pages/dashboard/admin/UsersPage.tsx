import { useState, useMemo } from "react";
import { Store } from "lucide-react";
import ActiveBadge from "../../../features/dashboard/components/ActiveBadge.js";
import Modal from "../../../features/dashboard/components/Modal.js";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import Input from "../../../components/ui/Input.js";
import EntityCard from "../../../features/dashboard/components/EntityCard.js";

// ─── Types ────────────────────────────────────────────────────────────────────
type Plan = "basic" | "pro" | "enterprise";

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

// ─── Constants ────────────────────────────────────────────────────────────────
const PLAN_BADGE: Record<Plan, string> = {
  basic:      "bg-zinc-700/60 text-zinc-400 border border-zinc-600/40",
  pro:        "bg-[#22a8c4]/15 text-[#22a8c4] border border-[#22a8c4]/30",
  enterprise: "bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30",
};

const EMPTY_FORM: StoreForm = { name: "", city: "", email: "", phone: "", plan: "basic", active: true };

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_STORES: StoreRecord[] = [
  { id: "usr1", name: "UrbanPrints NYC",    city: "New York City, United States",  email: "hello@urbanprints.com",     phone: "+1-212-555-0190",   active: true,  plan: "enterprise", productCount: 142, joinedAt: "2023-02-14" },
  { id: "usr2", name: "Tokyo 3D Shop",      city: "Tokyo, Japan",                  email: "contact@tokyo3d.jp",        phone: "+81-3-5678-9012",   active: true,  plan: "pro",        productCount: 87,  joinedAt: "2023-05-22" },
  { id: "usr3", name: "Berlin Makers",      city: "Berlin, Germany",               email: "info@berlinmakers.de",      phone: "+49-30-1234-5678",  active: true,  plan: "pro",        productCount: 63,  joinedAt: "2023-08-01" },
  { id: "usr4", name: "Cape Crafts Co.",    city: "Cape Town, South Africa",       email: "orders@capecrafts.co.za",   phone: "+27-21-555-0134",   active: true,  plan: "basic",      productCount: 28,  joinedAt: "2024-01-10" },
  { id: "usr5", name: "Sydney Space Print", city: "Sydney, Australia",             email: "hi@sydneyspaceprint.au",    phone: "+61-2-9876-5432",   active: true,  plan: "pro",        productCount: 54,  joinedAt: "2023-11-30" },
  { id: "usr6", name: "São Paulo Fab Lab",  city: "São Paulo, Brazil",             email: "contato@spfablab.com",      phone: "+55-11-9876-5432",  active: false, plan: "basic",      productCount: 19,  joinedAt: "2024-03-05" },
  { id: "usr7", name: "Dubai 3D Hub",       city: "Dubai, United Arab Emirates",   email: "info@dubai3dhub.ae",        phone: "+971-4-555-0310",   active: true,  plan: "enterprise", productCount: 211, joinedAt: "2022-09-18" },
  { id: "usr8", name: "Paris Design Lab",   city: "Paris, France",                 email: "bonjour@parisdesignlab.fr", phone: "+33-1-55-00-01-23", active: false, plan: "basic",      productCount: 11,  joinedAt: "2024-06-20" },
];

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
    <Modal onClose={onClose}>
        <h2 className="text-base font-bold uppercase tracking-widest text-white">
          {mode === "add" ? "Add Store" : "Edit Store"}
        </h2>

        {(
          [
            { label: "Name",  key: "name",  placeholder: "e.g. UrbanPrints NYC"            },
            { label: "City",  key: "city",  placeholder: "e.g. New York, United States"     },
            { label: "Email", key: "email", placeholder: "contact@example.com"              },
            { label: "Phone", key: "phone", placeholder: "+1-555-000-0000"                  },
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
    </Modal>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreRecord[]>(INITIAL_STORES);
  const [search, setSearch] = useState("");

  type ModalState =
    | null
    | { mode: "add" }
    | { mode: "edit"; store: StoreRecord };
  const [modal, setModal] = useState<ModalState>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return stores;
    const q = search.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [stores, search]);

  const handleSave = (form: StoreForm) => {
    if (!modal) return;
    if (modal.mode === "add") {
      setStores((prev) => [
        ...prev,
        {
          ...form,
          id: crypto.randomUUID(),
          productCount: 0,
          joinedAt: new Date().toISOString().slice(0, 10),
        },
      ]);
    } else if (modal.mode === "edit") {
      setStores((prev) =>
        prev.map((s) => (s.id === modal.store.id ? { ...s, ...form } : s)),
      );
    }
    setModal(null);
  };

  const handleDelete = (id: string) =>
    setStores((prev) => prev.filter((s) => s.id !== id));

  return (
    <DashboardLayout role="admin">
      <DashboardPage
        header={
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <DashboardPageTitle>Stores</DashboardPageTitle>
              <span className="rounded-full bg-[#22a8c4]/15 border border-[#22a8c4]/30 px-2.5 py-0.5 text-[13px] font-bold text-[#22a8c4]">
                {stores.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setModal({ mode: "add" })}
              className="h-10 rounded-md bg-[#22a8c4] px-5 text-[13px] font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-all whitespace-nowrap"
            >
              Add Store
            </button>
          </div>
        }
      >
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, city, or email…"
          className="w-full rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#22a8c4] transition-colors"
        />

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">No stores found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((store) => (
              <EntityCard
                key={store.id}
                icon={<Store size={32} color="#22a8c4" strokeWidth={1.5} />}
                accentColor="#22a8c4"
                name={store.name}
                subtitle={store.city}
                badges={
                  <>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${PLAN_BADGE[store.plan]}`}>
                      {store.plan}
                    </span>
                    <ActiveBadge active={store.active} color="#22a8c4" />
                  </>
                }
                onClick={() => navigate(`/dashboard/admin/users/${store.id}`)}
                onEdit={() => setModal({ mode: "edit", store })}
                onDelete={() => handleDelete(store.id)}
                onNavigate={() => navigate(`/dashboard/admin/users/${store.id}`)}
                navigateLabel="View Detail"
              />
            ))}
          </div>
        )}
      </DashboardPage>

      {modal && (
        modal.mode === "edit" ? (
          <StoreModal
            mode="edit"
            initial={{
              name:   modal.store.name,
              city:   modal.store.city,
              email:  modal.store.email,
              phone:  modal.store.phone,
              plan:   modal.store.plan,
              active: modal.store.active,
            }}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        ) : (
          <StoreModal
            mode="add"
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        )
      )}
    </DashboardLayout>
  );
}
