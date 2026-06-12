/**
 * DeliverySetupPage — selectors for /setup/delivery (list, create, edit).
 *
 * Follows the same conventions as TaxCodePage / SkillPage / ConcernPage.
 * Multiple fallback selectors joined with ", " for resilience across UI changes.
 */
export default class DeliverySetupPage {
    // ── Direct navigation path ────────────────────────────────────────────────
    static readonly DELIVERY_PATH = "delivery-operation";
    static readonly DELIVERY_CREATE_PATH = "delivery-operation/create";

    // ── Home page & sidebar indicators ───────────────────────────────────────
    static readonly PROFILE_MENU = 'button[aria-haspopup="true"]';
    static readonly HOME_GREETING = 'h1[class*="tracking-tight"]';
    static readonly SIDEBAR_NAV = 'nav.flex-1';

    // Setup is a collapsible sidebar button; Delivery link is only in DOM after it expands
    static readonly SETUP_MENU_BTN = 'nav button:has-text("Setup")';
    static readonly DELIVERY_SUBMENU_LINK = [
        'a[href="/setup/delivery"]',
        'a[href*="delivery"]',
        'a:has-text("Delivery Setup")',
        'a:has-text("Delivery")',
    ].join(", ");

    // ── Page headings ─────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = [
        ':is(h1,h2,h3):has-text("Delivery Setup")',
        ':is(h1,h2,h3):has-text("Delivery")',
    ].join(", ");
    static readonly CREATE_HEADING = [
        ':is(h1,h2,h3):has-text("Create Delivery")',
        ':is(h1,h2,h3):has-text("Add Delivery")',
    ].join(", ");
    static readonly EDIT_HEADING = [
        ':is(h1,h2,h3):has-text("Edit Delivery")',
        ':is(h1,h2,h3):has-text("Update Delivery")',
    ].join(", ");

    // ── Stat cards ────────────────────────────────────────────────────────────
    static readonly STAT_CARDS = [
        'p.uppercase:has-text("Total")',
        'p:has-text("Total Deliveries")',
        '[class*="card"]:has-text("Total")',
    ].join(", ");

    // ── Search ────────────────────────────────────────────────────────────────
    // Combined fallback selector — Playwright resolves to the first matching element
    static readonly SEARCH_INPUT = [
        'input[placeholder*="Search delivery" i]',
        'input[placeholder*="Search" i][type="text"]',
        'input[placeholder*="Search" i]',
    ].join(", ");
    static readonly SEARCH_BTN = [
        'button[aria-label*="Search" i]',
        'div:has(input[placeholder*="Search" i]) button',
        'input[placeholder*="Search" i] + button',
    ].join(", ");

    // ── Create button ─────────────────────────────────────────────────────────
    static readonly CREATE_BTN = [
        'button:has-text("Create Delivery")',
        'a:has-text("Create Delivery")',
        'button:has-text("Add Delivery")',
        'button:has-text("New Delivery")',
    ].join(", ");

    // ── Table ─────────────────────────────────────────────────────────────────
    static readonly TABLE = "table";
    static readonly TABLE_HEADERS = "table thead th";
    static readonly TABLE_ROWS = "table tbody tr";
    static readonly CELL_NAME = "table tbody tr td:nth-child(1)";
    static readonly CELL_TYPE = "table tbody tr td:nth-child(2)";
    static readonly CELL_STATUS = "table tbody tr td:nth-child(3)";

    static readonly NO_RECORDS = [
        'td:has-text("No records")',
        'td:has-text("No delivery")',
        'td:has-text("No data")',
        ':text("No records found")',
        ':text("No data found")',
    ].join(", ");

    // ── Row-scoped helper ─────────────────────────────────────────────────────
    static rowFor(name: string): string {
        return `table tbody tr:has(td:has-text("${name}"))`;
    }

    // ── Pagination ────────────────────────────────────────────────────────────
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
    static readonly NAME_INPUT = [
        'input[name="name"]',
        'input[id*="name" i]',
        'input[placeholder*="name" i]',
        'input[placeholder*="delivery" i]',
        'form input[type="text"]',
    ].join(", ");
    static readonly TYPE_SELECT = [
        'select[name="type"]',
        'select[name*="type" i]',
        'select[id*="type" i]',
        'form select',
    ].join(", ");
    static readonly DESCRIPTION_INPUT = [
        'textarea[placeholder*="description" i]',
        'textarea[name*="description" i]',
        'form textarea',
    ].join(", ");
    static readonly FORM_INPUTS = "form input, form select, form textarea";
    static readonly VALIDATION_MESSAGE = [
        '[role="alert"]',
        ".text-red-500",
        ".text-red-600",
        "[class*='error']",
        "[class*='invalid']",
        ':text("required")',
        ':text("invalid")',
    ].join(", ");

    // ── Submit buttons ────────────────────────────────────────────────────────
    static readonly SAVE_BTN = [
        'button:has-text("Save")',
        'button:has-text("Create Delivery")',
        'button:has-text("Add Delivery")',
        'button[type="submit"]',
    ].join(", ");
    static readonly UPDATE_BTN = [
        'button:has-text("Update")',
        'button:has-text("Update Delivery")',
        'button:has-text("Save Changes")',
    ].join(", ");

    // ── Delete confirmation (SweetAlert2) ─────────────────────────────────────
    // eslint-disable-next-line max-len
    static readonly DELETE_POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]';
    // eslint-disable-next-line max-len
    static readonly DELETE_YES_BTN = '.swal2-confirm, button:has-text("Yes, delete it!"), button:has-text("Yes, Delete"), button:has-text("Confirm")';
    // eslint-disable-next-line max-len
    static readonly DELETE_CANCEL_BTN = '.swal2-cancel, button:has-text("No"), button:has-text("Cancel")';

    // ── Toast ─────────────────────────────────────────────────────────────────
    static readonly TOAST = ".Toastify__toast";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";
}
