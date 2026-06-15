/**
 * Page Object for the Permission (Admin) module — Configurations → Permission (route /auth/permission).
 * Locator strings / dynamic locator builders only; no assertions or logic (those live in the Steps).
 *
 * Listing: a table with RESOURCE | PERMISSION | METHOD | ACTIONS columns, a "Search here" box, a
 * "Create Permission" button, Previous/Next pagination, and per-row Edit/Delete icon buttons.
 * Create opens a "Create Permission" dialog (Permission Name, Method combobox, Resource URL, Save).
 * Delete opens a confirmation dialog ("Are you sure?...") with a destructive "Delete" button.
 */
export default class PermissionPage {
    static readonly LISTING_PATH = "auth/permission";

    // ---- Navigation (sidebar: Configurations → Permission) ----
    static readonly SIDEBAR_PERMISSION = "Permission"; // exact accessible name of the sidebar link

    // ---- Module guard ----
    // The sidebar item resolves to "/permission" which the app also serves at "/auth/permission";
    // accept either (the heading + Create button checks pin it to the right module regardless).
    static readonly URL_GUARD = /\/(auth\/)?permission/i;
    static readonly HEADING_GUARD = /^Permission$/i;
    static readonly MODULE_HEADING = "main h1, main h2";

    // ---- Listing ----
    static readonly SEARCH_INPUT = 'main >> input[placeholder="Search here"]';
    static readonly CREATE_BUTTON = 'main >> button:has-text("Create Permission")';
    static readonly TABLE = "main >> table";
    static readonly TABLE_HEADERS = "main >> table thead th";
    static readonly ROWS = "main table tbody tr";
    static readonly EXPECTED_COLUMNS = ["RESOURCE", "PERMISSION", "METHOD", "ACTIONS"];
    static readonly EMPTY_STATE_TEXT = "No permissions found";

    /** A listing row that contains the given text (permission name / resource url). */
    static row(text: string): string {
        return `main table tbody tr:has-text("${text}")`;
    }
    /** Delete / Edit icon button inside the row that contains the given text. */
    static deleteIconInRow(text: string): string {
        return `main table tbody tr:has-text("${text}") >> button[aria-label="Delete"]`;
    }
    static editIconInRow(text: string): string {
        return `main table tbody tr:has-text("${text}") >> button[aria-label="Edit"]`;
    }
    static readonly ROW_DELETE_ICON = 'button[aria-label="Delete"]';
    static readonly ROW_EDIT_ICON = 'button[aria-label="Edit"]';

    // ---- Pagination (Previous / Next are <a> links inside <nav aria-label="pagination">) ----
    static readonly NEXT_BUTTON = 'main >> [aria-label="Go to next page"]';
    static readonly PREV_BUTTON = 'main >> [aria-label="Go to previous page"]';
    static readonly PAGINATION_NAV = 'main >> nav[aria-label="pagination"]';

    // ---- Create Permission dialog ----
    static readonly CREATE_DIALOG_NAME = "Create Permission"; // getByRole("dialog", { name })
    static readonly NAME_INPUT = 'input[placeholder="e.g. FORCE_REFUND_V3"]';
    static readonly METHOD_COMBOBOX = 'input[placeholder="Select method"]';
    static readonly URL_INPUT = 'input[placeholder*="orders/:orderId/refund/force"]';
    static readonly SAVE_BUTTON = "Save";
    static readonly CANCEL_BUTTON = "Cancel";

    // ---- Edit Permission dialog (same fields as Create, preloaded; submit button is "Update") ----
    static readonly EDIT_DIALOG_HEADING = "Edit Permission";
    static readonly UPDATE_BUTTON = "Update";

    // ---- Delete confirmation dialog ----
    static readonly DELETE_CONFIRM_BUTTON = "Delete";

    // ---- Loading state (listing fetch in progress) ----
    static readonly LOADING_TEXT = "Loading...";

    // ---- Toasts (react-toastify) ----
    static readonly TOAST = ".Toastify__toast";
    static readonly TOAST_SUCCESS = ".Toastify__toast--success";
}
