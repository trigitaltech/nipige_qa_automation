/**
 * Updates (or replaces) the "TaxCodeTest" sheet in testData.xlsx — 35 test cases.
 * Run once: node scripts/addTaxCodeTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "TaxCodeTest";

const rows = [
    // ── Tax Setup Dashboard ──────────────────────────────────────────────────
    {
        "TestID": "TC_TAX_01",
        "Issue": "8001",
        "Description": "Verify Tax Setup page loads successfully with Total Codes, Active, Countries, and Expiring Soon summary cards displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Tax Setup page loads successfully with all four summary cards displayed."
    },
    {
        "TestID": "TC_TAX_02",
        "Issue": "8002",
        "Description": "Verify \"Create Tax Code\" button navigates to the Create Tax Code page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is successfully navigated to the Create Tax Code page."
    },
    {
        "TestID": "TC_TAX_03",
        "Issue": "8003",
        "Description": "Verify page displays a proper error message when tax data API fails to load.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Proper error message is displayed and the page does not crash."
    },
    {
        "TestID": "TC_TAX_04",
        "Issue": "8004",
        "Description": "Verify tax code records are displayed in the grid with all columns (Tax Code, Country, Start Date, End Date, Status, Actions).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Tax code records are visible with all relevant columns and actions displayed correctly."
    },
    {
        "TestID": "TC_TAX_05",
        "Issue": "8005",
        "Description": "Verify empty-state message is displayed when no tax codes exist.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Grid displays empty state message and remaining UI remains functional."
    },

    // ── Search Functionality ─────────────────────────────────────────────────
    {
        "TestID": "TC_TAX_06",
        "Issue": "8006",
        "Description": "Verify search returns matching tax code records when a valid tax code name is entered.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching records matching the searched tax code name are displayed in the grid."
    },
    {
        "TestID": "TC_TAX_07",
        "Issue": "8007",
        "Description": "Verify search returns matching records when a valid country name is entered.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching records for the searched country are displayed in the grid."
    },
    {
        "TestID": "TC_TAX_08",
        "Issue": "8008",
        "Description": "Verify \"No records found\" message appears for a non-existing tax code search.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"No records found\" or empty state message is displayed."
    },
    {
        "TestID": "TC_TAX_09",
        "Issue": "8009",
        "Description": "Verify clearing the search field restores the complete tax code list.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All tax code records are restored and displayed in the grid."
    },
    {
        "TestID": "TC_TAX_10",
        "Issue": "8010",
        "Description": "Verify special characters entered in the search field do not break the application.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Search handles special characters safely and displays empty state without crash."
    },

    // ── Country Filter ───────────────────────────────────────────────────────
    {
        "TestID": "TC_TAX_11",
        "Issue": "8011",
        "Description": "Verify selecting a country from the filter displays only matching country tax codes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only tax codes belonging to the filtered country are displayed."
    },
    {
        "TestID": "TC_TAX_12",
        "Issue": "8012",
        "Description": "Verify clicking \"Clear\" resets the country filter and displays all records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Country filter is reset and the complete list of tax codes is displayed."
    },
    {
        "TestID": "TC_TAX_13",
        "Issue": "8013",
        "Description": "Verify filter returns no records when the selected country has no tax codes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty state is displayed safely for the country with zero codes."
    },
    {
        "TestID": "TC_TAX_14",
        "Issue": "8014",
        "Description": "Verify country dropdown loads all available countries correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Country select dropdown displays the expected lists of available countries."
    },

    // ── Create Tax Code ──────────────────────────────────────────────────────
    {
        "TestID": "TC_TAX_15",
        "Issue": "8015",
        "Description": "Verify user can create a tax code with valid country, tax code, dates, and tax lines.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Tax code is created successfully and success toast notification is displayed."
    },
    {
        "TestID": "TC_TAX_16",
        "Issue": "8016",
        "Description": "Verify creation fails when Tenant Country is left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears indicating Country is required and save is blocked."
    },
    {
        "TestID": "TC_TAX_17",
        "Issue": "8017",
        "Description": "Verify creation fails when Tax Code is left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears indicating Tax Code is required and save is blocked."
    },
    {
        "TestID": "TC_TAX_18",
        "Issue": "8018",
        "Description": "Verify creation fails when Start Date is greater than End Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears indicating Start Date must be before End Date and save is blocked."
    },
    {
        "TestID": "TC_TAX_19",
        "Issue": "8019",
        "Description": "Verify creation fails when Tax Rate contains non-numeric values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error is displayed on the tax rate input field and save is blocked."
    },
    {
        "TestID": "TC_TAX_20",
        "Issue": "8020",
        "Description": "Verify user can add multiple tax lines using the \"+ Add Item\" button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Additional tax line rows are added to the form successfully."
    },
    {
        "TestID": "TC_TAX_21",
        "Issue": "8021",
        "Description": "Verify duplicate tax line names within the same tax code are not allowed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error or warning indicates line names must be unique."
    },
    {
        "TestID": "TC_TAX_22",
        "Issue": "8022",
        "Description": "Verify newly created tax code appears in the Tax Setup list after successful creation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Tax code is displayed in the list and dashboard counts are updated."
    },

    // ── View Tax Code ────────────────────────────────────────────────────────
    {
        "TestID": "TC_TAX_23",
        "Issue": "8023",
        "Description": "Verify clicking the View icon opens the selected tax code details in read-only mode.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected to the read-only View page of the tax code."
    },
    {
        "TestID": "TC_TAX_24",
        "Issue": "8024",
        "Description": "Verify all tax code details match the values shown in the list page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Tax code, country, dates, and rates match the grid data perfectly."
    },
    {
        "TestID": "TC_TAX_25",
        "Issue": "8025",
        "Description": "Verify editing controls are disabled on the View page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All form inputs and dropdowns are disabled/read-only."
    },

    // ── Edit Tax Code ────────────────────────────────────────────────────────
    {
        "TestID": "TC_TAX_26",
        "Issue": "8026",
        "Description": "Verify clicking the Edit icon opens the selected tax code in editable mode.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected to the Edit page with fields populated."
    },
    {
        "TestID": "TC_TAX_27",
        "Issue": "8027",
        "Description": "Verify user can update tax code details and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Updates are saved successfully and redirect to list page occurs."
    },
    {
        "TestID": "TC_TAX_28",
        "Issue": "8028",
        "Description": "Verify user can modify an existing tax rate and see updated values after saving.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Modified tax rate is saved and reflected in View/Listing pages."
    },
    {
        "TestID": "TC_TAX_29",
        "Issue": "8029",
        "Description": "Verify user can add a new tax line while editing a tax code.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "New tax line is appended to the code and saved successfully."
    },
    {
        "TestID": "TC_TAX_30",
        "Issue": "8030",
        "Description": "Verify update fails when mandatory fields are cleared during edit.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Clear validation errors appear and updating is blocked."
    },
    {
        "TestID": "TC_TAX_31",
        "Issue": "8031",
        "Description": "Verify update fails when End Date is earlier than Start Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows end date cannot be before start date and save is blocked."
    },
    {
        "TestID": "TC_TAX_32",
        "Issue": "8032",
        "Description": "Verify clicking Cancel on Edit page discards unsaved changes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Changes are discarded and user returns safely to the list page."
    },

    // ── Delete Tax Code ──────────────────────────────────────────────────────
    {
        "TestID": "TC_TAX_33",
        "Issue": "8033",
        "Description": "Verify clicking Delete icon displays the confirmation popup with correct tax code name.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Confirmation popup appears indicating the correct tax code to delete."
    },
    {
        "TestID": "TC_TAX_34",
        "Issue": "8034",
        "Description": "Verify clicking \"Yes, delete it!\" removes the tax code and updates dashboard counts.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Tax code is deleted and dashboard stats adjust instantly."
    },
    {
        "TestID": "TC_TAX_35",
        "Issue": "8035",
        "Description": "Verify clicking \"Cancel\" in the delete confirmation popup keeps the tax code unchanged in the list.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Deletion is cancelled, popup closes, and record remains in the table."
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
