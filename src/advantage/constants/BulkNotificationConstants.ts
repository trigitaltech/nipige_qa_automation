/**
 * Human-readable element descriptions and app text for the Bulk Notification (Tenant) module — passed
 * to the UIActions wrappers so every action is logged consistently. Locators live in
 * BulkNotificationPage.
 */
export default class BulkNotificationConstants {
    // Navigation
    static readonly BULK_NOTIFICATION_PAGE = "Bulk Notification Page";
    static readonly MENU_BULK_NOTIFICATION = "Bulk Notification Menu Link";

    // Listing page
    static readonly CREATE_BUTTON_LABEL = "Create Criteria";
    static readonly CREATE_BUTTON = "Create Criteria Button";
    static readonly SEARCH_INPUT = "Search Input";
    static readonly DATE_FILTER_DROPDOWN = "Date Filter Dropdown";
    static readonly EMPTY_STATE_TEXT = "No criteria found.";

    // Date filter options
    static readonly FILTER_TODAY = "Today";
    static readonly FILTER_7_DAYS = "7 days";
    static readonly FILTER_30_DAYS = "30 days";
    static readonly FILTER_CUSTOM = "Custom";

    // Criteria builder (shared pattern with Bulk Promotion)
    static readonly ENTITY_DROPDOWN = "Entity Dropdown";
    static readonly CRITERIA_DROPDOWN = "Criteria Dropdown";
    static readonly ADD_CONDITION_BUTTON = "Add Condition Button (+)";
    static readonly REMOVE_CONDITION_BUTTON = "Remove Condition Button (-)";
    static readonly OPERATOR_DROPDOWN = "Operator Dropdown";
    static readonly VALUE_INPUT = "Value Input";
    static readonly DATE_INPUTS = "Date Inputs";

    // Impacted customer
    static readonly VIEW_IMPACTED_BUTTON_LABEL = "VIEW IMPACTED CUSTOMER";
    static readonly VIEW_IMPACTED_BUTTON = "View Impacted Customer Button";
    static readonly DOWNLOAD_BUTTON = "Download Button";
    static readonly TOTAL_IMPACTED_LABEL = "TOTAL IMPACTED";
    static readonly IMPACTED_COUNT = "Impacted Customer Count";
    static readonly LOADING_TEXT = "Loading...";

    // Notification Configuration
    static readonly NOTIFICATION_TYPE_DROPDOWN = "Notification Type Dropdown";
    static readonly TEMPLATE_DROPDOWN = "Template Dropdown";
    static readonly SCHEDULE_DATE_INPUT = "Schedule Date Input";
    static readonly SCHEDULE_TIME_INPUT = "Schedule Time Input";
    static readonly SUBMIT_BUTTON = "Submit Button";
    static readonly SUBMIT_BUTTON_LABEL = "Submit";

    // Messages
    static readonly SUCCESS_MODAL_TEXT = "Criteria created successfully.";
    static readonly SUBMIT_SUCCESS_TEXT = "Notification scheduled successfully";
    static readonly NOTIFICATION_TYPE_REQUIRED = "Notification Type is required";
    static readonly TEMPLATE_REQUIRED = "Template is required";
    static readonly PAST_DATE_ERROR = "Schedule date and time must be in the future";
    static readonly NO_CUSTOMERS_FOUND = "No customers found matching the selected criteria";
    static readonly CUSTOM_DATE_RANGE_ERROR = "From Date cannot be greater than To Date";

    // Listing table
    static readonly TABLE_VIEW_BUTTON = "View Button";
    static readonly TABLE_DOWNLOAD_BUTTON = "Download Button";

    // Details page
    static readonly DETAILS_HEADING = "View Bulk Notification Heading";
    static readonly DETAILS_DOWNLOAD_BUTTON = "Details Page Download Button";
    static readonly BACK_BUTTON = "Back Button";
}
