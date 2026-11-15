/**
 * 3D-Fly – "Early Adapters List" sheet receiver (Join form).
 *
 * Paste into the Apps Script editor of the sheet (Extensions → Apps Script),
 * then Deploy → New deployment → Web app. See README.md in this folder.
 *
 * Columns are mapped by POSITION (the header typos in the sheet are left as is):
 *   A Full Name | B Email | C Country | D Phone Number | E Kind | F Website | G Submitted At
 */

// Payload keys, in column order (A, B, C, ...). Edit here if the sheet changes.
var COLUMNS = ["fullName", "email", "country", "phone", "kind", "website"];
var REQUIRED = ["fullName", "email", "country", "kind"];
var MAX_LENGTH = 2000;
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  for (var i = 0; i < REQUIRED.length; i++) {
    var value = data[REQUIRED[i]];
    if (typeof value !== "string" || !value.trim()) return "Missing field: " + REQUIRED[i];
  }
  if (!EMAIL_RE.test(String(data.email).trim())) return "Invalid email";
  return "";
}

// Trims, caps the length and neutralises spreadsheet formulas (=, +, -, @).
function sanitize_(value) {
  var text = value == null ? "" : String(value).trim().slice(0, MAX_LENGTH);
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
          phone: "",
          kind: "Store Owner",
          website: "",
        },
      }),
    },
  });
  Logger.log(result.getContent());
}
