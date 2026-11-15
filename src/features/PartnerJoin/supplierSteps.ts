// Step layout for the supplier wizard (/join-as-partner).
// Step titles, summaries and error-summary names are UI copy, not document copy.

import {
  MATERIAL_GROUPS,
  OTHER_TECH_ID,
  SUPPLIER_LABELS,
  TECH_OPTIONS,
} from "./supplierContent.js";
import {
  activeMaterials,
  type SupplierErrors,
  type SupplierFormState,
} from "./supplierValidation.js";

export type SupplierFieldKey = keyof SupplierErrors;

export interface WizardStep {
  id: string;
  title: string;
  fields: readonly SupplierFieldKey[];
}

export const WIZARD_STEPS: readonly WizardStep[] = [
  {
    id: "business",
    title: "Business Details",
    fields: ["fullName", "businessName", "email", "phone", "country", "city", "website"],
  },
  {
    id: "capabilities",
    title: "Printing Capabilities",
    fields: [
      "technologies",
      "techOther",
      "materials",
      "materialsOther",
      "printersAmount",
      "printerType",
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Services",
    fields: [
      "packAndShip",
      "packAndShipDetail",
      "multipleOrders",
      "productionTime",
      "shippingDestiny",
      "selfPickup",
      "shippingCarrier",
      "packagingMethod",
      "services",
      "servicesOther",
      "additionalText",
    ],
  },
  { id: "review", title: "Review & Submit", fields: [] },
];

export const REVIEW_STEP = WIZARD_STEPS.length - 1;

export function stepErrorKeys(
  stepIndex: number,
  errors: SupplierErrors,
): SupplierFieldKey[] {
  return (WIZARD_STEPS[stepIndex]?.fields ?? []).filter((key) => errors[key]);
}

/** Highest step the user may open: every step before it must be valid. */
export function maxReachableStep(errors: SupplierErrors): number {
  let step = 0;
  while (step < REVIEW_STEP && stepErrorKeys(step, errors).length === 0) step += 1;
  return step;
}

const stripColon = (text: string) => text.replace(/:\s*$/, "");

/** Short names used in the error summary. */
export const FIELD_NAMES: Record<SupplierFieldKey, string> = {
  fullName: stripColon(SUPPLIER_LABELS.fullName),
  businessName: stripColon(SUPPLIER_LABELS.businessName),
  email: stripColon(SUPPLIER_LABELS.email),
  phone: "Phone Number",
  country: stripColon(SUPPLIER_LABELS.country),
  city: stripColon(SUPPLIER_LABELS.city),
  website: "Business Website",
  technologies: "3D Printing Technologies",
  techOther: "Other Technology",
  materials: "Printing Materials",
  materialsOther: "Other Material",
  printersAmount: "Number of 3D Printers",
  printerType: "Printers You Own",
  packAndShip: "Package and Ship",
  packAndShipDetail: "Package and Ship – Details",
  multipleOrders: "Multiple Orders",
  productionTime: "Production Time",
  shippingDestiny: "Shipping Destinations",
  selfPickup: "Local Pickup",
  shippingCarrier: "Shipping Carrier",
  packagingMethod: "Packaging Method",
  services: "Additional Services",
  servicesOther: "Other Service",
  additionalText: "Anything Else",
};

/** One or two short lines describing what was filled in a step (live summary). */
export function stepSummary(stepIndex: number, form: SupplierFormState): string[] {
  const join = (parts: (string | undefined)[], sep: string) =>
    parts.filter((p): p is string => Boolean(p && p.trim())).join(sep);

  if (stepIndex === 0) {
    return [
      join([form.fullName, form.businessName], " · "),
      join([form.city?.label, form.country?.label], ", "),
    ].filter(Boolean);
  }

  if (stepIndex === 1) {
    const techs = TECH_OPTIONS.filter((t) => form.technologies.includes(t.id)).map((t) =>
      t.id === OTHER_TECH_ID ? form.techOther.trim() || "Other" : t.label,
    );
    const materialCount =
      Object.values(activeMaterials(form)).reduce((sum, list) => sum + list.length, 0) +
      (form.materialsOther.trim() ? 1 : 0);
    return [
      techs.join(", "),
      join(
        [materialCount ? `${materialCount} materials` : "", form.printersAmount],
        " · ",
      ),
    ].filter(Boolean);
  }

  if (stepIndex === 2) {
    return [
      join([form.shippingDestiny, form.productionTime], " · "),
      form.services.length ? `${form.services.length} additional services` : "",
    ].filter(Boolean);
  }

  return [];
}

/** Material groups in document order, for checked technologies only. */
export function groupsFor(technologies: readonly string[]) {
  return MATERIAL_GROUPS.filter((g) => technologies.includes(g.techId));
}
