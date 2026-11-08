import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import EntityFormPage, {
  EMPTY_ENTITY_FORM,
  type EntityFormValues,
} from "../../../features/dashboard/components/EntityFormPage.js";
import {
  addAdminSupplier,
  getAdminSupplierById,
  updateAdminSupplier,
} from "./adminSuppliers.js";

const LIST_PATH = "/dashboard/admin/suppliers";

/** Add (`/suppliers/new`) and edit (`/suppliers/:id/edit`) page for a supplier. */
export default function AdminSupplierForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existing = id ? getAdminSupplierById(id) : undefined;

  if (id && !existing) {
    return (
      <DashboardLayout role="admin">
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-sm text-zinc-400">Supplier not found.</p>
          <button
            type="button"
            onClick={() => navigate(LIST_PATH)}
            className="flex items-center gap-2 text-sm text-green-500 hover:underline"
          >
            <ArrowLeft size={15} /> Back to Suppliers
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (v: EntityFormValues) => {
    const input = { name: v.name, city: v.city, email: v.email, phone: v.phone, active: v.active };
    if (existing) updateAdminSupplier(existing.id, input);
    else addAdminSupplier(input);
    navigate(LIST_PATH, { replace: true });
  };

  return (
    <EntityFormPage
      title={existing ? "Edit Supplier" : "Add Supplier"}
      backTo={LIST_PATH}
      backLabel="Back to Suppliers"
      accentColor="#5ac422"
      namePlaceholder="e.g. PrintHub TLV"
      cityPlaceholder="e.g. Tel Aviv, Israel"
      initial={existing ? { ...EMPTY_ENTITY_FORM, ...existing } : EMPTY_ENTITY_FORM}
      onSubmit={handleSubmit}
    />
  );
}
