// Field-level checks shared by the Join and Supplier forms. Messages are UI copy
// (not from the legal/marketing documents).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

export const MAX_SHORT = 200;
export const MAX_LONG = 2000;

export function required(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message;
}

export function checkEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Email is required";
  if (!EMAIL_RE.test(v)) return "Enter a valid email address";
  return undefined;
}

// Allowed characters, plus 7–15 actual digits (15 is the E.164 maximum).
export function checkPhone(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  const digits = v.replace(/\D/g, "").length;
  return PHONE_RE.test(v) && digits >= 7 && digits <= 15
    ? undefined
    : "Enter a valid phone number";
}

export function checkWebsite(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return url.hostname.includes(".") ? undefined : "Enter a valid website address";
  } catch {
    return "Enter a valid website address";
  }
}

export function checkLength(value: string, max: number): string | undefined {
  return value.length > max ? `Keep it under ${max} characters` : undefined;
}

export function clip(value: string, max = MAX_LONG): string {
  return value.trim().slice(0, max);
}
