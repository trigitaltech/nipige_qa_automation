/**
 * Merges testData.xlsx conflict between origin/develop and our branch (Ros/QA-automation).
 *
 * Strategy: start from develop's workbook (has CouponTest, PartnerReportTest, and develop's
 * Regression additions) and layer in our additions:
 *   - the new "BulkNotification" data sheet (not in develop)
 *   - the "BulkNotificationTest" row in the Regression sheet (not in develop's Regression)
 *
 * Nothing from develop is removed or overwritten. Run once: node scripts/mergeTestDataConflict.js
 */
const XLSX = require("xlsx");
const path = require("path");

const DEVELOP_FILE = path.resolve(__dirname, "../tmp_xlsx_compare/develop.xlsx");
const OURS_FILE = path.resolve(__dirname, "../tmp_xlsx_compare/ours.xlsx");
const OUTPUT_FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");

const devWb = XLSX.readFile(DEVELOP_FILE);
const oursWb = XLSX.readFile(OURS_FILE);

console.log("develop sheets:", devWb.SheetNames.length);
console.log("ours sheets:", oursWb.SheetNames.length);

// 1) Add our new "BulkNotification" data sheet (develop doesn't have it).
if (!devWb.SheetNames.includes("BulkNotification")) {
  XLSX.utils.book_append_sheet(devWb, oursWb.Sheets["BulkNotification"], "BulkNotification");
  console.log("Added 'BulkNotification' sheet from our branch.");
} else {
  console.log("'BulkNotification' sheet already present in develop — skipping (unexpected).");
}

// 2) Merge the Regression sheet: union of develop's rows + our "BulkNotificationTest" row.
const devReg = XLSX.utils.sheet_to_json(devWb.Sheets.Regression);
const oursReg = XLSX.utils.sheet_to_json(oursWb.Sheets.Regression);

const devNames = new Set(devReg.map((r) => r.TestName));
const missingFromDev = oursReg.filter((r) => !devNames.has(r.TestName));
console.log("Rows from our Regression sheet missing in develop's:", missingFromDev.map((r) => r.TestName));

const mergedReg = [...devReg, ...missingFromDev];

const headers = ["TestName", "Run", "Mode"];
const wsData = [headers, ...mergedReg.map((r) => headers.map((h) => (r[h] !== undefined ? r[h] : "")))];
devWb.Sheets.Regression = XLSX.utils.aoa_to_sheet(wsData);

console.log("Merged Regression row count:", mergedReg.length);
console.log("Final sheet list:", devWb.SheetNames.join(", "));

XLSX.writeFile(devWb, OUTPUT_FILE);
console.log(`Written merged workbook to ${OUTPUT_FILE}`);
