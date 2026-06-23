/**
 * Page Object for the Tenants (Super Admin) module.
 * Contains locator strings and dynamic builders matching the Spec -> Steps -> UIActions -> Page pattern.
 */
export default class TenantsSuperAdminPage {
    static readonly LISTING_PATH = "tenant";

    // ---- Navigation / guard ----
    static readonly SIDEBAR_LINK = "Tenant";
    static readonly URL_GUARD = /\/tenant/i;
    static readonly LISTING_URL_GUARD = /\/tenant(?:\?.*)?$/i;
    static readonly VIEW_URL_GUARD = /\/tenant\/view\//i;
    static readonly EDIT_URL_GUARD = /\/tenant\/edit\//i;
    static readonly CREATE_URL_GUARD = /\/tenant\/create/i;
    static readonly HEADING_GUARD = /Tenant/i;
    static readonly MODULE_HEADING = "main h1, main h2";

    // ---- Listing ----
    static readonly PAGE_HEADING = 'main >> role=heading[name="Tenants"]';
    static readonly SUBTITLE = "Manage platform tenants, authentication, business plans and KYC";
    static readonly SEARCH_INPUT = 'main >> input[placeholder*="Search"]';
    static readonly CREATE_TENANT_BUTTON = 'main >> button:has-text("Create Tenant")';
    static readonly REFRESH_BUTTON = 'main >> button[aria-label="Reload"], main >> button:has-text("Refresh")';
    static readonly TABLE = "main table";
    static readonly TABLE_HEADERS = "main table thead th";
    static readonly ROWS = "main table tbody tr";
    static readonly EMPTY_STATE_TEXT = "No Records Found";
    static readonly BADGE_ACTIVE = '.badge:has-text("Active"), span:has-text("Active")';
    static readonly BADGE_DRAFT = '.badge:has-text("Draft"), span:has-text("Draft")';

    static readonly ROW_VIEW_ICON = 'button[aria-label="View"], button[title="View"]';
    static readonly ROW_EDIT_ICON = 'button[aria-label="Edit"], button[title="Edit"]';

    static row(text: string): string {
        return `main table tbody tr:has-text("${text}")`;
    }

    static viewIconInRow(text: string): string {
        return `${TenantsSuperAdminPage.row(text)} >> ${TenantsSuperAdminPage.ROW_VIEW_ICON}`;
    }

    static editIconInRow(text: string): string {
        return `${TenantsSuperAdminPage.row(text)} >> ${TenantsSuperAdminPage.ROW_EDIT_ICON}`;
    }

    // ---- Pagination ----
    static readonly NEXT_BUTTON = 'main [aria-label="Go to next page"], main button:has-text("Next")';
    static readonly PREV_BUTTON = 'main [aria-label="Go to previous page"], main button:has-text("Previous")';

    // ---- Tenant View Screen ----
    static readonly VIEW_PAGE_HEADING = 'main >> role=heading[name*="Tenant Details"]';
    static readonly VIEW_LOGO = 'main img.logo, main img[alt="logo"], main img[alt="tenant logo"]';
    static readonly VIEW_FIELD_NAME = 'main text="Company Name", main text="Tenant Name"';
    static readonly BACK_BUTTON = 'main button:has-text("Back"), main button[aria-label="Back"]';
    static readonly VIEW_KYC_DETAILS_BUTTON = 'main button:has-text("KYC Details"), main button:has-text("View KYC")';

    // ---- Edit Tenant Screen ----
    static readonly EDIT_PAGE_HEADING = 'main >> role=heading[name*="Edit Tenant"]';
    static readonly UPDATE_BUTTON = 'main >> button:has-text("Update")';
    static readonly EDIT_KYC_DETAILS_BUTTON = 'main >> button:has-text("KYC Details")';

    // ---- Create Tenant Screen (Basic Info) ----
    static readonly COMPANY_NAME_INPUT = 'div:has(> label:has-text("Company Name")) input, input[placeholder="Enter Company Name"], input[name="companyName"]';
    static readonly FIRST_NAME_INPUT = 'div:has(> label:has-text("First Name")) input, input[placeholder="Enter First Name"], input[name="firstName"]';
    static readonly LAST_NAME_INPUT = 'div:has(> label:has-text("Last Name")) input, input[placeholder="Enter Last Name"], input[name="lastName"]';
    static readonly LOGO_UPLOAD = 'div:has(> label:has-text("Upload Company Logo")) input[type="file"], input[type="file"][name="logo"], input[type="file"][accept*="image"]';
    static readonly LOGO_PREVIEW = 'main img.logo-preview, main img[alt="preview"], main img[alt*="logo" i], main img[src^="blob:"], main img[src^="data:"]';
    static readonly GOOGLE_ADDRESS_INPUT = 'input[placeholder="Search with Google"], input[placeholder*="Search Address"], input[placeholder*="Google Address"]';
    static readonly COUNTRY_INPUT = 'div:has(> label:has-text("Country")) input, input[placeholder="Enter Country"], input[name="country"]';
    static readonly STATE_INPUT = 'div:has(> label:has-text("State")) input, input[placeholder="Enter State"], input[name="state"]';
    static readonly CITY_INPUT = 'div:has(> label:has-text("City")) input, input[placeholder="Enter City"], input[name="city"]';
    static readonly ZIPCODE_INPUT = 'div:has(> label:has-text("Zipcode")) input, input[placeholder="Enter Zipcode"], input[name="zipcode"]';
    static readonly STREET_1_INPUT = 'div:has(> label:has-text("Street 1")) input, input[placeholder="Enter Street 1"], input[name="street1"]';
    static readonly STREET_2_INPUT = 'div:has(> label:has-text("Street 2")) input, input[placeholder="Enter Street 2"], input[name="street2"]';
    static readonly COORDINATES_INPUT = 'div:has(> label:has-text("Coordinates")) input, div:has(> label:has-text("Resolved Coordinates")) input, input[placeholder="Coordinates"], input[name="coordinates"]';
    static readonly CONTINUE_AUTH_BUTTON = 'button:has-text("Continue to Authentication")';
    static readonly CANCEL_BUTTON = 'button:has-text("Cancel")';

    // ---- Create Tenant Screen (Authentication) ----
    static readonly EMAIL_INPUT = 'div:has(> label:has-text("Email")) input, input[placeholder="Enter Email"], input[name="email"]';
    static readonly PHONE_INPUT = 'div:has(> label:has-text("Phone Number")) input, input[placeholder="Enter Phone Number"], input[name="phoneNumber"]';
    static readonly USERNAME_INPUT = 'div:has(> label:has-text("User Name")) input, input[placeholder="Enter Username"], input[name="username"]';
    static readonly PASSWORD_INPUT = 'div:has(> label:has-text("Password")) input, input[placeholder="Enter Password"], input[name="password"]';
    static readonly CONTINUE_PLAN_BUTTON = 'button:has-text("Continue to Business Plan")';
    static readonly GO_BACK_BASIC_BUTTON = 'button:has-text("Go back to Basic Info")';

    // ---- Create Tenant Screen (Business Plan) ----
    static readonly BUSINESS_PLAN_SELECT = 'select[name="businessPlan"], select[name="plan"]';
    static readonly AGREEMENT_UPLOAD = 'input[type="file"][name="agreement"], input[type="file"][accept*="pdf"], main input[type="file"]';
    static readonly FROM_DATE_PICKER = 'input[type="date"][name="fromDate"], input[placeholder="From Date"]';
    static readonly TO_DATE_PICKER = 'input[type="date"][name="toDate"], input[placeholder="To Date"]';
    static readonly DOMAIN_DROPDOWN = 'select[name="domains"], main button:has-text("Select Domain"), [role="combobox"][placeholder*="Domain"]';
    static readonly DOMAIN_OPTION_CHECKBOX = 'input[type="checkbox"][name="domain"]';
    static readonly SELECT_MARKET_CHECKBOX = 'input[type="checkbox"][name="selectMarket"], input[type="checkbox"][name="market"]';
    static readonly ENABLE_MANUFACTURER_CHECKBOX = 'input[type="checkbox"][name="enableManufacturer"], input[type="checkbox"][name="manufacturer"]';
    static readonly PAYMENT_GATEWAY_SELECT = 'select[name="paymentGateway"], select[name="gateway"]';
    static readonly CREATE_TENANT_CONFIRM_BUTTON = 'button:has-text("Create Tenant")';

    // ---- Confirmation popup ----
    static readonly CONFIRM_POPUP_HEADING = 'role=dialog >> text=/Create Tenant Confirmation|Confirm/';
    static readonly POPUP_CREATE_BUTTON = 'role=dialog button:has-text("CREATE"), role=dialog button:has-text("Confirm")';
    static readonly POPUP_DISCARD_BUTTON = 'role=dialog button:has-text("DISCARD"), role=dialog button:has-text("Cancel")';

    // ---- Success popup ----
    static readonly SUCCESS_POPUP_HEADING = 'role=dialog >> text=/Tenant created successfully|Success/';
    static readonly POPUP_OK_BUTTON = 'role=dialog button:has-text("OK")';

    // ---- Theme Screen ----
    static readonly SUBDOMAIN_INPUT = 'input[placeholder="Enter Sub-domain"], input[name="subdomain"]';
    static readonly BRAND_COLOR_INPUT = 'input[type="color"][name="brandColor"], [data-qa="brand-color"]';
    static readonly DARK_COLOR_INPUT = 'input[type="color"][name="primaryDark"]';
    static readonly LIGHT_COLOR_INPUT = 'input[type="color"][name="primaryLight"]';
    static readonly FONT_COLOR_INPUT = 'input[name="fontColor"]';
    static readonly FONT_FAMILY_SELECT = 'select[name="fontFamily"]';
    static readonly CONTINUE_KYC_BUTTON = 'button:has-text("Continue to KYC")';
    static readonly DRAFT_QUIT_BUTTON = 'button:has-text("Draft & Quit")';

    // ---- KYC Screen ----
    static readonly ID_PROOF_TYPE_SELECT = 'select[name="idProofType"]';
    static readonly ID_NUMBER_INPUT = 'input[name="idNumber"]';
    static readonly ID_FRONT_UPLOAD = 'input[type="file"][name="idFront"]';
    static readonly ID_BACK_UPLOAD = 'input[type="file"][name="idBack"]';
    static readonly ADDRESS_PROOF_TYPE_SELECT = 'select[name="addressProofType"]';
    static readonly ADDRESS_NUMBER_INPUT = 'input[name="addressNumber"]';
    static readonly ADDRESS_FRONT_UPLOAD = 'input[type="file"][name="addressFront"]';
    static readonly ADDRESS_BACK_UPLOAD = 'input[type="file"][name="addressBack"]';
    static readonly DRAFT_APPROVE_LATER_BUTTON = 'button:has-text("Draft & Approve Later")';
    static readonly APPROVE_SEND_MAIL_BUTTON = 'button:has-text("Approve & Send Verification Mail")';

    // ---- KYC Approve popup ----
    static readonly KYC_APPROVE_POPUP_HEADING = 'role=dialog >> text=/Approve KYC|KYC Approval/';
    static readonly KYC_POPUP_APPROVE_BUTTON = 'role=dialog button:has-text("APPROVE")';
    static readonly KYC_POPUP_CANCEL_BUTTON = 'role=dialog button:has-text("CANCEL")';

    // ---- Toast ----
    static readonly TOAST = ".Toastify__toast";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";
    static readonly SYNTHETIC_ERROR_TOAST = '[data-qa="tenants-negative-search-toast"]';
}
