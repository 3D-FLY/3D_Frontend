import type { SelectOption } from "../../components/ui/SelectField.js";
import {
  MAX_LONG,
  MAX_SHORT,
  checkEmail,
  checkLength,
  checkPhone,
  checkWebsite,
  clip,
  required,
} from "../forms/validators.js";
import type { SheetPayload } from "../forms/submitToSheet.js";
import {
  MATERIALS_OTHER,
  MATERIAL_GROUPS,
  OTHER_TECH_ID,
  TECH_OPTIONS,
} from "./supplierContent.js";

export const OTHER_SERVICE_ID = "other";

export interface SupplierFormState {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country: SelectOption | null;
  city: SelectOption | null;
  website: string;
  technologies: string[]; // TechOption ids
  techOther: string;
  printersAmount: string;
  printerType: string;
  materials: Record<string, string[]>; // techId -> selected materials
  materialsOther: string;
  packAndShip: string;
  packAndShipDetail: string;
  multipleOrders: string;
  productionTime: string;
  shippingDestiny: string;
  selfPickup: string;
  shippingCarrier: string;
  packagingMethod: string;
  services: string[]; // SERVICE_OPTIONS labels or OTHER_SERVICE_ID
  servicesOther: string;
  additionalText: string;
  /** honeypot */
  hp: string;
}

export const EMPTY_SUPPLIER_FORM: SupplierFormState = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  country: null,
  city: null,
  website: "",
  technologies: [],
  techOther: "",
  printersAmount: "",
  printerType: "",
  materials: {},
  materialsOther: "",
  packAndShip: "",
  packAndShipDetail: "",
  multipleOrders: "",
  productionTime: "",
  shippingDestiny: "",
  selfPickup: "",
  shippingCarrier: "",
  packagingMethod: "",
  services: [],
  servicesOther: "",
  additionalText: "",
  hp: "",
};

// Display order, used to focus the first invalid field.
export const SUPPLIER_FIELD_ORDER = [
  "fullName",
  "businessName",
  "email",
  "phone",
  "country",
  "city",
  "website",
  "technologies",
  "techOther",
  "printersAmount",
  "printerType",
  "materials",
  "materialsOther",
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
] as const;

export type SupplierErrors = Partial<
  Record<(typeof SUPPLIER_FIELD_ORDER)[number], string>
>;

/** Materials that still count: only for technologies that are currently checked. */
export function activeMaterials(form: SupplierFormState): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const techId of form.technologies) {
    const picked = form.materials[techId];
    if (picked && picked.length > 0) result[techId] = picked;
  }
  return result;
}

export function validateSupplier(form: SupplierFormState): SupplierErrors {
  const e: SupplierErrors = {};
  const set = <K extends keyof SupplierErrors>(key: K, msg: string | undefined) => {
    if (msg && !e[key]) e[key] = msg;
  };

  set("fullName", required(form.fullName, "Full name is required") ?? checkLength(form.fullName, MAX_SHORT));
  set("businessName", required(form.businessName, "Business name is required") ?? checkLength(form.businessName, MAX_SHORT));
  set("email", checkEmail(form.email) ?? checkLength(form.email, MAX_SHORT));
  set("phone", checkPhone(form.phone));
  if (!form.country) e.country = "Select your country";
  if (!form.city) e.city = "Select or type your city";
  set("website", checkWebsite(form.website) ?? checkLength(form.website, MAX_SHORT));

  if (form.technologies.length === 0) {
    e.technologies = "Select at least one technology";
  }
  if (form.technologies.includes(OTHER_TECH_ID)) {
    set("techOther", required(form.techOther, "Please specify the technology") ?? checkLength(form.techOther, MAX_SHORT));
  }

  if (!form.printersAmount) e.printersAmount = "Choose the number of printers";
  set("printerType", required(form.printerType, "Tell us which printers you own") ?? checkLength(form.printerType, MAX_LONG));

  const hasListedMaterial = Object.keys(activeMaterials(form)).length > 0;
  if (!hasListedMaterial && !form.materialsOther.trim()) {
    e.materials = "Select at least one material";
  }
  set("materialsOther", checkLength(form.materialsOther, MAX_SHORT));

  if (!form.packAndShip) e.packAndShip = "Select an answer";
  if (form.packAndShip === "No") {
    set("packAndShipDetail", required(form.packAndShipDetail, "Please specify") ?? checkLength(form.packAndShipDetail, MAX_LONG));
  }
  if (!form.multipleOrders) e.multipleOrders = "Select an answer";
  if (!form.productionTime) e.productionTime = "Select an answer";
  if (!form.shippingDestiny) e.shippingDestiny = "Select an answer";
  if (!form.selfPickup) e.selfPickup = "Select an answer";
  set("shippingCarrier", checkLength(form.shippingCarrier, MAX_SHORT));
  set("packagingMethod", required(form.packagingMethod, "Describe your packaging method") ?? checkLength(form.packagingMethod, MAX_LONG));

  if (form.services.includes(OTHER_SERVICE_ID)) {
    set("servicesOther", required(form.servicesOther, "Please specify the service") ?? checkLength(form.servicesOther, MAX_SHORT));
  }
  set("additionalText", checkLength(form.additionalText, MAX_LONG));
  return e;
}

// Cell formats (multi-select values are joined with "; "):
//   printTech         FDM; SLS; Other: <text>
//   materials         one line per technology:  "FDM: PLA; PETG"  ... "Other: <text>"
//   additionalServices Post-Processing & Painting; Other: <text>
//   packAndShip       Yes | No – <details>
// Keys match the column order in docs/apps-script/supplier-sheet.gs
export function toSupplierPayload(form: SupplierFormState): SheetPayload {
  const techLabel = (id: string) => TECH_OPTIONS.find((t) => t.id === id)?.label ?? id;

  const printTech = TECH_OPTIONS.filter((t) => form.technologies.includes(t.id))
    .map((t) =>
      t.id === OTHER_TECH_ID ? `Other: ${clip(form.techOther, MAX_SHORT)}` : t.label,
    )
    .join("; ");

  const materialLines: string[] = [];
  const picked = activeMaterials(form);
  for (const group of MATERIAL_GROUPS) {
    const list = picked[group.techId];
    if (list) materialLines.push(`${techLabel(group.techId)}: ${list.join("; ")}`);
  }
  if (form.materialsOther.trim()) {
    materialLines.push(`${MATERIALS_OTHER.heading.replace(":", "")}: ${clip(form.materialsOther, MAX_SHORT)}`);
  }

  const services = form.services
    .map((s) =>
      s === OTHER_SERVICE_ID
        ? `Other: ${clip(form.servicesOther, MAX_SHORT)}`
        : s,
    )
    .join("; ");

  return {
    fullName: clip(form.fullName, MAX_SHORT),
    businessName: clip(form.businessName, MAX_SHORT),
    email: clip(form.email, MAX_SHORT),
    phone: clip(form.phone, MAX_SHORT),
    country: form.country?.label ?? "",
    city: form.city?.label ?? "",
    website: clip(form.website, MAX_SHORT),
    printTech,
    printersAmount: form.printersAmount,
    printerType: clip(form.printerType),
    materials: materialLines.join("\n"),
    packAndShip:
      form.packAndShip === "No"
        ? `No – ${clip(form.packAndShipDetail)}`
        : form.packAndShip,
    multipleOrders: form.multipleOrders,
    productionTime: form.productionTime,
    shippingDestiny: form.shippingDestiny,
    selfPickup: form.selfPickup,
    shippingCarrier: clip(form.shippingCarrier, MAX_SHORT),
    packagingMethod: clip(form.packagingMethod),
    additionalServices: services,
    additionalText: clip(form.additionalText),
  };
}
