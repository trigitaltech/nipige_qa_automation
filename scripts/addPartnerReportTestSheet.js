/**
 * Updates (or replaces) the "PartnerReportTest" sheet in testData.xlsx — 36 test cases.
 * Run once: node scripts/addPartnerReportTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "PartnerReportTest";

const rows = [
    // ── Preserved Spec-Required Test Cases ──
    {
        "TestID": "TC01_PartnerReportLoad",
        "Issue": "6001",
        "Description": "Verify Partner Report Page Load.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Partner Report page loads successfully with dashboard metrics, partner filters, and list."
    },
    {
        "TestID": "TC02_DateFilterValidation",
        "Issue": "6002",
        "Description": "Verify Partner Report Date Filters.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "45809",
        "ToDate": "46188",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Report reloads displaying only records within the selected From and To dates."
    },
    {
        "TestID": "TC03_RefreshValidation",
        "Issue": "6003",
        "Description": "Verify Refresh Button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Latest partner report records are fetched and reloaded."
    },
    {
        "TestID": "TC04_PartnerDirectorySearchValidation",
        "Issue": "6004",
        "Description": "Verify Partner Directory Search.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "Clickmart",
        "InvalidSearch": "INVALID123",
        "ExpectedResult": "Exact matching partner is returned for valid search; empty state displayed for invalid search."
    },
    {
        "TestID": "TC05_PartnerDirectoryTypeFilterValidation",
        "Issue": "6005",
        "Description": "Verify Partner Type Filter.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Filters partner records correctly by selected Partner type (e.g. Seller)."
    },
    {
        "TestID": "TC06_PartnerDirectoryStatusFilterValidation",
        "Issue": "6006",
        "Description": "Verify Partner Status Filter.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Filters partner records correctly by selected status (e.g. Active, Pending)."
    },

    // ── Positive Test Cases ──
    {
        "TestID": "TC_PR_POS_01",
        "Issue": "32001",
        "Description": "Verify user can successfully open the Create Partner Account page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Create Partner Account page is loaded successfully showing forms and steps."
    },
    {
        "TestID": "TC_PR_POS_02",
        "Issue": "32002",
        "Description": "Verify user can enter a valid Office Name and save the details.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Office Name is accepted and saved in form state."
    },
    {
        "TestID": "TC_PR_POS_03",
        "Issue": "32003",
        "Description": "Verify user can enter a valid Email ID in the Office section.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Valid email format is accepted without validation warnings."
    },
    {
        "TestID": "TC_PR_POS_04",
        "Issue": "32004",
        "Description": "Verify user can enter a valid Phone Number with country code.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Phone number is accepted and saved correctly."
    },
    {
        "TestID": "TC_PR_POS_05",
        "Issue": "32005",
        "Description": "Verify user can select a valid Seller Type from the dropdown.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Seller Type option is selected successfully."
    },
    {
        "TestID": "TC_PR_POS_06",
        "Issue": "32006",
        "Description": "Verify user can select a valid address from the map and populate location details.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Selecting location on map successfully fills coordinate and address inputs."
    },
    {
        "TestID": "TC_PR_POS_07",
        "Issue": "32007",
        "Description": "Verify user can proceed from Office step to Organization step using the Next button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Form advances to Organization step displaying relevant fields."
    },
    {
        "TestID": "TC_PR_POS_08",
        "Issue": "32008",
        "Description": "Verify user can create an organization with a unique Organization Name.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Unique Organization Name is saved successfully."
    },
    {
        "TestID": "TC_PR_POS_09",
        "Issue": "32009",
        "Description": "Verify user can successfully upload a valid logo file (PNG/JPG).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Logo is uploaded and thumbnail preview displays correctly."
    },
    {
        "TestID": "TC_PR_POS_10",
        "Issue": "32010",
        "Description": "Verify user can enter valid Registration No, GST/License No, and FSSAI No.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Registration numbers are verified and accepted in their respective inputs."
    },
    {
        "TestID": "TC_PR_POS_11",
        "Issue": "32011",
        "Description": "Verify user can select the Own Company checkbox and proceed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Checkbox is toggled and advances organization configurations."
    },
    {
        "TestID": "TC_PR_POS_12",
        "Issue": "32012",
        "Description": "Verify user can create Authentication details with valid Username, Email, Phone, and Password.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Authentication fields are validated and credentials saved."
    },
    {
        "TestID": "TC_PR_POS_13",
        "Issue": "32013",
        "Description": "Verify user can review, accept the Agreement, and successfully create a Partner Account.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Partner account registration completes and creates a new partner record."
    },

    // ── Negative Test Cases ──
    {
        "TestID": "TC_PR_NEG_14",
        "Issue": "32014",
        "Description": "Verify validation message appears when Office Name is left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Validation error shows Office Name is required."
    },
    {
        "TestID": "TC_PR_NEG_15",
        "Issue": "32015",
        "Description": "Verify invalid Email format is rejected in the Office section.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Validation error warns invalid email format."
    },
    {
        "TestID": "TC_PR_NEG_16",
        "Issue": "32016",
        "Description": "Verify user cannot proceed with an empty Phone Number field.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Proceed is blocked, highlighting Phone field."
    },
    {
        "TestID": "TC_PR_NEG_17",
        "Issue": "32017",
        "Description": "Verify system prevents progression when Seller Type is not selected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Proceed is blocked, highlighting Seller Type dropdown."
    },
    {
        "TestID": "TC_PR_NEG_18",
        "Issue": "32018",
        "Description": "Verify user cannot continue when mandatory address fields are empty.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Validation marks missing address fields and locks navigation."
    },
    {
        "TestID": "TC_PR_NEG_19",
        "Issue": "32019",
        "Description": "Verify duplicate Organization Name is not accepted.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Warning indicates Organization Name already exists."
    },
    {
        "TestID": "TC_PR_NEG_20",
        "Issue": "32020",
        "Description": "Verify unsupported logo file formats (e.g., .exe, .txt) are rejected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Logo upload fails showing file type validation error."
    },
    {
        "TestID": "TC_PR_NEG_21",
        "Issue": "32021",
        "Description": "Verify system displays an error when uploaded logo exceeds the allowed file size limit.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Logo upload fails displaying file size limit warning."
    },
    {
        "TestID": "TC_PR_NEG_22",
        "Issue": "32022",
        "Description": "Verify invalid Registration Number format is rejected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Validation triggers for invalid Registration number format."
    },
    {
        "TestID": "TC_PR_NEG_23",
        "Issue": "32023",
        "Description": "Verify invalid GST/License Number or FSSAI Number is rejected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Validation triggers warning of invalid characters or length in GST/FSSAI fields."
    },
    {
        "TestID": "TC_PR_NEG_24",
        "Issue": "32024",
        "Description": "Verify weak password or password not meeting policy requirements is not accepted in Authentication.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Validation triggers requesting at least 8 characters, numbers, and special symbols."
    },
    {
        "TestID": "TC_PR_NEG_25",
        "Issue": "32025",
        "Description": "Verify Partner Account creation is blocked when the Agreement checkbox is not accepted before submission.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Submit button remains disabled or validation alert shows Agreement must be accepted."
    },

    // ── Additional Dashboard & Report Validation Test Cases ──
    {
        "TestID": "TC_PR_POS_26",
        "Issue": "32026",
        "Description": "Verify newly created partner is displayed in the Partner Directory after successful registration.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Newly registered partner records populate correctly in Partner Directory list."
    },
    {
        "TestID": "TC_PR_POS_27",
        "Issue": "32027",
        "Description": "Verify partner status is shown as Active after successful account creation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Partner directory displays Active badge for the registered partner."
    },
    {
        "TestID": "TC_PR_POS_28",
        "Issue": "32028",
        "Description": "Verify created partner appears in the Partner Report dashboard metrics.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Partner Report total count and metrics dynamically increase reflecting new registration."
    },
    {
        "TestID": "TC_PR_POS_29",
        "Issue": "32029",
        "Description": "Verify Download History records the report download request successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "Download history grid logs request details and records download success status."
    },
    {
        "TestID": "TC_PR_NEG_30",
        "Issue": "32030",
        "Description": "Verify partner details are not displayed in reports when account creation fails due to validation errors.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ValidSearch": "",
        "InvalidSearch": "",
        "ExpectedResult": "No new records are reflected in Partner Reports or directories."
    }
];

const headers = [
    "TestID",
    "Issue",
    "Description",
    "UserName",
    "Password",
    "persona",
    "FromDate",
    "ToDate",
    "ValidSearch",
    "InvalidSearch",
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
