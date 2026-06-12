/**
 * Page Object for the Notification Template (Tenant) module — Communications → Notification Template
 * (route /notification-template). Locator strings / dynamic locator builders only; no assertions.
 *
 * Listing: table with SL NO | TYPE | CONCERN | BODY | ACTION columns, a "Search templates" box, a
 * "Create Template" button, a "Reload" (refresh) button, Previous/Next pagination and per-row Delete
 * icons. Search matches the displayed CONCERN and BODY columns (NOT the Subject). Create opens the
 * /create page (Concern combobox, Template-Type tabs Email/SMS/Whatsapp/Inapp, then the Email fields
 * Subject/Body/CSS/From Name/From Email and a Submit button). Delete opens a confirmation dialog.
 */
export default class NotificationTemplatePage {
    static readonly LISTING_PATH = "notification-template";
    static readonly CREATE_PATH = "notification-template/create";

    // ---- Navigation (sidebar: Communications → Notification Template) ----
    static readonly SIDEBAR_LINK = "Notification Template";

    // ---- Module guard ----
    static readonly URL_GUARD = /\/notification-template/i;
    static readonly HEADING_GUARD = /^Templates$/i;
    static readonly MODULE_HEADING = "main h1, main h2";

    // ---- Listing ----
    static readonly SEARCH_INPUT = 'main >> input[placeholder="Search templates"]';
    static readonly CREATE_BUTTON = 'main >> button:has-text("Create Template")';
    static readonly RELOAD_BUTTON_NAME = "Reload";
    static readonly TABLE = "main >> table";
    static readonly TABLE_HEADERS = "main >> table thead th";
    static readonly ROWS = "main table tbody tr";
    static readonly EXPECTED_COLUMNS = ["SL NO", "TYPE", "CONCERN", "BODY", "ACTION"];
    static readonly EMPTY_STATE_TEXT = "No data available.";
    static readonly LOADING_TEXT = "Loading...";

    /** A listing row that contains the given text (concern / body). */
    static row(text: string): string {
        return `main table tbody tr:has-text("${text}")`;
    }
    /** Delete icon button inside the row that contains the given text. */
    static deleteIconInRow(text: string): string {
        return `main table tbody tr:has-text("${text}") >> button[aria-label="Delete"]`;
    }
    static readonly ROW_DELETE_ICON = 'button[aria-label="Delete"]';

    // ---- Pagination (Previous / Next are <a> links inside <nav aria-label="pagination">) ----
    static readonly NEXT_BUTTON = 'main >> [aria-label="Go to next page"]';
    static readonly PREV_BUTTON = 'main >> [aria-label="Go to previous page"]';

    // ---- Create Template page ----
    static readonly CREATE_HEADING = "Create Template";
    static readonly CONCERN_COMBOBOX = 'input[role="combobox"][placeholder="Select Concern"]';
    static readonly CONCERN_OPEN_OPTIONS =
        'xpath=//input[@placeholder="Select Concern"]/following::button[@aria-label="Open options"][1]';
    static templateTypeTab(type: string): string {
        return `main >> button:has-text("${type}")`;
    }
    static readonly SUBJECT_INPUT = 'main >> input[placeholder="Subject"]';
    static readonly BODY_TEXTAREA = 'main >> textarea[placeholder="HTML (text Area)"]';
    static readonly FROM_NAME_INPUT = 'main >> input[placeholder="From Name"]';
    static readonly FROM_EMAIL_INPUT = 'main >> input[placeholder="From Email"]';
    static readonly SUBMIT_BUTTON = 'main >> button:text-is("Submit")';

    // ---- Delete confirmation dialog ----
    static readonly DELETE_CONFIRM_BUTTON = "Delete";

    // ---- Toasts (react-toastify) ----
    static readonly TOAST = ".Toastify__toast";
}
