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
 *
 * Validation mirrors the website (src/features/forms/validators.ts and
 * src/features/PartnerJoin/supplierValidation.ts). The option lists below MUST be
 * kept in sync with src/features/PartnerJoin/supplierContent.ts.
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

var MAX_SHORT = 200;
var MAX_LONG = 2000;
// Plain fields with the same limits as the website. Composite cells
// (printTech, materials, packAndShip, additionalServices) are checked part by part.
var LIMITS = {
  fullName: MAX_SHORT, businessName: MAX_SHORT, email: MAX_SHORT, phone: MAX_SHORT,
  country: MAX_SHORT, city: MAX_SHORT, website: MAX_SHORT, shippingCarrier: MAX_SHORT,
  printerType: MAX_LONG, packagingMethod: MAX_LONG, additionalText: MAX_LONG,
};
var REQUIRED = [
  "fullName", "businessName", "email", "country", "city", "printTech",
  "printersAmount", "printerType", "materials", "packAndShip", "multipleOrders",
  "productionTime", "shippingDestiny", "selfPickup", "packagingMethod",
];

// ── Allowed values (sync with supplierContent.ts) ──────────────────────────────
var MATERIALS_BY_TECH = {
  "FDM": ["PLA", "PETG", "ABS", "ASA", "TPU", "TPE", "PA (Nylon)", "PC", "PP", "PEEK", "PEI (ULTEM)", "PLA-CF", "PETG-CF", "PA-CF", "PA-GF"],
  "SLA / DLP / MSLA": ["Standard Resin", "ABS-Like", "Tough", "Durable", "Flexible", "Elastic", "Rigid", "Clear", "High Temp", "Castable", "Dental", "Biocompatible"],
  "SLS": ["PA12", "PA11", "TPU", "PP", "PA12-GF", "PA-CF"],
  "MJF": ["PA12", "PA11", "TPU", "PP"],
  "PolyJet": ["Rigid Resin", "Flexible / Rubber-Like", "Clear", "Full-Color", "High Temp", "Biocompatible", "Digital Materials"],
  "LPBF / DMLS / SLM": ["Stainless Steel (316L, 17-4PH)", "Aluminum (AlSi10Mg)", "Titanium (Ti64)", "Inconel (625, 718)", "Tool Steel", "Cobalt Chrome", "Copper"],
  "Ceramic / Concrete": ["Concrete", "Cementitious Materials", "Clay", "Alumina", "Zirconia", "Silicon Carbide", "Ceramic-Filled Resin"],
};
var TECH_LABELS = Object.keys(MATERIALS_BY_TECH);
var SERVICE_OPTIONS = ["Post-Processing & Painting", "Assembly & Bonding", "3D Modeling & Design", "Quality Inspection"];
var CHOICES = {
  printersAmount: ["Up to 10 Printers", "11–25 Printers", "More than 25 Printers"],
  multipleOrders: ["Yes, on a regular basis", "Yes, but only a limited number", "No"],
  productionTime: ["Within 1 Business Day", "2–3 Business Days", "4–7 Business Days", "More than 7 Business Days"],
  shippingDestiny: ["Domestic Shipping Only", "International Shipping"],
  selfPickup: ["Yes", "No"],
};
var OTHER_PREFIX = "Other: ";
var PACK_NO_PREFIX = "No – ";

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
  var i, key;
  for (i = 0; i < COLUMNS.length; i++) {
    key = COLUMNS[i];
    if (key && data[key] != null && typeof data[key] !== "string") return "Invalid field: " + key;
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

  for (key in CHOICES) {
    if (CHOICES[key].indexOf(text_(data[key])) === -1) return "Invalid value: " + key;
  }

  return (
    checkMultiSelect_(text_(data.printTech), TECH_LABELS, "printTech", true) ||
    checkMultiSelect_(text_(data.additionalServices), SERVICE_OPTIONS, "additionalServices", false) ||
    checkMaterials_(text_(data.materials)) ||
    checkPackAndShip_(text_(data.packAndShip)) ||
    ""
  );
}

// "A; B; Other: details" – every item from the list, at most one "Other: …" (1–200 chars).
function checkMultiSelect_(value, allowed, name, required) {
  if (!value) return required ? "Missing field: " + name : "";
  var items = value.split("; ");
  var seenOther = false;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.indexOf(OTHER_PREFIX) === 0) {
      var detail = item.slice(OTHER_PREFIX.length).trim();
      if (seenOther || !detail || detail.length > MAX_SHORT) return "Invalid value: " + name;
      seenOther = true;
    } else if (allowed.indexOf(item) === -1) {
      return "Invalid value: " + name;
    }
  }
  return "";
}

// One line per technology: "FDM: PLA; PETG" … and optionally "Other: details".
function checkMaterials_(value) {
  var lines = value.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.indexOf(OTHER_PREFIX) === 0) {
      var detail = line.slice(OTHER_PREFIX.length).trim();
      if (!detail || detail.length > MAX_SHORT) return "Invalid value: materials";
      continue;
    }
    var sep = line.indexOf(": ");
    if (sep < 1) return "Invalid value: materials";
    var allowed = MATERIALS_BY_TECH[line.slice(0, sep)];
    if (!allowed) return "Invalid value: materials";
    var items = line.slice(sep + 2).split("; ");
    for (var j = 0; j < items.length; j++) {
      if (allowed.indexOf(items[j]) === -1) return "Invalid value: materials";
    }
  }
  return "";
}

// "Yes", or "No – details" (details 1–2000 chars).
function checkPackAndShip_(value) {
  if (value === "Yes") return "";
  if (value.indexOf(PACK_NO_PREFIX) === 0) {
    var detail = value.slice(PACK_NO_PREFIX.length).trim();
    if (detail && detail.length <= MAX_LONG) return "";
  }
  return "Invalid value: packAndShip";
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

function sampleData_() {
  return {
    fullName: "Test Person",
    businessName: "Test Print Farm",
    email: "test@example.com",
    phone: "",
    country: "Israel",
    city: "Tel Aviv",
    website: "",
    printTech: "FDM; SLS; Other: Binder Jetting",
    printersAmount: "Up to 10 Printers",
    printerType: "Bambu Lab X1C",
    materials: "FDM: PLA; PETG\nSLS: PA12\nOther: Wood-filled PLA",
    packAndShip: "Yes",
    multipleOrders: "Yes, on a regular basis",
    productionTime: "2–3 Business Days",
    shippingDestiny: "International Shipping",
    selfPickup: "No",
    shippingCarrier: "",
    packagingMethod: "Bubble wrap inside a cardboard box.",
    additionalServices: "Quality Inspection; Other: Laser engraving",
    additionalText: "",
  };
}

/** Run from the editor to check the script without the website. Adds one test row. */
function testDoPost() {
  var result = doPost({ postData: { contents: JSON.stringify({ hp: "", data: sampleData_() }) } });
  Logger.log(result.getContent());
}

/** Run from the editor: each case must be rejected (nothing is written). */
function testRejects() {
  var cases = [
    { phone: "-------" },
    { website: "not a site" },
    { productionTime: "Tomorrow" },
    { printTech: "FDM; Teleportation" },
    { materials: "FDM: Unobtainium" },
    { packAndShip: "No" },
    { additionalServices: "Other: " },
    { city: new Array(202).join("x") },
  ];
  cases.forEach(function (change) {
    var data = Object.assign(sampleData_(), change);
    Logger.log(JSON.stringify(change).slice(0, 60) + " → " + (validate_(data) || "ACCEPTED (unexpected)"));
  });
  Logger.log("valid sample → " + (validate_(sampleData_()) || "accepted"));
}
