export default class BulkPromotionPage {
    // Sidebar navigation
    static readonly MENU_BULK_PROMOTION = 'a[href="/bulkPromotion"]';

    // Listing page
    static readonly CREATE_BUTTON = 'button[data-slot="button"][data-size="sm"]:text-is("Create")';

    // Condition builder dropdowns
    static readonly SELECT = "select";
    static readonly ENTITY_DROPDOWN = "select";
    static readonly CRITERIA_DROPDOWN = "select";
    static readonly OPERATOR_DROPDOWN = "select";

    // Condition values
    static readonly VALUE_INPUT = 'input[placeholder^="Enter"]';
    static readonly DATE_INPUTS = 'input[type="date"], input[placeholder="dd-mm-yyyy"]';
    static readonly RANGE_LOWER_INPUT = 'input[placeholder="Lower Amount"]';
    static readonly RANGE_HIGHER_INPUT = 'input[placeholder="Higher Amount"]';

    // Condition row
    static readonly CONDITION_ROW = 'div:has(select):has(input[placeholder^="Enter"])';

    // Add / remove condition buttons
    static readonly ADD_CONDITION_BUTTON = "button.rounded-full.bg-emerald-600";
    static readonly REMOVE_CONDITION_BUTTON = 'button.rounded-full:text-is("-")';

    // Action buttons
    static readonly VIEW_IMPACTED_BUTTON = 'button:text("View Impacted Customer")';
    static readonly DOWNLOAD_BUTTON = 'button:text("Download")';

    // Results section
    static readonly IMPACTED_SECTION = 'div:has-text("Impacted Customer"):visible';
    static readonly IMPACTED_COUNT = 'div:has-text("Impacted Customer") span:text-matches("\\d+")';

    // Listing table
    static readonly TABLE_VIEW_BUTTON = 'button[title="View"]';
    static readonly TABLE_DOWNLOAD_BUTTON = 'button[title="Download"]';
    static readonly TABLE_ROW = "tbody tr";

    // Details page
    static readonly DETAILS_HEADING = 'h1:has-text("View Bulk Promotion"), '
        + 'h2:has-text("View Bulk Promotion"), '
        + '[class*="heading"]:has-text("View Bulk Promotion")';
    static readonly DETAILS_DOWNLOAD_BUTTON = 'button:has-text("Download")';
    static readonly BACK_BUTTON = 'button:text-is("Back")';

    // Validation error
    static readonly VALIDATION_ERROR = ".Toastify__toast--error";
}
