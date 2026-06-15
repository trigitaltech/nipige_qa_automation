const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const wb = XLSX.readFile(FILE);
console.log("Sheets in testData.xlsx:");
console.log(wb.SheetNames);

const regressionData = XLSX.utils.sheet_to_json(wb.Sheets["Regression"], { header: 1 });
console.log("\nRegression Sheet Sample:");
console.log(regressionData.slice(0, 5));

if (wb.SheetNames.includes("CommissionRuleTest")) {
    const comData = XLSX.utils.sheet_to_json(wb.Sheets["CommissionRuleTest"], { header: 1 });
    console.log("\nCommissionRuleTest Sheet Sample:");
    console.log(comData.slice(0, 5));
} else {
    console.log("\nCommissionRuleTest sheet not found. Need to create it.");
}
