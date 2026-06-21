/**
 * Adds the NotificationApproval sheet to testData.xlsx and appends TC11 (FreshCart Seller)
 * to the LoginTest sheet.
 *
 * Run from the project root:
 *   node scripts/addNotificationApprovalData.js
 */

const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const filePath = path.resolve(__dirname, "../src/resources/data/testData.xlsx");

if (!fs.existsSync(filePath)) {
    console.error("testData.xlsx not found at:", filePath);
    process.exit(1);
}

const workbook = XLSX.readFile(filePath);

// ── 1. Append TC11 FreshCart Seller to LoginTest sheet ──────────────────────────────────────
const LOGIN_SHEET = "LoginTest";
if (workbook.SheetNames.includes(LOGIN_SHEET)) {
    const ws = workbook.Sheets[LOGIN_SHEET];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

    // Only add if TC11 doesn't already exist
    const alreadyExists = rows.some((r) => r.TestID === "TC11_FreshCartSellerLogin");
    if (!alreadyExists) {
        rows.push({
            TestID: "TC11_FreshCartSellerLogin",
            Description: "Valid login as FreshCart Seller",
            UserName: "jackwalker@gmail.com",
            Password: "Test@123",
            persona: "seller",
            Tenant: "FreshCart",
            ErrorMessage: "",
            Issue: "",
        });
        const newWs = XLSX.utils.json_to_sheet(rows);
        workbook.Sheets[LOGIN_SHEET] = newWs;
        console.log("✔ TC11_FreshCartSellerLogin added to LoginTest sheet.");
    } else {
        console.log("ℹ TC11_FreshCartSellerLogin already exists in LoginTest — skipped.");
    }
} else {
    console.warn("⚠ LoginTest sheet not found — skipping TC11 insertion.");
}

// ── 2. Create / replace NotificationApproval sheet ──────────────────────────────────────────
const NA_SHEET = "NotificationApproval";

const naRows = [
    // ── Positive ────────────────────────────────────────────────────────────────────────────
    {
        TestID: "TC01_PageLoads",
        Description: "Verify Notification Approval page loads successfully with all UI components displayed correctly",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC02_DefaultFilters",
        Description: "Verify default filter values (Date, Type, Status) are displayed on page load",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC03_Last7DaysFilter",
        Description: "Verify user can select Last 7 Days filter and corresponding records are displayed",
        persona: "tenant",
        FilterValue: "Last 7 days",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC04_MultiDateFilters",
        Description: "Verify user can select Last 15 Days / Last 30 Days / Last 3 Months / Last 6 Months filters successfully",
        persona: "tenant",
        FilterValue: "Last 15 days|Last 30 days|Last 3 months|Last 6 months",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC05_BulkNotificationType",
        Description: "Verify user can select Bulk Notification from Type filter and only matching records are displayed",
        persona: "tenant",
        FilterValue: "Bulk Notification",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC06_BulkPromotionType",
        Description: "Verify user can select Bulk Promotion from Type filter and only matching records are displayed",
        persona: "tenant",
        FilterValue: "Bulk Promotion",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC07_PendingStatus",
        Description: "Verify user can select Pending status and only pending records are displayed",
        persona: "tenant",
        FilterValue: "Pending",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC08_ApprovedStatus",
        Description: "Verify user can select Approved status and only approved records are displayed",
        persona: "tenant",
        FilterValue: "Approved",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC09_RejectedStatus",
        Description: "Verify user can select Rejected status and only rejected records are displayed",
        persona: "tenant",
        FilterValue: "Rejected",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC10_SearchByTemplateName",
        Description: "Verify search functionality works correctly using Template Name",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "Automated notification",
        Issue: "",
    },
    {
        TestID: "TC11_SearchByTemplateID",
        Description: "Verify search functionality works correctly using Template ID",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "NTF",
        Issue: "",
    },
    {
        TestID: "TC12_PartialSearch",
        Description: "Verify search functionality supports partial text matching",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "Auto",
        Issue: "",
    },
    {
        TestID: "TC13_CaseInsensitiveSearch",
        Description: "Verify search functionality is case-insensitive",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "notification",
        Issue: "",
    },
    {
        TestID: "TC14_RefreshButton",
        Description: "Verify refresh button reloads the latest notification records",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC15_TableColumns",
        Description: "Verify all table columns are displayed correctly",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC16_StatusBadges",
        Description: "Verify status badges are displayed correctly for each notification status",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC17_RecordCount",
        Description: "Verify record count displayed matches actual records in the grid",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC18_ViewDetails",
        Description: "Verify clicking the View (Eye) icon opens Notification Approval Details page",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC19_DetailsContent",
        Description: "Verify details page displays correct information for the selected notification",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC20_NotificationStats",
        Description: "Verify Notification Stats section displays Pending, Success, and Failed counts correctly",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC21_TemplateConfig",
        Description: "Verify Template Configuration details are displayed correctly",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC22_NotificationBody",
        Description: "Verify notification body/content is displayed properly",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC23_DownloadFile",
        Description: "Verify Download link/button downloads the file successfully",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC24_BackButton",
        Description: "Verify Back button navigates to Notification Approval listing page",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC25_CombinedFilters",
        Description: "Verify multiple filters (Date + Type + Status) work together correctly",
        persona: "tenant",
        FilterValue: "Last 7 days|Bulk Notification|Pending",
        SearchTerm: "",
        Issue: "",
    },
    // ── Negative ─────────────────────────────────────────────────────────────────────────────
    {
        TestID: "TC26_NoRecordsFound",
        Description: "Verify No Records Found message is displayed when search returns no results",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "ZZZNOMATCH99999",
        Issue: "",
    },
    {
        TestID: "TC27_SpecialCharSearch",
        Description: "Verify invalid or special characters entered in search field do not break the application",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "!@#$%^&*()<>{}[]",
        Issue: "",
    },
    {
        TestID: "TC28_SQLInjection",
        Description: "Verify SQL Injection attempts in search field are blocked and handled securely",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "' OR '1'='1",
        Issue: "",
    },
    {
        TestID: "TC29_UnauthorizedAccess",
        Description: "Verify unauthorized users cannot access Notification Approval page or details page",
        persona: "tenant",
        FilterValue: "",
        SearchTerm: "",
        Issue: "",
    },
    {
        TestID: "TC30_MissingDataGraceful",
        Description: "Verify system handles missing/corrupted notification data gracefully without application crash",
        persona: "tenant",
        FilterValue: "Rejected",
        SearchTerm: "",
        Issue: "",
    },
];

// Remove existing sheet if present, then add the new one
if (workbook.SheetNames.includes(NA_SHEET)) {
    const idx = workbook.SheetNames.indexOf(NA_SHEET);
    workbook.SheetNames.splice(idx, 1);
    delete workbook.Sheets[NA_SHEET];
    console.log("ℹ Existing NotificationApproval sheet removed — replacing with updated data.");
}

const naWs = XLSX.utils.json_to_sheet(naRows);
XLSX.utils.book_append_sheet(workbook, naWs, NA_SHEET);
console.log("✔ NotificationApproval sheet created with 30 test rows.");

// ── 3. Write back ────────────────────────────────────────────────────────────────────────────
XLSX.writeFile(workbook, filePath);
console.log("✔ testData.xlsx updated successfully at:", filePath);
