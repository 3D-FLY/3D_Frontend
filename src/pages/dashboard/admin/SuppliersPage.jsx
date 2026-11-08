import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";
import ActiveBadge from "../../../features/dashboard/components/ActiveBadge.js";
import EntityCard from "../../../features/dashboard/components/EntityCard.js";
import StaggerItem from "../../../features/dashboard/components/StaggerItem.js";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import { getAdminSuppliers, removeAdminSupplier } from "./adminSuppliers.js";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SuppliersPage() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState(getAdminSuppliers);
  const [search, setSearch]       = useState("");

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

  const handleDelete = (id) => {
    removeAdminSupplier(id);
    setSuppliers(getAdminSuppliers());
  };
  const handleViewOrders = (id) => console.log("View orders for supplier:", id);

  return (
    <DashboardLayout role="admin">
      <DashboardPage
        header={
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <DashboardPageTitle>Suppliers</DashboardPageTitle>
              <span className="rounded-full bg-[#5ac422]/15 border border-[#5ac422]/30 px-2.5 py-0.5 text-[13px] font-bold text-[#5ac422]">
                {suppliers.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/suppliers/new")}
              className="h-10 rounded-md bg-[#5ac422] px-3 md:px-5 text-[13px] font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-all whitespace-nowrap"
            >
              Add Supplier
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
          className="w-full rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#5ac422] transition-colors"
        />

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-zinc-500">No suppliers found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((supplier, i) => (
              <StaggerItem key={supplier.id} index={i}>
              <EntityCard
                icon={<Printer size={32} color="#5ac422" strokeWidth={1.5} />}
                accentColor="#5ac422"
                name={supplier.name}
                subtitle={supplier.city}
                badges={<ActiveBadge active={supplier.active} color="#5ac422" />}
                onClick={() => navigate(`/dashboard/admin/suppliers/${supplier.id}`)}
                onEdit={() => navigate(`/dashboard/admin/suppliers/${supplier.id}/edit`)}
                onDelete={() => handleDelete(supplier.id)}
                onNavigate={() => handleViewOrders(supplier.id)}
                navigateLabel="View Orders"
              />
              </StaggerItem>
            ))}
          </div>
        )}
      </DashboardPage>
    </DashboardLayout>
  );
}
