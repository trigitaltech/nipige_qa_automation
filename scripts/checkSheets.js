const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const wb = XLSX.readFile(FILE);
console.log("Sheet names in testData.xlsx:");
console.log(wb.SheetNames);
