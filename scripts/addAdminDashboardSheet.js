const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const wb = XLSX.readFile(FILE);

// 1. Check if AdminDashboardTest sheet exists
if (wb.SheetNames.includes("AdminDashboardTest")) {
    console.log("AdminDashboardTest sheet already exists in testData.xlsx");
} else {
    console.log("AdminDashboardTest sheet is missing. Creating and adding it...");
    const sheetData = [
        [
            "TestID",
            "Issue",
            "Description",
            "UserName",
            "Password",
            "Persona",
            "FromDate",
            "ToDate"
        ],
        [
            "TC01_AdminDashboardLoad",
            "4001",
            "Verify Admin Dashboard Load",
            "nipigev2@yopmail.com",
            "admin@123",
            "admin",
            "",
            ""
        ],
        [
            "TC02_AdminDashboardFilters",
            "4002",
            "Verify Admin Dashboard Filters",
            "nipigev2@yopmail.com",
            "admin@123",
            "admin",
            "6/1/25",
            "6/10/26"
        ],
        [
            "TC03_AdminOrderChartDropdown",
            "4003",
            "Verify Admin Order Chart",
            "nipigev2@yopmail.com",
            "admin@123",
            "admin",
            "6/1/25",
            "6/10/26"
        ],
        [
            "TC04_AdminRevenueDropdown",
            "4004",
            "Verify Admin Revenue Dropdown",
            "nipigev2@yopmail.com",
            "admin@123",
            "admin",
            "6/1/25",
            "6/10/26"
        ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "AdminDashboardTest");
    console.log("AdminDashboardTest sheet added successfully.");
}

// 2. Verify Regression sheet entry for AdminDashboardTest
const regSheet = wb.Sheets["Regression"];
const regData = XLSX.utils.sheet_to_json(regSheet, { header: 1 });
const headers = regData[0];
const testNameIdx = headers.indexOf("TestName");

let hasRow = false;
for (let i = 1; i < regData.length; i++) {
    if (regData[i] && regData[i][testNameIdx] === "AdminDashboardTest") {
        hasRow = true;
        break;
    }
}

if (!hasRow) {
    console.log("AdminDashboardTest row is missing in Regression sheet. Adding it...");
    // Find the next empty row index or just push to data
    const newRow = [];
    newRow[headers.indexOf("TestName")] = "AdminDashboardTest";
    newRow[headers.indexOf("Run")] = "YES";
    newRow[headers.indexOf("Mode")] = "serial";
    regData.push(newRow);

    // Write back to Regression sheet
    wb.Sheets["Regression"] = XLSX.utils.aoa_to_sheet(regData);
    console.log("AdminDashboardTest row added to Regression sheet successfully.");
} else {
    console.log("AdminDashboardTest row already exists in Regression sheet.");
}

XLSX.writeFile(wb, FILE);
console.log("Saved testData.xlsx successfully.");
