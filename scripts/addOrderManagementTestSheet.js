/**
 * Updates (or replaces) the "OrderManagementTest" sheet in testData.xlsx — 40 test cases.
 * Run once: node scripts/addOrderManagementTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "OrderManagementTest";

const rows = [
    // ── Spec-required exact keys (Preserved and mapped to their respective requirements) ──
    {
        "TestID": "TC01_OrderManagementLoad",
        "Issue": "3001",
        "Description": "Verify Order Management dashboard loads successfully with all widgets visible.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Order Management page loads successfully with KPI cards, date/status/seller filters, and orders table visible."
    },
    {
        "TestID": "TC02_DateAndStatusFilter",
        "Issue": "3002",
        "Description": "Validate date filters and status filter dropdown combinations correctly filter the order records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Order list updates correctly based on selected status and date range combinations."
    },
    {
        "TestID": "TC03_DateAndSellerFilter",
        "Issue": "3003",
        "Description": "Validate seller filter dropdown ('All Sellers' / hierarchy / direct) and date filters combination correctly filter the orders.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Order list updates correctly displaying only the orders matching the selected seller and date range."
    },
    {
        "TestID": "TC04_DateAndOrderIdFilter",
        "Issue": "3004",
        "Description": "Verify 'Search by Order ID' field and date filter combination returns the exact matching order.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "The exact order with the searched Order ID is displayed in the list."
    },
    {
        "TestID": "TC05_DateStatusOrderViewInvoice",
        "Issue": "3005",
        "Description": "Validate 'View Invoice' button functionality for a selected order after applying status and date filters.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Invoice popup/page opens/downloads successfully showing correct order invoice details."
    },

    // ── Additional Positive Test Cases (TC_OM_POS_02 to TC_OM_POS_20, filling gaps) ──
    {
        "TestID": "TC_OM_POS_02",
        "Issue": "31002",
        "Description": "Validate 'Total Orders' count accuracy matches the backend total orders count.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Orders KPI card displays the correct count matching backend records."
    },
    {
        "TestID": "TC_OM_POS_03",
        "Issue": "31003",
        "Description": "Check 'Delivered' KPI card value shows correct delivered orders.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delivered KPI card displays correct number of delivered orders."
    },
    {
        "TestID": "TC_OM_POS_04",
        "Issue": "31004",
        "Description": "Validate 'Confirmed/Active' orders metric reflects only confirmed/active orders.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Confirmed/Active KPI card excludes completed/cancelled orders and shows correct active count."
    },
    {
        "TestID": "TC_OM_POS_05",
        "Issue": "31005",
        "Description": "Verify 'Total Amount (Revenue)' calculation sum matches all matching orders.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Revenue KPI card displays correct summed amount of all orders."
    },
    {
        "TestID": "TC_OM_POS_06",
        "Issue": "31006",
        "Description": "Test 'Export Orders' button functionality downloads a file with correct data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Orders file downloads successfully with complete and correct order records."
    },
    {
        "TestID": "TC_OM_POS_08",
        "Issue": "31008",
        "Description": "Verify date filter 'Today' selection shows only today's orders.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Orders list is filtered to display only records created on the current date."
    },
    {
        "TestID": "TC_OM_POS_09",
        "Issue": "31009",
        "Description": "Validate 'Last 7 Days / 30 Days' filter applies the correct date range.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Orders list reloads displaying records matching the selected 7 or 30 days range."
    },
    {
        "TestID": "TC_OM_POS_10",
        "Issue": "31010",
        "Description": "Check custom date range filter returns orders within selected start and end dates.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Orders within the selected custom date range are successfully displayed."
    },
    {
        "TestID": "TC_OM_POS_13",
        "Issue": "31013",
        "Description": "Validate 'Apply' filter button applies all selected filters.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Selected filters are successfully applied and order table updates accordingly."
    },
    {
        "TestID": "TC_OM_POS_14",
        "Issue": "31014",
        "Description": "Verify 'Reset' filter functionality clears all filters and restores defaults.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All filters are cleared and the default order list loads."
    },
    {
        "TestID": "TC_OM_POS_15",
        "Issue": "31015",
        "Description": "Validate orders table loads correctly with all rows and columns displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Orders table displays complete columns (Order ID, Customer, Seller, Date, Amount, Status)."
    },
    {
        "TestID": "TC_OM_POS_16",
        "Issue": "31016",
        "Description": "Verify Order ID column click/view action opens correct order details.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Order details screen opens displaying the correct order information."
    },
    {
        "TestID": "TC_OM_POS_17",
        "Issue": "31017",
        "Description": "Validate order status labels show correct status (e.g. Fulfillment Pending, Shipped, Delivered).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Status labels accurately reflect the real status of the order."
    },
    {
        "TestID": "TC_OM_POS_18",
        "Issue": "31018",
        "Description": "Check pagination controls work correctly for navigating pages.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Next/Previous page clicks load the appropriate next or previous set of order records."
    },
    {
        "TestID": "TC_OM_POS_20",
        "Issue": "31020",
        "Description": "Verify Order Details page consistency (customer, seller, payment, address are correct).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Customer details, seller, payment status, and shipping address are correctly displayed."
    },

    // ── Negative Test Cases (TC_OM_NEG_01 to TC_OM_NEG_20) ──
    {
        "TestID": "TC_OM_NEG_01",
        "Issue": "31021",
        "Description": "Verify Order Management page fails to load or components are broken if API is down.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Page displays appropriate error alert/state and handles failure gracefully."
    },
    {
        "TestID": "TC_OM_NEG_02",
        "Issue": "31022",
        "Description": "Verify incorrect or stale count is handled or warning is displayed if backend sync fails.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Orders card handles sync failure without crashing the dashboard."
    },
    {
        "TestID": "TC_OM_NEG_03",
        "Issue": "31023",
        "Description": "Verify 'Delivered' KPI card handles wrong, missing, or null data values gracefully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delivered KPI card displays zero or empty state safely."
    },
    {
        "TestID": "TC_OM_NEG_04",
        "Issue": "31024",
        "Description": "Verify Confirmed/Active orders metric does not include incorrect statuses.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Metric does not count completed or cancelled orders."
    },
    {
        "TestID": "TC_OM_NEG_05",
        "Issue": "31025",
        "Description": "Verify 'Total Amount (Revenue)' calculation handles missing or null order amounts.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Calculation skips invalid data and displays correct sum of valid orders."
    },
    {
        "TestID": "TC_OM_NEG_06",
        "Issue": "31026",
        "Description": "Verify 'Export Orders' fails gracefully or shows warning when no data is available to export.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Export button is disabled or error alert is shown."
    },
    {
        "TestID": "TC_OM_NEG_07",
        "Issue": "31027",
        "Description": "Verify status filter dropdown shows no results or handles invalid status selection correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "'No orders matched' message is displayed correctly."
    },
    {
        "TestID": "TC_OM_NEG_08",
        "Issue": "31028",
        "Description": "Verify date filter 'Today' selection does not include older records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Older orders are successfully excluded from the search result."
    },
    {
        "TestID": "TC_OM_NEG_09",
        "Issue": "31029",
        "Description": "Verify 'Last 7 Days / 30 Days' filter does not include data outside the specified range.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Orders outside the 7 or 30 days boundary are excluded."
    },
    {
        "TestID": "TC_OM_NEG_10",
        "Issue": "31030",
        "Description": "Verify custom date range filter validation when start date is greater than end date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation warning is displayed and range is not applied."
    },
    {
        "TestID": "TC_OM_NEG_11",
        "Issue": "31031",
        "Description": "Verify seller filter dropdown ('All Sellers') does not show unrelated sellers' data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only the selected seller's orders are loaded."
    },
    {
        "TestID": "TC_OM_NEG_12",
        "Issue": "31032",
        "Description": "Verify 'Search by Order ID' field handles invalid, non-existing, or empty ID queries.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "'No matching records' is displayed without breaking the table."
    },
    {
        "TestID": "TC_OM_NEG_13",
        "Issue": "31033",
        "Description": "Verify 'Apply' filter button handles click when no filters are selected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Default order list remains loaded without resetting or crashing."
    },
    {
        "TestID": "TC_OM_NEG_14",
        "Issue": "31034",
        "Description": "Verify 'Reset' filter button does not leave partial or un-reset filters active.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All filter fields are restored to their default state completely."
    },
    {
        "TestID": "TC_OM_NEG_15",
        "Issue": "31035",
        "Description": "Verify orders table handles missing data or alignment issues when fields are empty.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty fields display placeholder/dash and table layout remains intact."
    },
    {
        "TestID": "TC_OM_NEG_16",
        "Issue": "31036",
        "Description": "Verify Order ID column click/view action does not open wrong or blank details page on network failure.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error toaster appears and user remains on the order management screen."
    },
    {
        "TestID": "TC_OM_NEG_17",
        "Issue": "31037",
        "Description": "Verify order status labels do not show wrong status or unstyled text for corrupted states.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Fallback default styling and label are displayed for unknown statuses."
    },
    {
        "TestID": "TC_OM_NEG_18",
        "Issue": "31038",
        "Description": "Verify pagination controls are disabled when there is only one page of data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Next/Previous buttons are inactive and prevent click events."
    },
    {
        "TestID": "TC_OM_NEG_19",
        "Issue": "31039",
        "Description": "Verify 'View Invoice' button shows error when invoice file is broken or missing.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error toaster notification displays that invoice is unavailable."
    },
    {
        "TestID": "TC_OM_NEG_20",
        "Issue": "31040",
        "Description": "Verify Order Details page handles mismatched or missing details gracefully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Missing details are highlighted or show 'N/A' without breaking the page."
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
