import type { SelectOption } from "../../components/ui/SelectField.js";
import {
  MAX_SHORT,
  checkEmail,
  checkLength,
  checkPhone,
  checkWebsite,
  clip,
  required,
} from "../forms/validators.js";
import type { SheetPayload } from "../forms/submitToSheet.js";
import { buildSheetPayload, type SheetColumn } from "../forms/sheetPreview.js";

export interface JoinFormState {
  fullName: string;
  email: string;
  country: SelectOption | null;
  phone: string;
  kind: string;
  website: string;
  /** honeypot */
  hp: string;
}

export const EMPTY_JOIN_FORM: JoinFormState = {
  fullName: "",
  email: "",
  country: null,
  phone: "",
  kind: "",
  website: "",
  hp: "",
};

// Display order, used to focus the first invalid field.
export const JOIN_FIELD_ORDER = [
  "fullName",
  "email",
  "country",
  "phone",
  "kind",
  "website",
] as const;

export type JoinErrors = Partial<Record<(typeof JOIN_FIELD_ORDER)[number], string>>;

export function validateJoin(form: JoinFormState): JoinErrors {
  const errors: JoinErrors = {};
  const fullName =
    required(form.fullName, "Full name is required") ??
    checkLength(form.fullName, MAX_SHORT);
  if (fullName) errors.fullName = fullName;

  const email = checkEmail(form.email) ?? checkLength(form.email, MAX_SHORT);
  if (email) errors.email = email;

  if (!form.country) errors.country = "Select your country";

  const phone = checkPhone(form.phone);
  if (phone) errors.phone = phone;

  if (!form.kind) errors.kind = "Choose how you want to join";

  const website = checkWebsite(form.website) ?? checkLength(form.website, MAX_SHORT);
  if (website) errors.website = website;

  return errors;
}

export const JOIN_SHEET_NAME = "Early Adapters List";

/**
 * "Early Adapters List" columns A–G, by position (headers as in the sheet).
 * Must match COLUMNS in docs/apps-script/join-sheet.gs.
 */
export const JOIN_SHEET_COLUMNS: readonly SheetColumn<JoinFormState>[] = [
  { letter: "A", header: "Full Name", key: "fullName", value: (f) => clip(f.fullName, MAX_SHORT) },
  { letter: "B", header: "Email", key: "email", value: (f) => clip(f.email, MAX_SHORT) },
  { letter: "C", header: "Country", key: "country", value: (f) => f.country?.label ?? "" },
  { letter: "D", header: "Phone Number", key: "phone", value: (f) => clip(f.phone, MAX_SHORT) },
  { letter: "E", header: "Kind", key: "kind", value: (f) => f.kind },
  { letter: "F", header: "Website", key: "website", value: (f) => clip(f.website, MAX_SHORT) },
  { letter: "G", header: "", timestamp: true },
];

export function toJoinPayload(form: JoinFormState): SheetPayload {
  return buildSheetPayload(JOIN_SHEET_COLUMNS, form);
}
