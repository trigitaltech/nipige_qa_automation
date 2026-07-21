/**
 * Updates (or replaces) the "PaymentReportTest" sheet in testData.xlsx — 20 test cases.
 * Run once: node scripts/addPaymentReportRegressionSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "PaymentReportTest";

const rows = [
    // ── Positive Test Cases ──
    {
        "TestID": "TC01_PaymentReportLoad",
        "Issue": "4001",
        "Description": "Verify the Payment Report page loads successfully with KPI cards, charts, filters, and payment data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Payment report page loads with Collections Trend, Payment Mode charts, and KPI cards visible."
    },
    {
        "TestID": "TC02_TodayFilter",
        "Issue": "4002",
        "Description": "Verify user can switch between date filters (Today, 7D, 30D, 90D, YTD) and view updated report data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Payment report data updates successfully when predefined date range filters are toggled."
    },
    {
        "TestID": "TC_PR_POS_03",
        "Issue": "41003",
        "Description": "Verify user can select a custom date range and view payment metrics for the selected period.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Custom date range is applied successfully, and payment records update accordingly."
    },
    {
        "TestID": "TC07_RefreshValidation",
        "Issue": "4007",
        "Description": "Verify clicking Refresh reloads the latest payment report data successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Latest payment report metrics are refreshed and loaded successfully."
    },
    {
        "TestID": "TC_PR_POS_05",
        "Issue": "41005",
        "Description": "Verify clicking Export CSV downloads the payment report in CSV format successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Payment report CSV file is downloaded with correct transactional data."
    },
    {
        "TestID": "TC_PR_POS_06",
        "Issue": "41006",
        "Description": "Verify clicking PDF downloads the payment report in PDF format successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Payment report PDF file is downloaded successfully with formatted transaction charts."
    },
    {
        "TestID": "TC_PR_POS_07",
        "Issue": "41007",
        "Description": "Verify clicking View Download History navigates to the Payment Download History page successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Successfully redirects user to the download history log screen."
    },
    {
        "TestID": "TC_PR_POS_08",
        "Issue": "41008",
        "Description": "Verify clicking Reconcile initiates the payment reconciliation process successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Payment reconciliation process begins and shows success confirmation modal."
    },
    {
        "TestID": "TC12_CollectionsTrendChart",
        "Issue": "4012",
        "Description": "Verify the Collections Trend, Payment by Mode, Success vs Failed Transactions, and Refund Breakdown charts display accurate data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "45817",
        "ToDate": "46196",
        "ExpectedResult": "Charts accurately map transaction and breakdown data values."
    },
    {
        "TestID": "TC_PR_POS_10",
        "Issue": "41010",
        "Description": "Verify KPI cards (Total Collected, Total Pending Amount, Total Refunded, Cancelled Order Amount, Earning This Month) display correct values for the selected period.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "All KPI card counts and amounts show correct and accurate values."
    },

    // ── Negative Test Cases ──
    {
        "TestID": "TC_PR_NEG_01",
        "Issue": "41011",
        "Description": "Verify selecting an invalid custom date range (From Date > To Date) displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Validation alert displays indicating 'From Date cannot be later than To Date'."
    },
    {
        "TestID": "TC_PR_NEG_02",
        "Issue": "41012",
        "Description": "Verify the page displays an appropriate error message when payment report data fails to load due to API/network failure.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "A user-friendly network error toaster notification is displayed."
    },
    {
        "TestID": "TC_PR_NEG_03",
        "Issue": "41013",
        "Description": "Verify applying filters with no available data displays an appropriate empty-state message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Grid displays 'No payment records match selected filters' message cleanly."
    },
    {
        "TestID": "TC_PR_NEG_04",
        "Issue": "41014",
        "Description": "Verify clicking Export CSV when no data exists does not generate a corrupted file and displays a proper message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "System prompts warning that export is unavailable for empty lists."
    },
    {
        "TestID": "TC_PR_NEG_05",
        "Issue": "41015",
        "Description": "Verify clicking PDF Export when no data exists is handled gracefully with an appropriate notification.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Warning toaster is shown explaining export cannot be completed without data."
    },
    {
        "TestID": "TC_PR_NEG_06",
        "Issue": "41016",
        "Description": "Verify the Reconcile process displays an error message when reconciliation fails due to backend/API issues.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Reconciliation error alert is displayed."
    },
    {
        "TestID": "TC_PR_NEG_07",
        "Issue": "41017",
        "Description": "Verify charts handle null, missing, or zero-value data without UI breakage.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Charts render empty state placeholders cleanly without freezing the browser."
    },
    {
        "TestID": "TC_PR_NEG_08",
        "Issue": "41018",
        "Description": "Verify rapid multiple clicks on Refresh, Export CSV, PDF, or Reconcile do not create duplicate requests.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Button interactions are debounced or disabled during processing."
    },
    {
        "TestID": "TC_PR_NEG_09",
        "Issue": "41019",
        "Description": "Verify unauthorized users cannot access export or reconciliation functionality and receive an authorization error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "Access is denied, and functionality remains hidden/disabled."
    },
    {
        "TestID": "TC_PR_NEG_10",
        "Issue": "41020",
        "Description": "Verify the dashboard handles large payment datasets without performance degradation or page crashes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "FromDate": "",
        "ToDate": "",
        "ExpectedResult": "UI paginates data rows and loads charts seamlessly."
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
