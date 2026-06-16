/**
 * Adds BulkNotificationTest to the Regression suite sheet (Run=YES) so it's included in `npm test`.
 * Run once: node scripts/addBulkNotificationToRegression.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET = "Regression";
const TEST_NAME = "BulkNotificationTest";

const wb = XLSX.readFile(FILE);
const ws = wb.Sheets[SHEET];
const rows = XLSX.utils.sheet_to_json(ws);

const existing = rows.find((r) => r.TestName === TEST_NAME);
if (existing) {
  existing.Run = "YES";
  existing.Mode = existing.Mode || "serial";
  console.log(`'${TEST_NAME}' already present in '${SHEET}' — updated Run=YES.`);
} else {
  // Mirrors BulkPromotionTest's settings (same Communications-area module, same shared-page pattern).
  rows.push({ TestName: TEST_NAME, Run: "YES", Mode: "serial" });
  console.log(`Added '${TEST_NAME}' to '${SHEET}' with Run=YES, Mode=serial.`);
}

const headers = ["TestName", "Run", "Mode"];
const wsData = [headers, ...rows.map((r) => headers.map((h) => (r[h] !== undefined ? r[h] : "")))];
const newWs = XLSX.utils.aoa_to_sheet(wsData);
wb.Sheets[SHEET] = newWs;

XLSX.writeFile(wb, FILE);
console.log(`Written ${rows.length} rows to '${SHEET}' sheet in ${FILE}`);
