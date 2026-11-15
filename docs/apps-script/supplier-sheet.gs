/**
 * 3D-Fly – "Early Supplier" sheet receiver (supplier application).
 *
 * Paste into the Apps Script editor of the sheet (Extensions → Apps Script),
 * then Deploy → New deployment → Web app. See README.md in this folder.
 *
 * Columns are mapped by POSITION (header typos such as "Ptiner Type" and
 * "Shipping Destiney" are left as they are). Empty strings mark the unlabeled
 * columns H, M and V, which stay empty. "Other" details are written inside the main cell.
 *
 *   A Full Name | B Business Name | C Email | D Phone Number | E Country | F City | G Website
 *   H (empty)
 *   I Print Tech | J Printers Amount | K Ptiner Type | L Materials
 *   M (empty)
 *   N Pack and Ship | O Multiple Orders | P Production Time | Q Shipping Destiney | R Self Pickup
 *   S Shipping Carrier | T Packaging Method | U Additional Services
 *   V (empty)
 *   W Additional text | X Submitted At
 *
 * Multi-select cells use "; " between items. "Materials" has one line per technology.
 */

// Payload keys, in column order (A..W). "" = intentionally empty column.
var COLUMNS = [
  "fullName", "businessName", "email", "phone", "country", "city", "website", // A-G
  "",                                                                         // H
  "printTech", "printersAmount", "printerType", "materials",                  // I-L
  "",                                                                         // M
  "packAndShip", "multipleOrders", "productionTime", "shippingDestiny",       // N-Q
  "selfPickup", "shippingCarrier", "packagingMethod", "additionalServices",   // R-U
  "",                                                                         // V
  "additionalText",                                                           // W
];
var REQUIRED = [
  "fullName", "businessName", "email", "country", "city", "printTech",
  "printersAmount", "printerType", "materials", "packAndShip", "multipleOrders",
  "productionTime", "shippingDestiny", "selfPickup", "packagingMethod",
];
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
      return key ? sanitize_(data[key]) : "";
    });
    row.push(
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss")
    ); // column X

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
          businessName: "Test Print Farm",
          email: "test@example.com",
          phone: "",
          country: "Israel",
          city: "Tel Aviv",
          website: "",
          printTech: "FDM; SLS",
          printersAmount: "Up to 10 Printers",
          printerType: "Bambu Lab X1C",
          materials: "FDM: PLA; PETG\nSLS: PA12",
          packAndShip: "Yes",
          multipleOrders: "Yes, on a regular basis",
          productionTime: "2–3 Business Days",
          shippingDestiny: "International Shipping",
          selfPickup: "No",
          shippingCarrier: "",
          packagingMethod: "Bubble wrap inside a cardboard box.",
          additionalServices: "Quality Inspection",
          additionalText: "",
        },
      }),
    },
  });
  Logger.log(result.getContent());
}
