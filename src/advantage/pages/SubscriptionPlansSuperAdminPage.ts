/**
 * Page Object for the Super Admin Subscription Plans module
 * (Pricing and Monetization -> Subscription, route /subscription-pricing).
 * Locator strings and dynamic builders only; assertions/workflows live in Steps.
 */
export default class SubscriptionPlansSuperAdminPage {
    static readonly LISTING_PATH = "subscription-pricing";

    // ---- Navigation / guard ----
    static readonly SIDEBAR_LINK = "Subscription";
    static readonly URL_GUARD = /\/subscription-pricing/i;
    static readonly HEADING_GUARD = /^Subscription Plans$/i;
    static readonly MODULE_HEADING = "main h1, main h2";

    // ---- Listing ----
    static readonly PAGE_HEADING = 'main >> role=heading[name="Subscription Plans"]';
    static readonly SUBTITLE = "Manage partner and tenant subscription plans, pricing and provisioning";
    static readonly CREATE_PLAN_BUTTON = 'main >> button:has-text("Create Plan")';
    static readonly SEARCH_INPUT = 'main >> input[placeholder="Search plan name, description..."]';
    static readonly SCOPE_COMBOBOX = 'main >> input[role="combobox"][placeholder="All Scopes"]';
    static readonly SCOPE_OPEN_OPTIONS = 'main >> button[aria-label="Open options"]';
    static readonly CLEAR_BUTTON = 'main >> button:has-text("Clear")';
    static readonly TABLE = "main >> table";
    static readonly TABLE_HEADERS = "main >> table thead th";
    static readonly ROWS = "main table tbody tr";
    static readonly ROW_SCOPE_CELL = "td:first-child";
    static readonly EXPECTED_COLUMNS = [
        "APPLICABLE TO",
        "PLAN NAME",
        "DESCRIPTION",
        "PRICE",
        "CADENCE",
        "STATUS",
        "ACTIONS",
    ];
    static readonly DASHBOARD_CARDS = ["Total Plans", "Active", "Tenant", "Total Amount"];
    static readonly EMPTY_STATE_TEXT = "Data Not Found";

    static row(text: string): string {
        return `main table tbody tr:has-text("${text}")`;
    }

    static editIconInRow(text: string): string {
        return `${SubscriptionPlansSuperAdminPage.row(text)} >> button[aria-label="Edit"]`;
    }

    static deleteIconInRow(text: string): string {
        return `${SubscriptionPlansSuperAdminPage.row(text)} >> button[aria-label="Delete"]`;
    }

    static readonly ROW_EDIT_ICON = 'button[aria-label="Edit"]';
    static readonly ROW_DELETE_ICON = 'button[aria-label="Delete"]';

    // ---- Create / Edit dialog ----
    static readonly CREATE_DIALOG_HEADING = "Add New Subscription";
    static readonly EDIT_DIALOG_HEADING = "Update Subscription";
    static readonly PLAN_NAME_INPUT = 'input[placeholder="Enter Plan Name"]';
    static readonly PLAN_AMOUNT_INPUT = 'input[placeholder="Enter Plan Amount"]';
    static readonly DESCRIPTION_INPUT = 'input[placeholder="Enter Description"]';
    static readonly SAVE_BUTTON = "Save";
    static readonly UPDATE_BUTTON = "Update";
    static readonly CANCEL_BUTTON = "Cancel";

    // ---- Delete dialog ----
    static readonly DELETE_DIALOG_HEADING = "Delete Subscription Plan";
    static readonly DELETE_CONFIRM_BUTTON = "Yes, delete it!";

    // ---- Toasts ----
    static readonly TOAST = ".Toastify__toast";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";
}
