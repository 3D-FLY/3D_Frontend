import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import EntityFormPage, {
  EMPTY_ENTITY_FORM,
  type EntityFormValues,
} from "../../../features/dashboard/components/EntityFormPage.js";
import {
  addAdminStore,
  getAdminStoreById,
  updateAdminStore,
  type StorePlan,
} from "./adminStores.js";

const LIST_PATH = "/dashboard/admin/users";

/** Add (`/users/new`) and edit (`/users/:id/edit`) page for a store. */
export default function AdminStoreForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existing = id ? getAdminStoreById(id) : undefined;

  if (id && !existing) {
    return (
      <DashboardLayout role="admin">
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-sm text-zinc-400">Store not found.</p>
          <button
            type="button"
            onClick={() => navigate(LIST_PATH)}
            className="flex items-center gap-2 text-sm text-green-500 hover:underline"
          >
            <ArrowLeft size={15} /> Back to Stores
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (v: EntityFormValues) => {
    const input = {
      name: v.name,
      city: v.city,
      email: v.email,
      phone: v.phone,
      plan: v.plan as StorePlan,
      active: v.active,
    };
    if (existing) updateAdminStore(existing.id, input);
    else addAdminStore(input);
    navigate(LIST_PATH, { replace: true });
  };

  return (
    <EntityFormPage
      title={existing ? "Edit Store" : "Add Store"}
      backTo={LIST_PATH}
      backLabel="Back to Stores"
      accentColor="#22a8c4"
      withPlan
      namePlaceholder="e.g. UrbanPrints NYC"
      cityPlaceholder="e.g. New York, United States"
      initial={existing ? { ...EMPTY_ENTITY_FORM, ...existing } : EMPTY_ENTITY_FORM}
      onSubmit={handleSubmit}
    />
  );
}
