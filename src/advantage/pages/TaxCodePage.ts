/**
 * TaxCodePage — selectors for /setup/taxcode (list, create, edit, view).
 *
 * Verified from DOM screenshots of the Nipige FreshCart tenant app:
 *   • Country filter is a custom React dropdown (not a native <select>)
 *   • Delete confirmation uses SweetAlert2-style popup
 *   • Date inputs show dd-mm-yyyy placeholder (fill with YYYY-MM-DD format)
 *   • Action icons per row: view (eye), edit (pencil), delete (trash) — nth 0/1/last
 */
export default class TaxCodePage {
    // ── Direct navigation path ────────────────────────────────────────────────
    static readonly TAX_CODE_PATH = "setup/taxcode";

    // ── Home page & sidebar indicators (used by TC_01 E2E flow) ──────────────
    static readonly PROFILE_MENU = 'button[aria-haspopup="true"]';
    static readonly HOME_GREETING = 'h1[class*="tracking-tight"]';
    static readonly SIDEBAR_NAV = 'nav.flex-1';
    // Setup is a collapsible button near the bottom of the sidebar nav
    static readonly SETUP_MENU_BTN = 'nav button:has-text("Setup")';
    // Tax Code submenu link — only in DOM after Setup is expanded
    static readonly TAX_CODE_SUBMENU_LINK = 'a[href="/setup/taxcode"]';

    // ── Page headings ─────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = ':is(h1,h2,h3):has-text("Tax Setup")';
    static readonly CREATE_HEADING = ':is(h1,h2,h3):has-text("Create Tax Code")';
    static readonly EDIT_HEADING = ':is(h1,h2,h3):has-text("Edit Tax Code")';
    static readonly VIEW_HEADING = ':is(h1,h2,h3):has-text("View Tax Code")';

    // ── Stat cards ────────────────────────────────────────────────────────────
    static readonly TOTAL_CODES_CARD = ':has-text("Total Codes")';
    static readonly ACTIVE_CARD = ':has-text("Active")';
    static readonly COUNTRIES_CARD = ':has-text("Countries")';
    static readonly EXPIRING_SOON_CARD = ':has-text("Expiring Soon")';

    // ── Search & filter ───────────────────────────────────────────────────────
    static readonly SEARCH_INPUT = 'input[placeholder="Search tax code, country..."]';
    // Country filter — may be a native <select> OR a custom React dropdown.
    // Listed in priority order: native select first (most specific), then semantic roles,
    // then class-based fallbacks. The steps layer detects which type is present at runtime.
    static readonly COUNTRY_SELECT = 'select';
    // eslint-disable-next-line max-len
    static readonly COUNTRY_FILTER_TRIGGER = [
        'select',
        'button:has-text("All Countries")',
        '[role="combobox"]:has-text("All Countries")',
        '[class*="dropdown"]:has-text("All Countries")',
    ].join(", ");
    static readonly DROPDOWN_OPTION = '[role="option"], [role="listbox"] li, [class*="option"]:not(button):not(a)';
    static readonly CLEAR_BTN = 'button:has-text("Clear")';

    // ── Create button ─────────────────────────────────────────────────────────
    static readonly CREATE_BTN = 'button:has-text("Create Tax Code"), a:has-text("Create Tax Code")';

    // ── Table ─────────────────────────────────────────────────────────────────
    static readonly TABLE = 'table';
    static readonly TABLE_HEADERS = 'table thead th';
    static readonly TABLE_ROWS = 'table tbody tr';
    static readonly CELL_TAX_CODE = 'table tbody tr td:nth-child(1)';
    static readonly CELL_COUNTRY = 'table tbody tr td:nth-child(2)';
    static readonly CELL_START_DATE = 'table tbody tr td:nth-child(3)';
    static readonly CELL_END_DATE = 'table tbody tr td:nth-child(4)';
    static readonly CELL_STATUS = 'table tbody tr td:nth-child(5)';
    static readonly NO_RECORDS = [
        'td:has-text("No records")',
        'td:has-text("No tax")',
        'td:has-text("No data found")',
        '[class*="empty-state"]',
        ':text("No records found")',
        ':text("No data found")',
    ].join(", ");

    // ── Row-scoped helpers ────────────────────────────────────────────────────
    static rowFor(taxCode: string): string {
        return `table tbody tr:has(td:has-text("${taxCode}"))`;
    }

    // ── Pagination ────────────────────────────────────────────────────────────
    static readonly NEXT_BTN = 'li[data-slot="pagination-item"]:has-text("Next"), button:has-text("Next")';
    static readonly PREV_BTN = 'li[data-slot="pagination-item"]:has-text("Previous"), button:has-text("Previous")';
    // Composite next-page selector used by countAllListingRecords — covers aria-label
    // links (HeroUI/NextUI), slot-based items, and plain Next buttons.
    static readonly NEXT_PAGE_BTN = [
        'a[aria-label="Go to next page"]',
        'button[aria-label="Go to next page"]',
        'li[data-slot="pagination-item"]:has-text("Next") > a',
        'li[data-slot="pagination-item"]:has-text("Next") > button',
        'button:has-text("Next")',
    ].join(", ");

    // ── Navigation buttons ────────────────────────────────────────────────────
    static readonly BACK_BTN = 'button:has-text("Back"), a:has-text("Back")';
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';

    // ── Create / Edit form fields ─────────────────────────────────────────────
    // Tenant Country: combobox with "Select country..." placeholder
    static readonly TENANT_COUNTRY_INPUT = 'input[placeholder="Select country..."], input[placeholder*="country" i]';
    // Tax Code name input
    static readonly TAX_CODE_NAME_INPUT = 'input[placeholder*="KID-5" i], input[placeholder*="HSN_451236" i]';
    // Both date inputs share the same placeholder — use .nth(0) / .nth(1) in steps
    static readonly DATE_INPUTS = 'input[type="date"], input[placeholder="dd-mm-yyyy"]';
    // Tax Lines section
    static readonly TAX_LINE_NAME_INPUT = 'input[placeholder*="CGST" i], input[placeholder*="SGST" i]';
    static readonly TAX_RATE_INPUT = 'input[placeholder*="5, 12, 18" i]';
    static readonly TAX_LINE_TYPE_SELECT = 'select';
    static readonly ADD_ITEM_BTN = 'button:has-text("Add Item")';
    static readonly FORM_INPUTS = 'form input, form select, form textarea';
    static readonly VALIDATION_MESSAGE = [
        '[role="alert"]',
        '.invalid-feedback',
        '.text-danger',
        '.text-red-500',
        '.text-red-600',
        '[class*="error"]',
        '[class*="invalid"]',
        ':text("required")',
        ':text("invalid")',
        ':text("must")',
        ':text("numeric")',
        ':text("duplicate")',
        ':text("already")',
    ].join(", ");

    // ── Submit buttons ────────────────────────────────────────────────────────
    static readonly CREATE_SUBMIT_BTN = 'button:has-text("Create Tax Code")';
    static readonly UPDATE_SUBMIT_BTN = 'button:has-text("Update Tax Code")';

    // ── Delete confirmation (SweetAlert2 style) ───────────────────────────────
    static readonly DELETE_POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]';
    // eslint-disable-next-line max-len
    static readonly DELETE_YES_BTN = 'button:has-text("Yes, delete it!"), button:has-text("Yes, Delete"), .swal2-confirm';
    static readonly DELETE_CANCEL_BTN = '.swal2-cancel';

    // ── Toast / alerts ────────────────────────────────────────────────────────
    static readonly TOAST = '.Toastify__toast, [class*="toast"], [role="alert"]';
    static readonly SUCCESS_TOAST = '.Toastify__toast--success, [class*="toast"][class*="success"]';
}
