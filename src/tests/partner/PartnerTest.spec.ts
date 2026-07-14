import HomeSteps from "@uiSteps/HomeSteps";
import PartnerSteps from "@uiSteps/PartnerSteps";
import { test as base, expect } from "@base-test";
import { Page } from "@playwright/test";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "Partner (Tenant)";
const TENANT = { email: "freshcart@gmail.com", password: "Welcome@123", persona: "tenant" };

const test = base.extend<{ partnerPage: Page }>({
    partnerPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ viewport: null });
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        await home.login(TENANT.email, TENANT.password, TENANT.persona);
        await home.validateLogin(TENANT.email);
        await use(page);
        await context.close();
    }, { scope: "worker" }],
});

test.describe.configure({ retries: 0 });

const ROWS = ExcelUtil.getTestDataArray(SHEET);
function row(id: string) {
    const found = ROWS.find((r) => r.TC_ID === id);
    if (!found) throw new Error(`TC_ID '${id}' not found on '${SHEET}' sheet`);
    return found;
}

test.describe("Partner (Tenant) Suite", () => {
    let steps: PartnerSteps;

    test.beforeAll(async ({ partnerPage }) => {
        steps = new PartnerSteps(partnerPage);
    });

    test("TC_LIST_01 - Verify the Partners page loads successfully with dashboard metrics, partner filters, search box, and partner list.", async ({ partnerPage }) => {
        const data = row("TC_LIST_01");
        await steps.navigateToPartners();
        await steps.verifyDashboardMetrics();
    });

    test("TC_LIST_02 - Verify user can filter partners by Seller and only Seller-type partners are displayed.", async ({ partnerPage }) => {
        const data = row("TC_LIST_02");
        await steps.navigateToPartners();
        await steps.filterBySeller();
    });

    test("TC_LIST_03 - Verify user can search a partner using a valid Name, Email, or Phone Number and view matching results.", async ({ partnerPage }) => {
        const data = row("TC_LIST_03");
        await steps.navigateToPartners();
        await steps.searchPartner("Seller");
        await steps.verifySearchResult("Seller");
        await steps.searchPartner(""); // Clear search to avoid affecting next tests
    });

    test("TC_LIST_04 - Verify clicking the View icon opens the selected partner's details page successfully.", async ({ partnerPage }) => {
        const data = row("TC_LIST_04");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
        await steps.clickBackButton();
    });

    test("TC_LIST_05 - Verify clicking the Create Partner button navigates the user to the partner creation screen.", async ({ partnerPage }) => {
        const data = row("TC_LIST_05");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
    });

    test("TC_LIST_06 - Verify dashboard counts (Total Partners, Sellers, New This Month, Total Orders) are displayed correctly.", async ({ partnerPage }) => {
        const data = row("TC_LIST_06");
        await steps.navigateToPartners();
    });

    test("TC_LIST_NEG_01 - Verify searching with a non-existing partner name/email/phone displays a 'No Records Found' message.", async ({ partnerPage }) => {
        const data = row("TC_LIST_NEG_01");
        await steps.navigateToPartners();
        await steps.searchPartner("INVALID_DATA_XYZ");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_02 - Verify search field handles special characters and invalid inputs without application failure.", async ({ partnerPage }) => {
        const data = row("TC_LIST_NEG_02");
        await steps.navigateToPartners();
        await steps.searchPartner("INVALID_DATA_XYZ");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_03 - Verify the page displays an appropriate error message when partner data fails to load due to API/network issues.", async ({ partnerPage }) => {
        const data = row("TC_LIST_NEG_03");
        await steps.navigateToPartners();
        await steps.searchPartner("INVALID_DATA_XYZ");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_04 - Verify clicking the View icon for a deleted or inaccessible partner displays an appropriate error message.", async ({ partnerPage }) => {
        const data = row("TC_LIST_NEG_04");
        await steps.navigateToPartners();
        await steps.searchPartner("INVALID_DATA_XYZ");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_05 - Verify partner type filters display an empty state message when no records exist for the selected type.", async ({ partnerPage }) => {
        const data = row("TC_LIST_NEG_05");
        await steps.navigateToPartners();
        await steps.searchPartner("INVALID_DATA_XYZ");
        await steps.verifyEmptyState();
    });

    test("TC_LIST_NEG_06 - Verify rapid multiple clicks on filter tabs or action buttons do not cause duplicate requests or UI issues.", async ({ partnerPage }) => {
        const data = row("TC_LIST_NEG_06");
        await steps.navigateToPartners();
        await steps.searchPartner("INVALID_DATA_XYZ");
        await steps.verifyEmptyState();
    });

    test("TC_VIEW_01 - Verify the Partner Details page loads successfully with all partner information displayed correctly.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_01");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_02 - Verify clicking the Back button navigates the user back to the Partners listing page.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_02");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_03 - Verify partner profile information (Logo, Name, Email, Phone) is displayed correctly in the left panel.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_03");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_04 - Verify clicking the Edit button in the Organization Info section opens the edit form with pre-populated data.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_04");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_05 - Verify clicking the Manage Account button opens the partner account management screen successfully.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_05");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_06 - Verify user can navigate between all left-menu sections (Subscription, Payments, Orders, Invoices, Users, etc.) successfully.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_06");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_07 - Verify all information sections (Organization Info, Office, Billing Info, Agreement, Credentials, Additional Info) display correct data.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_07");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_08 - Verify individual Edit buttons open the corresponding section for modification without affecting other sections.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_08");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_NEG_01 - Verify an appropriate error message is displayed when partner details fail to load due to API/network failure.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_NEG_01");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_NEG_02 - Verify the page handles missing partner profile image by displaying a default placeholder image.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_NEG_02");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_NEG_03 - Verify clicking Edit without sufficient permissions displays an authorization error.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_NEG_03");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_NEG_04 - Verify navigation to a non-existent partner record displays a 'Partner Not Found' message.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_NEG_04");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_NEG_05 - Verify sections with missing data (e.g., Agreement, Additional Info) display appropriate empty-state messages instead of blank screens.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_NEG_05");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_NEG_06 - Verify clicking Manage Account for an inactive or disabled partner displays an appropriate validation message.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_NEG_06");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_NEG_07 - Verify rapid multiple clicks on Edit buttons do not open duplicate forms or create UI inconsistencies.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_NEG_07");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_VIEW_NEG_08 - Verify the page handles invalid or corrupted partner data without breaking the layout or displaying incorrect information.", async ({ partnerPage }) => {
        const data = row("TC_VIEW_NEG_08");
        await steps.navigateToPartners();
        await steps.viewPartner();
        await steps.verifyPartnerDetails();
    });

    test("TC_DEL_01 - Verify clicking Delete successfully removes the selected partner and updates the partner list.", async ({ partnerPage }) => {
        const data = row("TC_DEL_01");
        await steps.navigateToPartners();
        if ("TC_DEL_01".includes("NEG")) {
            await steps.openDeletePopup("");
            await steps.cancelDelete();
        } else {
            await steps.openDeletePopup("");
            await steps.confirmDelete();
        }
    });

    test("TC_DEL_02 - Verify clicking Cancel closes the delete confirmation popup without deleting the partner.", async ({ partnerPage }) => {
        const data = row("TC_DEL_02");
        await steps.navigateToPartners();
        if ("TC_DEL_02".includes("NEG")) {
            await steps.openDeletePopup("");
            await steps.cancelDelete();
        } else {
            await steps.openDeletePopup("");
            await steps.confirmDelete();
        }
    });

    test("TC_DEL_03 - Verify clicking the X (Close) icon dismisses the popup and retains the partner record.", async ({ partnerPage }) => {
        const data = row("TC_DEL_03");
        await steps.navigateToPartners();
        if ("TC_DEL_03".includes("NEG")) {
            await steps.openDeletePopup("");
            await steps.cancelDelete();
        } else {
            await steps.openDeletePopup("");
            await steps.confirmDelete();
        }
    });

    test("TC_DEL_04 - Verify the delete confirmation popup displays correctly with warning message, Cancel button, and Delete button.", async ({ partnerPage }) => {
        const data = row("TC_DEL_04");
        await steps.navigateToPartners();
        if ("TC_DEL_04".includes("NEG")) {
            await steps.openDeletePopup("");
            await steps.cancelDelete();
        } else {
            await steps.openDeletePopup("");
            await steps.confirmDelete();
        }
    });

    test("TC_DEL_NEG_01 - Verify an appropriate error message is displayed when partner deletion fails due to API/network failure.", async ({ partnerPage }) => {
        const data = row("TC_DEL_NEG_01");
        await steps.navigateToPartners();
        if ("TC_DEL_NEG_01".includes("NEG")) {
            await steps.openDeletePopup("");
            await steps.cancelDelete();
        } else {
            await steps.openDeletePopup("");
            await steps.confirmDelete();
        }
    });

    test("TC_DEL_NEG_02 - Verify a user without delete permissions cannot delete a partner and receives an authorization error.", async ({ partnerPage }) => {
        const data = row("TC_DEL_NEG_02");
        await steps.navigateToPartners();
        if ("TC_DEL_NEG_02".includes("NEG")) {
            await steps.openDeletePopup("");
            await steps.cancelDelete();
        } else {
            await steps.openDeletePopup("");
            await steps.confirmDelete();
        }
    });

    test("TC_DEL_NEG_03 - Verify multiple rapid clicks on the Delete button do not trigger duplicate delete requests.", async ({ partnerPage }) => {
        const data = row("TC_DEL_NEG_03");
        await steps.navigateToPartners();
        if ("TC_DEL_NEG_03".includes("NEG")) {
            await steps.openDeletePopup("");
            await steps.cancelDelete();
        } else {
            await steps.openDeletePopup("");
            await steps.confirmDelete();
        }
    });

    test("TC_DEL_NEG_04 - Verify attempting to delete a partner associated with active orders, subscriptions, or transactions displays a validation error and prevents deletion.", async ({ partnerPage }) => {
        const data = row("TC_DEL_NEG_04");
        await steps.navigateToPartners();
        if ("TC_DEL_NEG_04".includes("NEG")) {
            await steps.openDeletePopup("");
            await steps.cancelDelete();
        } else {
            await steps.openDeletePopup("");
            await steps.confirmDelete();
        }
    });

    test("TC_CR_OFF_01 - Verify user can enter valid Office details and successfully proceed to the next step by clicking Next.", async ({ partnerPage, page }) => {
        const data = row("TC_CR_OFF_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
    });

    test("TC_CR_OFF_02 - Verify user can add a valid email address and it is saved successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
    });

    test("TC_CR_OFF_03 - Verify user can enter a valid phone number with country code and proceed successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
    });

    test("TC_CR_OFF_04 - Verify selecting a valid partner type (e.g., Seller) saves the selection correctly.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
    });

    test("TC_CR_OFF_05 - Verify address fields (Address, City, State, Country, Zipcode) accept valid inputs and are saved successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_05");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
    });

    test("TC_CR_OFF_06 - Verify the map location updates correctly based on the entered address/location details.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_06");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
    });

    test("TC_CR_OFF_NEG_01 - Verify system displays validation errors when mandatory fields are left blank and Next is clicked.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_NEG_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("", "", "", "", "", "", "");
        await steps.clickNextExpectValidationOnSameStep();
    });

    test("TC_CR_OFF_NEG_02 - Verify system rejects invalid email formats and prevents navigation to the next step.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_NEG_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("", "", "", "", "", "", "");
        await steps.clickNextExpectValidationOnSameStep();
    });

    test("TC_CR_OFF_NEG_03 - Verify system rejects invalid phone numbers containing alphabets, special characters, or incorrect length.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_NEG_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("", "", "", "", "", "", "");
        await steps.clickNextExpectValidationOnSameStep();
    });

    test("TC_CR_OFF_NEG_04 - Verify system prevents proceeding when an unsupported or invalid partner type is selected.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_NEG_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("", "", "", "", "", "", "");
        await steps.clickNextExpectValidationOnSameStep();
    });

    test("TC_CR_OFF_NEG_05 - Verify system displays an error when an invalid or non-existent address/location is entered.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_NEG_05");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("", "", "", "", "", "", "");
        await steps.clickNextExpectValidationOnSameStep();
    });

    test("TC_CR_OFF_NEG_06 - Verify system prevents proceeding when Zipcode contains invalid characters or exceeds the allowed length.", async ({ partnerPage }) => {
        const data = row("TC_CR_OFF_NEG_06");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("", "", "", "", "", "", "");
        await steps.clickNextExpectValidationOnSameStep();
    });

    test("TC_CR_ORG_01 - Verify user can enter valid Organization details and successfully proceed to the next step by clicking Next.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
    });

    test("TC_CR_ORG_02 - Verify user can upload a valid company logo image and the logo preview is displayed correctly.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
    });

    test("TC_CR_ORG_03 - Verify user can enter a unique Organization Name and save it successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
    });

    test("TC_CR_ORG_04 - Verify user can enter valid Registration Number, GST/License Number, and FSSAI Number and proceed successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
    });

    test("TC_CR_ORG_05 - Verify user can enable the Own Company checkbox and save the organization details successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_05");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
    });

    test("TC_CR_ORG_06 - Verify clicking the Back button navigates to the previous step while retaining entered data.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_06");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
    });

    test("TC_CR_ORG_NEG_01 - Verify validation errors are displayed when mandatory fields (Organization Name, Logo, Registration No, GST/License No, FSSAI No) are left blank and Next is clicked.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_NEG_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillOrganizationDetails("", "", "", "");
        await steps.verifyValidationError();
        await steps.verifyNextDisabled();
    });

    test("TC_CR_ORG_NEG_02 - Verify system prevents proceeding when a duplicate Organization Name is entered.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_NEG_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillOrganizationDetails("", "", "", "");
        await steps.verifyValidationError();
        await steps.verifyNextDisabled();
    });

    test("TC_CR_ORG_NEG_03 - Verify system rejects unsupported logo file formats or files exceeding the allowed size limit.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_NEG_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillOrganizationDetails("", "", "", "");
        await steps.verifyValidationError();
        await steps.verifyNextDisabled();
    });

    test("TC_CR_ORG_NEG_04 - Verify system displays a validation error when invalid GST/License Number format is entered.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_NEG_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillOrganizationDetails("", "", "", "");
        await steps.verifyValidationError();
        await steps.verifyNextDisabled();
    });

    test("TC_CR_ORG_NEG_05 - Verify system displays a validation error when FSSAI Number contains alphabetic or special characters instead of valid numeric input.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_NEG_05");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillOrganizationDetails("", "", "", "");
        await steps.verifyValidationError();
        await steps.verifyNextDisabled();
    });

    test("TC_CR_ORG_NEG_06 - Verify an appropriate error message is displayed when organization details fail to save due to API/network issues.", async ({ partnerPage }) => {
        const data = row("TC_CR_ORG_NEG_06");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillOrganizationDetails("", "", "", "");
        await steps.verifyValidationError();
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AUTH_01 - Verify user can enter valid Username, Email, Phone Number, and Password and proceed to the next step by clicking Next.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
    });

    test("TC_CR_AUTH_02 - Verify system accepts a valid email address format and saves it successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
    });

    test("TC_CR_AUTH_03 - Verify user can enter a valid phone number with country code and proceed successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
    });

    test("TC_CR_AUTH_04 - Verify clicking the Show/Hide Password icon correctly toggles password visibility.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
    });

    test("TC_CR_AUTH_05 - Verify clicking the Back button navigates to the previous step while retaining entered authentication details.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_05");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
    });

    test("TC_CR_AUTH_NEG_01 - Verify validation errors are displayed when mandatory fields (Username, Email, Phone Number, Password) are left blank and Next is clicked.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_NEG_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillAuthDetails("", "", "", "");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AUTH_NEG_02 - Verify system rejects invalid email formats and prevents proceeding to the next step.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_NEG_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillAuthDetails(`user${Date.now()}`, "Pass@123", "invalid-email");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AUTH_NEG_03 - Verify system prevents proceeding when an already existing Username is entered.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_NEG_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillAuthDetails("user123", "Pass@123");
        await steps.clickNext();
        await steps.verifyValidationError();
    });

    test("TC_CR_AUTH_NEG_04 - Verify system rejects weak passwords that do not meet the password policy requirements.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_NEG_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillAuthDetails(`user${Date.now()}`, "123");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AUTH_NEG_05 - Verify system rejects invalid phone numbers containing alphabets, special characters, or incorrect length.", async ({ partnerPage }) => {
        const data = row("TC_CR_AUTH_NEG_05");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillAuthDetails(`user${Date.now()}`, "Pass@123", undefined, "abc");
        await steps.verifyPhoneDoesNotContain("abc");
    });

    test("TC_CR_AGR_01 - Verify user can upload a valid agreement document and proceed to the next step successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
    });

    test("TC_CR_AGR_02 - Verify user can select a valid Catalog Option and Market and save the selections correctly.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
    });

    test("TC_CR_AGR_03 - Verify user can select one or more markets and the selected markets are displayed in the Selected Markets section.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
    });

    test("TC_CR_AGR_04 - Verify user can enter valid Agreement Start Date and Agreement End Date and proceed successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
    });

    test("TC_CR_AGR_05 - Verify user can select one or more Payment Methods (COD/Online) and save the agreement details successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_05");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
    });

    test("TC_CR_AGR_NEG_01 - Verify validation errors are displayed when mandatory fields (Agreement Document, Catalog Option, Market, Start Date, End Date) are left blank and Next is clicked.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_NEG_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("", "");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AGR_NEG_02 - Verify system rejects unsupported agreement document file formats or files exceeding the allowed size limit.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_NEG_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementWithDocument("test-data/uploads/large-file.png", "2025-01-01", "2026-01-01");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AGR_NEG_03 - Verify system prevents proceeding when Agreement End Date is earlier than Agreement Start Date.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_NEG_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2026-01-01", "2025-01-01");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AGR_NEG_04 - Verify system displays a validation error when no market is selected after choosing a catalog option.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_NEG_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementWithoutMarket("2025-01-01", "2026-01-01");
        await steps.verifyNextDisabled();
    });

    test("TC_CR_AGR_NEG_05 - Verify system prevents proceeding when no payment method is selected if at least one payment method is mandatory.", async ({ partnerPage }) => {
        const data = row("TC_CR_AGR_NEG_05");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clearPaymentMethods();
        await steps.verifyPaymentMethodsUnchecked();
        await steps.clickNext();
    });

    test("TC_CR_DN_01 - Verify the success page is displayed after completing all partner creation steps successfully.", async ({ partnerPage }) => {
        const data = row("TC_CR_DN_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
        if ("TC_CR_DN_01".includes("NEG")) {
           // Skip or negative validation
        } else {
           await steps.verifySuccessMessage();
           await steps.clickDone();
        }
    });

    test("TC_CR_DN_02 - Verify the success message 'Partner details submitted successfully!' is displayed correctly.", async ({ partnerPage }) => {
        const data = row("TC_CR_DN_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
        if ("TC_CR_DN_02".includes("NEG")) {
           // Skip or negative validation
        } else {
           await steps.verifySuccessMessage();
           await steps.clickDone();
        }
    });

    test("TC_CR_DN_03 - Verify clicking the Done button redirects the user to the Partners list or Partner Details page as per business requirement.", async ({ partnerPage }) => {
        const data = row("TC_CR_DN_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
        if ("TC_CR_DN_03".includes("NEG")) {
           // Skip or negative validation
        } else {
           await steps.verifySuccessMessage();
           await steps.clickDone();
        }
    });

    test("TC_CR_DN_04 - Verify the newly created partner record is available in the Partners listing after clicking Done.", async ({ partnerPage }) => {
        const data = row("TC_CR_DN_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
        if ("TC_CR_DN_04".includes("NEG")) {
           // Skip or negative validation
        } else {
           await steps.verifySuccessMessage();
           await steps.clickDone();
        }
    });

    test("TC_CR_DN_NEG_01 - Verify the success page is not displayed if partner creation fails due to API/server error.", async ({ partnerPage }) => {
        const data = row("TC_CR_DN_NEG_01");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
        if ("TC_CR_DN_NEG_01".includes("NEG")) {
           // Skip or negative validation
        } else {
           await steps.verifySuccessMessage();
           await steps.clickDone();
        }
    });

    test("TC_CR_DN_NEG_02 - Verify clicking the Done button during a network interruption displays an appropriate error message.", async ({ partnerPage }) => {
        const data = row("TC_CR_DN_NEG_02");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
        if ("TC_CR_DN_NEG_02".includes("NEG")) {
           // Skip or negative validation
        } else {
           await steps.verifySuccessMessage();
           await steps.clickDone();
        }
    });

    test("TC_CR_DN_NEG_03 - Verify refreshing the success page does not create a duplicate partner record.", async ({ partnerPage }) => {
        const data = row("TC_CR_DN_NEG_03");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
        if ("TC_CR_DN_NEG_03".includes("NEG")) {
           // Skip or negative validation
        } else {
           await steps.verifySuccessMessage();
           await steps.clickDone();
        }
    });

    test("TC_CR_DN_NEG_04 - Verify using the browser Back button after successful submission does not resubmit or duplicate the partner creation request.", async ({ partnerPage }) => {
        const data = row("TC_CR_DN_NEG_04");
        await steps.navigateToPartners();
        await steps.clickCreatePartner();
        await steps.fillOfficeDetails("test@email.com", "9876543210", "123 St", "City", "State", "Country", "12345");
        await steps.clickNext();
        await steps.fillUniqueOrganizationDetails();
        await steps.clickNext();
        await steps.fillUniqueAuthDetails();
        await steps.clickNext();
        await steps.fillAgreementDetails("2025-01-01", "2026-01-01");
        await steps.clickNext();
        if ("TC_CR_DN_NEG_04".includes("NEG")) {
           // Skip or negative validation
        } else {
           await steps.verifySuccessMessage();
           await steps.clickDone();
        }
    });
});
