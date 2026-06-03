import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Store, X } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import Input from "../../../components/ui/Input.js";

// ─── Types ────────────────────────────────────────────────────────────────────
type Plan = "basic" | "pro" | "enterprise";
type ProductStatus = "published" | "draft";
type OrderStatus = "delivered" | "shipped" | "processing" | "issue";

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

const ORDER_STATUS_DOT: Record<OrderStatus, string> = {
  delivered:  "bg-[#22a8c4]",
  shipped:    "bg-amber-400",
  processing: "bg-zinc-400",
  issue:      "bg-rose-400",
};

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  delivered:  "Delivered",
  shipped:    "Shipped",
  processing: "Processing",
  issue:      "Issue",
};

const EMPTY_FORM: StoreForm = { name: "", city: "", email: "", phone: "", plan: "basic", active: true };

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_STORES: StoreRecord[] = [
  { id: "usr1", name: "UrbanPrints NYC",    city: "New York City, United States",  email: "hello@urbanprints.com",     phone: "+1-212-555-0190",   active: true,  plan: "enterprise", productCount: 142, joinedAt: "2023-02-14" },
  { id: "usr2", name: "Tokyo 3D Shop",      city: "Tokyo, Japan",                  email: "contact@tokyo3d.jp",        phone: "+81-3-5678-9012",   active: true,  plan: "pro",        productCount: 87,  joinedAt: "2023-05-22" },
  { id: "usr3", name: "Berlin Makers",      city: "Berlin, Germany",               email: "info@berlinmakers.de",      phone: "+49-30-1234-5678",  active: true,  plan: "pro",        productCount: 63,  joinedAt: "2023-08-01" },
  { id: "usr4", name: "Cape Crafts Co.",    city: "Cape Town, South Africa",       email: "orders@capecrafts.co.za",   phone: "+27-21-555-0134",   active: true,  plan: "basic",      productCount: 28,  joinedAt: "2024-01-10" },
  { id: "usr5", name: "Sydney Space Print", city: "Sydney, Australia",             email: "hi@sydneyspaceprint.au",    phone: "+61-2-9876-5432",   active: true,  plan: "pro",        productCount: 54,  joinedAt: "2023-11-30" },
  { id: "usr6", name: "São Paulo Fab Lab",  city: "São Paulo, Brazil",             email: "contato@spfablab.com",      phone: "+55-11-9876-5432",  active: false, plan: "basic",      productCount: 19,  joinedAt: "2024-03-05" },
  { id: "usr7", name: "Dubai 3D Hub",       city: "Dubai, United Arab Emirates",   email: "info@dubai3dhub.ae",        phone: "+971-4-555-0310",   active: true,  plan: "enterprise", productCount: 211, joinedAt: "2022-09-18" },
  { id: "usr8", name: "Paris Design Lab",   city: "Paris, France",                 email: "bonjour@parisdesignlab.fr", phone: "+33-1-55-00-01-23", active: false, plan: "basic",      productCount: 11,  joinedAt: "2024-06-20" },
];

const STORE_PRODUCTS: Record<string, Product[]> = {
  usr1: [
    { id: "p1-1", name: "Mini Eiffel Tower",   price: 34.99, category: "Decor",        status: "published" },
    { id: "p1-2", name: "Custom Nameplate",    price: 19.99, category: "Personalized", status: "published" },
    { id: "p1-3", name: "Dragon Figurine",     price: 49.99, category: "Collectibles", status: "draft"     },
    { id: "p1-4", name: "Phone Stand Pro",     price: 14.99, category: "Accessories",  status: "published" },
    { id: "p1-5", name: "Skull Candle Holder", price: 27.99, category: "Decor",        status: "published" },
  ],
  usr2: [
    { id: "p2-1", name: "Samurai Helmet",      price: 79.99, category: "Collectibles", status: "published" },
    { id: "p2-2", name: "Bonsai Tree Stand",   price: 22.99, category: "Decor",        status: "published" },
    { id: "p2-3", name: "Cable Organizer",     price: 12.99, category: "Accessories",  status: "draft"     },
    { id: "p2-4", name: "Origami Crane Model", price: 39.99, category: "Art",          status: "published" },
  ],
  usr3: [
    { id: "p3-1", name: "Bauhaus Wall Clock",  price: 44.99, category: "Decor",        status: "published" },
    { id: "p3-2", name: "Desk Organizer Set",  price: 29.99, category: "Accessories",  status: "published" },
    { id: "p3-3", name: "Robot Toy Kit",       price: 59.99, category: "Toys",         status: "draft"     },
    { id: "p3-4", name: "Planter Pot",         price: 18.99, category: "Decor",        status: "published" },
    { id: "p3-5", name: "Gear Necklace",       price: 24.99, category: "Jewelry",      status: "published" },
    { id: "p3-6", name: "Modular Shelf Clip",  price: 9.99,  category: "Accessories",  status: "published" },
  ],
  usr4: [
    { id: "p4-1", name: "Cape Elephant Deco",  price: 34.99, category: "Decor",        status: "published" },
    { id: "p4-2", name: "Safari Keychain Set", price: 12.99, category: "Accessories",  status: "published" },
    { id: "p4-3", name: "Tribal Mask Wall Art",price: 64.99, category: "Art",          status: "draft"     },
    { id: "p4-4", name: "Beaded Phone Case",   price: 21.99, category: "Accessories",  status: "published" },
  ],
  usr5: [
    { id: "p5-1", name: "Surf Board Miniature",price: 42.99, category: "Collectibles", status: "published" },
    { id: "p5-2", name: "Koala Figure",        price: 29.99, category: "Toys",         status: "published" },
    { id: "p5-3", name: "Solar System Kit",    price: 74.99, category: "Educational",  status: "published" },
    { id: "p5-4", name: "Boomerang Decor",     price: 19.99, category: "Decor",        status: "draft"     },
    { id: "p5-5", name: "Wave Lamp Shade",     price: 54.99, category: "Decor",        status: "published" },
  ],
  usr6: [
    { id: "p6-1", name: "Carnival Mask",       price: 28.99, category: "Art",          status: "published" },
    { id: "p6-2", name: "Caipirinha Cup Set",  price: 39.99, category: "Kitchen",      status: "draft"     },
    { id: "p6-3", name: "Jungle Animal Pack",  price: 19.99, category: "Toys",         status: "published" },
    { id: "p6-4", name: "Hammock Hook",        price: 14.99, category: "Accessories",  status: "published" },
  ],
  usr7: [
    { id: "p7-1", name: "Gold Camel Figure",   price: 89.99,  category: "Collectibles", status: "published" },
    { id: "p7-2", name: "Falconry Hood",       price: 59.99,  category: "Collectibles", status: "published" },
    { id: "p7-3", name: "Arabic Coffee Set",   price: 124.99, category: "Kitchen",      status: "published" },
    { id: "p7-4", name: "Mosque Miniature",    price: 149.99, category: "Art",          status: "published" },
    { id: "p7-5", name: "Date Palm Stand",     price: 34.99,  category: "Decor",        status: "draft"     },
    { id: "p7-6", name: "Desert Rose Crystal", price: 44.99,  category: "Decor",        status: "published" },
  ],
  usr8: [
    { id: "p8-1", name: "Eiffel Keychain",     price: 9.99,  category: "Accessories",  status: "published" },
    { id: "p8-2", name: "Louvre Puzzle",       price: 34.99, category: "Art",          status: "draft"     },
    { id: "p8-3", name: "French Bulldog Fig.", price: 19.99, category: "Collectibles", status: "published" },
    { id: "p8-4", name: "Macaron Display",     price: 24.99, category: "Decor",        status: "published" },
  ],
};

const STORE_ORDERS: Record<string, Order[]> = {
  usr1: [
    { id: "#00341", customer: "Alice Johnson",  status: "delivered",  total: 89.97  },
    { id: "#00340", customer: "Bob Martinez",   status: "shipped",    total: 34.99  },
    { id: "#00339", customer: "Carol White",    status: "processing", total: 54.98  },
    { id: "#00338", customer: "David Lee",      status: "delivered",  total: 149.99 },
    { id: "#00337", customer: "Emma Wilson",    status: "issue",      total: 19.99  },
  ],
  usr2: [
    { id: "#00221", customer: "Yuki Tanaka",    status: "delivered",  total: 79.99  },
    { id: "#00220", customer: "Hiroshi Sato",   status: "shipped",    total: 22.99  },
    { id: "#00219", customer: "Aiko Yamamoto",  status: "delivered",  total: 39.99  },
    { id: "#00218", customer: "Ken Watanabe",   status: "processing", total: 12.99  },
    { id: "#00217", customer: "Mei Fujiwara",   status: "issue",      total: 79.99  },
  ],
  usr3: [
    { id: "#00183", customer: "Klaus Müller",   status: "delivered",  total: 44.99  },
    { id: "#00182", customer: "Lena Schmidt",   status: "shipped",    total: 59.99  },
    { id: "#00181", customer: "Hans Weber",     status: "delivered",  total: 29.99  },
    { id: "#00180", customer: "Greta Fischer",  status: "processing", total: 18.99  },
    { id: "#00179", customer: "Otto Bauer",     status: "delivered",  total: 9.99   },
  ],
  usr4: [
    { id: "#00089", customer: "Sipho Dlamini",  status: "delivered",  total: 34.99  },
    { id: "#00088", customer: "Nomsa Nkosi",    status: "shipped",    total: 12.99  },
    { id: "#00087", customer: "Thabo Mokoena",  status: "issue",      total: 64.99  },
    { id: "#00086", customer: "Zanele Khumalo", status: "processing", total: 21.99  },
    { id: "#00085", customer: "Bongani Zulu",   status: "delivered",  total: 34.99  },
  ],
  usr5: [
    { id: "#00267", customer: "Liam Nguyen",    status: "delivered",  total: 42.99  },
    { id: "#00266", customer: "Chloe Smith",    status: "shipped",    total: 74.99  },
    { id: "#00265", customer: "Jack Brown",     status: "delivered",  total: 29.99  },
    { id: "#00264", customer: "Olivia Taylor",  status: "processing", total: 54.99  },
    { id: "#00263", customer: "Noah Anderson",  status: "delivered",  total: 19.99  },
  ],
  usr6: [
    { id: "#00045", customer: "Lucas Silva",    status: "delivered",  total: 28.99  },
    { id: "#00044", customer: "Ana Costa",      status: "shipped",    total: 19.99  },
    { id: "#00043", customer: "Pedro Santos",   status: "issue",      total: 39.99  },
    { id: "#00042", customer: "Maria Oliveira", status: "processing", total: 14.99  },
    { id: "#00041", customer: "Joao Ferreira",  status: "delivered",  total: 28.99  },
  ],
  usr7: [
    { id: "#00519", customer: "Ahmed Al-Rashid", status: "delivered",  total: 149.99 },
    { id: "#00518", customer: "Fatima Al-Zahra", status: "shipped",    total: 124.99 },
    { id: "#00517", customer: "Khalid Al-Farsi", status: "delivered",  total: 89.99  },
    { id: "#00516", customer: "Layla Hassan",    status: "processing", total: 59.99  },
    { id: "#00515", customer: "Omar Saeed",      status: "delivered",  total: 44.99  },
  ],
  usr8: [
    { id: "#00023", customer: "Camille Dupont",  status: "delivered",  total: 9.99   },
    { id: "#00022", customer: "Pierre Martin",   status: "shipped",    total: 34.99  },
    { id: "#00021", customer: "Sophie Bernard",  status: "issue",      total: 19.99  },
    { id: "#00020", customer: "Louis Dubois",    status: "processing", total: 24.99  },
    { id: "#00019", customer: "Marie Laurent",   status: "delivered",  total: 9.99   },
  ],
};

const STORE_STATS: Record<string, StoreStats> = {
  usr1: { totalOrders: 342, revenue: 24830, issues: 3,  completionRate: 97,  avgDeliveryDays: 4.2, rating: 4.8 },
  usr2: { totalOrders: 189, revenue: 18340, issues: 2,  completionRate: 99,  avgDeliveryDays: 3.5, rating: 4.9 },
  usr3: { totalOrders: 145, revenue: 12890, issues: 1,  completionRate: 98,  avgDeliveryDays: 5.1, rating: 4.6 },
  usr4: { totalOrders: 67,  revenue: 4920,  issues: 4,  completionRate: 91,  avgDeliveryDays: 7.8, rating: 4.2 },
  usr5: { totalOrders: 132, revenue: 11760, issues: 0,  completionRate: 100, avgDeliveryDays: 4.0, rating: 4.7 },
  usr6: { totalOrders: 38,  revenue: 2140,  issues: 6,  completionRate: 84,  avgDeliveryDays: 9.3, rating: 3.9 },
  usr7: { totalOrders: 521, revenue: 67890, issues: 2,  completionRate: 99,  avgDeliveryDays: 2.8, rating: 4.9 },
  usr8: { totalOrders: 21,  revenue: 1230,  issues: 3,  completionRate: 86,  avgDeliveryDays: 8.5, rating: 3.7 },
};

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

  const products = STORE_PRODUCTS[store.id] ?? [];
  const orders   = STORE_ORDERS[store.id]   ?? [];
  const stats    = STORE_STATS[store.id]    ?? { totalOrders: 0, revenue: 0, issues: 0, completionRate: 0, avgDeliveryDays: 0, rating: 0 };

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
                  <span
                    className={`self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      store.active
                        ? "bg-[#22a8c4]/15 text-[#22a8c4] border border-[#22a8c4]/30"
                        : "bg-zinc-700/60 text-zinc-400 border border-zinc-600/40"
                    }`}
                  >
                    {store.active ? "Active" : "Inactive"}
                  </span>
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
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl border border-white/10 bg-[rgba(5,10,7,0.5)] p-4 flex flex-col items-center text-center gap-1">
                <span className="text-[clamp(22px,2.5vw,32px)] font-extrabold text-[#22a8c4]">
                  {stats.totalOrders}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  Total Orders
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-[rgba(5,10,7,0.5)] p-4 flex flex-col items-center text-center gap-1">
                <span className="text-[clamp(22px,2.5vw,32px)] font-extrabold text-[#5ac422]">
                  ${stats.revenue.toLocaleString()}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  Revenue
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-[rgba(5,10,7,0.5)] p-4 flex flex-col items-center text-center gap-1">
                <span className="text-[clamp(22px,2.5vw,32px)] font-extrabold text-[#f87171]">
                  {stats.issues}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  Open Issues
                </span>
              </div>
            </div>

            {/* Recent orders table */}
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 px-2 pb-2 border-b border-white/10">
                {["Order", "Customer", "Status", "Total"].map((h) => (
                  <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {h}
                  </span>
                ))}
              </div>
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 px-2 py-2.5 border-b border-white/5 last:border-0 items-center"
                >
                  <span className="text-[12px] font-mono text-zinc-400">{o.id}</span>
                  <span className="text-[12px] text-white truncate">{o.customer}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${ORDER_STATUS_DOT[o.status]}`} />
                    <span className="text-[11px] text-zinc-300 whitespace-nowrap">
                      {ORDER_STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <span className="text-[12px] font-semibold text-white text-right">
                    ${o.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
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
