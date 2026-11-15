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

// Keys match the column order in docs/apps-script/join-sheet.gs
export function toJoinPayload(form: JoinFormState): SheetPayload {
  return {
    fullName: clip(form.fullName, MAX_SHORT),
    email: clip(form.email, MAX_SHORT),
    country: form.country?.label ?? "",
    phone: clip(form.phone, MAX_SHORT),
    kind: form.kind,
    website: clip(form.website, MAX_SHORT),
  };
}
