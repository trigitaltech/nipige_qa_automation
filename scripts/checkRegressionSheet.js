const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const wb = XLSX.readFile(FILE);
const regressionData = XLSX.utils.sheet_to_json(wb.Sheets["Regression"], { header: 1 });

console.log("Regression Sheet data:");
for(let i=0; i<Math.min(10, regressionData.length); i++) {
    console.log(regressionData[i]);
}
