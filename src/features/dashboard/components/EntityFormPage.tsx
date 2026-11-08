import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../DashboardLayout.js";
import DashboardPage, { DashboardPageTitle } from "./DashboardPage.js";
import FormField from "./FormField.js";
import StaggerItem from "./StaggerItem.js";

export interface EntityFormValues {
  name: string;
  city: string;
  email: string;
  phone: string;
  plan: string;
  active: boolean;
}

export const EMPTY_ENTITY_FORM: EntityFormValues = {
  name: "",
  city: "",
  email: "",
  phone: "",
  plan: "basic",
  active: true,
};

interface EntityFormPageProps {
  /** Page title, e.g. "Add Supplier". */
  title: string;
  /** List page the Back button, Cancel and a successful save return to. */
  backTo: string;
  backLabel: string;
  /** Accent for the Save button and the Active toggle (runtime color, so inline style). */
  accentColor: string;
  /** Show the Plan select (stores only). */
  withPlan?: boolean;
  initial?: EntityFormValues;
  namePlaceholder: string;
  cityPlaceholder: string;
  onSubmit: (values: EntityFormValues) => void;
}

/** Full-page add/edit form for admin entities (suppliers, stores). Replaces the old popups. */
export default function EntityFormPage({
  title,
  backTo,
  backLabel,
  accentColor,
  withPlan = false,
  initial = EMPTY_ENTITY_FORM,
  namePlaceholder,
  cityPlaceholder,
  onSubmit,
}: EntityFormPageProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<EntityFormValues>(initial);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: "name" | "city" | "email" | "phone" | "plan") => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    setSubmitted(true);
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  const fields = [
    { label: "Name", key: "name", placeholder: namePlaceholder },
    { label: "City", key: "city", placeholder: cityPlaceholder },
    { label: "Email", key: "email", placeholder: "contact@example.com" },
    { label: "Phone", key: "phone", placeholder: "+1-555-000-0000" },
  ] as const;

  return (
    <DashboardLayout role="admin">
      <DashboardPage
        header={
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(backTo)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
              title={backLabel}
            >
              <ArrowLeft size={18} />
            </button>
            <DashboardPageTitle className="truncate">{title}</DashboardPageTitle>
          </div>
        }
      >
        <div className="flex max-w-2xl flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map(({ label, key, placeholder }, i) => (
              <StaggerItem key={key} index={i}>
                <FormField
                  label={label}
                  value={form[key]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  accentColor={accentColor}
                  error={key === "name" && submitted && !form.name.trim() ? "Name is required" : undefined}
                />
              </StaggerItem>
            ))}
            {withPlan && (
              <StaggerItem index={fields.length}>
                <FormField
                  as="select"
                  label="Plan"
                  value={form.plan}
                  onChange={set("plan")}
                  accentColor={accentColor}
                  options={[
                    { value: "basic", label: "Basic" },
                    { value: "pro", label: "Pro" },
                    { value: "enterprise", label: "Enterprise" },
                  ]}
                />
              </StaggerItem>
            )}
          </div>

          {/* Active toggle */}
          <StaggerItem index={fields.length + 1}>
            <div className="flex items-center gap-3">
              <span className="flex-1 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                Status
              </span>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                aria-label="Toggle active status"
                className={`relative h-6 w-12 rounded-full transition-colors ${form.active ? "" : "bg-zinc-700"}`}
                style={form.active ? { backgroundColor: accentColor } : undefined}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.active ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`w-14 text-sm font-semibold ${form.active ? "" : "text-zinc-500"}`}
                style={form.active ? { color: accentColor } : undefined}
              >
                {form.active ? "Active" : "Inactive"}
              </span>
            </div>
          </StaggerItem>

          <StaggerItem index={fields.length + 2}>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(backTo)}
                className="flex-1 rounded-md border border-white/10 py-2.5 text-sm text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-md py-2.5 text-sm font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
                style={{ backgroundColor: accentColor }}
              >
                Save
              </button>
            </div>
          </StaggerItem>
        </div>
      </DashboardPage>
    </DashboardLayout>
  );
}
