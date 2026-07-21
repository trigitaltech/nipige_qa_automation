/**
 * Updates (or replaces) the "OrderReportTest" sheet in testData.xlsx — 30 test cases.
 * Run once: node scripts/addOrderReportTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "OrderReportTest";

const rows = [
    // ── Spec-required exact keys ──
    {
        "TestID": "TC01_OrderReportLoad",
        "Issue": "30001",
        "Description": "Verify the Order Report page loads successfully with KPI cards, charts, filters, and order data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Order Report page loads successfully with all KPI cards and charts displayed."
    },
    {
        "TestID": "TC02_DateFilterValidation",
        "Issue": "30002",
        "Description": "Verify user can filter reports using predefined date ranges (Today, 7D, 30D, 90D, YTD) and view updated results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Predefined date ranges update report metrics correctly."
    },
    {
        "TestID": "TC03_RefreshValidation",
        "Issue": "30003",
        "Description": "Verify clicking Refresh reloads the latest report data successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Latest report metrics are reloaded successfully."
    },
    {
        "TestID": "TC04_OrderValueChartFilter",
        "Issue": "30004",
        "Description": "Verify Order Value chart filter displays correct transactional details on hover.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Order value metrics load successfully on chart."
    },
    {
        "TestID": "TC05_OrderStatusFilter",
        "Issue": "30005",
        "Description": "Verify user can filter orders by Status and view correct results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Order details filter by selected status successfully."
    },
    {
        "TestID": "TC06_SalesChannelAndOrderTypeValidation",
        "Issue": "30006",
        "Description": "Verify user can filter orders by Channel and Order Type and view correct results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Order details filter by channel and type successfully."
    },
    {
        "TestID": "TC07_OrderDetailFiltersValidation",
        "Issue": "30007",
        "Description": "Verify clicking Apply refreshes the Order Details table based on selected filters.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Order details table updates matching filters."
    },

    // ── Additional Order Report positives ──
    {
        "TestID": "TC_OR_POS_03",
        "Issue": "30008",
        "Description": "Verify user can search orders using a valid Order ID and view the matching order record.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "12345",
        "ExpectedResult": "Matching order record is displayed in list."
    },
    {
        "TestID": "TC_OR_POS_07",
        "Issue": "30009",
        "Description": "Verify clicking View Download History opens the report download history screen successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Download history screen loaded successfully."
    },
    {
        "TestID": "TC_OR_POS_08",
        "Issue": "30010",
        "Description": "Verify clicking Schedule Report allows the user to schedule a report successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Report is scheduled successfully; notification displays."
    },

    // ── Order Report negatives (TC_OR_NEG_01 to TC_OR_NEG_08) ──
    {
        "TestID": "TC_OR_NEG_01",
        "Issue": "30011",
        "Description": "Verify searching with an invalid or non-existing Order ID displays a 'No Records Found' message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "NONEXISTENT_99999",
        "ExpectedResult": "No Records Found is displayed."
    },
    {
        "TestID": "TC_OR_NEG_02",
        "Issue": "30012",
        "Description": "Verify the system handles special characters or SQL injection-like inputs in the search field without errors.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "' OR '1'='1",
        "ExpectedResult": "Search handles special inputs safely."
    },
    {
        "TestID": "TC_OR_NEG_03",
        "Issue": "30013",
        "Description": "Verify selecting a custom date range where From Date > To Date displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Validation error warns date bounds."
    },
    {
        "TestID": "TC_OR_NEG_04",
        "Issue": "30014",
        "Description": "Verify applying filters that return no matching records displays an appropriate empty-state message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Empty state displays matching filter criteria."
    },
    {
        "TestID": "TC_OR_NEG_05",
        "Issue": "30015",
        "Description": "Verify the page displays an appropriate error message when report data fails to load due to API/network failure.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Toaster connection error displays."
    },
    {
        "TestID": "TC_OR_NEG_06",
        "Issue": "30016",
        "Description": "Verify pagination does not navigate beyond available pages and handles invalid page numbers correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Controls lock navigation cleanly."
    },
    {
        "TestID": "TC_OR_NEG_07",
        "Issue": "30017",
        "Description": "Verify clicking Schedule Report without mandatory scheduling details displays validation errors.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Required warning parameters display."
    },
    {
        "TestID": "TC_OR_NEG_08",
        "Issue": "30018",
        "Description": "Verify rapid multiple clicks on Apply, Refresh, or Schedule Report do not trigger duplicate requests or UI inconsistencies.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Single request handles click safely."
    },

    // ── History Screen: Positives (TC_OR_HIST_POS_01 to TC_OR_HIST_POS_06) ──
    {
        "TestID": "TC_OR_HIST_POS_01",
        "Issue": "30019",
        "Description": "Verify the Download History page loads successfully with filters, download history table, and navigation controls.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Download history UI displays."
    },
    {
        "TestID": "TC_OR_HIST_POS_02",
        "Issue": "30020",
        "Description": "Verify user can filter download history records using the Date Range dropdown and view matching results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Date filters load correct history records."
    },
    {
        "TestID": "TC_OR_HIST_POS_03",
        "Issue": "30021",
        "Description": "Verify clicking View Order Report navigates the user to the Order Report screen successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Redirects back to main Order Report page."
    },
    {
        "TestID": "TC_OR_HIST_POS_04",
        "Issue": "30022",
        "Description": "Verify download history records display correct details such as Request ID, Request Date, Request Type, Requested By, and Status.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "History row values match requested profiles."
    },
    {
        "TestID": "TC_OR_HIST_POS_05",
        "Issue": "30023",
        "Description": "Verify completed report requests display the appropriate download action and allow successful file download.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Report download trigger saves CSV/PDF successfully."
    },
    {
        "TestID": "TC_OR_HIST_POS_06",
        "Issue": "30024",
        "Description": "Verify pagination navigates correctly between pages when multiple download history records exist.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Grid reloads records corresponding to page."
    },

    // ── History Screen: Negatives (TC_OR_HIST_NEG_01 to TC_OR_HIST_NEG_06) ──
    {
        "TestID": "TC_OR_HIST_NEG_01",
        "Issue": "30025",
        "Description": "Verify the page displays a 'No Data Available' message when no download history records exist for the selected date range.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "No Data Available displays in grid."
    },
    {
        "TestID": "TC_OR_HIST_NEG_02",
        "Issue": "30026",
        "Description": "Verify selecting a date filter with no matching records displays an appropriate empty-state message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Empty filter results handle cleanly."
    },
    {
        "TestID": "TC_OR_HIST_NEG_03",
        "Issue": "30027",
        "Description": "Verify the page handles API/network failures gracefully and displays an appropriate error message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Toaster error warning displays."
    },
    {
        "TestID": "TC_OR_HIST_NEG_04",
        "Issue": "30028",
        "Description": "Verify clicking the download action for an expired or unavailable report displays a proper validation/error message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Validation toast warns item unavailable."
    },
    {
        "TestID": "TC_OR_HIST_NEG_05",
        "Issue": "30029",
        "Description": "Verify pagination controls are disabled or handled correctly when only one page of records exists.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Navigation controls lock cleanly."
    },
    {
        "TestID": "TC_OR_HIST_NEG_06",
        "Issue": "30030",
        "Description": "Verify rapid multiple clicks on View Order Report or download actions do not trigger duplicate requests or UI inconsistencies.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "OrderID": "",
        "ExpectedResult": "Only one click processes safely."
    }
];

const headers = [
    "TestID",
    "Issue",
    "Description",
    "UserName",
    "Password",
    "persona",
    "OrderID",
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
