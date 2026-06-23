/**
 * Page Object for the Partner (Tenant) module.
 * Contains locator strings and dynamic builders matching the Spec -> Steps -> UIActions -> Page pattern.
 */
export default class PartnerPage {
    static readonly LISTING_PATH = "partner";

    // ---- Navigation / Guard ----
    static readonly SIDEBAR_LINK = "Partner";
    static readonly URL_GUARD = /\/partner/i;
    static readonly LISTING_URL_GUARD = /\/partner(?:\?.*)?$/i;
    static readonly VIEW_URL_GUARD = /\/partner\/view\//i;
    static readonly CREATE_URL_GUARD = /\/partner\/create/i;
    static readonly MODULE_HEADING = "main h1, main h2";
    static readonly PAGE_HEADING = 'main >> role=heading[name*="Partner"]';

    // ---- Listing Screen ----
    static readonly SEARCH_INPUT = 'main >> input[placeholder*="Search"]';
    static readonly CLEAR_SEARCH_BUTTON = 'main button:has-text("Clear")';
    static readonly RELOAD_BUTTON = 'main button[aria-label="Reload"], main button:has-text("Reload")';
    static readonly FILTER_SELLER = 'button:has-text("Seller"), label:has-text("Seller")';
    static readonly CREATE_PARTNER_BUTTON = 'button:has-text("Create Partner"), button:has-text("Add Partner"), button:has-text("Add")';
    static readonly TABLE_ROWS = "main table tbody tr";
    static readonly DATA_TABLE_ROWS = "main table tbody tr:has(td:nth-child(6))";
    static readonly PARTNER_DATA_ROWS = 'main table tbody tr:has-text("@")';
    static readonly ACTIONABLE_PARTNER_ROWS = 'main table tbody tr';
    static readonly EMPTY_STATE_TEXT = "No partners matched the current filters.";
    static readonly NO_PARTNER_DATA_TEXT = "No partner data found.";
    static readonly EMPTY_RESULT_COUNT_TEXT = "0 results";
    static readonly EMPTY_RESULT_SUMMARY_TEXT = "Showing 0 of 0 partners";
    
    // Dashboard metrics
    static readonly TOTAL_PARTNERS_METRIC = 'main div:has-text("Total Partners")';
    static readonly SELLERS_METRIC = 'main div:has-text("Sellers")';
    static readonly NEW_THIS_MONTH_METRIC = 'main div:has-text("New This Month")';
    static readonly TOTAL_ORDERS_METRIC = 'main div:has-text("Total Orders")';

    // Action Icons
    static readonly ROW_VIEW_ICON = 'td:last-child button:first-child, button[aria-label="View"], button[title="View"], [data-testid="VisibilityIcon"]';
    static readonly ROW_DELETE_ICON = 'td:last-child button:nth-child(2), button[aria-label="Delete"], button[title="Delete"], [data-testid="DeleteIcon"]';

    static row(text: string): string {
        return `main table tbody tr:has-text("${text}")`;
    }

    static viewIconInRow(text: string): string {
        return `${PartnerPage.row(text)} >> ${PartnerPage.ROW_VIEW_ICON}`;
    }

    static deleteIconInRow(text: string): string {
        return `${PartnerPage.row(text)} >> ${PartnerPage.ROW_DELETE_ICON}`;
    }

    // ---- View Details Screen ----
    static readonly BACK_BUTTON = 'main button:has-text("Back"), main button[aria-label="Back"]';
    static readonly PARTNER_NAME_VIEW = 'main h3, main h2';
    static readonly MANAGE_ACCOUNT_BUTTON = 'main button:has-text("Manage Account")';
    static readonly EDIT_BUTTON = 'main button:has-text("Edit"), main button[aria-label="Edit"]';
    static readonly DEFAULT_PLACEHOLDER_IMAGE = 'main img[src*="placeholder"]';

    // ---- Delete Popup ----
    static readonly DELETE_POPUP_HEADING = 'text=/Delete Partner|Confirm|Delete Record/i';
    static readonly DELETE_WARNING_TEXT = 'text=/Are you sure you want to delete/i';
    static readonly CANCEL_BUTTON = 'button:has-text("Cancel")';
    static readonly CONFIRM_DELETE_BUTTON = 'button:has-text("Delete"), button:has-text("Confirm")';
    static readonly CLOSE_ICON = 'button[aria-label="Close"], [data-testid="CloseIcon"]';

    // ---- Create: Common ----
    static readonly NEXT_BUTTON = 'main button:has-text("Next"), main button:has-text("Continue")';
    static readonly UPLOADING_BUTTON = 'main button:has-text("Uploading")';
    static readonly BACK_STEP_BUTTON = 'main button:has-text("Back"), main button:has-text("Previous")';
    static readonly DONE_BUTTON = 'main button:has-text("Done"), main button:has-text("Submit")';
    static readonly VALIDATION_ERROR = '.error-message, .invalid-feedback, span:has-text("required"), p:has-text("required"), [role="alert"], :text("required")';

    // ---- Create: Office Info ----
    static readonly OFFICE_NAME_INPUT = 'input[name="officeName"], input[placeholder*="Office" i]';
    static readonly EMAIL_INPUT = 'input[name="email"], input[type="email"], input[placeholder*="Email" i]';
    static readonly PHONE_INPUT = 'input[name="phone"], input[name="phoneNumber"], input[type="tel"]';
    static readonly PARTNER_TYPE_SELECT = 'select[name="partnerType"], select.w-full:not(.PhoneInputCountrySelect), [role="combobox"]';
    static readonly ADDRESS_INPUT = 'input[name="address"], input[placeholder*="Address" i], input[placeholder*="Search address" i]';
    static readonly CITY_INPUT = 'input[name="city"], input[placeholder*="City" i]';
    static readonly STATE_INPUT = 'input[name="state"], input[placeholder*="State" i]';
    static readonly COUNTRY_INPUT = 'input[name="country"], input[placeholder*="Country" i]';
    static readonly ZIPCODE_INPUT = 'input[name="zipcode"], input[placeholder*="Zipcode" i], input[name="pinCode"]';
    static readonly MAP_LOCATION = '.map-container, [aria-label="Map"]';

    // ---- Create: Organization Info ----
    static readonly ORG_NAME_INPUT = 'input[name="organizationName"], input[name="companyName"], input[placeholder*="Organization" i]';
    static readonly LOGO_UPLOAD = 'input[type="file"][name="logo"], input[type="file"][accept*="image"]';
    static readonly LOGO_PREVIEW = 'img.logo-preview, img[alt="preview"]';
    static readonly REG_NUMBER_INPUT = 'input[name="registrationNumber"], input[placeholder*="Registration" i]';
    static readonly GST_INPUT = 'input[name="gstNumber"], input[placeholder*="GST" i]';
    static readonly FSSAI_INPUT = 'input[name="fssaiNumber"], input[placeholder*="FSSAI" i]';
    static readonly OWN_COMPANY_CHECKBOX = 'input[type="checkbox"][name="ownCompany"], input[type="checkbox"]';

    // ---- Create: Authentication ----
    static readonly USERNAME_INPUT = 'input[name="username"], input[placeholder*="Username" i]';
    static readonly PASSWORD_INPUT = 'input[name="password"], input[type="password"]';
    static readonly SHOW_HIDE_PASSWORD_ICON = 'button[aria-label="toggle password visibility"], [data-testid="VisibilityIcon"]';

    // ---- Create: Agreement ----
    static readonly AGREEMENT_UPLOAD = 'main input[type="file"]';
    static readonly CATALOG_OPTION_SELECT = 'main select';
    static readonly MARKET_SELECT = 'main select';
    static readonly START_DATE_INPUT = 'main input[placeholder="mm/dd/yyyy"]';
    static readonly END_DATE_INPUT = 'main input[placeholder="mm/dd/yyyy"]';
    static readonly PAYMENT_METHOD_CHECKBOX = 'input[type="checkbox"][name="paymentMethod"], input[type="checkbox"][value="COD"]';

    // ---- Create: Done ----
    static readonly SUCCESS_MESSAGE = 'text=/Partner details submitted successfully!|Partner Created Successfully/i';
}
