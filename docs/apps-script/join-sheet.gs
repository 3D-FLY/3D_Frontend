/**
 * 3D-Fly – "Early Adapters List" sheet receiver (Join form).
 *
 * Paste into the Apps Script editor of the sheet (Extensions → Apps Script),
 * then Deploy → New deployment → Web app. See README.md in this folder.
 *
 * Columns are mapped by POSITION (the header typos in the sheet are left as is):
 *   A Full Name | B Email | C Country | D Phone Number | E Kind | F Website | G Submitted At
 *
 * Validation mirrors the website (src/features/forms/validators.ts and
 * src/features/Join/joinValidation.ts). Keep KIND_OPTIONS in sync with
 * JOIN_FORM.kinds in src/features/Join/joinContent.ts.
 */

// Payload keys, in column order (A, B, C, ...). Edit here if the sheet changes.
var COLUMNS = ["fullName", "email", "country", "phone", "kind", "website"];

var MAX_SHORT = 200;
var LIMITS = { fullName: MAX_SHORT, email: MAX_SHORT, country: MAX_SHORT, phone: MAX_SHORT, kind: MAX_SHORT, website: MAX_SHORT };
var REQUIRED = ["fullName", "email", "country", "kind"];
var KIND_OPTIONS = ["Store Owner", "3D Printing Supplier", "Other (Partnership / Collaboration)"];

var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;
var WEBSITE_RE = /^(https?:\/\/)?[^\s\/?#]+\.[^\s\/?#]+([\/?#]\S*)?$/i;

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Honeypot: the page never fills this. A value means a bot; answer "ok" and save nothing.
    if (body.hp) return json_({ ok: true });

    var data = body.data || body;
    var error = validate_(data);
    if (error) return json_({ ok: false, error: error });

    var row = COLUMNS.map(function (key) {
      return sanitize_(data[key]);
    });
    row.push(
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss")
    ); // column G

    lock.waitLock(10000);
    // The bound script writes to the first sheet. Change if the data lives elsewhere.
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "Server error" });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

function validate_(data) {
  var i, key;
  for (i = 0; i < COLUMNS.length; i++) {
    key = COLUMNS[i];
    if (data[key] != null && typeof data[key] !== "string") return "Invalid field: " + key;
  }
  for (i = 0; i < REQUIRED.length; i++) {
    if (!text_(data[REQUIRED[i]])) return "Missing field: " + REQUIRED[i];
  }
  for (key in LIMITS) {
    if (text_(data[key]).length > LIMITS[key]) return "Too long: " + key;
  }
  if (!EMAIL_RE.test(text_(data.email))) return "Invalid email";
  if (!validPhone_(text_(data.phone))) return "Invalid phone";
  if (text_(data.website) && !WEBSITE_RE.test(text_(data.website))) return "Invalid website";
  if (KIND_OPTIONS.indexOf(text_(data.kind)) === -1) return "Invalid kind";
  return "";
}

// Optional; when present: allowed characters and 7–15 actual digits.
function validPhone_(value) {
  if (!value) return true;
  var digits = value.replace(/\D/g, "").length;
  return PHONE_RE.test(value) && digits >= 7 && digits <= 15;
}

function text_(value) {
  return value == null ? "" : String(value).trim();
}

// Trims and neutralises spreadsheet formulas (=, +, -, @).
function sanitize_(value) {
  var text = text_(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(object) {
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Run from the editor to check the script without the website. Adds one test row. */
function testDoPost() {
  var result = doPost({
    postData: {
      contents: JSON.stringify({
        hp: "",
        data: {
          fullName: "Test Person",
          email: "test@example.com",
          country: "Israel",
          phone: "+972 50-123-4567",
          kind: "Store Owner",
          website: "example.com",
        },
      }),
    },
  });
  Logger.log(result.getContent());
}

/** Run from the editor: each case must be rejected (nothing is written). */
function testRejects() {
  var base = { fullName: "Test", email: "test@example.com", country: "Israel", phone: "", kind: "Store Owner", website: "" };
  var cases = [
    { email: "not-an-email" },
    { phone: "-------" },
    { website: "not a site" },
    { kind: "Hacker" },
    { fullName: new Array(202).join("x") },
  ];
  cases.forEach(function (change) {
    var data = Object.assign({}, base, change);
    Logger.log(JSON.stringify(change).slice(0, 60) + " → " + (validate_(data) || "ACCEPTED (unexpected)"));
  });
}
