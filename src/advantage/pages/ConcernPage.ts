export default class ConcernPage {
    // ── Direct navigation paths (used by all tests except TC_CONCERN_01) ──────
    static readonly CONCERN_PATH = "setup/concern";
    static readonly CONCERN_CREATE_PATH = "setup/concern/create";

    // ── Home page indicators ──────────────────────────────────────────────────
    // Profile menu button — visible only when logged in
    static readonly PROFILE_MENU = 'button[aria-haspopup="true"]';
    // Home page greeting — always starts with "Good morning" / "Good afternoon" / "Good evening"
    static readonly HOME_GREETING = 'h1[class*="tracking-tight"]';

    // ── Sidebar navigation ────────────────────────────────────────────────────
    // The main sidebar nav element
    static readonly SIDEBAR_NAV = 'nav.flex-1';
    // Setup menu: a <button> that expands the Setup submenu (collapsed by default).
    // Located in the CONFIGURATIONS section near the bottom of the sidebar nav.
    static readonly SETUP_MENU_BTN = 'nav button:has-text("Setup")';
    // Concern submenu link — only present in DOM after Setup is expanded
    static readonly CONCERN_SUBMENU_LINK = 'a[href="/setup/concern"]';

    // ── Page headings ─────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = 'h1:has-text("Concerns")';
    static readonly CREATE_HEADING = 'h1:has-text("Create Concern")';

    // ── Stat card label elements (p.uppercase — avoids matching filter buttons) ──
    static readonly STAT_CARD_TOTAL = 'p.uppercase:has-text("Total Concerns")';
    static readonly STAT_CARD_SYSTEM = 'p.uppercase:has-text("System")';
    static readonly STAT_CARD_CUSTOM = 'p.uppercase:has-text("Custom")';
    static readonly STAT_CARD_IN_USE = 'p.uppercase:has-text("In Use")';

    // ── Filter tabs (plain <button> elements inside the toggle group) ──────────
    static readonly TAB_ALL_TYPES = 'button:has-text("All Types")';
    static readonly TAB_SYSTEM = 'button:has-text("System")';
    static readonly TAB_CUSTOM = 'button:has-text("Custom")';

    // ── Search ────────────────────────────────────────────────────────────────
    static readonly SEARCH_INPUT = 'input[placeholder="Search concerns..."]';

    // ── Create button ─────────────────────────────────────────────────────────
    static readonly CREATE_BTN = 'button:has-text("Create Concern")';

    // ── Table ─────────────────────────────────────────────────────────────────
    static readonly TABLE = 'table[data-slot="table"]';
    static readonly TABLE_HEADERS = 'table[data-slot="table"] thead th';
    static readonly TABLE_ROWS = 'table[data-slot="table"] tbody tr';
    static readonly CELL_CONCERN_NAME = 'table tbody tr td:nth-child(1)';
    static readonly CELL_TYPE_BADGE = 'table tbody tr td:nth-child(2) span';

    // ── No-records state ──────────────────────────────────────────────────────
    // Actual DOM text: "No concerns found." inside a <td colspan="6">
    static readonly NO_RECORDS = 'td:has-text("No concerns found.")';

    // ── Row-scoped helper (concern name is in span inside td) ─────────────────
    static rowFor(concernName: string): string {
        return `table tbody tr:has(td:has-text("${concernName}"))`;
    }

    // ── Pagination (uses <a> elements with aria-label, NOT buttons) ────────────
    static readonly NEXT_BTN = 'a[aria-label="Go to next page"]';
    static readonly PREV_BTN = 'a[aria-label="Go to previous page"]';
    // Active page: <a aria-current="page" data-slot="pagination-link">
    static readonly PAGE_NUMBER = 'a[data-slot="pagination-link"][aria-current="page"]';

    // ── Create form ────────────────────────────────────────────────────────────
    // CONCERN NAME: input with specific placeholder, no id/name
    static readonly CONCERN_NAME_INPUT = 'input[placeholder="e.g. DIWALI_BUMPER_OFFER"]';

    // Radio buttons have readonly="" — click the PARENT div container, not the input.
    // Parent: <div class="flex cursor-pointer items-start ... "> containing the text below.
    static readonly RADIO_CONTAINER = 'div.cursor-pointer:has(input[type="radio"])';
    // Filter text unique to each type option
    static readonly CUSTOM_TYPE_FILTER_TEXT = 'Admin-editable';
    static readonly SYSTEM_TYPE_FILTER_TEXT = 'Protected';

    // DESCRIPTION: textarea with specific placeholder
    static readonly DESCRIPTION_INPUT = 'textarea[placeholder*="Briefly describe"]';

    // Channel / Priority: native <select> elements with NO id/name attribute.
    // The create form has exactly 2 selects — Default Channel first, Priority second.
    // Use nth(0) / nth(1) in steps to avoid ancestor-div ambiguity.
    static readonly FORM_SELECT = 'select';

    static readonly SAVE_BTN = 'button:has-text("Save")';
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';

    // ── Preview panel ─────────────────────────────────────────────────────────
    static readonly PREVIEW_PANEL = 'div:has(h2:has-text("Preview"))';

    // ── Delete confirmation (SweetAlert2) ─────────────────────────────────────
    static readonly DELETE_POPUP = '.swal2-popup';
    static readonly DELETE_YES_BTN = '.swal2-confirm';
    static readonly DELETE_NO_BTN = '.swal2-cancel';

    // ── Toast ─────────────────────────────────────────────────────────────────
    static readonly TOAST = '.Toastify__toast';
    static readonly SUCCESS_TOAST = '.Toastify__toast--success';

    // ── Validation messages ───────────────────────────────────────────────────
    static readonly VALIDATION_MESSAGE = 'p.text-red-500, p[class*="text-red"]';
    static readonly FORM_INPUTS = 'form input, form select, form textarea';
}
