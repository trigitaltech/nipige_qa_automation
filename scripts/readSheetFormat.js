const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const wb = XLSX.readFile(FILE);
const createAccountData = XLSX.utils.sheet_to_json(wb.Sheets["CreateAccountTest"], { header: 1 });
console.log("CreateAccountTest Columns:");
console.log(createAccountData[0]);
console.log(createAccountData[1]);
