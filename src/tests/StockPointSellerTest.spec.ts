import HomeSteps from "@uiSteps/HomeSteps";
import StockPointSteps from "@uiSteps/StockPointSteps";
import { test as base, expect } from "@base-test";
import { Page } from "@playwright/test";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "StockPointSellerTest";
const SELLER = { email: "grocery@gmail.com", password: "Test@123", persona: "seller", tenant: "NipigeV2" };

const test = base.extend<{ stockPointPage: Page }>({
    stockPointPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ viewport: null });
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        await home.login(SELLER.email, SELLER.password, SELLER.persona, SELLER.tenant);
        await home.validateLogin(SELLER.email);
        await use(page);
        await context.close();
    }, { scope: "worker" }]
});

test.describe.configure({ mode: "default", retries: 0 });

const ROWS = ExcelUtil.getTestDataArray(SHEET);
function row(id: string) {
    const found = ROWS.find((r) => r.TC_ID === id);
    if (!found) throw new Error(`TC_ID '${id}' not found on '${SHEET}' sheet`);
    return found;
}

test.describe("Stock Point (Seller) Suite", () => {
    let steps: StockPointSteps;

    test.beforeAll(async ({ stockPointPage }) => {
        steps = new StockPointSteps(stockPointPage);
    });

    // ==========================================================================
    // STOCK POINTS LISTING SCREEN – POSITIVE
    // ==========================================================================

    test("TC_LIST_01 - Verify the Stock Points page loads successfully with all summary cards, search box, and stock point records displayed.", async () => {
        const data = row("TC_LIST_01");
        await steps.navigateToStockPoints();
        await steps.verifyPageLoad();
    });

    test("TC_LIST_02 - Verify the Current Page Results count matches the number of records displayed in the table.", async () => {
        const data = row("TC_LIST_02");
        await steps.navigateToStockPoints();
        await steps.verifyCurrentPageResultsCount();
    });

    test("TC_LIST_03 - Verify the Total Stock Points count displays the correct total number of stock points.", async () => {
        const data = row("TC_LIST_03");
        await steps.navigateToStockPoints();
        await steps.verifyTotalStockPointsCount();
    });

    test("TC_LIST_04 - Verify searching with a valid Stock Point name returns the correct matching record.", async () => {
        const data = row("TC_LIST_04");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("Stock");
        await steps.verifySearchResult("Stock");
    });

    test("TC_LIST_05 - Verify searching with a valid Email ID returns the correct stock point record.", async () => {
        const data = row("TC_LIST_05");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("@");
        await steps.verifySearchResult("@");
    });

    test("TC_LIST_06 - Verify clicking the View (Eye) icon opens the selected Stock Point details page.", async () => {
        const data = row("TC_LIST_06");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyViewPageLoad();
    });

    test("TC_LIST_07 - Verify clicking Create Stock Point navigates to the Create Stock Point screen.", async () => {
        const data = row("TC_LIST_07");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
    });

    test("TC_LIST_08 - Verify clicking the Refresh icon reloads the latest stock point data successfully.", async () => {
        const data = row("TC_LIST_08");
        await steps.navigateToStockPoints();
        await steps.clickRefreshButton();
        await steps.verifyPageLoad();
    });

    test("TC_LIST_09 - Verify the correct Office Type badge (Branch Office, Head Office, Default) is displayed for each stock point.", async () => {
        const data = row("TC_LIST_09");
        await steps.navigateToStockPoints();
        await steps.verifyOfficeTypeBadge();
    });

    test("TC_LIST_10 - Verify clicking the Back button navigates to the previous page successfully.", async () => {
        const data = row("TC_LIST_10");
        await steps.navigateToStockPoints();
        await steps.clickBackButton();
    });

    // ==========================================================================
    // STOCK POINTS LISTING SCREEN – NEGATIVE
    // ==========================================================================

    test("TC_LIST_NEG_01 - Verify searching with a non-existent Stock Point name displays no records found.", async () => {
        const data = row("TC_LIST_NEG_01");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("NONEXISTENT_STOCKPOINT_XYZ_999");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_02 - Verify searching with invalid special characters (@#$%^&*) does not crash the application.", async () => {
        const data = row("TC_LIST_NEG_02");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("@#$%^&*");
        await steps.verifyPageStableAfterSearch();
    });

    test("TC_LIST_NEG_03 - Verify the page handles API failure gracefully while loading stock point records.", async () => {
        const data = row("TC_LIST_NEG_03");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("NONEXISTENT_STOCKPOINT_XYZ_999");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_04 - Verify an appropriate error message is displayed when the stock point details API fails after clicking the View icon.", async () => {
        const data = row("TC_LIST_NEG_04");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("NONEXISTENT_STOCKPOINT_XYZ_999");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_05 - Verify the table displays an empty-state message when no stock points exist.", async () => {
        const data = row("TC_LIST_NEG_05");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("NONEXISTENT_STOCKPOINT_XYZ_999");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_06 - Verify incorrect or malformed email search values do not return unrelated records.", async () => {
        const data = row("TC_LIST_NEG_06");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("not-an-email@@@invalid");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_07 - Verify rapid multiple clicks on the Refresh button do not create duplicate API requests or UI issues.", async () => {
        const data = row("TC_LIST_NEG_07");
        await steps.navigateToStockPoints();
        await steps.clickRefreshButton();
        await steps.clickRefreshButton();
        await steps.verifyPageLoad();
    });

    test("TC_LIST_NEG_08 - Verify clicking the View icon for a deleted/inactive stock point displays an appropriate error message.", async () => {
        const data = row("TC_LIST_NEG_08");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("NONEXISTENT_STOCKPOINT_XYZ_999");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_09 - Verify unauthorized users cannot access the Stock Points page and receive an access denied message.", async () => {
        const data = row("TC_LIST_NEG_09");
        await steps.navigateToStockPoints();
        await steps.verifyGracefulErrorHandling();
    });

    test("TC_LIST_NEG_10 - Verify the summary cards do not display negative, null, or incorrect counts when API data is invalid.", async () => {
        const data = row("TC_LIST_NEG_10");
        await steps.navigateToStockPoints();
        await steps.verifyPageLoad();
    });

    // ==========================================================================
    // VIEW STOCK POINT SCREEN – POSITIVE
    // ==========================================================================

    test("TC_VIEW_01 - Verify the View Stock Point page loads successfully with all Stock Point details displayed.", async () => {
        const data = row("TC_VIEW_01");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyViewPageLoad();
    });

    test("TC_VIEW_02 - Verify Office information (Stock Point Name, Office Type, Email, Phone, City, State, Country, Zipcode) is displayed correctly.", async () => {
        const data = row("TC_VIEW_02");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyOfficeInfo();
    });

    test("TC_VIEW_03 - Verify Organization details (Organization Name, Registration No, GST No, FSSAI No, Own Company) are displayed correctly.", async () => {
        const data = row("TC_VIEW_03");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyOrganizationDetails();
    });

    test("TC_VIEW_04 - Verify Bill To section displays the linked billing office information correctly.", async () => {
        const data = row("TC_VIEW_04");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyBillToSection();
    });

    test("TC_VIEW_05 - Verify Authentication details (Username, Email, Phone, Security Question, Security Answer) are displayed correctly.", async () => {
        const data = row("TC_VIEW_05");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyAuthenticationDetails();
    });

    test("TC_VIEW_06 - Verify the Office Type badge (e.g., Branch Office) matches the configured office type.", async () => {
        const data = row("TC_VIEW_06");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyViewOfficeTypeBadge();
    });

    test("TC_VIEW_07 - Verify clicking the Back button navigates to the Stock Point listing page.", async () => {
        const data = row("TC_VIEW_07");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyViewPageLoad();
        await steps.clickBackButton();
    });

    test("TC_VIEW_08 - Verify clicking the Create button navigates to the Create Stock Point page.", async () => {
        const data = row("TC_VIEW_08");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyViewPageLoad();
        await steps.clickCreateStockPoint();
    });

    test("TC_VIEW_09 - Verify the Search box is displayed and accepts valid search input.", async () => {
        const data = row("TC_VIEW_09");
        await steps.navigateToStockPoints();
        await steps.verifySearchBoxAcceptsInput();
    });

    test("TC_VIEW_10 - Verify the Refresh button reloads the latest stock point details successfully.", async () => {
        const data = row("TC_VIEW_10");
        await steps.navigateToStockPoints();
        await steps.verifyViewRefresh();
    });

    // ==========================================================================
    // VIEW STOCK POINT SCREEN – NEGATIVE
    // ==========================================================================

    test("TC_VIEW_NEG_01 - Verify an appropriate error message is displayed when the Stock Point details API returns no data.", async () => {
        const data = row("TC_VIEW_NEG_01");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("NONEXISTENT_STOCKPOINT_XYZ_999");
        await steps.verifyEmptyState();
    });

    test("TC_VIEW_NEG_02 - Verify the page handles API/network failure gracefully while loading stock point details.", async () => {
        const data = row("TC_VIEW_NEG_02");
        await steps.navigateToStockPoints();
        await steps.verifyGracefulErrorHandling();
    });

    test("TC_VIEW_NEG_03 - Verify accessing the page with an invalid Stock Point ID displays a Record Not Found message.", async () => {
        const data = row("TC_VIEW_NEG_03");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("NONEXISTENT_STOCKPOINT_XYZ_999");
        await steps.verifyEmptyState();
    });

    test("TC_VIEW_NEG_04 - Verify missing Organization information does not break the page layout and displays placeholders/default values.", async () => {
        const data = row("TC_VIEW_NEG_04");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyMissingDataHandled();
    });

    test("TC_VIEW_NEG_05 - Verify missing Bill To information is displayed as - or appropriate default values.", async () => {
        const data = row("TC_VIEW_NEG_05");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyMissingDataHandled();
    });

    test("TC_VIEW_NEG_06 - Verify missing Authentication details are handled gracefully without page crashes.", async () => {
        const data = row("TC_VIEW_NEG_06");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyMissingDataHandled();
    });

    test("TC_VIEW_NEG_07 - Verify unauthorized users cannot access the View Stock Point page and receive an access denied message.", async () => {
        const data = row("TC_VIEW_NEG_07");
        await steps.navigateToStockPoints();
        await steps.verifyGracefulErrorHandling();
    });

    test("TC_VIEW_NEG_08 - Verify invalid search input (special characters only) does not cause application errors.", async () => {
        const data = row("TC_VIEW_NEG_08");
        await steps.navigateToStockPoints();
        await steps.searchStockPoint("!@#$%^&*()");
        await steps.verifyPageStableAfterSearch();
    });

    test("TC_VIEW_NEG_09 - Verify the Refresh button handles API timeout/failure scenarios correctly.", async () => {
        const data = row("TC_VIEW_NEG_09");
        await steps.navigateToStockPoints();
        await steps.clickRefreshButton();
        await steps.verifyGracefulErrorHandling();
    });

    test("TC_VIEW_NEG_10 - Verify null or empty values in fields (Email, Phone, GST No, FSSAI No, Security Answer) are displayed properly without UI corruption.", async () => {
        const data = row("TC_VIEW_NEG_10");
        await steps.navigateToStockPoints();
        await steps.clickViewIcon();
        await steps.verifyMissingDataHandled();
    });

    // ==========================================================================
    // STOCK POINT ONBOARDING – OFFICE SCREEN – POSITIVE
    // ==========================================================================

    test("TC_CR_OFF_01 - Verify user can create a Stock Point by entering all mandatory fields with valid data and click Next successfully.", async () => {
        const data = row("TC_CR_OFF_01");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
    });

    test("TC_CR_OFF_02 - Verify valid email address can be added using the Add Email button.", async () => {
        const data = row("TC_CR_OFF_02");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.addEmail("valid@email.com");
    });

    test("TC_CR_OFF_03 - Verify valid phone number with country code can be added using the Add Phone button.", async () => {
        const data = row("TC_CR_OFF_03");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.addPhone("9876543210");
    });

    test("TC_CR_OFF_04 - Verify selecting a valid location from Google Search auto-populates Country, State, City, and Zipcode fields.", async () => {
        const data = row("TC_CR_OFF_04");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.verifyLocationAutoPopulate();
    });

    test("TC_CR_OFF_05 - Verify user can select different Office Types from the dropdown successfully.", async () => {
        const data = row("TC_CR_OFF_05");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.selectOfficeType("Branch Office");
    });

    test("TC_CR_OFF_06 - Verify map pin location is updated correctly when a valid address is searched and selected.", async () => {
        const data = row("TC_CR_OFF_06");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.verifyLocationAutoPopulate();
        await steps.verifyMapPinUpdated();
    });

    // ==========================================================================
    // STOCK POINT ONBOARDING – OFFICE SCREEN – NEGATIVE
    // ==========================================================================

    test("TC_CR_OFF_NEG_01 - Verify validation message appears when Stock Point Name is left blank and user clicks Next.", async () => {
        const data = row("TC_CR_OFF_NEG_01");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillOfficeDetails("", "", "", "", "", "", "");
        await steps.clickNextExpectValidation();
    });

    test("TC_CR_OFF_NEG_02 - Verify validation message appears when Email field contains an invalid email format.", async () => {
        const data = row("TC_CR_OFF_NEG_02");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillOfficeDetails("TestPoint", "invalid-email", "9876543210", "India", "Maharashtra", "Mumbai", "400001");
        await steps.clickNextExpectValidation();
    });

    test("TC_CR_OFF_NEG_03 - Verify validation message appears when Phone Number contains alphabets or special characters.", async () => {
        const data = row("TC_CR_OFF_NEG_03");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillOfficeDetails("TestPoint", "test@email.com", "abc!@#", "India", "Maharashtra", "Mumbai", "400001");
        await steps.verifyPhoneDoesNotContain("abc");
    });

    test("TC_CR_OFF_NEG_04 - Verify user cannot proceed when mandatory fields (Country, State, City, Zipcode) are empty.", async () => {
        const data = row("TC_CR_OFF_NEG_04");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillOfficeDetails("TestPoint", "test@email.com", "9876543210", "", "", "", "");
        await steps.clickNextExpectValidation();
    });

    test("TC_CR_OFF_NEG_05 - Verify Zipcode field rejects invalid formats (letters, special characters, insufficient digits).", async () => {
        const data = row("TC_CR_OFF_NEG_05");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillOfficeDetails("TestPoint", "test@email.com", "9876543210", "India", "Maharashtra", "Mumbai", "ABC!@");
        await steps.clickNextExpectValidation();
    });

    test("TC_CR_OFF_NEG_06 - Verify user cannot proceed when Google location search returns no valid address or an invalid address is entered.", async () => {
        const data = row("TC_CR_OFF_NEG_06");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillOfficeDetails("TestPoint", "test@email.com", "9876543210", "", "", "", "");
        await steps.clickNextExpectValidation();
    });

    // ==========================================================================
    // STOCK POINT ONBOARDING – ORGANIZATION SCREEN – POSITIVE
    // ==========================================================================

    test("TC_CR_ORG_01 - Verify user can proceed to the next step by entering valid Organization Name, Logo, Registration No, GST/License No, and FSSAI No.", async () => {
        const data = row("TC_CR_ORG_01");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
    });

    test("TC_CR_ORG_02 - Verify user can upload a valid logo file (JPG/PNG) successfully.", async () => {
        const data = row("TC_CR_ORG_02");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.uploadLogo("test-data/uploads/valid-logo.png");
        await steps.verifyLogoPreview();
    });

    test("TC_CR_ORG_03 - Verify Organization Name uniqueness validation passes for a new unique organization name.", async () => {
        const data = row("TC_CR_ORG_03");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
    });

    test("TC_CR_ORG_04 - Verify user can select the Own Company checkbox and continue successfully.", async () => {
        const data = row("TC_CR_ORG_04");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.checkOwnCompany();
        await steps.clickNext();
    });

    // ==========================================================================
    // STOCK POINT ONBOARDING – ORGANIZATION SCREEN – NEGATIVE
    // ==========================================================================

    test("TC_CR_ORG_NEG_01 - Verify validation message appears when Organization Name is left blank and user clicks Next.", async () => {
        const data = row("TC_CR_ORG_NEG_01");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillOrganizationDetails("", "", "", "");
        await steps.verifyValidationError();
    });

    test("TC_CR_ORG_NEG_02 - Verify validation message appears when a duplicate Organization Name is entered.", async () => {
        const data = row("TC_CR_ORG_NEG_02");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillOrganizationDetails("DuplicateOrg", "REG001", "GST001", "12345678901234");
        await steps.verifyValidationError();
    });

    test("TC_CR_ORG_NEG_03 - Verify user cannot proceed without uploading the mandatory Logo file.", async () => {
        const data = row("TC_CR_ORG_NEG_03");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillOrganizationDetails("", "", "", "");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_ORG_NEG_04 - Verify validation message appears when Registration No, GST/License No, or FSSAI No is left empty and user clicks Next.", async () => {
        const data = row("TC_CR_ORG_NEG_04");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillOrganizationDetails("TestOrg", "", "", "");
        await steps.verifyValidationError();
    });

    // ==========================================================================
    // STOCK POINT ONBOARDING – AUTHENTICATION SCREEN – POSITIVE
    // ==========================================================================

    test("TC_CR_AUTH_01 - Verify user can proceed to the next step by entering valid Username, Email, Phone Number, and Password.", async () => {
        const data = row("TC_CR_AUTH_01");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
    });

    test("TC_CR_AUTH_02 - Verify system accepts a valid email format (e.g., user@example.com).", async () => {
        const data = row("TC_CR_AUTH_02");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
    });

    test("TC_CR_AUTH_03 - Verify system accepts a valid phone number with country code selected.", async () => {
        const data = row("TC_CR_AUTH_03");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
    });

    test("TC_CR_AUTH_04 - Verify password visibility toggle (eye icon) correctly shows and hides the password.", async () => {
        const data = row("TC_CR_AUTH_04");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.togglePasswordVisibility();
    });

    // ==========================================================================
    // STOCK POINT ONBOARDING – AUTHENTICATION SCREEN – NEGATIVE
    // ==========================================================================

    test("TC_CR_AUTH_NEG_01 - Verify validation message appears when Username is left blank and user clicks Next.", async () => {
        const data = row("TC_CR_AUTH_NEG_01");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillAuthDetails("", "", "", "");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AUTH_NEG_02 - Verify validation message appears when an invalid email format is entered (e.g., abc@com).", async () => {
        const data = row("TC_CR_AUTH_NEG_02");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillAuthDetails("testuser", "abc@com", "9876543210", "Pass@123");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AUTH_NEG_03 - Verify validation message appears when Phone Number contains alphabets or special characters.", async () => {
        const data = row("TC_CR_AUTH_NEG_03");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillAuthDetails("testuser", "test@email.com", "abc!@#", "Pass@123");
        await steps.verifyPhoneDoesNotContain("abc");
    });

    test("TC_CR_AUTH_NEG_04 - Verify user cannot proceed when Password field is empty or does not meet password policy requirements.", async () => {
        const data = row("TC_CR_AUTH_NEG_04");
        await steps.navigateToStockPoints();
        await steps.clickCreateStockPoint();
        await steps.fillValidOfficeDetails();
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillAuthDetails("testuser", "test@email.com", "9876543210", "");
        await steps.verifyNextDisabled();
    });
});
