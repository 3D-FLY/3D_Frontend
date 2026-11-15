// Sends a form to a Google Apps Script web app that appends a row to a sheet.
// Scripts live in docs/apps-script/. URLs come from .env (see .env.example).

export type SheetTarget = "join" | "supplier";

const SHEET_URLS: Record<SheetTarget, string | undefined> = {
  join: import.meta.env.VITE_JOIN_SHEET_URL,
  supplier: import.meta.env.VITE_SUPPLIER_SHEET_URL,
};

const TIMEOUT_MS = 20_000;

function urlFor(target: SheetTarget): string | undefined {
  const url = SHEET_URLS[target]?.trim();
  return url ? url : undefined;
}

/** True when submissions are NOT saved anywhere (dev build without a sheet URL). */
export function isMockSubmit(target: SheetTarget): boolean {
  return import.meta.env.DEV && !urlFor(target);
}

export type SheetPayload = Record<string, string>;

export async function submitToSheet(
  target: SheetTarget,
  payload: SheetPayload,
): Promise<void> {
  const url = urlFor(target);

  if (!url) {
    if (import.meta.env.DEV) {
      // TEMP: mock until the Apps Script URL is configured in .env
      console.warn(
        `[MOCK SUBMIT] No sheet URL for "${target}". Nothing was saved. Payload:`,
        payload,
      );
      await new Promise((resolve) => setTimeout(resolve, 600));
      return;
    }
    // Production without a URL must fail loudly, never pretend to succeed.
    throw new Error(`Sheet URL for "${target}" is not configured.`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // text/plain keeps this a "simple" request (no CORS preflight), which
    // Apps Script web apps cannot answer.
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const result = (await response.json()) as { ok?: boolean; error?: string };
    if (!result.ok) {
      throw new Error(result.error ?? "The sheet rejected the submission.");
    }
  } finally {
    clearTimeout(timer);
  }
}
