/**
 * Page Object for the Features (Super Admin) module
 * (Configurations -> Features, route /features). Locator strings and dynamic builders only.
 */
export default class FeaturesSuperAdminPage {
    static readonly LISTING_PATH = "features";
    static readonly ADD_PATH = "features/add";

    // ---- Navigation / guard ----
    static readonly SIDEBAR_LINK = "Features";
    static readonly URL_GUARD = /\/features/i;
    static readonly LISTING_URL_GUARD = /\/features(?:\?.*)?$/i;
    static readonly ADD_URL_GUARD = /\/features\/add/i;
    static readonly VIEW_URL_GUARD = /\/features\/view\//i;
    static readonly EDIT_URL_GUARD = /\/features\/edit\//i;
    static readonly HEADING_GUARD = /^Features$/i;
    static readonly MODULE_HEADING = "main h1, main h2";

    // ---- Listing ----
    static readonly PAGE_HEADING = 'main >> role=heading[name="Features"]';
    static readonly SUBTITLE = "Configure platform features and module availability";
    static readonly SEARCH_INPUT = 'main >> input[placeholder="Search here"]';
    static readonly SEARCH_BUTTON = 'main >> button[aria-label="Search"]';
    static readonly CREATE_BUTTON = 'main >> button:has-text("Create feature")';
    static readonly REFRESH_BUTTON = 'main >> button[aria-label="Reload"]';
    static readonly TABLE = "main >> table";
    static readonly TABLE_HEADERS = "main >> table thead th";
    static readonly ROWS = "main table tbody tr";
    static readonly EXPECTED_COLUMNS = ["FEATURE NAME", "DESCRIPTION", "PERMISSIONS", "ACTION"];
    static readonly EMPTY_STATE_TEXT = "No features match your search.";
    static readonly LOADING_TEXT = "Loading...";

    static readonly ROW_VIEW_ICON = 'button[aria-label="View"]';
    static readonly ROW_EDIT_ICON = 'button[aria-label="Edit"]';
    static readonly ROW_DELETE_ICON = 'button[aria-label="Delete"]';

    static row(text: string): string {
        return `main table tbody tr:has-text("${text}")`;
    }

    static viewIconInRow(text: string): string {
        return `${FeaturesSuperAdminPage.row(text)} >> ${FeaturesSuperAdminPage.ROW_VIEW_ICON}`;
    }

    static editIconInRow(text: string): string {
        return `${FeaturesSuperAdminPage.row(text)} >> ${FeaturesSuperAdminPage.ROW_EDIT_ICON}`;
    }

    static deleteIconInRow(text: string): string {
        return `${FeaturesSuperAdminPage.row(text)} >> ${FeaturesSuperAdminPage.ROW_DELETE_ICON}`;
    }

    // ---- Pagination ----
    static readonly PAGINATION_NAV = 'main >> nav[aria-label="pagination"]';
    static readonly NEXT_BUTTON = 'main >> [aria-label="Go to next page"]';
    static readonly PREV_BUTTON = 'main >> [aria-label="Go to previous page"]';

    // ---- Add / Edit / View form pages ----
    static readonly ADD_HEADING = "Add Feature";
    static readonly EDIT_HEADING = "Edit Feature";
    static readonly VIEW_HEADING = "Feature Details";
    static readonly FEATURE_NAME_INPUT = 'main >> input[placeholder="Enter feature name"]';
    static readonly DESCRIPTION_INPUT = 'main >> textarea[placeholder="Enter description"]';
    static readonly PERMISSION_COMBOBOX = 'main >> input[role="combobox"][placeholder="Select a permission"]';
    static readonly MENU_COMBOBOX = 'main >> input[role="combobox"][placeholder*="menu key"]';
    static readonly ADD_PERMISSION_BUTTON = 'main >> button:has-text("Add")';
    static readonly PERMISSION_TABLE = "main table";
    static readonly PERMISSION_ROWS = "main table tbody tr";
    static readonly SAVE_BUTTON = 'main >> button:has-text("Save")';
    static readonly CANCEL_BUTTON = 'main >> button:has-text("Cancel")';
    static readonly BACK_BUTTON = 'main >> button:has-text("Back"), main >> button[aria-label="Back"]';

    static permissionRow(permission: string): string {
        return `main table tbody tr:has-text("${permission}")`;
    }

    static removePermissionButton(permission: string): string {
        return `${FeaturesSuperAdminPage.permissionRow(permission)} >> button:has-text("Remove")`;
    }

    // ---- Dialogs ----
    static readonly REMOVE_PERMISSION_DIALOG = "Remove permission?";
    static readonly DELETE_DIALOG_TEXT = "Delete";
    static readonly DELETE_CONFIRM_BUTTON = "Delete";

    // ---- Toasts ----
    static readonly TOAST = ".Toastify__toast";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";
    static readonly SYNTHETIC_ERROR_TOAST = '[data-qa="features-negative-search-toast"]';
}
