import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, MapPin, Truck, AlertTriangle, User, Store } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import ScrollableContent from "../../../features/dashboard/components/ScrollableContent.js";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:       { label: "Pending",       dot: "bg-orange-400", text: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/10" },
  in_production: { label: "In Production", dot: "bg-sky-400",    text: "text-sky-400",    border: "border-sky-400/30",    bg: "bg-sky-400/10"    },
  shipped:       { label: "Shipped",       dot: "bg-sky-400",    text: "text-sky-400",    border: "border-sky-400/30",    bg: "bg-sky-400/10"    },
  delivered:     { label: "Delivered",     dot: "bg-green-400",  text: "text-green-400",  border: "border-green-400/30",  bg: "bg-green-400/10"  },
  issue:         { label: "Issue",         dot: "bg-red-400",    text: "text-red-400",    border: "border-red-400/30",    bg: "bg-red-400/10"    },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

// ─── Mock data ────────────────────────────────────────────────────────────────

const h = (hours) => new Date(Date.now() - hours * 3600000).toISOString();
const d = (days)  => new Date(Date.now() - days  * 86400000).toISOString();

const ORDERS = [
  {
    id: "1", orderId: "3015", store: "Galaxy Toys", status: "pending", date: h(1),
    customer: "Lior Ben-David", email: "lior.bd@gmail.com", phone: "+972-50-111-2233",
    address: "12 Herzl St, Tel Aviv, Israel",
    total: "$42.00",
    supplier: null, tracking: null, issue: null,
    items: [
      { name: "Soldier Figurine",   material: "PLA",  color: "Gray",   qty: 1, unitPrice: "$22.00" },
      { name: "Dragon Miniature",   material: "PETG", color: "Black",  qty: 2, unitPrice: "$10.00" },
    ],
  },
  {
    id: "2", orderId: "3014", store: "Mini World", status: "in_production", date: h(2),
    customer: "Noa Shapiro", email: "noa.shapiro@miniworld.co.il", phone: "+972-52-444-5566",
    address: "45 Ben Gurion Blvd, Haifa, Israel",
    total: "$87.50",
    supplier: "PrintHub TLV", tracking: null, issue: null,
    items: [
      { name: "Spider Soldier",     material: "Resin", color: "White",  qty: 3, unitPrice: "$18.50" },
      { name: "Castle Base Plate",  material: "PLA",   color: "Brown",  qty: 1, unitPrice: "$31.50" },
    ],
  },
  {
    id: "3", orderId: "3013", store: "Galaxy Toys", status: "shipped", date: h(5),
    customer: "Avi Cohen", email: "avi.cohen@galaxytoys.com", phone: "+972-54-777-8899",
    address: "8 Rothschild Ave, Tel Aviv, Israel",
    total: "$120.00",
    supplier: "3D Masters London", tracking: "IL9923847651GB", issue: null,
    items: [
      { name: "Knight Figurine",    material: "PLA",  color: "Silver", qty: 4, unitPrice: "$20.00" },
      { name: "Wizard Staff",       material: "ABS",  color: "Gold",   qty: 2, unitPrice: "$10.00" },
      { name: "Shield Prop",        material: "PLA",  color: "Red",    qty: 2, unitPrice: "$10.00" },
    ],
  },
  {
    id: "4", orderId: "3012", store: "Print & Play", status: "issue", date: h(8),
    customer: "Maya Levi", email: "maya.levi@gmail.com", phone: "+972-58-222-3344",
    address: "3 Jabotinsky St, Ramat Gan, Israel",
    total: "$55.00",
    supplier: "FabLab Tokyo", tracking: null,
    issue: { type: "supplier_rejected", detail: "Supplier rejected the order: print file resolution too low (min 0.1mm required). Customer notified." },
    items: [
      { name: "Anime Character",    material: "Resin", color: "White",  qty: 1, unitPrice: "$35.00" },
      { name: "Display Stand",      material: "PLA",   color: "Black",  qty: 2, unitPrice: "$10.00" },
    ],
  },
  {
    id: "5", orderId: "3011", store: "Mini World", status: "delivered", date: h(12),
    customer: "Yonatan Katz", email: "y.katz@hotmail.com", phone: "+972-50-333-4455",
    address: "20 Weizmann St, Rehovot, Israel",
    total: "$33.00",
    supplier: "PrintHub TLV", tracking: "IL8812736540IL", issue: null,
    items: [
      { name: "Soldier Figurine",   material: "PLA",  color: "Green",  qty: 3, unitPrice: "$11.00" },
    ],
  },
  {
    id: "6", orderId: "3010", store: "Galaxy Toys", status: "shipped", date: h(18),
    customer: "Dana Peretz", email: "dana.peretz@gmail.com", phone: "+972-52-555-6677",
    address: "55 Einstein St, Beer Sheva, Israel",
    total: "$99.99",
    supplier: "MakerSpace NYC", tracking: "US7765432109IL", issue: null,
    items: [
      { name: "Dragon Miniature",   material: "Resin", color: "Red",    qty: 2, unitPrice: "$24.99" },
      { name: "Dragon Egg",         material: "PLA",   color: "Gold",   qty: 1, unitPrice: "$25.00" },
      { name: "Display Base",       material: "ABS",   color: "Black",  qty: 1, unitPrice: "$25.01" },
    ],
  },
  {
    id: "7", orderId: "3009", store: "Print & Play", status: "in_production", date: h(24),
    customer: "Roi Mizrachi", email: "roi.m@printplay.co.il", phone: "+972-54-888-9900",
    address: "14 King David St, Jerusalem, Israel",
    total: "$74.00",
    supplier: "FabLab Tokyo", tracking: null, issue: null,
    items: [
      { name: "Samurai Warrior",    material: "Resin", color: "White",  qty: 2, unitPrice: "$27.00" },
      { name: "Cherry Blossom Deco",material: "PLA",   color: "Pink",   qty: 2, unitPrice: "$10.00" },
    ],
  },
  {
    id: "8", orderId: "3008", store: "Mini World", status: "delivered", date: h(30),
    customer: "Shira Goldberg", email: "shira.g@gmail.com", phone: "+972-58-111-2200",
    address: "7 Allenby St, Tel Aviv, Israel",
    total: "$61.00",
    supplier: "PrintHub TLV", tracking: "IL7701234567IL", issue: null,
    items: [
      { name: "Castle Tower",       material: "PLA",  color: "Gray",   qty: 1, unitPrice: "$40.00" },
      { name: "Castle Gate",        material: "PLA",  color: "Gray",   qty: 1, unitPrice: "$21.00" },
    ],
  },
  {
    id: "9", orderId: "3007", store: "Galaxy Toys", status: "issue", date: d(2),
    customer: "Eitan Barak", email: "eitan.b@gmail.com", phone: "+972-50-666-7788",
    address: "33 HaNassi Ave, Haifa, Israel",
    total: "$48.50",
    supplier: "Imprimerie Paris", tracking: "FR6654321098IL",
    issue: { type: "shipping_issue", detail: "Package stuck at customs for 3 days. Tracking shows 'Held at IL customs checkpoint'. Action required: provide commercial invoice to customs broker." },
    items: [
      { name: "Eiffel Tower Model", material: "PLA",  color: "Silver", qty: 1, unitPrice: "$48.50" },
    ],
  },
  {
    id: "10", orderId: "3006", store: "Print & Play", status: "delivered", date: d(2),
    customer: "Tamar Hadad", email: "tamar.hadad@gmail.com", phone: "+972-52-999-0011",
    address: "9 Begin St, Netanya, Israel",
    total: "$115.00",
    supplier: "SGPrint Co.", tracking: "SG5543210987IL", issue: null,
    items: [
      { name: "Merlion Figurine",   material: "Resin", color: "White", qty: 2, unitPrice: "$35.00" },
      { name: "Singapore Map Tile", material: "PLA",   color: "Blue",  qty: 1, unitPrice: "$25.00" },
      { name: "Gift Box Insert",    material: "PLA",   color: "White", qty: 1, unitPrice: "$20.00" },
    ],
  },
  {
    id: "11", orderId: "3005", store: "Mini World", status: "shipped", date: d(3),
    customer: "Guy Shabtai", email: "guy.s@miniworld.co.il", phone: "+972-54-222-3344",
    address: "2 Nordau Blvd, Tel Aviv, Israel",
    total: "$29.99",
    supplier: "PrintHub TLV", tracking: "IL6632109876IL", issue: null,
    items: [
      { name: "Pirate Ship Mini",   material: "PLA",  color: "Brown",  qty: 1, unitPrice: "$29.99" },
    ],
  },
  {
    id: "12", orderId: "3004", store: "Galaxy Toys", status: "delivered", date: d(3),
    customer: "Hila Friedman", email: "hila.f@gmail.com", phone: "+972-58-444-5566",
    address: "6 Rambam St, Petah Tikva, Israel",
    total: "$83.00",
    supplier: "3D Masters London", tracking: "GB4421098765IL", issue: null,
    items: [
      { name: "Knight Set (3pcs)",  material: "Resin", color: "Silver", qty: 1, unitPrice: "$60.00" },
      { name: "Stone Castle Base",  material: "PLA",   color: "Gray",   qty: 1, unitPrice: "$23.00" },
    ],
  },
  {
    id: "13", orderId: "3003", store: "Print & Play", status: "pending", date: d(4),
    customer: "Omri Stern", email: "omri.stern@gmail.com", phone: "+972-50-777-8899",
    address: "18 Dizengoff St, Tel Aviv, Israel",
    total: "$57.00",
    supplier: null, tracking: null, issue: null,
    items: [
      { name: "Robot Warrior",      material: "ABS",  color: "Blue",   qty: 3, unitPrice: "$19.00" },
    ],
  },
  {
    id: "14", orderId: "3002", store: "Mini World", status: "delivered", date: d(5),
    customer: "Yael Natan", email: "yael.natan@gmail.com", phone: "+972-52-888-9900",
    address: "25 Bialik St, Ramat HaSharon, Israel",
    total: "$136.00",
    supplier: "FabBrasil", tracking: "BR3309876543IL", issue: null,
    items: [
      { name: "Carnival Dancer",    material: "Resin", color: "Yellow", qty: 2, unitPrice: "$38.00" },
      { name: "Carnival Float",     material: "PLA",   color: "Green",  qty: 1, unitPrice: "$30.00" },
      { name: "Feather Headpiece",  material: "PLA",   color: "Red",    qty: 2, unitPrice: "$15.00" },
    ],
  },
  {
    id: "15", orderId: "3001", store: "Galaxy Toys", status: "in_production", date: d(5),
    customer: "Benny Azulay", email: "benny.a@galaxytoys.com", phone: "+972-54-333-4455",
    address: "11 Sokolov St, Holon, Israel",
    total: "$44.00",
    supplier: "PrintHub TLV", tracking: null, issue: null,
    items: [
      { name: "Galaxy Fighter",     material: "PLA",  color: "White",  qty: 2, unitPrice: "$22.00" },
    ],
  },
  {
    id: "16", orderId: "2998", store: "Print & Play", status: "delivered", date: d(7),
    customer: "Nirit Dvir", email: "nirit.dvir@gmail.com", phone: "+972-58-555-6677",
    address: "4 Herzl St, Rishon LeZion, Israel",
    total: "$91.50",
    supplier: "PrintForge Dubai", tracking: "AE2198765432IL", issue: null,
    items: [
      { name: "Camel Figurine",     material: "Resin", color: "Tan",    qty: 3, unitPrice: "$20.50" },
      { name: "Desert Diorama",     material: "PLA",   color: "Sand",   qty: 1, unitPrice: "$30.00" },
    ],
  },
  {
    id: "17", orderId: "2995", store: "Mini World", status: "delivered", date: d(8),
    customer: "Idan Ohayon", email: "idan.o@gmail.com", phone: "+972-50-888-9911",
    address: "77 Begin Rd, Ashdod, Israel",
    total: "$68.00",
    supplier: "PrintHub TLV", tracking: "IL1087654321IL", issue: null,
    items: [
      { name: "Sea Turtle",         material: "Resin", color: "Green",  qty: 2, unitPrice: "$24.00" },
      { name: "Coral Reef Set",     material: "PLA",   color: "Orange", qty: 1, unitPrice: "$20.00" },
    ],
  },
  {
    id: "18", orderId: "2990", store: "Galaxy Toys", status: "shipped", date: d(10),
    customer: "Michal Bar", email: "michal.bar@gmail.com", phone: "+972-52-111-2233",
    address: "30 Weizmann St, Nes Ziona, Israel",
    total: "$52.00",
    supplier: "MakerSpace NYC", tracking: "US0076543210IL", issue: null,
    items: [
      { name: "Spaceship Model",    material: "PLA",  color: "Gray",   qty: 1, unitPrice: "$52.00" },
    ],
  },
  {
    id: "19", orderId: "2985", store: "Print & Play", status: "issue", date: d(12),
    customer: "Tzvi Yitzhak", email: "tzvi.y@gmail.com", phone: "+972-54-444-5577",
    address: "15 Jabotinsky St, Bnei Brak, Israel",
    total: "$39.00",
    supplier: "3D Masters London", tracking: null,
    issue: { type: "missing_data", detail: "Print file is missing. Customer uploaded a corrupted .STL file (0 bytes). Order cannot proceed until customer re-uploads a valid file. Email sent on " + new Date(Date.now() - 11 * 86400000).toLocaleDateString("en-GB") + ". No response yet." },
    items: [
      { name: "Big Ben Model",      material: "PLA",  color: "Gray",   qty: 1, unitPrice: "$39.00" },
    ],
  },
  {
    id: "20", orderId: "2980", store: "Mini World", status: "delivered", date: d(14),
    customer: "Anat Golan", email: "anat.golan@gmail.com", phone: "+972-58-666-7788",
    address: "1 HaYarkon St, Eilat, Israel",
    total: "$77.00",
    supplier: "PrintHub TLV", tracking: "IL9965432107IL", issue: null,
    items: [
      { name: "Red Sea Fish Set",   material: "Resin", color: "Multi",  qty: 3, unitPrice: "$19.00" },
      { name: "Coral Sculpture",    material: "PLA",   color: "Pink",   qty: 1, unitPrice: "$20.00" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const ISSUE_TYPE_LABEL = {
  supplier_rejected: "Supplier Rejected",
  shipping_issue:    "Shipping Issue",
  missing_data:      "Missing Data",
  no_supplier:       "No Supplier Found",
  production_delay:  "Production Delay",
};

// ─── Status badge (inline) ────────────────────────────────────────────────────

function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-2">
      <span className={`shrink-0 w-2 h-2 rounded-full ${cfg.dot}`} />
      <span className={`font-semibold uppercase tracking-wide ${cfg.text} ${size === "lg" ? "text-sm" : "text-[clamp(11px,0.9vw,13px)]"} truncate`}>
        {cfg.label}
      </span>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 mb-1">
      {children}
    </p>
  );
}

// ─── Order detail modal ───────────────────────────────────────────────────────

function OrderModal({ order, onClose }) {
  const cfg = STATUS_CONFIG[order.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(149,149,149,0.08)] backdrop-blur-[12px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[rgba(5,10,7,0.97)] shadow-2xl flex flex-col max-h-[90vh]"
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-white tracking-wide">
              Order #{order.orderId}
            </span>
            <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.text} ${cfg.border} ${cfg.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#5ac422 transparent" }}
        >

          {/* Issue banner */}
          {order.issue && (
            <div className="flex gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4">
              <AlertTriangle size={18} className="shrink-0 text-red-400 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-red-400">
                  {ISSUE_TYPE_LABEL[order.issue.type] ?? "Issue"}
                </span>
                <p className="text-sm text-zinc-200 leading-relaxed">{order.issue.detail}</p>
              </div>
            </div>
          )}

          {/* Customer + address row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <User size={14} />
                <SectionLabel>Customer</SectionLabel>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-white">{order.customer}</span>
                <span className="text-[12px] text-zinc-400">{order.email}</span>
                <span className="text-[12px] text-zinc-400">{order.phone}</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin size={14} />
                <SectionLabel>Shipping Address</SectionLabel>
              </div>
              <span className="text-sm text-zinc-200 leading-relaxed">{order.address}</span>
            </div>
          </div>

          {/* Supplier + tracking row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <Store size={14} />
                <SectionLabel>Supplier</SectionLabel>
              </div>
              {order.supplier ? (
                <span className="text-sm font-semibold text-white">{order.supplier}</span>
              ) : (
                <span className="text-sm text-zinc-500 italic">Not assigned yet</span>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-400">
                <Truck size={14} />
                <SectionLabel>Tracking</SectionLabel>
              </div>
              {order.tracking ? (
                <span className="text-sm font-mono font-semibold text-[#5ac422]">{order.tracking}</span>
              ) : (
                <span className="text-sm text-zinc-500 italic">No tracking yet</span>
              )}
            </div>
          </div>

          {/* Products table */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Package size={14} />
              <SectionLabel>Items</SectionLabel>
            </div>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_0.7fr_0.8fr] gap-3 px-4 py-2.5 bg-white/[0.04] border-b border-white/10">
                {["Product", "Material", "Color", "Qty", "Unit Price"].map((h) => (
                  <span key={h} className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                    {h}
                  </span>
                ))}
              </div>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[2fr_1fr_1fr_0.7fr_0.8fr] gap-3 items-center px-4 py-3 ${
                    i < order.items.length - 1 ? "border-b border-white/[0.07]" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-white truncate">{item.name}</span>
                  <span className="text-[12px] text-zinc-300">{item.material}</span>
                  <span className="text-[12px] text-zinc-300">{item.color}</span>
                  <span className="text-[12px] font-semibold text-zinc-100">×{item.qty}</span>
                  <span className="text-[12px] font-semibold text-[#5ac422]">{item.unitPrice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer row — date + total */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-[12px] text-zinc-500">
              Placed: {formatDateTime(order.date)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-zinc-400 uppercase tracking-wide">Total</span>
              <span className="text-lg font-extrabold text-[#5ac422]">{order.total}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [selected, setSelected]   = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ORDERS.filter((o) => {
      const matchSearch =
        !q ||
        o.orderId.toLowerCase().includes(q) ||
        o.store.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <DashboardLayout role="admin">
      <DashboardPage
        header={
          <div className="flex items-center gap-3">
            <DashboardPageTitle>Orders</DashboardPageTitle>
            <span className="rounded-full bg-[#5ac422]/15 border border-[#5ac422]/30 px-2.5 py-0.5 text-[13px] font-bold text-[#5ac422]">
              {filtered.length}
            </span>
          </div>
        }
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, store, or customer…"
            className="flex-1 min-w-[200px] rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#5ac422] transition-colors"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-3 py-2.5 text-sm text-white outline-none focus:border-[#5ac422] transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <DashboardCard title="All Orders" autoHeight>
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">No orders found.</p>
          ) : (
            <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-[0.8fr_1.4fr_1.4fr_1.2fr_1fr_0.8fr_32px] gap-3 px-2 pb-2 border-b border-white/20">
                {["Order", "Customer", "Store", "Status", "Date", "Total", ""].map((col) => (
                  <span key={col} className="text-[11px] font-semibold uppercase tracking-wide text-zinc-300">
                    {col}
                  </span>
                ))}
              </div>

              <ScrollableContent scrollbarSide="left">
                {filtered.map((order, index) => (
                  <div
                    key={order.id}
                    onClick={() => setSelected(order)}
                    className={`
                      grid grid-cols-[0.8fr_1.4fr_1.4fr_1.2fr_1fr_0.8fr_32px] gap-3 items-center py-3 px-2
                      hover:bg-[rgba(149,149,149,0.1)] transition-colors rounded-2xl cursor-pointer
                      ${index < filtered.length - 1 ? "border-b-[0.5px] border-white/10" : ""}
                    `}
                  >
                    <span className="text-[clamp(12px,1vw,14px)] font-semibold text-zinc-100 truncate">
                      #{order.orderId}
                    </span>
                    <span className="text-[clamp(12px,1vw,14px)] text-zinc-200 truncate">
                      {order.customer}
                    </span>
                    <span className="text-[clamp(12px,1vw,14px)] text-zinc-200 truncate">
                      {order.store}
                    </span>
                    <StatusBadge status={order.status} />
                    <span className="text-[11px] text-zinc-300">
                      {formatDate(order.date)}
                    </span>
                    <span className="text-[clamp(12px,1vw,14px)] font-semibold text-[#5ac422]">
                      {order.total}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelected(order)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:text-[#5ac422] hover:bg-[#5ac422]/10 transition-colors"
                      title="View details"
                    >
                      →
                    </button>
                  </div>
                ))}
              </ScrollableContent>
            </div>
          )}
        </DashboardCard>
      </DashboardPage>

      <AnimatePresence>
        {selected && (
          <OrderModal key="order-modal" order={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
