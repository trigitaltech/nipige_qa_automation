/**
 * Page Object for the Notification Approval module — Communications → Notification Approval
 * (route /approvalNotification). Logged in as FreshCart tenant.
 *
 * Listing: filters (Date, Type, Status), Search box, Refresh button, table with columns
 * TEMPLATE NAME | TEMPLATE CATEGORY | TEMPLATE ID | CONCERN | AMOUNT | SCHEDULE TIME | STATUS | ACTION.
 * Details page (/approvalNotification/<id>): stats section, template config, notification body,
 * Download link, Back button.
 *
 * NOTE: The sidebar also has a "Search here" input — all search/refresh selectors are scoped
 * to the main content area (header bar of the listing) to avoid hitting the sidebar input.
 */
export default class NotificationApprovalPage {
    static readonly LISTING_PATH = "approvalNotification";

    // ---- Navigation (sidebar: Communications → Notification Approval) ----
    static readonly MENU_NOTIFICATION_APPROVAL = 'a[href="/approvalNotification"]';

    // ---- Module guard ----
    static readonly URL_GUARD = /\/approvalNotification/i;
    static readonly MODULE_HEADING = 'h1:has-text("Notification Approval"), h2:has-text("Notification Approval")';

    // ---- Listing filters ----
    // All three filters (Date, Type, Status) are the same custom combobox widget as used in
    // BulkNotification: input[role="combobox"][aria-haspopup="listbox"] with no placeholder
    // (they display the current selection as value text). Options render as plain <button> elements
    // inside a listbox that appears below the clicked combobox.
    // Order on page: index 0 = Date, index 1 = Type, index 2 = Status.
    static readonly FILTER_COMBOBOX = 'input[role="combobox"][aria-haspopup="listbox"]';
    static readonly DATE_FILTER_INDEX = 0;
    static readonly TYPE_FILTER_INDEX = 1;
    static readonly STATUS_FILTER_INDEX = 2;
    /** Option button inside whichever filter listbox is currently open, matched by visible text. */
    static filterOption(label: string): string {
        // Use :has-text() for flexible matching (handles leading/trailing whitespace in button text)
        return `[role="listbox"] button:has-text("${label}"), ul button:has-text("${label}"), `
            + `[class*="dropdown"] button:has-text("${label}"), button:has-text("${label}")`;
    }

    // ---- Search & Refresh ----
    // Scoped to main to avoid hitting the identical sidebar "Search here" input.
    // The page-level search sits in the header bar of the listing content area.
    static readonly SEARCH_INPUT = 'main input[placeholder="Search here"], '
        + 'header input[placeholder="Search here"], '
        + '.content-area input[placeholder="Search here"]';
    // Fallback: the second "Search here" input on the page (index 1, after the sidebar one).
    static readonly SEARCH_INPUT_NTH = 1;
    static readonly REFRESH_BUTTON = 'main button[title="Refresh"], '
        + 'header button[title="Refresh"], button.text-gray-400, '
        + 'button svg[data-icon*="refresh"], button:near(input[placeholder="Search here"])';

    // ---- Listing table ----
    static readonly TABLE = "table";
    static readonly TABLE_HEADERS = "table thead th";
    static readonly TABLE_ROW = "tbody tr";
    static readonly TABLE_VIEW_BUTTON = 'button[title="View"], button[aria-label*="view" i]';
    static readonly EMPTY_STATE_TEXT = "No notification approvals found for the selected filters.";
    static readonly EMPTY_STATE = `:has-text("${NotificationApprovalPage.EMPTY_STATE_TEXT}")`;
    static readonly RECORD_COUNT_TEXT = /Showing \d+ of \d+ requests?/i;

    // Expected listing columns (for column-visibility assertion)
    static readonly EXPECTED_COLUMNS = [
        "TEMPLATE NAME", "TEMPLATE CATEGORY", "TEMPLATE ID",
        "CONCERN", "AMOUNT", "SCHEDULE TIME", "STATUS", "ACTION",
    ];

    // ---- Status badges ----
    // Statuses shown in the STATUS column: Pending, Approved, Rejected
    static statusBadge(status: string): string {
        return `span:text-is("${status}"), td:has-text("${status}") [class*="badge"], `
            + `td:has-text("${status}") [class*="status"]`;
    }

    // ---- Details page ----
    static readonly DETAILS_HEADING = 'h1:has-text("Notification Approval Details"), '
        + 'h2:has-text("Notification Approval Details"), '
        + 'h1:has-text("Approval"), h2:has-text("Approval")';
    static readonly BACK_BUTTON = 'button:text-is("Back")';
    static readonly DOWNLOAD_BUTTON = 'button:has-text("Download"), a:has-text("Download")';

    // ---- Notification Stats section (Details page) ----
    static readonly STATS_SECTION = ':has-text("Notification Stats"), :has-text("Stats")';
    static readonly STATS_PENDING = ':has-text("Pending")';
    static readonly STATS_SUCCESS = ':has-text("Success")';
    static readonly STATS_FAILED = ':has-text("Failed")';

    // ---- Template Configuration section (Details page) ----
    static readonly TEMPLATE_CONFIG_SECTION = ':has-text("Template Configuration"), '
        + ':has-text("Template Config")';

    // ---- Notification body/content (Details page) ----
    static readonly NOTIFICATION_BODY = '[class*="body"], [class*="content"], '
        + ':has-text("Notification Body") ~ *, :has-text("Message") ~ *';

    // ---- Approve / Reject action buttons (Details page) ----
    static readonly APPROVE_BUTTON = 'button:text-is("Approve")';
    static readonly REJECT_BUTTON = 'button:text-is("Reject")';

    /** Row in the listing table that contains the given template name or ID text. */
    static row(text: string): string {
        return `tbody tr:has-text("${text}")`;
    }
}
