/**
 * Updates (or replaces) the "DashboardTest" sheet in testData.xlsx — 43 test cases.
 * Run once: node scripts/addDashboardTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "DashboardTest";

const rows = [
    // ── Spec-required exact keys ──
    {
        "TestID": "TC01_DashboardLoad",
        "Issue": "28001",
        "Description": "Verify Dashboard loads successfully with all KPI cards displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dashboard loads with summary KPI cards visible."
    },
    {
        "TestID": "TC03_DashboardFilters",
        "Issue": "28002",
        "Description": "Verify Today/7 Days/30 Days/Custom filters load dashboard data successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Metrics filter updates correctly."
    },
    {
        "TestID": "TC04_OrderChartDropdown",
        "Issue": "28003",
        "Description": "Verify Order Chart filters and displays status metrics (Delivered, Pending, Cancelled, Payment Pending).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Order chart legend and statuses filters render."
    },
    {
        "TestID": "TC05_TopRevenueDropdown",
        "Issue": "28004",
        "Description": "Verify Top Revenue Category donut chart filters and updates when tenant filter changes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Donut chart updates category records successfully."
    },

    // ── Positive Test Cases (TC_DASH_POS_02 to TC_DASH_POS_20) ──
    {
        "TestID": "TC_DASH_POS_02",
        "Issue": "28005",
        "Description": "Verify Today filter loads dashboard data for the current day.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dashboard reloads metrics filtering for today's transactions."
    },
    {
        "TestID": "TC_DASH_POS_03",
        "Issue": "28006",
        "Description": "Verify 7 Days filter displays correct dashboard metrics.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dashboard reloads metrics filtering for the last 7 days."
    },
    {
        "TestID": "TC_DASH_POS_04",
        "Issue": "28007",
        "Description": "Verify 30 Days filter displays correct dashboard metrics.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dashboard reloads metrics filtering for the last 30 days."
    },
    {
        "TestID": "TC_DASH_POS_05",
        "Issue": "28008",
        "Description": "Verify Custom date range filter loads data successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dashboard reloads metrics filtering for custom date range."
    },
    {
        "TestID": "TC_DASH_POS_06",
        "Issue": "28009",
        "Description": "Verify Total Tenants count is displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Tenants KPI card is populated correctly."
    },
    {
        "TestID": "TC_DASH_POS_07",
        "Issue": "28010",
        "Description": "Verify Total Markets count is displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Markets KPI card displays exact count."
    },
    {
        "TestID": "TC_DASH_POS_08",
        "Issue": "28011",
        "Description": "Verify Total Users count is displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Users KPI card displays exact count."
    },
    {
        "TestID": "TC_DASH_POS_09",
        "Issue": "28012",
        "Description": "Verify Total Attributes count is displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Attributes KPI card displays exact count."
    },
    {
        "TestID": "TC_DASH_POS_10",
        "Issue": "28013",
        "Description": "Verify Total Partners count is displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Partners KPI card displays exact count."
    },
    {
        "TestID": "TC_DASH_POS_11",
        "Issue": "28014",
        "Description": "Verify Total Permissions count is displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Permissions KPI card displays exact count."
    },
    {
        "TestID": "TC_DASH_POS_12",
        "Issue": "28015",
        "Description": "Verify Total Features count is displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Features KPI card displays exact count."
    },
    {
        "TestID": "TC_DASH_POS_13",
        "Issue": "28016",
        "Description": "Verify progress percentages are displayed correctly for all KPI cards.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Metrics cards render percentage calculations correctly."
    },
    {
        "TestID": "TC_DASH_POS_14",
        "Issue": "28017",
        "Description": "Verify Order Chart is rendered successfully with valid data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Order chart loads with active bars/lines."
    },
    {
        "TestID": "TC_DASH_POS_15",
        "Issue": "28018",
        "Description": "Verify Order Chart legend displays all statuses (Delivered, Pending, Cancelled, Payment Pending).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All statuses legends display correct status colors."
    },
    {
        "TestID": "TC_DASH_POS_16",
        "Issue": "28019",
        "Description": "Verify Tenant dropdown filters Order Chart data correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Order chart filters metrics by selected Tenant."
    },
    {
        "TestID": "TC_DASH_POS_17",
        "Issue": "28020",
        "Description": "Verify Date Range dropdown filters Order Chart data correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Order chart filters metrics by selected date range."
    },
    {
        "TestID": "TC_DASH_POS_18",
        "Issue": "28021",
        "Description": "Verify Top Revenue Category donut chart loads successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Donut chart categories render correct percentages."
    },
    {
        "TestID": "TC_DASH_POS_19",
        "Issue": "28022",
        "Description": "Verify Top Revenue Category chart updates when Tenant filter changes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Donut chart reloads metrics by selected Tenant."
    },
    {
        "TestID": "TC_DASH_POS_20",
        "Issue": "28023",
        "Description": "Verify dashboard data refreshes correctly after page reload.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Reloading page refreshes all KPI cards and charts."
    },

    // ── Negative Test Cases (TC_DASH_NEG_01 to TC_DASH_NEG_20) ──
    {
        "TestID": "TC_DASH_NEG_01",
        "Issue": "28024",
        "Description": "Verify dashboard handles API failure without crashing.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Graceful error alert is displayed and dashboard panels fallback to empty."
    },
    {
        "TestID": "TC_DASH_NEG_02",
        "Issue": "28025",
        "Description": "Verify KPI cards display zero values when no data exists.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Cards display zero (0) values cleanly."
    },
    {
        "TestID": "TC_DASH_NEG_03",
        "Issue": "28026",
        "Description": "Verify dashboard shows appropriate message when analytics data is unavailable.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"No Data Available\" is displayed."
    },
    {
        "TestID": "TC_DASH_NEG_04",
        "Issue": "28027",
        "Description": "Verify invalid custom date range selection is rejected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation blocks selection or handles date error."
    },
    {
        "TestID": "TC_DASH_NEG_05",
        "Issue": "28028",
        "Description": "Verify future date range does not return incorrect data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Future date returns zero or handles date query correctly."
    },
    {
        "TestID": "TC_DASH_NEG_06",
        "Issue": "28029",
        "Description": "Verify start date greater than end date shows validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows End Date cannot be earlier than Start Date."
    },
    {
        "TestID": "TC_DASH_NEG_07",
        "Issue": "28030",
        "Description": "Verify Tenant dropdown handles empty tenant list gracefully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dropdown displays \"No Tenants Available\" safely."
    },
    {
        "TestID": "TC_DASH_NEG_08",
        "Issue": "28031",
        "Description": "Verify dashboard remains stable when chart API returns empty response.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Charts render empty state message safely without error."
    },
    {
        "TestID": "TC_DASH_NEG_09",
        "Issue": "28032",
        "Description": "Verify Order Chart does not break when one status has null values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Null statuses are rendered as zero values."
    },
    {
        "TestID": "TC_DASH_NEG_10",
        "Issue": "28033",
        "Description": "Verify Top Revenue Category chart handles empty category data correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Donut chart displays empty layout."
    },
    {
        "TestID": "TC_DASH_NEG_11",
        "Issue": "28034",
        "Description": "Verify dashboard handles slow API response without UI freeze.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Loading spin displays and UI remains responsive."
    },
    {
        "TestID": "TC_DASH_NEG_12",
        "Issue": "28035",
        "Description": "Verify unauthorized users cannot access dashboard URL directly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirects to Login or shows Access Denied."
    },
    {
        "TestID": "TC_DASH_NEG_13",
        "Issue": "28036",
        "Description": "Verify dashboard redirects to login after session expiration.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirects automatically to Login screen."
    },
    {
        "TestID": "TC_DASH_NEG_14",
        "Issue": "28037",
        "Description": "Verify invalid tenant selection does not display incorrect data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Displays zero metrics safely."
    },
    {
        "TestID": "TC_DASH_NEG_15",
        "Issue": "28038",
        "Description": "Verify dashboard handles network disconnection gracefully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Warning bar shows connection problem."
    },
    {
        "TestID": "TC_DASH_NEG_16",
        "Issue": "28039",
        "Description": "Verify charts do not overlap or distort when large datasets are loaded.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Responsive CSS sizes chart canvases safely."
    },
    {
        "TestID": "TC_DASH_NEG_17",
        "Issue": "28040",
        "Description": "Verify percentage calculations do not display NaN or negative values unexpectedly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "NaN is rendered as zero (0%)."
    },
    {
        "TestID": "TC_DASH_NEG_18",
        "Issue": "28041",
        "Description": "Verify refresh action handles backend timeout correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Refresh stops and toaster displays timeout alert."
    },
    {
        "TestID": "TC_DASH_NEG_19",
        "Issue": "28042",
        "Description": "Verify dashboard prevents duplicate API calls on rapid filter clicks.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only the final filter selection request is processed."
    },
    {
        "TestID": "TC_DASH_NEG_20",
        "Issue": "28043",
        "Description": "Verify system displays error notification when dashboard data fetch fails.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Toaster error is displayed."
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
