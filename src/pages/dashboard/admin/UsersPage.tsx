import { useState, useMemo } from "react";
import { Store } from "lucide-react";
import ActiveBadge from "../../../features/dashboard/components/ActiveBadge.js";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import EntityCard from "../../../features/dashboard/components/EntityCard.js";
import StaggerItem from "../../../features/dashboard/components/StaggerItem.js";
import { getAdminStores, removeAdminStore, type StorePlan } from "./adminStores.js";

// ─── Constants ────────────────────────────────────────────────────────────────
const PLAN_BADGE: Record<StorePlan, string> = {
  basic:      "bg-zinc-700/60 text-zinc-400 border border-zinc-600/40",
  pro:        "bg-[#22a8c4]/15 text-[#22a8c4] border border-[#22a8c4]/30",
  enterprise: "bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState(getAdminStores);
  const [search, setSearch] = useState("");

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

  const handleDelete = (id: string) => {
    removeAdminStore(id);
    setStores(getAdminStores());
  };

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
              onClick={() => navigate("/dashboard/admin/users/new")}
              className="h-10 rounded-md bg-[#22a8c4] px-3 md:px-5 text-[13px] font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-all whitespace-nowrap"
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
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((store, i) => (
              <StaggerItem key={store.id} index={i}>
              <EntityCard
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
                onEdit={() => navigate(`/dashboard/admin/users/${store.id}/edit`)}
                onDelete={() => handleDelete(store.id)}
                onNavigate={() => navigate(`/dashboard/admin/users/${store.id}`)}
                navigateLabel="View Detail"
              />
              </StaggerItem>
            ))}
          </div>
        )}
      </DashboardPage>

    </DashboardLayout>
  );
}
