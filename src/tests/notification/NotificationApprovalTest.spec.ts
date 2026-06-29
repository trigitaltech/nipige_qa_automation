import { Page } from "@playwright/test";
import HomeSteps from "@uiSteps/HomeSteps";
import NotificationApprovalSteps from "@uiSteps/NotificationApprovalSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import { getCredential, Role } from "@config/Credentials";

const SHEET = "NotificationApproval";

let sharedPage!: Page;
let home!: HomeSteps;
let approval!: NotificationApprovalSteps;

// mode: "serial" is intentionally NOT used — serial mode skips all remaining tests when one fails,
// which prevents independent reporting of each TC. Tests run in declaration order naturally; the
// shared session is maintained via module-level variables initialised in beforeAll.
test.describe("Notification Approval", () => {
    test.beforeAll(async ({ browser }) => {
        // FreshCart tenant (TC01 in LoginTest) — the Notification Approval listing is under
        // the FreshCart tenant's Communications sidebar, populated by criteria submitted via
        // Bulk Notification by the FreshCart Seller.
        const credential = getCredential(Role.TENANT);
        const d = ExcelUtil.getTestData(SHEET, "TC01_PageLoads");
        sharedPage = await browser.newPage();
        home = new HomeSteps(sharedPage);
        approval = new NotificationApprovalSteps(sharedPage);
        await home.launchApplication();
        await home.login(credential.email, credential.password, d.persona);
        await home.validateLogin(credential.email);
    });

    test.beforeEach(async () => {
        // navigateToNotificationApproval() reloads the page, which resets all filters to defaults.
        await approval.navigateToNotificationApproval();
    });

    test.afterAll(async () => {
        await home.logout();
        await sharedPage?.close();
    });

    // ── TC01: Page loads with all UI components ───────────────────────────────────
    const d01 = ExcelUtil.getTestData(SHEET, "TC01_PageLoads");
    test(`${d01.TestID} - ${d01.Description} @regression`, async () => {
        Allure.attachDetails(d01.Description, d01.Issue);
        await approval.verifyPageLoadsSuccessfully();
    });

    // ── TC02: Default filter values on page load ──────────────────────────────────
    const d02 = ExcelUtil.getTestData(SHEET, "TC02_DefaultFilters");
    test(`${d02.TestID} - ${d02.Description} @regression`, async () => {
        Allure.attachDetails(d02.Description, d02.Issue);
        await approval.verifyDefaultFilterValues();
    });

    // ── TC03: Last 7 Days date filter ─────────────────────────────────────────────
    const d03 = ExcelUtil.getTestData(SHEET, "TC03_Last7DaysFilter");
    test(`${d03.TestID} - ${d03.Description} @regression`, async () => {
        Allure.attachDetails(d03.Description, d03.Issue);
        await approval.selectDateFilter(d03.FilterValue);
        await approval.verifyListingReloadedAfterFilter();
    });

    // ── TC04: Additional date filters (15 days / 30 days / 3 months / 6 months) ──
    const d04 = ExcelUtil.getTestData(SHEET, "TC04_MultiDateFilters");
    test(`${d04.TestID} - ${d04.Description} @regression`, async () => {
        Allure.attachDetails(d04.Description, d04.Issue);
        const filters = String(d04.FilterValue).split("|").map((v) => v.trim());
        await filters.reduce(async (prev, filter) => {
            await prev;
            await approval.selectDateFilter(filter);
            await approval.verifyListingReloadedAfterFilter();
        }, Promise.resolve());
    });

    // ── TC05: Bulk Notification type filter ──────────────────────────────────────
    const d05 = ExcelUtil.getTestData(SHEET, "TC05_BulkNotificationType");
    test(`${d05.TestID} - ${d05.Description} @regression`, async () => {
        Allure.attachDetails(d05.Description, d05.Issue);
        await approval.selectTypeFilter(d05.FilterValue);
        await approval.verifyListingReloadedAfterFilter();
    });

    // ── TC06: Bulk Promotion type filter ─────────────────────────────────────────
    const d06 = ExcelUtil.getTestData(SHEET, "TC06_BulkPromotionType");
    test(`${d06.TestID} - ${d06.Description} @regression`, async () => {
        Allure.attachDetails(d06.Description, d06.Issue);
        await approval.selectTypeFilter(d06.FilterValue);
        await approval.verifyListingReloadedAfterFilter();
    });

    // ── TC07: Pending status filter ───────────────────────────────────────────────
    const d07 = ExcelUtil.getTestData(SHEET, "TC07_PendingStatus");
    test(`${d07.TestID} - ${d07.Description} @regression`, async () => {
        Allure.attachDetails(d07.Description, d07.Issue);
        await approval.selectStatusFilter(d07.FilterValue);
        await approval.verifyListingReloadedAfterFilter();
    });

    // ── TC08: Approved status filter ─────────────────────────────────────────────
    const d08 = ExcelUtil.getTestData(SHEET, "TC08_ApprovedStatus");
    test(`${d08.TestID} - ${d08.Description} @regression`, async () => {
        Allure.attachDetails(d08.Description, d08.Issue);
        await approval.selectStatusFilter(d08.FilterValue);
        await approval.verifyListingReloadedAfterFilter();
    });

    // ── TC09: Rejected status filter ─────────────────────────────────────────────
    const d09 = ExcelUtil.getTestData(SHEET, "TC09_RejectedStatus");
    test(`${d09.TestID} - ${d09.Description} @regression`, async () => {
        Allure.attachDetails(d09.Description, d09.Issue);
        await approval.selectStatusFilter(d09.FilterValue);
        await approval.verifyListingReloadedAfterFilter();
    });

    // ── TC10: Search by Template Name ────────────────────────────────────────────
    const d10 = ExcelUtil.getTestData(SHEET, "TC10_SearchByTemplateName");
    test(`${d10.TestID} - ${d10.Description} @regression`, async () => {
        Allure.attachDetails(d10.Description, d10.Issue);
        await approval.enterSearchTerm(d10.SearchTerm);
        await approval.verifySearchResultsContain(d10.SearchTerm);
    });

    // ── TC11: Search by Template ID ──────────────────────────────────────────────
    const d11 = ExcelUtil.getTestData(SHEET, "TC11_SearchByTemplateID");
    test(`${d11.TestID} - ${d11.Description} @regression`, async () => {
        Allure.attachDetails(d11.Description, d11.Issue);
        await approval.enterSearchTerm(d11.SearchTerm);
        await approval.verifySearchResultsContain(d11.SearchTerm);
    });

    // ── TC12: Partial text search ────────────────────────────────────────────────
    const d12 = ExcelUtil.getTestData(SHEET, "TC12_PartialSearch");
    test(`${d12.TestID} - ${d12.Description} @regression`, async () => {
        Allure.attachDetails(d12.Description, d12.Issue);
        await approval.enterSearchTerm(d12.SearchTerm);
        await approval.verifyListingReloadedAfterFilter();
    });

    // ── TC13: Case-insensitive search ────────────────────────────────────────────
    const d13 = ExcelUtil.getTestData(SHEET, "TC13_CaseInsensitiveSearch");
    test(`${d13.TestID} - ${d13.Description} @regression`, async () => {
        Allure.attachDetails(d13.Description, d13.Issue);
        await approval.verifySearchIsCaseInsensitive(d13.SearchTerm);
    });

    // ── TC14: Refresh button ─────────────────────────────────────────────────────
    const d14 = ExcelUtil.getTestData(SHEET, "TC14_RefreshButton");
    test(`${d14.TestID} - ${d14.Description} @regression`, async () => {
        Allure.attachDetails(d14.Description, d14.Issue);
        await approval.clickRefresh();
        await approval.verifyRefreshReloadsListing();
    });

    // ── TC15: Table columns displayed ───────────────────────────────────────────
    const d15 = ExcelUtil.getTestData(SHEET, "TC15_TableColumns");
    test(`${d15.TestID} - ${d15.Description} @regression`, async () => {
        Allure.attachDetails(d15.Description, d15.Issue);
        await approval.verifyAllColumnsDisplayed();
    });

    // ── TC16: Status badges ──────────────────────────────────────────────────────
    const d16 = ExcelUtil.getTestData(SHEET, "TC16_StatusBadges");
    test(`${d16.TestID} - ${d16.Description} @regression`, async () => {
        Allure.attachDetails(d16.Description, d16.Issue);
        await approval.verifyStatusBadgesDisplayed();
    });

    // ── TC17: Record count matches grid ─────────────────────────────────────────
    const d17 = ExcelUtil.getTestData(SHEET, "TC17_RecordCount");
    test(`${d17.TestID} - ${d17.Description} @regression`, async () => {
        Allure.attachDetails(d17.Description, d17.Issue);
        await approval.verifyRecordCountMatchesGrid();
    });

    // ── TC18: View (Eye) icon opens details page ─────────────────────────────────
    const d18 = ExcelUtil.getTestData(SHEET, "TC18_ViewDetails");
    test(`${d18.TestID} - ${d18.Description} @regression`, async () => {
        Allure.attachDetails(d18.Description, d18.Issue);
        await approval.clickFirstViewButton();
        await approval.verifyDetailsPageOpened();
        await approval.clickBackButton();
    });

    // ── TC19: Details page shows correct information ──────────────────────────────
    const d19 = ExcelUtil.getTestData(SHEET, "TC19_DetailsContent");
    test(`${d19.TestID} - ${d19.Description} @regression`, async () => {
        Allure.attachDetails(d19.Description, d19.Issue);
        await approval.clickFirstViewButton();
        await approval.verifyDetailsPageContent();
        await approval.clickBackButton();
    });

    // ── TC20: Notification Stats section ─────────────────────────────────────────
    const d20 = ExcelUtil.getTestData(SHEET, "TC20_NotificationStats");
    test(`${d20.TestID} - ${d20.Description} @regression`, async () => {
        Allure.attachDetails(d20.Description, d20.Issue);
        await approval.clickFirstViewButton();
        await approval.verifyNotificationStatsSection();
        await approval.clickBackButton();
    });

    // ── TC21: Template Configuration details ─────────────────────────────────────
    const d21 = ExcelUtil.getTestData(SHEET, "TC21_TemplateConfig");
    test(`${d21.TestID} - ${d21.Description} @regression`, async () => {
        Allure.attachDetails(d21.Description, d21.Issue);
        await approval.clickFirstViewButton();
        await approval.verifyTemplateConfigSection();
        await approval.clickBackButton();
    });

    // ── TC22: Notification body displayed ────────────────────────────────────────
    const d22 = ExcelUtil.getTestData(SHEET, "TC22_NotificationBody");
    test(`${d22.TestID} - ${d22.Description} @regression`, async () => {
        Allure.attachDetails(d22.Description, d22.Issue);
        await approval.clickFirstViewButton();
        await approval.verifyNotificationBodyDisplayed();
        await approval.clickBackButton();
    });

    // ── TC23: Download link ───────────────────────────────────────────────────────
    const d23 = ExcelUtil.getTestData(SHEET, "TC23_DownloadFile");
    test(`${d23.TestID} - ${d23.Description} @regression`, async () => {
        Allure.attachDetails(d23.Description, d23.Issue);
        await approval.clickFirstViewButton();
        await approval.verifyDownloadLink();
        await approval.clickBackButton();
    });

    // ── TC24: Back button navigation ─────────────────────────────────────────────
    const d24 = ExcelUtil.getTestData(SHEET, "TC24_BackButton");
    test(`${d24.TestID} - ${d24.Description} @regression`, async () => {
        Allure.attachDetails(d24.Description, d24.Issue);
        await approval.clickFirstViewButton();
        await approval.verifyDetailsPageOpened();
        await approval.clickBackButton();
        await approval.verifyListingPageVisible();
    });

    // ── TC25: Combined filters (Date + Type + Status) ────────────────────────────
    const d25 = ExcelUtil.getTestData(SHEET, "TC25_CombinedFilters");
    test(`${d25.TestID} - ${d25.Description} @regression`, async () => {
        Allure.attachDetails(d25.Description, d25.Issue);
        const [dateFilter, typeFilter, statusFilter] = String(d25.FilterValue)
            .split("|").map((v) => v.trim());
        await approval.applyMultipleFilters(dateFilter, typeFilter, statusFilter);
        await approval.verifyListingReloadedAfterFilter();
    });

    // ── TC26 (Negative): No records for unmatched search ─────────────────────────
    const d26 = ExcelUtil.getTestData(SHEET, "TC26_NoRecordsFound");
    test(`${d26.TestID} - ${d26.Description} @regression`, async () => {
        Allure.attachDetails(d26.Description, d26.Issue);
        await approval.searchAndVerifyNoRecords(d26.SearchTerm);
    });

    // ── TC27 (Negative): Special characters in search ────────────────────────────
    const d27 = ExcelUtil.getTestData(SHEET, "TC27_SpecialCharSearch");
    test(`${d27.TestID} - ${d27.Description} @regression`, async () => {
        Allure.attachDetails(d27.Description, d27.Issue);
        await approval.verifySpecialCharsInSearchHandledSafely(d27.SearchTerm);
    });

    // ── TC28 (Negative): SQL Injection in search ─────────────────────────────────
    const d28 = ExcelUtil.getTestData(SHEET, "TC28_SQLInjection");
    test(`${d28.TestID} - ${d28.Description} @regression`, async () => {
        Allure.attachDetails(d28.Description, d28.Issue);
        await approval.verifySQLInjectionBlocked(d28.SearchTerm);
    });

    // ── TC29 (Negative): Unauthorized access ─────────────────────────────────────
    // This TC navigates to the route after logout, so it manages its own page instance.
    const d29 = ExcelUtil.getTestData(SHEET, "TC29_UnauthorizedAccess");
    test(`${d29.TestID} - ${d29.Description} @regression`, async ({ browser }) => {
        Allure.attachDetails(d29.Description, d29.Issue);
        const privatePage = await browser.newPage();
        try {
            // Navigate directly to the protected route WITHOUT logging in
            await privatePage.goto(`${process.env.BASE_URL}/approvalNotification`);
            await privatePage.waitForLoadState("domcontentloaded");
            const notificationApprovalSteps = new NotificationApprovalSteps(privatePage);
            await notificationApprovalSteps.verifyUnauthorizedAccessBlocked();
        } finally {
            await privatePage.close();
        }
    });

    // ── TC30 (Negative): Missing / corrupted data handled gracefully ──────────────
    const d30 = ExcelUtil.getTestData(SHEET, "TC30_MissingDataGraceful");
    test(`${d30.TestID} - ${d30.Description} @regression`, async () => {
        Allure.attachDetails(d30.Description, d30.Issue);
        // Apply a future-only filter (Last 7 Days) to the Status=Rejected bucket.
        // If no records exist in that window the empty-state renders — no crash.
        await approval.selectStatusFilter(d30.FilterValue);
        await approval.verifyPageHandlesMissingDataGracefully();
    });
});
