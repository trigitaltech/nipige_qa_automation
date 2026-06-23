/**
 * OfficePage — selectors for /office-management module.
 * Covers: Office Registry listing, 5-step create wizard, view and edit pages.
 */
export default class OfficePage {
    // ── Navigation paths ──────────────────────────────────────────────────────
    static readonly OM_PATH = "office-management";
    static readonly OM_CREATE_PATH = "office-management/create";

    // ── Listing page (Office Registry) ────────────────────────────────────────
    static readonly PAGE_HEADING = [
        'h1:has-text("Offices")',
        ':is(h1,h2,h3):has-text("Offices")',
        ':is(h1,h2,h3):has-text("Office Registry")',
        ':is(h1,h2,h3):has-text("Office Management")',
    ].join(", ");

    static readonly CREATE_BTN = [
        'button:has-text("Create Office")',
        'button:has-text("Add Office")',
        'a:has-text("Create Office")',
        'button:has-text("Create")',
    ].join(", ");

    // IMPORTANT: Use Office Registry search box only — never the left sidebar search.
    // The main content search box sits in the toolbar row next to "Create Office" button.
    static readonly REGISTRY_SEARCH = [
        'input[placeholder="Search here"]:not(#sidebar-search)',
        'div:has(button:has-text("Create Office")) input[placeholder*="Search" i]:not(#sidebar-search)',
        'main input[placeholder*="Search" i]:not(#sidebar-search)',
        'div[class*="content"] input[placeholder*="Search" i]:not(#sidebar-search)',
        'div[class*="toolbar"] input[placeholder*="Search" i]:not(#sidebar-search)',
        'div[class*="header"] input[placeholder*="Search" i]:not(#sidebar-search)',
    ].join(", ");

    static readonly TABLE_ROWS = "table tbody tr";
    static readonly TABLE_FIRST_ROW = "table tbody tr:first-child";

    static readonly NO_RECORDS = [
        ':text("No Records Found")',
        ':text("No records found")',
        ':text("No data available")',
        ':text("No records")',
        'td:has-text("No")',
    ].join(", ");

    // Action icons in table rows
    static readonly VIEW_ICON = [
        'button[aria-label*="view" i]',
        'button[title*="view" i]',
        'button:has(svg[class*="eye"])',
    ].join(", ");

    static readonly EDIT_ICON = [
        'button[aria-label*="edit" i]',
        'button[title*="edit" i]',
        'button:has(svg[class*="edit"])',
        'button:has(svg[class*="pencil"])',
    ].join(", ");

    static readonly DELETE_ICON = [
        'button[aria-label*="delete" i]',
        'button[title*="delete" i]',
        'button:has(svg[class*="trash"])',
    ].join(", ");

    static rowContaining(text: string): string {
        return `table tbody tr:has-text("${text}")`;
    }

    static viewIconInRow(text: string): string {
        return [
            `table tbody tr:has-text("${text}") button[aria-label*="view" i]`,
            `table tbody tr:has-text("${text}") button[title*="view" i]`,
            `table tbody tr:has-text("${text}") button:has(svg[class*="eye"])`,
            `table tbody tr:has-text("${text}") button:first-child`,
        ].join(", ");
    }

    static editIconInRow(text: string): string {
        return [
            `table tbody tr:has-text("${text}") button[aria-label*="edit" i]`,
            `table tbody tr:has-text("${text}") button[title*="edit" i]`,
            `table tbody tr:has-text("${text}") button:has(svg[class*="edit"])`,
        ].join(", ");
    }

    // ── Create wizard — step indicators ──────────────────────────────────────
    static readonly STEP_OFFICE = [
        'li:has-text("Office")',
        'span:has-text("Office"):visible',
        '[data-step="1"]',
        '.step:has-text("Office")',
    ].join(", ");

    static readonly STEP_ORG = [
        'li:has-text("Organization")',
        'span:has-text("Organization"):visible',
        '[data-step="2"]',
    ].join(", ");

    static readonly STEP_AUTH = [
        'li:has-text("Authentication")',
        'span:has-text("Authentication"):visible',
        '[data-step="3"]',
    ].join(", ");

    static readonly STEP_AGREEMENT = [
        'li:has-text("Agreement")',
        'span:has-text("Agreement"):visible',
        '[data-step="4"]',
    ].join(", ");

    static readonly STEP_DONE = [
        'li:has-text("Done")',
        'span:has-text("Done"):visible',
        '[data-step="5"]',
    ].join(", ");

    // ── Wizard common buttons ─────────────────────────────────────────────────
    static readonly NEXT_BTN = [
        'button:has-text("Next")',
        'button[type="submit"]:has-text("Next")',
    ].join(", ");

    static readonly BACK_BTN = [
        'button:has-text("Back")',
        'a:has-text("Back")',
    ].join(", ");

    // ── Step 1: Office ────────────────────────────────────────────────────────
    // The Office Type field is NOT react-select; try native <select> and button patterns.
    static readonly OFFICE_TYPE_CONTROL = [
        'select:has(option:has-text("Office type"))',
        'select:has(option:has-text("Office Type"))',
        'select[name*="officeType" i]',
        'select[name*="office_type" i]',
        'select[name*="office" i]',
        'button:has-text("Select Office type")',
        'button:has-text("Select Office Type")',
        '[aria-haspopup="listbox"]:not([role="option"])',
        '[class*="select__control"]',
        '[role="combobox"]',
    ].join(", ");

    static readonly OFFICE_TYPE_PLACEHOLDER = [
        '[placeholder*="Office Type" i]',
        '[class*="select__placeholder"]:has-text("Type")',
    ].join(", ");

    static dropdownOption(text: string): string {
        return [
            `[role="option"]:has-text("${text}")`,
            `.select__option:has-text("${text}")`,
            `div[class*="option"]:has-text("${text}")`,
            `li:has-text("${text}")`,
        ].join(", ");
    }

    static readonly EMAIL_INPUT = [
        'input[type="email"]',
        'input[placeholder*="Email" i]',
        'input[name*="email" i]',
    ].join(", ");

    static readonly ADD_EMAIL_BTN = [
        'button:has-text("Add")',
        'button[type="button"]:has-text("Add")',
    ].join(", ");

    static readonly EMAIL_TAG = [
        'span[class*="tag"]:has-text("@")',
        'div[class*="chip"]:has-text("@")',
        'div[class*="badge"]:has-text("@")',
        'span[class*="badge"]:has-text("@")',
        '[class*="email-tag"]',
    ].join(", ");

    static readonly COUNTRY_CODE_SELECT = [
        'select[name*="countryCode" i]',
        'select[name*="country_code" i]',
        'select[name*="code" i]',
        '[class*="phone"] select',
        '[class*="PhoneInput"] select',
    ].join(", ");

    static readonly PHONE_INPUT = [
        'input[type="tel"]',
        'input[placeholder*="Phone" i]',
        'input[name*="phone" i]',
        'input[placeholder*="Number" i]',
    ].join(", ");

    // Google Places autocomplete
    static readonly ADDRESS_INPUT = [
        'input[placeholder*="Address" i]',
        'input[name*="address" i]',
        'input[placeholder*="Search address" i]',
        'input[placeholder*="Location" i]',
        'input[autocomplete="off"][type="text"]',
    ].join(", ");

    static readonly ADDRESS_SUGGESTION = [
        '.pac-item',
        '[class*="pac-item"]',
        'div[class*="suggestion"]:visible',
        'li[class*="autocomplete"]:visible',
        '[role="option"]:has-text(","):visible',
    ].join(", ");

    static readonly CITY_INPUT = [
        'input[name*="city" i]',
        'input[placeholder*="City" i]',
        'input[name="city"]',
    ].join(", ");

    static readonly STATE_INPUT = [
        'input[name*="state" i]',
        'input[placeholder*="State" i]',
        'input[name="state"]',
    ].join(", ");

    static readonly COUNTRY_INPUT = [
        'input[name*="country" i]',
        'input[placeholder*="Country" i]',
        'input[name="country"]',
    ].join(", ");

    static readonly ZIPCODE_INPUT = [
        'input[name*="zip" i]',
        'input[name*="postal" i]',
        'input[placeholder*="Zip" i]',
        'input[placeholder*="Postal" i]',
    ].join(", ");

    // ── Step 2: Organization ──────────────────────────────────────────────────
    static readonly ORG_NAME_INPUT = [
        'input[placeholder*="Organization Name" i]',
        'input[name*="orgName" i]',
        'input[name*="organizationName" i]',
        'input[placeholder*="Company Name" i]',
        'input[placeholder*="Organisation" i]',
    ].join(", ");

    static readonly LOGO_FILE_INPUT = 'input[type="file"]';

    static readonly LOGO_PREVIEW = [
        'img[alt*="logo" i]',
        'img[src*="blob:"]',
        'img[src*="data:image"]',
    ].join(", ");

    static readonly REG_NUMBER_INPUT = [
        'input[placeholder*="Registration Number" i]',
        'input[name*="regNumber" i]',
        'input[name*="registrationNumber" i]',
        'input[placeholder*="Reg" i]',
    ].join(", ");

    static readonly GST_INPUT = [
        'input[placeholder*="GST" i]',
        'input[placeholder*="License" i]',
        'input[name*="gst" i]',
        'input[name*="license" i]',
    ].join(", ");

    static readonly FSSAI_INPUT = [
        'input[placeholder*="FSSAI" i]',
        'input[name*="fssai" i]',
        'input[maxlength="14"]',
    ].join(", ");

    static readonly OWN_COMPANY_CHECKBOX = [
        'input[type="checkbox"][name*="ownCompany" i]',
        'label:has-text("Own Company") input[type="checkbox"]',
        'input[type="checkbox"]:near(:text("Own Company"))',
    ].join(", ");

    // ── Step 3: Authentication ────────────────────────────────────────────────
    static readonly AUTH_USERNAME_INPUT = [
        'input[placeholder*="Username" i]',
        'input[name*="username" i]',
        'input[name="username"]',
    ].join(", ");

    static readonly AUTH_EMAIL_INPUT = [
        'input[type="email"]',
        'input[placeholder*="Email" i]',
        'input[name*="email" i]',
    ].join(", ");

    static readonly AUTH_COUNTRY_CODE = [
        'select[name*="countryCode" i]',
        '[class*="phone"] select',
        '[class*="PhoneInput"] select',
    ].join(", ");

    static readonly AUTH_PHONE_INPUT = [
        'input[type="tel"]',
        'input[placeholder*="Phone" i]',
        'input[name*="phone" i]',
    ].join(", ");

    static readonly AUTH_PASSWORD_INPUT = [
        'input[type="password"]',
        'input[placeholder*="Password" i]',
        'input[name*="password" i]',
    ].join(", ");

    static readonly PASSWORD_TOGGLE = [
        'button[aria-label*="password" i]',
        'button:has(svg[class*="eye"])',
        '[class*="password-toggle"]',
        'span[class*="eye"]:visible',
        'button[type="button"]:near(input[type="password"])',
    ].join(", ");

    // ── Step 4: Agreement ─────────────────────────────────────────────────────
    static readonly AGREEMENT_FILE_INPUT = [
        'input[type="file"][accept*="pdf"]',
        'input[type="file"]',
    ].join(", ");

    static readonly AGREEMENT_URL = [
        'input[placeholder*="Agreement URL" i]',
        'input[name*="agreementUrl" i]',
        'a[href*="https://"]:visible',
        'span:has-text("https://"):visible',
        'p:has-text("https://"):visible',
        'div:has-text("https://amazonaws"):visible',
        '[class*="url"]:visible',
        '[class*="file"]:has-text("https://"):visible',
    ].join(", ");

    static readonly CATALOG_CONTROL = [
        'select:has(option:has-text("Market"))',
        'select:near(:text("Catalog Options"))',
        'select[name*="catalog" i]',
        'div[class*="select__control"]:near(:text("Catalog"))',
        '[placeholder*="Catalog" i]',
    ].join(", ");

    static marketCheckbox(name: string): string {
        return [
            `input[type="checkbox"][value*="${name}" i]`,
            `label:has-text("${name}") input[type="checkbox"]`,
            `input[type="checkbox"]:near(:text("${name}"))`,
        ].join(", ");
    }

    static readonly SELECT_ALL_MARKET = [
        'label:has-text("Select All") input[type="checkbox"]',
        'input[type="checkbox"][name*="selectAll" i]',
        'input[type="checkbox"]:near(:text("Select All"))',
    ].join(", ");

    static readonly MODE_OF_SALE_CONTROL = [
        'div[class*="select__control"]:near(:text("Mode of Sale"))',
        '[placeholder*="Mode of Sale" i]',
        '[placeholder*="Mode" i]',
        'select[name*="modeOfSale" i]',
    ].join(", ");

    static readonly START_DATE_INPUT = [
        'input[name*="startDate" i]',
        'input[placeholder*="Start Date" i]',
        'input[type="date"]:first-of-type',
    ].join(", ");

    static readonly END_DATE_INPUT = [
        'input[name*="endDate" i]',
        'input[placeholder*="End Date" i]',
        'input[type="date"]:last-of-type',
    ].join(", ");

    // ── Step 5: Done ──────────────────────────────────────────────────────────
    static readonly SUCCESS_MESSAGE = [
        ':text("Partner details submitted successfully!")',
        ':has-text("submitted successfully")',
        ':is(h1,h2,h3,p):has-text("success")',
        ':is(h1,h2,h3):has-text("All Done")',
        ':is(h1,h2,h3):has-text("Congratulations")',
        ':is(h1,h2,h3):has-text("Office Created")',
        ':is(h1,h2,h3):has-text("Setup Complete")',
        '[class*="success"]:has-text("submitted")',
        '[class*="done"]:visible',
        '.step-done:visible, .wizard-done:visible',
    ].join(", ");

    static readonly DONE_BTN = [
        'button:has-text("Done")',
        'a:has-text("Done")',
    ].join(", ");

    // ── View / detail page ────────────────────────────────────────────────────
    static readonly VIEW_PAGE_HEADING = [
        ':is(h1,h2,h3):has-text("Office Details")',
        ':is(h1,h2,h3):has-text("View Office")',
        ':is(h1,h2,h3):has-text("Partner Details")',
        ':is(h1,h2,h3):has-text("Office")',
    ].join(", ");

    static readonly CREATE_PAGE_HEADING = [
        ':is(h1,h2,h3):has-text("Create Office")',
        ':is(h1,h2,h3):has-text("Add Office")',
        ':is(h1,h2,h3):has-text("Office Registration")',
        ':is(h1,h2,h3):has-text("Register")',
    ].join(", ");

    // ── Validation messages ───────────────────────────────────────────────────
    static readonly VALIDATION_MSG = [
        '[role="alert"]',
        '.text-red-500',
        '.text-red-600',
        'p[class*="text-red"]',
        '[class*="error"]',
        '[class*="invalid"]',
        ':text("is required")',
        ':text("required")',
        ':text("Invalid")',
    ].join(", ");

    // ── Toast notifications ───────────────────────────────────────────────────
    static readonly TOAST = ".Toastify__toast, [data-sonner-toast]";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";

    // ── Delete confirmation popup ─────────────────────────────────────────────
    static readonly DELETE_POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]';
    static readonly DELETE_CONFIRM_BTN = [
        'button:has-text("Delete"):visible',
        '.swal2-confirm:visible',
        'button:has-text("Yes"):visible',
    ].join(", ");

    static readonly DELETE_CANCEL_BTN = [
        'button:has-text("Cancel"):visible',
        '.swal2-cancel:visible',
    ].join(", ");

    // ── Edit page ─────────────────────────────────────────────────────────────
    static readonly EDIT_PAGE_HEADING = [
        ':is(h1,h2,h3):has-text("Edit Office")',
        ':is(h1,h2,h3):has-text("Update Office")',
        ':is(h1,h2,h3):has-text("Edit")',
        ':is(h1,h2,h3):has-text("Modify")',
    ].join(", ");

    static readonly UPDATE_BTN = [
        'button:has-text("Update Office")',
        'button:has-text("Update")',
        'button[type="submit"]:has-text("Update")',
        'button:has-text("Save Changes")',
        'button:has-text("Save")',
    ].join(", ");

    static readonly SECURITY_QUESTION_INPUT = [
        'select[name*="securityQuestion" i]',
        'input[name*="securityQuestion" i]',
        'input[placeholder*="Security Question" i]',
        'select[placeholder*="Security" i]',
    ].join(", ");

    static readonly SECURITY_ANSWER_INPUT = [
        'input[name*="securityAnswer" i]',
        'input[placeholder*="Security Answer" i]',
        'input[placeholder*="Answer" i]',
    ].join(", ");

    // ── View page sections ────────────────────────────────────────────────────
    static readonly VIEW_OFFICE_SECTION = [
        ':is(h2,h3,h4):has-text("Office Details")',
        ':is(h2,h3,h4):has-text("Office Information")',
        'strong:has-text("Office Details")',
        'p:has-text("Office Details")',
    ].join(", ");

    static readonly VIEW_ORG_SECTION = [
        ':is(h2,h3,h4):has-text("Organization Details")',
        ':is(h2,h3,h4):has-text("Organisation Details")',
        ':is(h2,h3,h4):has-text("Organization Information")',
        'strong:has-text("Organization")',
        'strong:has-text("Organisation")',
    ].join(", ");

    static readonly VIEW_AUTH_SECTION = [
        ':is(h2,h3,h4):has-text("Authentication Details")',
        ':is(h2,h3,h4):has-text("Authentication Information")',
        ':is(h2,h3,h4):has-text("Login Details")',
        'strong:has-text("Authentication")',
    ].join(", ");

    static readonly LOGO_ON_VIEW = [
        'img[alt*="logo" i]',
        'img[class*="logo"]',
        'img[src*="https://"]',
        'img[src*="blob:"]',
    ].join(", ");

    static readonly OFFICE_TYPE_BADGE = [
        'span[class*="badge"]:visible',
        'div[class*="badge"]:visible',
        'span[class*="chip"]:visible',
        'span[class*="tag"]:not(:has-text("@")):visible',
    ].join(", ");

    static deleteIconInRow(text: string): string {
        return [
            `table tbody tr:has-text("${text}") button[aria-label*="delete" i]`,
            `table tbody tr:has-text("${text}") button[title*="delete" i]`,
            `table tbody tr:has-text("${text}") button:has(svg[class*="trash"])`,
        ].join(", ");
    }
}
