# Google Sheets receivers (Apps Script)

Two web apps, one per sheet. Each appends a row when a form on the site is submitted.

| Form | Sheet | Script | `.env` variable |
|---|---|---|---|
| Join (`/join`) | Early Adapters List | `join-sheet.gs` | `VITE_JOIN_SHEET_URL` |
| Supplier application (`/join-as-partner`) | Early Supplier | `supplier-sheet.gs` | `VITE_SUPPLIER_SHEET_URL` |

## Publish (done by someone with edit access to the sheet)

1. Open the sheet → **Extensions → Apps Script**.
2. Replace the editor contents with the matching `.gs` file from this folder.
3. Select `testDoPost` and click **Run** (approve permissions once). A test row is added and `{"ok":true}` is logged. Delete the test row afterwards.
4. **Deploy → New deployment → Select type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the **Web app URL** (ends with `/exec`).
6. In the frontend repo: copy `.env.example` to `.env` and paste the URL into the matching variable. Restart `npm run dev`.

After editing a script, use **Deploy → Manage deployments → Edit → New version**. The URL stays the same.

## How it works

- The page sends `POST` with `Content-Type: text/plain;charset=utf-8` and a JSON body: `{ "hp": "", "data": { ... } }`. `text/plain` avoids a CORS preflight, which Apps Script cannot answer.
- The script replies with JSON: `{ "ok": true }` or `{ "ok": false, "error": "..." }`. The page shows the confirmation only when `ok` is true.
- Columns are mapped by position, set in the `COLUMNS` array at the top of each script. Sheet headers (including the typos) are never changed.
- Column **G** (Join) and **X** (Supplier) get a "Submitted At" timestamp in the script's time zone. Add a header there if you want one.
- Columns H, M and V of the supplier sheet stay empty. "Other" details are written inside the main cell (`Other: ...`). To use them as separate columns, change `COLUMNS` and the payload in `src/features/PartnerJoin/supplierValidation.ts`.

## Cell formats (supplier sheet)

- Multi-select values are separated by `; `.
- **Materials** has one line per technology: `FDM: PLA; PETG` / `SLS: PA12` / `Other: ...`.
- **Pack and Ship**: `Yes`, or `No – <details>`.

## Safety notes

- The web app URL is embedded in the site and is public, so anyone can send requests to it. The script defends itself: required-field and email checks, a 2000-character cap per cell, a honeypot field (`hp`), formula neutralising (values starting with `=`, `+`, `-`, `@` get a leading `'`), and a script lock for concurrent writes.
- Without a URL in `.env`: in dev the forms run in **mock mode** (a yellow notice appears and the payload is logged with `[MOCK SUBMIT]`; nothing is saved). In a production build the forms show an error instead of a fake success.
