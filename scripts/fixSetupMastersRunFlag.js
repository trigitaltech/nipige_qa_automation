/**
 * Fixes the Regression sheet: SetupMasters has Run=YES but SetupMasters.spec.ts has never existed
 * in this repo (it's a data-only sheet, like InventoryManagement which is correctly Run=NO) — this
 * breaks `npm test` for everyone since SuiteManager generates a require() for a missing file.
 * Run once: node scripts/fixSetupMastersRunFlag.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET = "Regression";

const wb = XLSX.readFile(FILE);
const rows = XLSX.utils.sheet_to_json(wb.Sheets[SHEET]);

const row = rows.find((r) => r.TestName === "SetupMasters");
if (!row) {
  console.log("'SetupMasters' row not found in Regression — nothing to fix.");
  process.exit(0);
}
if (String(row.Run).toUpperCase() !== "YES") {
  console.log(`'SetupMasters' Run is already '${row.Run}' — nothing to fix.`);
  process.exit(0);
}

row.Run = "NO";

const headers = ["TestName", "Run", "Mode"];
const wsData = [headers, ...rows.map((r) => headers.map((h) => (r[h] !== undefined ? r[h] : "")))];
wb.Sheets[SHEET] = XLSX.utils.aoa_to_sheet(wsData);

XLSX.writeFile(wb, FILE);
console.log("Set SetupMasters Run=NO in the Regression sheet.");
