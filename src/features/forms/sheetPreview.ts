import type { SheetPayload } from "./submitToSheet.js";

// One definition per sheet column. The same list builds the payload that is sent
// and the dev console preview, so the preview always matches what is submitted.
// Column positions must match the COLUMNS array in docs/apps-script/*.gs.
export type SheetColumn<F> =
  /** A column filled from the form */
  | { letter: string; header: string; key: string; value: (form: F) => string }
  /** A column the script leaves empty (e.g. unlabeled spacer columns) */
  | { letter: string; header: string; empty: true }
  /** The "submitted at" column, filled by the script when the row is added */
  | { letter: string; header: string; timestamp: true };

export function buildSheetPayload<F>(
  columns: readonly SheetColumn<F>[],
  form: F,
): SheetPayload {
  const payload: SheetPayload = {};
  for (const column of columns) {
    if ("key" in column) payload[column.key] = column.value(form);
  }
  return payload;
}

const pad = (n: number) => String(n).padStart(2, "0");
function localTimestamp(date: Date): string {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/**
 * Dev only: prints the row exactly as it will land in the sheet.
 * Never runs in production builds (the values are personal data).
 */
export function logSheetPreview<F>(
  sheetName: string,
  columns: readonly SheetColumn<F>[],
  payload: SheetPayload,
): void {
  if (!import.meta.env.DEV) return;
  const rows = columns.map((column) => ({
    Column: column.letter,
    Header: column.header || "(no header)",
    Value:
      "key" in column
        ? (payload[column.key] ?? "")
        : "timestamp" in column
          ? `${localTimestamp(new Date())} (set by the script on insert)`
          : "",
  }));
  console.group(`[SHEET PREVIEW] ${sheetName}`);
  console.table(rows);
  console.groupEnd();
}
