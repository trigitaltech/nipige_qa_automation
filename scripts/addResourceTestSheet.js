/**
 * Updates (or replaces) the "ResourceTest" sheet in testData.xlsx — 35 test cases.
 * Run once: node scripts/addResourceTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "ResourceTest";

const rows = [
    // ── Resource List Page ──
    {
        "TestID": "TC_RES_01",
        "Issue": "11001",
        "Description": "Verify Resource Setup page loads successfully and displays all summary cards (Total Currencies, Active Rates, Pending Update, Last Sync).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Resource Setup page loads successfully with all summary cards displayed."
    },
    {
        "TestID": "TC_RES_02",
        "Issue": "11002",
        "Description": "Verify system displays an error/empty state when resource API fails to load.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Proper error or empty state is displayed and page does not crash."
    },
    {
        "TestID": "TC_RES_03",
        "Issue": "11003",
        "Description": "Verify clicking Create Resource opens the Add Resource page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is navigated to the Add Resource page."
    },
    {
        "TestID": "TC_RES_04",
        "Issue": "11004",
        "Description": "Verify Create Resource button is inaccessible for users without create permission.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Button is disabled, hidden, or access denied occurs."
    },
    {
        "TestID": "TC_RES_05",
        "Issue": "11005",
        "Description": "Verify search returns matching resource records when valid code/name/symbol is entered.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching resource records are displayed in the grid."
    },
    {
        "TestID": "TC_RES_06",
        "Issue": "11006",
        "Description": "Verify search displays \"No records found\" for non-existing resource data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"No records found\" or empty state message is displayed."
    },
    {
        "TestID": "TC_RES_07",
        "Issue": "11007",
        "Description": "Verify resource type filter displays only selected resource types.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only resources of the selected type are displayed."
    },
    {
        "TestID": "TC_RES_08",
        "Issue": "11008",
        "Description": "Verify invalid filter combinations return empty results without breaking UI.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty state is displayed safely."
    },
    {
        "TestID": "TC_RES_09",
        "Issue": "11009",
        "Description": "Verify Export button downloads resource data successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Export download begins and data is stored locally."
    },
    {
        "TestID": "TC_RES_10",
        "Issue": "11010",
        "Description": "Verify export failure displays proper error message when API returns error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Export error toast or message is displayed."
    },
    {
        "TestID": "TC_RES_11",
        "Issue": "11011",
        "Description": "Verify View icon opens selected resource details page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Resource details page is loaded successfully."
    },
    {
        "TestID": "TC_RES_12",
        "Issue": "11012",
        "Description": "Verify viewing a deleted resource shows appropriate error/redirect message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error page or redirection occurs safely."
    },
    {
        "TestID": "TC_RES_13",
        "Issue": "11013",
        "Description": "Verify Edit icon opens selected resource in edit mode.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Edit page is loaded with resource values populated."
    },
    {
        "TestID": "TC_RES_14",
        "Issue": "11014",
        "Description": "Verify edit access is restricted for unauthorized users.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Unauthorized notification or redirection occurs."
    },

    // ── Add Resource Page ──
    {
        "TestID": "TC_RES_15",
        "Issue": "11015",
        "Description": "Verify user can create a new resource with valid Resource Code, Name, Symbol, and Type.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Resource is created successfully."
    },
    {
        "TestID": "TC_RES_16",
        "Issue": "11016",
        "Description": "Verify resource creation fails when mandatory fields are left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows required fields and save is blocked."
    },
    {
        "TestID": "TC_RES_17",
        "Issue": "11017",
        "Description": "Verify Resource Code dropdown displays all available currency codes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dropdown loads all available currency codes correctly."
    },
    {
        "TestID": "TC_RES_18",
        "Issue": "11018",
        "Description": "Verify duplicate Resource Code cannot be created.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate code warning appears and save is blocked."
    },
    {
        "TestID": "TC_RES_19",
        "Issue": "11019",
        "Description": "Verify Currency toggle can be enabled successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Currency toggle is enabled and saved successfully."
    },
    {
        "TestID": "TC_RES_20",
        "Issue": "11020",
        "Description": "Verify resource creation fails when invalid special characters are entered in Resource Name.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error is displayed on Resource Name."
    },
    {
        "TestID": "TC_RES_21",
        "Issue": "11021",
        "Description": "Verify Resource ID is generated/displayed correctly for a new resource.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Resource ID is generated and shown correctly."
    },
    {
        "TestID": "TC_RES_22",
        "Issue": "11022",
        "Description": "Verify resource cannot be saved with duplicate Resource ID (if editable).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate Resource ID warning is shown."
    },

    // ── Exchange Rate History Section ──
    {
        "TestID": "TC_RES_23",
        "Issue": "11023",
        "Description": "Verify user can add exchange rate history with valid Base Currency, Rate, Start Date, and End Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Exchange rate is added successfully."
    },
    {
        "TestID": "TC_RES_24",
        "Issue": "11024",
        "Description": "Verify exchange rate cannot be added when Base Currency is not selected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears for Base Currency."
    },
    {
        "TestID": "TC_RES_25",
        "Issue": "11025",
        "Description": "Verify multiple exchange rate periods can be added using \"+\" button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "New rows for exchange rate periods are added to the list."
    },
    {
        "TestID": "TC_RES_26",
        "Issue": "11026",
        "Description": "Verify exchange rate cannot be saved with blank Rate value.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears on the Rate input."
    },
    {
        "TestID": "TC_RES_27",
        "Issue": "11027",
        "Description": "Verify decimal exchange rate values are accepted correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Decimals are accepted and saved successfully."
    },
    {
        "TestID": "TC_RES_28",
        "Issue": "11028",
        "Description": "Verify system rejects negative exchange rate values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears on negative rate values."
    },
    {
        "TestID": "TC_RES_29",
        "Issue": "11029",
        "Description": "Verify effective Start Date earlier than End Date is accepted.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Date range is accepted and saved successfully."
    },
    {
        "TestID": "TC_RES_30",
        "Issue": "11030",
        "Description": "Verify validation appears when End Date is earlier than Start Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows end date cannot be before start date."
    },
    {
        "TestID": "TC_RES_31",
        "Issue": "11031",
        "Description": "Verify overlapping date ranges are handled according to business rules.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Overlapping ranges show warning or error according to policies."
    },
    {
        "TestID": "TC_RES_32",
        "Issue": "11032",
        "Description": "Verify duplicate exchange rate periods for same date range are rejected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate periods error appears."
    },

    // ── Resource Details Page ──
    {
        "TestID": "TC_RES_33",
        "Issue": "11033",
        "Description": "Verify Resource Details page displays correct code, name, type, symbol, rate, and update timestamp.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All details match the database values correctly."
    },
    {
        "TestID": "TC_RES_34",
        "Issue": "11034",
        "Description": "Verify details page handles missing resource data gracefully without UI crash.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error placeholder or page is displayed without crashing."
    },

    // ── Edit & Delete Functionality ──
    {
        "TestID": "TC_RES_35",
        "Issue": "11035",
        "Description": "Verify user can update resource details and save changes successfully; also verify canceling update or deleting resource from confirmation popup does not modify existing data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Resource is updated successfully, and canceling discard or cancel delete actions leaves data unchanged."
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
