/**
 * Updates (or replaces) the "NotificationApproval" sheet in testData.xlsx — 30 test cases.
 * Run once: node scripts/addNotificationApprovalTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "NotificationApproval";

const rows = [
    // ── Positive Test Cases (TC01 to TC25) ──
    {
        "TestID": "TC01_PageLoads",
        "Issue": "21001",
        "Description": "Verify Notification Approval page loads successfully with all UI components displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Notification Approval page loads with search inputs and grids visible.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC02_DefaultFilters",
        "Issue": "21002",
        "Description": "Verify default filter values (Date, Type, Status) are displayed on page load.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Default filters are selected (usually All/Pending).",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC03_Last7DaysFilter",
        "Issue": "21003",
        "Description": "Verify user can select Last 7 Days filter and corresponding records are displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Grid displays notification records from the last 7 days.",
        "FilterValue": "Last 7 Days",
        "SearchTerm": ""
    },
    {
        "TestID": "TC04_MultiDateFilters",
        "Issue": "21004",
        "Description": "Verify user can select Last 15 Days / Last 30 Days / Last 3 Months / Last 6 Months filters successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Grid records update according to selected date options.",
        "FilterValue": "Last 15 Days | Last 30 Days | Last 3 Months | Last 6 Months",
        "SearchTerm": ""
    },
    {
        "TestID": "TC05_BulkNotificationType",
        "Issue": "21005",
        "Description": "Verify user can select Bulk Notification from Type filter and only matching records are displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only Bulk Notification records are displayed.",
        "FilterValue": "Bulk Notification",
        "SearchTerm": ""
    },
    {
        "TestID": "TC06_BulkPromotionType",
        "Issue": "21006",
        "Description": "Verify user can select Bulk Promotion from Type filter and only matching records are displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only Bulk Promotion records are displayed.",
        "FilterValue": "Bulk Promotion",
        "SearchTerm": ""
    },
    {
        "TestID": "TC07_PendingStatus",
        "Issue": "21007",
        "Description": "Verify user can select Pending status and only pending records are displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only Pending status notifications are listed.",
        "FilterValue": "Pending",
        "SearchTerm": ""
    },
    {
        "TestID": "TC08_ApprovedStatus",
        "Issue": "21008",
        "Description": "Verify user can select Approved status and only approved records are displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only Approved status notifications are listed.",
        "FilterValue": "Approved",
        "SearchTerm": ""
    },
    {
        "TestID": "TC09_RejectedStatus",
        "Issue": "21009",
        "Description": "Verify user can select Rejected status and only rejected records are displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only Rejected status notifications are listed.",
        "FilterValue": "Rejected",
        "SearchTerm": ""
    },
    {
        "TestID": "TC10_SearchByTemplateName",
        "Issue": "21010",
        "Description": "Verify search functionality works correctly using Template Name.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching template name notifications are shown.",
        "FilterValue": "",
        "SearchTerm": "Promotion"
    },
    {
        "TestID": "TC11_SearchByTemplateID",
        "Issue": "21011",
        "Description": "Verify search functionality works correctly using Template ID.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching template ID notifications are shown.",
        "FilterValue": "",
        "SearchTerm": "1001"
    },
    {
        "TestID": "TC12_PartialSearch",
        "Issue": "21012",
        "Description": "Verify search functionality supports partial text matching.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Notifications containing partial search text display.",
        "FilterValue": "",
        "SearchTerm": "Promo"
    },
    {
        "TestID": "TC13_CaseInsensitiveSearch",
        "Issue": "21013",
        "Description": "Verify search functionality is case-insensitive.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Search returns same results regardless of case.",
        "FilterValue": "",
        "SearchTerm": "PROMOTION"
    },
    {
        "TestID": "TC14_RefreshButton",
        "Issue": "21014",
        "Description": "Verify refresh button reloads the latest notification records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Listing reloads with most current database entries.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC15_TableColumns",
        "Issue": "21015",
        "Description": "Verify all table columns are displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Template Name, Type, Status, and Actions headers are visible.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC16_StatusBadges",
        "Issue": "21016",
        "Description": "Verify status badges are displayed correctly for each notification status.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Status badges follow correct colors (e.g. green for Approved, amber for Pending).",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC17_RecordCount",
        "Issue": "21017",
        "Description": "Verify record count displayed matches actual records in the grid.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total count indicator matches grid items count.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC18_ViewDetails",
        "Issue": "21018",
        "Description": "Verify clicking the View (Eye) icon opens Notification Approval Details page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Details page/panel loads successfully.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC19_DetailsContent",
        "Issue": "21019",
        "Description": "Verify details page displays correct information for the selected notification.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Correct details match the clicked record.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC20_NotificationStats",
        "Issue": "21020",
        "Description": "Verify Notification Stats section displays Pending, Success, and Failed counts correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Notification status stats counts match.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC21_TemplateConfig",
        "Issue": "21021",
        "Description": "Verify Template Configuration details are displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Configuration details display.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC22_NotificationBody",
        "Issue": "21022",
        "Description": "Verify notification body/content is displayed properly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "The formatted message body text displays.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC23_DownloadFile",
        "Issue": "21023",
        "Description": "Verify Download link/button downloads the file successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Target attachment file download begins.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC24_BackButton",
        "Issue": "21024",
        "Description": "Verify Back button navigates to Notification Approval listing page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User redirects back to list grid.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC25_CombinedFilters",
        "Issue": "21025",
        "Description": "Verify multiple filters (Date + Type + Status) work together correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only records matching all active criteria display.",
        "FilterValue": "",
        "SearchTerm": ""
    },

    // ── Negative Test Cases (TC26 to TC30) ──
    {
        "TestID": "TC26_NoRecordsFound",
        "Issue": "21026",
        "Description": "Verify \"No Records Found\" message is displayed when search returns no results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"No Records Found\" is shown in table.",
        "FilterValue": "",
        "SearchTerm": "NONEXISTENT_STAMP_XYZ_999"
    },
    {
        "TestID": "TC27_SpecialCharSearch",
        "Issue": "21027",
        "Description": "Verify invalid or special characters entered in search field do not break the application.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Special characters are handled safely without crash.",
        "FilterValue": "",
        "SearchTerm": "~!@#$%^&*()_+{}[]:;\"'<>,.?"
    },
    {
        "TestID": "TC28_SQLInjection",
        "Issue": "21028",
        "Description": "Verify SQL Injection attempts in search field are blocked and handled securely.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "SQL injection characters are treated as literal text; no crash occurs.",
        "FilterValue": "",
        "SearchTerm": "1' OR '1'='1"
    },
    {
        "TestID": "TC29_UnauthorizedAccess",
        "Issue": "21029",
        "Description": "Verify unauthorized users cannot access Notification Approval page or details page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access is blocked or redirects to login.",
        "FilterValue": "",
        "SearchTerm": ""
    },
    {
        "TestID": "TC30_MissingDataGraceful",
        "Issue": "21030",
        "Description": "Verify system handles missing/corrupted notification data gracefully without application crash.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Corrupted attributes show placeholders cleanly.",
        "FilterValue": "",
        "SearchTerm": ""
    }
];

const headers = [
    "TestID",
    "Issue",
    "Description",
    "UserName",
    "Password",
    "persona",
    "ExpectedResult",
    "FilterValue",
    "SearchTerm"
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
