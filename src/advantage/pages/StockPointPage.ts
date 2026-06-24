/**
 * Page Object for the Stock Point (Seller) module.
 * Contains locator strings matching the Spec -> Steps -> UIActions -> Page pattern.
 */
export default class StockPointPage {
    // ---- Navigation / Guard ----
    static readonly SIDEBAR_LINK = "Stock Points";
    static readonly URL_GUARD = /\/stock-point/i;
    static readonly LISTING_URL_GUARD = /\/stock-point(?:\?.*)?$/i;
    static readonly VIEW_URL_GUARD = /\/stock-point\/view\//i;
    static readonly CREATE_URL_GUARD = /\/stock-point\/create/i;

    // ---- Listing Screen ----
    static readonly SEARCH_INPUT = 'main >> input[placeholder*="Search"]';
    static readonly CREATE_STOCK_POINT_BUTTON = 'button:has-text("Create Stock Point"), button:has-text("Add Stock Point"), button:has-text("Create"), a:has-text("Create Stock Point")';
    static readonly REFRESH_BUTTON = 'main button[aria-label="Reload"], main button:has-text("Reload"), main button[aria-label="Refresh"], main button:has-text("Refresh")';
    static readonly TABLE_ROWS = "main table tbody tr";
    static readonly ACTIONABLE_ROWS = "main table tbody tr";
    static readonly BACK_BUTTON = 'main button:has-text("Back"), main button[aria-label="Back"], button[aria-label="go back"]';

    // Summary cards
    static readonly CURRENT_PAGE_RESULTS_CARD = 'main div:has-text("Current Page Results"), main div:has-text("Page Results")';
    static readonly TOTAL_STOCK_POINTS_CARD = 'main div:has-text("Total Stock Points"), main div:has-text("Total")';

    // Office Type Badges
    static readonly OFFICE_TYPE_BADGE = 'span:has-text("Branch Office"), span:has-text("Head Office"), span:has-text("Default"), .badge, [class*="badge"]';

    // Action Icons
    static readonly ROW_VIEW_ICON = 'td:last-child button:first-child, button[aria-label="View"], button[title="View"], [data-testid="VisibilityIcon"]';

    // Empty state
    static readonly EMPTY_STATE_TEXT = "No stock points matched your current search.";
    static readonly NO_DATA_TEXT = "No stock point data found";
    static readonly EMPTY_RESULT_COUNT_TEXT = "0 results";

    static row(text: string): string {
        return `main table tbody tr:has-text("${text}")`;
    }

    static viewIconInRow(text: string): string {
        return `${StockPointPage.row(text)} >> ${StockPointPage.ROW_VIEW_ICON}`;
    }

    // ---- View Details Screen ----
    static readonly STOCK_POINT_NAME_VIEW = "main h3, main h2, main h1";
    static readonly OFFICE_INFO_SECTION = 'main >> text=/Office|Stock Point Name/i';
    static readonly ORGANIZATION_SECTION = 'main >> text=/Organization|Organisation/i';
    static readonly BILL_TO_SECTION = 'main >> text=/Bill To|Billing/i';
    static readonly AUTHENTICATION_SECTION = 'main >> text=/Authentication|Credentials/i';

    // View fields
    static readonly VIEW_EMAIL_FIELD = 'main >> text=/Email/i';
    static readonly VIEW_PHONE_FIELD = 'main >> text=/Phone/i';
    static readonly VIEW_CITY_FIELD = 'main >> text=/City/i';
    static readonly VIEW_STATE_FIELD = 'main >> text=/State/i';
    static readonly VIEW_COUNTRY_FIELD = 'main >> text=/Country/i';
    static readonly VIEW_ZIPCODE_FIELD = 'main >> text=/Zipcode|Pin Code|Postal/i';
    static readonly VIEW_ORG_NAME_FIELD = 'main >> text=/Organization Name|Company/i';
    static readonly VIEW_REG_NO_FIELD = 'main >> text=/Registration No|Reg/i';
    static readonly VIEW_GST_FIELD = 'main >> text=/GST|License/i';
    static readonly VIEW_FSSAI_FIELD = 'main >> text=/FSSAI/i';
    static readonly VIEW_OWN_COMPANY_FIELD = 'main >> text=/Own Company/i';
    static readonly VIEW_USERNAME_FIELD = 'main >> text=/Username|User Name/i';
    static readonly VIEW_SECURITY_QUESTION = 'main >> text=/Security Question/i';
    static readonly VIEW_SECURITY_ANSWER = 'main >> text=/Security Answer/i';

    // ---- Create: Common ----
    static readonly NEXT_BUTTON = 'main button:has-text("Next"), main button:has-text("Continue")';
    static readonly VALIDATION_ERROR = '.error-message, .invalid-feedback, span:has-text("required"), p:has-text("required"), [role="alert"], :text("required"), .text-red-500, .text-danger';

    // ---- Create: Office Info ----
    static readonly STOCK_POINT_NAME_INPUT = 'input[name="officeName"], input[name="stockPointName"], input[placeholder*="Stock Point" i], input[placeholder*="Office Name" i], input[placeholder*="Name" i]';
    static readonly EMAIL_INPUT = 'input[name="email"], input[type="email"], input[placeholder*="Email" i], input[placeholder*="@" i], input[placeholder*="example.com" i]';
    static readonly ADD_EMAIL_BUTTON = 'button:has-text("Add Email"), button:has-text("Add email")';
    static readonly PHONE_INPUT = 'input[name="phone"], input[name="phoneNumber"], input[type="tel"]';
    static readonly ADD_PHONE_BUTTON = 'button:has-text("Add Phone"), button:has-text("Add phone")';
    static readonly GOOGLE_SEARCH_INPUT = 'input[placeholder*="Search location" i], input[placeholder*="Search address" i]';
    static readonly OFFICE_TYPE_SELECT = 'select[name="officeType"], [role="combobox"], select.w-full:not(.PhoneInputCountrySelect)';
    static readonly COUNTRY_INPUT = 'input[name="country"], input[placeholder*="Country" i]';
    static readonly STATE_INPUT = 'input[name="state"], input[placeholder*="State" i]';
    static readonly CITY_INPUT = 'input[name="city"], input[placeholder*="City" i]';
    static readonly ZIPCODE_INPUT = 'input[name="zipcode"], input[placeholder*="Zipcode" i], input[name="pinCode"], input[placeholder*="Pin" i]';
    static readonly MAP_LOCATION = '.map-container, [aria-label="Map"], .gm-style';

    // ---- Create: Organization Info ----
    static readonly ORG_NAME_INPUT = 'input[name="organizationName"], input[name="companyName"], input[placeholder*="Organization" i]';
    static readonly LOGO_UPLOAD = 'input[type="file"][name="logo"], input[type="file"][accept*="image"]';
    static readonly LOGO_PREVIEW = 'img.logo-preview, img[alt="preview"], img[alt*="logo" i]';
    static readonly REG_NUMBER_INPUT = 'input[name="registrationNumber"], input[placeholder*="Registration" i]';
    static readonly GST_INPUT = 'input[name="gstNumber"], input[placeholder*="GST" i], input[placeholder*="License" i]';
    static readonly FSSAI_INPUT = 'input[name="fssaiNumber"], input[placeholder*="FSSAI" i]';
    static readonly OWN_COMPANY_CHECKBOX = 'input[type="checkbox"][name="ownCompany"], input[type="checkbox"]';

    // ---- Create: Authentication ----
    static readonly USERNAME_INPUT = 'input[name="username"], input[placeholder*="Username" i]';
    static readonly AUTH_EMAIL_INPUT = 'input[name="email"], input[type="email"]';
    static readonly AUTH_PHONE_INPUT = 'input[name="phone"], input[name="phoneNumber"], input[type="tel"]';
    static readonly PASSWORD_INPUT = 'input[name="password"], input[type="password"], input[placeholder*="Password" i]';
    static readonly SHOW_HIDE_PASSWORD_ICON = 'button[aria-label="toggle password visibility"], [data-testid="VisibilityIcon"], [data-testid="VisibilityOffIcon"], div:has(input[name="password"]) > button, div:has(input[type="password"]) > button';

    // ---- Create: Done ----
    static readonly SUCCESS_MESSAGE = 'text=/Stock Point.*created|submitted successfully/i';
    static readonly UPLOADING_BUTTON = 'main button:has-text("Uploading")';
}
