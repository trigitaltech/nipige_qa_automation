/**
 * Appends ZoneManagementTest to the Regression sheet in testData.xlsx.
 * Run once: node scripts/addZoneManagementToRegression.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET = "Regression";

const wb = XLSX.readFile(FILE);
const ws = wb.Sheets[SHEET];
if (!ws) {
  console.error(`Sheet "${SHEET}" not found in ${FILE}`);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Check not already present
const alreadyExists = data.some((row) => row[0] === "ZoneManagementTest");
if (alreadyExists) {
  console.log("ZoneManagementTest already exists in Regression sheet — nothing to do.");
  process.exit(0);
}

data.push(["ZoneManagementTest", "YES", "serial"]);

wb.Sheets[SHEET] = XLSX.utils.aoa_to_sheet(data);
XLSX.writeFile(wb, FILE);
console.log(`Added ZoneManagementTest to Regression sheet in ${FILE}`);
