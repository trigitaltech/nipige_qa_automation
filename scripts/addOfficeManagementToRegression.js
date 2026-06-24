/**
 * Appends OfficeManagementTest to the Regression sheet in testData.xlsx.
 * Run once: node scripts/addOfficeManagementToRegression.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const REGRESSION_SHEET = "Regression";
const TEST_NAME = "OfficeManagementTest";

const wb = XLSX.readFile(FILE);
const ws = wb.Sheets[REGRESSION_SHEET];
if (!ws) {
    console.error(`Sheet "${REGRESSION_SHEET}" not found in ${FILE}`);
    process.exit(1);
}

const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

const alreadyExists = data.some((row) => row[0] === TEST_NAME);
if (alreadyExists) {
    console.log(`'${TEST_NAME}' already exists in Regression sheet — nothing to do.`);
    process.exit(0);
}

data.push([TEST_NAME, "YES", "serial"]);

wb.Sheets[REGRESSION_SHEET] = XLSX.utils.aoa_to_sheet(data);
XLSX.writeFile(wb, FILE);
console.log(`Added '${TEST_NAME}' to Regression sheet in ${FILE}`);
