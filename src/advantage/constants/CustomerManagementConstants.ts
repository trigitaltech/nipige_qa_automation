export default class CustomerManagementConstants {
    // Navigation
    static readonly CUSTOMERS_MENU = "Customers Menu";
    static readonly CUSTOMER_ADMIN_LINK = "Customer Admin Link";
    // Dashboard
    static readonly DASHBOARD_HEADING = "Customer Management Heading";
    static readonly WIDGET_TOTAL_CUSTOMERS = "Total Customers Widget";
    static readonly WIDGET_ACTIVE_CUSTOMERS = "Active Customers Widget";
    static readonly WIDGET_ORDERS_TODAY = "Orders Today Widget";
    static readonly WIDGET_OPEN_TICKETS = "Open Tickets Widget";
    // Search
    static readonly SEARCH_INPUT = "Customer Search Box";
    static readonly SEARCH_BUTTON = "Customer Search Button";
    static readonly SEARCH_TYPE_TOGGLE = "Search Type Dropdown";
    static readonly SEARCH_TYPE_OPTION = "Search Type Option";
    // Canonical UI label of the default search type (needs no dropdown interaction).
    static readonly SEARCH_TYPE_MOBILE = "Mobile Number";
    // Negative search
    static readonly SEARCH_ERROR_TOAST = "Invalid Search Error Toast";
    static readonly SEARCH_EMPTY_STATE = "Customer Search Empty State";
    // Customer profile
    static readonly CUSTOMER_PROFILE = "Customer Profile";
    static readonly CUSTOMER_NAME = "Customer Name";
    static readonly CUSTOMER_ID = "Customer ID";
    static readonly CUSTOMER_EMAIL = "Customer Email";
    static readonly CUSTOMER_PHONE = "Customer Phone";
    // Orders tab (customer profile)
    static readonly ORDERS_TAB = "Orders Tab";
    static readonly ORDERS_TABLE = "Orders Table";
    static readonly ORDERS_FILTER_FIELD = "Order Filter Field Dropdown";
    static readonly ORDERS_SEARCH_INPUT = "Order Number Search Box";
    static readonly ORDERS_STATUS_DROPDOWN = "Order Status Dropdown";
    static readonly ORDERS_DATE_FILTER = "Order Date Filter";
    static readonly ORDER_VIEW_BUTTON = "Order View Button";
    static readonly ORDER_DETAIL = "Order Detail";
    // Orders table columns and the status-filter options, exactly as rendered in the UI.
    static readonly ORDER_COLUMNS: readonly string[] = [
        "Order#", "Order Date", "Status", "Service Provider", "Amount", "Delivery Charge", "Action",
    ];
    static readonly ORDER_STATUSES: readonly string[] = [
        "Processing", "Confirmed", "Delivered", "Created", "Cancelled", "Returned", "Dispatched", "Refund",
    ];
    // Address Management tab (customer profile)
    static readonly ADDRESS_TAB = "Address Management Tab";
    // Service Requests tab (customer profile)
    static readonly SR_TAB = "Service Requests Tab";
    static readonly SR_DATE_RANGE = "Service Request Date Range Dropdown";
    static readonly SR_APPLY = "Service Request Apply Button";
    static readonly SR_STATISTICS = "Service Request Statistics Section";
    static readonly SR_TABLE = "Service Requests Table";
    static readonly SR_COLUMNS: readonly string[] = [
        "Date", "SR Number", "Description", "Status", "Action",
    ];
    // Observation pause (seconds) used at the Address Management demo checkpoints. Like every other
    // observation pause it is gated on STEP_DELAY, so it is a no-op (skipped) in CI / fast runs.
    static readonly OBSERVATION_DELAY = 3;
}
