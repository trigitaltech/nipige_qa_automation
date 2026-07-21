/**
 * Updates (or replaces) the "ConcernTest" sheet in testData.xlsx — 20 test cases.
 * Run once: node scripts/addConcernTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "ConcernTest";

const rows = [
    // ── Concern Listing Screen: Positive ─────────────────────────────────────
    {
        "TestID": "TC_CONCERN_01",
        "Issue": "7001",
        "Description": "Verify Concern page loads successfully",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Concern statistics cards and concern list displayed."
    },
    {
        "TestID": "TC_CONCERN_02",
        "Issue": "7002",
        "Description": "Search concern using valid concern name",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching concern record displayed."
    },
    {
        "TestID": "TC_CONCERN_03",
        "Issue": "7003",
        "Description": "Click \"System\" filter tab",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only System concerns displayed."
    },
    {
        "TestID": "TC_CONCERN_04",
        "Issue": "7004",
        "Description": "Click \"Custom\" filter tab",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only Custom concerns displayed."
    },
    {
        "TestID": "TC_CONCERN_05",
        "Issue": "7005",
        "Description": "Click \"Create Concern\" button",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User navigates to Create Concern page."
    },

    // ── Concern Listing Screen: Negative ─────────────────────────────────────
    {
        "TestID": "TC_CONCERN_06",
        "Issue": "7006",
        "Description": "Search using non-existing concern name",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "No matching records found."
    },
    {
        "TestID": "TC_CONCERN_07",
        "Issue": "7007",
        "Description": "Enter special characters in search field",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Application handles input safely without crash."
    },
    {
        "TestID": "TC_CONCERN_08",
        "Issue": "7008",
        "Description": "Click Next pagination on last page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User remains on last page."
    },
    {
        "TestID": "TC_CONCERN_09",
        "Issue": "7009",
        "Description": "Delete concern currently in use",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Appropriate validation/error message displayed."
    },
    {
        "TestID": "TC_CONCERN_10",
        "Issue": "7010",
        "Description": "Access Concern page without required permission",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access denied or redirected appropriately"
    },

    // ── Create Concern Screen: Positive ──────────────────────────────────────
    {
        "TestID": "TC_CONCERN_11",
        "Issue": "7011",
        "Description": "Create Custom Concern with valid data",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Concern created successfully."
    },
    {
        "TestID": "TC_CONCERN_12",
        "Issue": "7012",
        "Description": "Create System Concern with valid data",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Concern created successfully."
    },
    {
        "TestID": "TC_CONCERN_13",
        "Issue": "7013",
        "Description": "Select Default Channel and Priority values",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Selected values saved correctly."
    },
    {
        "TestID": "TC_CONCERN_14",
        "Issue": "7014",
        "Description": "Verify Preview panel updates with entered concern name",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Preview reflects entered data."
    },
    {
        "TestID": "TC_CONCERN_15",
        "Issue": "7015",
        "Description": "Click Save with all mandatory fields completed",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Record saved and success message displayed."
    },

    // ── Create Concern Screen: Negative ──────────────────────────────────────
    {
        "TestID": "TC_CONCERN_16",
        "Issue": "7016",
        "Description": "Leave Concern Name blank and click Save",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Required field validation displayed."
    },
    {
        "TestID": "TC_CONCERN_17",
        "Issue": "7017",
        "Description": "Enter duplicate Concern Name",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate validation message displayed."
    },
    {
        "TestID": "TC_CONCERN_18",
        "Issue": "7018",
        "Description": "Enter special characters not allowed in Concern Name",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error displayed."
    },
    {
        "TestID": "TC_CONCERN_19",
        "Issue": "7019",
        "Description": "Deselect both Custom and System concern types (if allowed by UI) and Save",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displayed."
    },
    {
        "TestID": "TC_CONCERN_20",
        "Issue": "7020",
        "Description": "Enter Concern Name exceeding maximum character limit",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Input restricted or validation displayed."
    }
];

const headers = [
    "TestID",
    "Issue",
    "Description",
    "UserName",
    "Password",
    "persona",
    "ExpectedResult"
];

const wsData = [
    headers,
    ...rows.map((r) => headers.map((h) => r[h] || "")),
];

try {
    const wb = XLSX.readFile(FILE);
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    if (wb.SheetNames.includes(SHEET_NAME)) {
        const idx = wb.SheetNames.indexOf(SHEET_NAME);
        wb.SheetNames.splice(idx, 1);
        delete wb.Sheets[SHEET_NAME];
        console.log(`Removed existing sheet: "${SHEET_NAME}"`);
    }

    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, FILE);
    console.log(`Successfully updated ${rows.length} rows in '${SHEET_NAME}' sheet in ${FILE}`);
} catch (err) {
    console.error("Failed to update testData.xlsx:", err.message);
    process.exit(1);
}
