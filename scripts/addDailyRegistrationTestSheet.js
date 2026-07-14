/**
 * Updates (or replaces) the "Daily Registration Regression" sheet in testData.xlsx — 41 test cases.
 * Run once: node scripts/addDailyRegistrationTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "Daily Registration Regression";

const rows = [
    // ── Daily Registration Report Screen: Positive ──
    {
        "TestID": "DRR-001",
        "Issue": "18001",
        "Description": "Verify Daily Registration Report page loads successfully with all KPI cards, charts, and tables displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Daily Registration Report page loads successfully with all KPI cards, charts, and tables displayed."
    },
    {
        "TestID": "DRR-002",
        "Issue": "18002",
        "Description": "Verify Today filter displays registration data for the current day.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Registration details grid loads with records created today."
    },
    {
        "TestID": "DRR-003",
        "Issue": "18003",
        "Description": "Verify 7D filter displays registration data for the last 7 days.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Registration details grid loads with records created in the last 7 days."
    },
    {
        "TestID": "DRR-004",
        "Issue": "18004",
        "Description": "Verify 30D filter displays registration data for the last 30 days.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Registration details grid loads with records created in the last 30 days."
    },
    {
        "TestID": "DRR-005",
        "Issue": "18005",
        "Description": "Verify Custom date filter displays data for the selected date range.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Registration details grid loads with records created within custom date range."
    },
    {
        "TestID": "DRR-006",
        "Issue": "18006",
        "Description": "Verify Refresh button reloads the latest registration data successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Report reloads data successfully."
    },
    {
        "TestID": "DRR-007",
        "Issue": "18007",
        "Description": "Verify Export CSV button downloads registration report in CSV format.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "CSV download begins and data matches the grid."
    },
    {
        "TestID": "DRR-008",
        "Issue": "18008",
        "Description": "Verify PDF button downloads registration report in PDF format.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "PDF download begins."
    },
    {
        "TestID": "DRR-009",
        "Issue": "18009",
        "Description": "Verify View Download History button navigates to the download history page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User redirects to Download History registry."
    },
    {
        "TestID": "DRR-010",
        "Issue": "18010",
        "Description": "Verify Schedule Report button opens report scheduling functionality.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Schedule Report modal opens successfully."
    },
    {
        "TestID": "DRR-011",
        "Issue": "18011",
        "Description": "Verify Customer tab filters Daily Registration Trend chart correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Registration Trend chart filters correctly by Customer tab."
    },
    {
        "TestID": "DRR-012",
        "Issue": "18012",
        "Description": "Verify Partner tab filters Daily Registration Trend chart correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Registration Trend chart filters correctly by Partner tab."
    },
    {
        "TestID": "DRR-013",
        "Issue": "18013",
        "Description": "Verify Staff tab filters Daily Registration Trend chart correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Registration Trend chart filters correctly by Staff tab."
    },
    {
        "TestID": "DRR-014",
        "Issue": "18014",
        "Description": "Verify Registration Details search returns matching user records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching user record displayed."
    },
    {
        "TestID": "DRR-015",
        "Issue": "18015",
        "Description": "Verify Role, Source, and Status filters display matching registration records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching records displayed in table."
    },
    {
        "TestID": "DRR-016",
        "Issue": "18016",
        "Description": "Verify combined Search + Role + Source + Status filtering returns correct results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only records matching all the combined filters display."
    },

    // ── Daily Registration Report Screen: Negative ──
    {
        "TestID": "DRR-017",
        "Issue": "18017",
        "Description": "Verify error message is displayed when Custom date range has End Date earlier than Start Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows End Date cannot be earlier than Start Date."
    },
    {
        "TestID": "DRR-018",
        "Issue": "18018",
        "Description": "Verify page handles Registration Report API failure without crashing.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message displays and UI remains stable."
    },
    {
        "TestID": "DRR-019",
        "Issue": "18019",
        "Description": "Verify KPI cards display default values when no registration data exists.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "KPI cards display zero (0) values."
    },
    {
        "TestID": "DRR-020",
        "Issue": "18020",
        "Description": "Verify charts display empty-state message when dataset is unavailable.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty state is displayed in the chart containers."
    },
    {
        "TestID": "DRR-021",
        "Issue": "18021",
        "Description": "Verify Export CSV is restricted or handled correctly when no records exist.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "CSV download button is disabled or handles empty state."
    },
    {
        "TestID": "DRR-022",
        "Issue": "18022",
        "Description": "Verify PDF export handles empty datasets without generating corrupted files.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "PDF download button is disabled or handles empty state."
    },
    {
        "TestID": "DRR-023",
        "Issue": "18023",
        "Description": "Verify Refresh button handles network failure gracefully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Refresh stops and toast error shows network failure."
    },
    {
        "TestID": "DRR-024",
        "Issue": "18024",
        "Description": "Verify unauthorized users cannot access Daily Registration Report page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirection or Access Denied occurs."
    },
    {
        "TestID": "DRR-025",
        "Issue": "18025",
        "Description": "Verify search with invalid/random text returns no matching records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "No records found displays in grid."
    },
    {
        "TestID": "DRR-026",
        "Issue": "18026",
        "Description": "Verify applying filters with no matching data displays empty results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty results list in the table."
    },
    {
        "TestID": "DRR-027",
        "Issue": "18027",
        "Description": "Verify Registration Details table handles null values without UI breakage.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty cells or placeholders display cleanly."
    },
    {
        "TestID": "DRR-028",
        "Issue": "18028",
        "Description": "Verify pagination remains disabled or hidden when no records are available.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Pagination controls are hidden or disabled."
    },
    {
        "TestID": "DRR-029",
        "Issue": "18029",
        "Description": "Verify rapid multiple clicks on Export CSV do not create duplicate downloads.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only one download request is processed."
    },
    {
        "TestID": "DRR-030",
        "Issue": "18030",
        "Description": "Verify rapid multiple clicks on PDF export do not generate duplicate files.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only one download request is processed."
    },
    {
        "TestID": "DRR-031",
        "Issue": "18031",
        "Description": "Verify page performance remains stable when loading a large registration dataset (10,000+ records).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Reports load within acceptable performance thresholds."
    },

    // ── Customer Download History Screen: Positive ──
    {
        "TestID": "CDH-001",
        "Issue": "18032",
        "Description": "Verify Customer Download History page loads successfully with all table headers displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Download History page displays listing with headers."
    },
    {
        "TestID": "CDH-002",
        "Issue": "18033",
        "Description": "Verify Today filter displays customer download requests for the current day.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Today's request downloads show in table."
    },
    {
        "TestID": "CDH-003",
        "Issue": "18034",
        "Description": "Verify \"View Customer Report\" button navigates successfully to the Customer Report page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigates back to the report page."
    },
    {
        "TestID": "CDH-004",
        "Issue": "18035",
        "Description": "Verify download history records display correct Request ID, Date, Type, Requested By, Status, and Action values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All download log details display accurately."
    },
    {
        "TestID": "CDH-005",
        "Issue": "18036",
        "Description": "Verify pagination works correctly when multiple customer download history records exist.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Pagination advances table records."
    },

    // ── Customer Download History Screen: Negative ──
    {
        "TestID": "CDH-006",
        "Issue": "18037",
        "Description": "Verify \"No data available\" message is displayed when no customer download history records exist.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"No Data Available\" is displayed."
    },
    {
        "TestID": "CDH-007",
        "Issue": "18038",
        "Description": "Verify page handles Customer Download History API failure gracefully without application crash.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message displays and UI remains stable."
    },
    {
        "TestID": "CDH-008",
        "Issue": "18039",
        "Description": "Verify invalid date filter selection does not return incorrect download history records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty result state is displayed."
    },
    {
        "TestID": "CDH-009",
        "Issue": "18040",
        "Description": "Verify unauthorized users cannot access the Customer Download History page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirection or Access Denied occurs."
    },
    {
        "TestID": "CDH-010",
        "Issue": "18041",
        "Description": "Verify Action buttons are disabled or hidden when the requested report file is unavailable or failed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Download actions are disabled/absent."
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
