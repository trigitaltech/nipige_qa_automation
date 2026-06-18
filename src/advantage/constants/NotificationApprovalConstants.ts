/**
 * Human-readable element descriptions and app text for the Notification Approval module —
 * Communications → Notification Approval. Locators live in NotificationApprovalPage.
 */
export default class NotificationApprovalConstants {
    // Navigation
    static readonly PAGE_TITLE = "Notification Approval";
    static readonly MENU_NOTIFICATION_APPROVAL = "Notification Approval Menu Link";

    // Page heading / description
    static readonly PAGE_DESCRIPTION = "Review and approve pending notification requests";

    // Filters
    static readonly DATE_FILTER = "Date Filter";
    static readonly TYPE_FILTER = "Type Filter";
    static readonly STATUS_FILTER = "Status Filter";

    // Date filter options
    static readonly FILTER_LAST_7_DAYS = "Last 7 days";
    static readonly FILTER_LAST_15_DAYS = "Last 15 days";
    static readonly FILTER_LAST_30_DAYS = "Last 30 days";
    static readonly FILTER_LAST_3_MONTHS = "Last 3 months";
    static readonly FILTER_LAST_6_MONTHS = "Last 6 months";

    // Type filter options
    static readonly TYPE_ALL = "All Types";
    static readonly TYPE_BULK_NOTIFICATION = "Bulk Notification";
    static readonly TYPE_BULK_PROMOTION = "Bulk Promotion";

    // Status filter options
    static readonly STATUS_ALL = "All Statuses";
    static readonly STATUS_PENDING = "Pending";
    static readonly STATUS_APPROVED = "Approved";
    static readonly STATUS_REJECTED = "Rejected";

    // Search
    static readonly SEARCH_INPUT = "Search Input";
    static readonly REFRESH_BUTTON = "Refresh Button";

    // Table columns
    static readonly COL_TEMPLATE_NAME = "TEMPLATE NAME";
    static readonly COL_TEMPLATE_CATEGORY = "TEMPLATE CATEGORY";
    static readonly COL_TEMPLATE_ID = "TEMPLATE ID";
    static readonly COL_CONCERN = "CONCERN";
    static readonly COL_AMOUNT = "AMOUNT";
    static readonly COL_SCHEDULE_TIME = "SCHEDULE TIME";
    static readonly COL_STATUS = "STATUS";
    static readonly COL_ACTION = "ACTION";

    // Actions
    static readonly VIEW_BUTTON = "View Button";
    static readonly APPROVE_BUTTON = "Approve Button";
    static readonly REJECT_BUTTON = "Reject Button";
    static readonly DOWNLOAD_BUTTON = "Download Button";
    static readonly BACK_BUTTON = "Back Button";

    // Details page sections
    static readonly STATS_SECTION = "Notification Stats Section";
    static readonly TEMPLATE_CONFIG_SECTION = "Template Configuration Section";
    static readonly NOTIFICATION_BODY = "Notification Body";

    // Messages
    static readonly EMPTY_STATE = "No notification approvals found for the selected filters.";
    static readonly NO_RECORDS_SEARCH = "No records found";

    // Security test inputs
    static readonly SQL_INJECTION_INPUT = "' OR '1'='1";
    static readonly SPECIAL_CHARS_INPUT = "!@#$%^&*()<>{}[]";
}
