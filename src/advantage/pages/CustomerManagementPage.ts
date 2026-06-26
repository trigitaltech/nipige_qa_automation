/**
 * Page Object for the Customer Management (Customer Admin) area of the Nipige tenant console.
 *
 * The application is a React build whose markup is composed entirely of Tailwind utility classes
 * with no ids or data-* hooks. Selectors are therefore anchored to stable, user-visible signals
 * (placeholders, link hrefs and exact label text) and scoped to the <main> content region where
 * the same word could otherwise collide with the sidebar navigation. This mirrors how
 * {@link HomePage} anchors the login screen and is the Playwright-recommended approach.
 */
export default class CustomerManagementPage {
    // ----------------------------------------------------------------------------------------
    // Navigation. The Customer Admin entry is anchored to its ROUTE HREF (/customer-management),
    // which is the stable contract: it survived a sidebar redesign that removed the old collapsible
    // "Customers" group and relabelled the entry to "Customer Management". CUSTOMERS_MENU is only an
    // OPTIONAL/legacy expander — clicked best-effort if the link happens to be nested in a collapsed
    // group — so navigation works across both the flat and collapsible menu layouts.
    // ----------------------------------------------------------------------------------------
    static readonly CUSTOMERS_MENU = 'button:has-text("Customers")';
    static readonly CUSTOMER_ADMIN_LINK = 'a[href="/customer-management"]';

    // ----------------------------------------------------------------------------------------
    // Dashboard: page heading + the four summary widgets. Each widget label is a <p> inside <main>;
    // the live "Active Customers" widget is rendered with the shorter label "Active".
    // ----------------------------------------------------------------------------------------
    static readonly DASHBOARD_HEADING = 'main h1:has-text("Customer Management")';
    static readonly WIDGET_TOTAL_CUSTOMERS = 'main >> text="Total Customers"';
    static readonly WIDGET_ACTIVE_CUSTOMERS = 'main >> text="Active"';
    static readonly WIDGET_ORDERS_TODAY = 'main >> text="Orders Today"';
    static readonly WIDGET_OPEN_TICKETS = 'main >> text="Open Tickets"';

    // ----------------------------------------------------------------------------------------
    // Customer 360° search. The customer search box is identified by its placeholder so it never
    // collides with the sidebar "Search navigation menu" box; the Search button is scoped to <main>.
    // The search-type dropdown defaults to "Mobile Number", so a phone search needs no extra step.
    // ----------------------------------------------------------------------------------------
    static readonly SEARCH_INPUT = 'input[placeholder="e.g. 9775680515"]';
    static readonly SEARCH_BUTTON = 'main >> button:has-text("Search")';

    // Search-type selector. The box defaults to "Mobile Number"; other types (Customer Number,
    // E-mail Id, Order Number, ...) are chosen from this dropdown. The toggle is an icon-only button
    // in <main> whose accessible name comes from aria-label (no visible text). The options render in
    // a portal listbox (role="option"), so the option locator is page-level. The value-input
    // placeholder is the same for every type, so SEARCH_INPUT above stays valid.
    static readonly SEARCH_TYPE_TOGGLE = 'main >> button[aria-label="Open options"]';

    /**
     * Builds the selector for a search-type option in the opened type dropdown.
     * @param type exact type label as shown, e.g. "Customer Number", "E-mail Id", "Order Number"
     */
    static searchTypeOption(type: string): string {
        return `[role="option"]:has-text("${type}")`;
    }

    // ----------------------------------------------------------------------------------------
    // Customer profile (opens at /customer-management/<id> after a successful search). The "Back"
    // button is a stable, data-independent signal that the profile has finished loading.
    // ----------------------------------------------------------------------------------------
    static readonly CUSTOMER_PROFILE_READY = 'main >> button:has-text("Back")';

    // ----------------------------------------------------------------------------------------
    // Negative search state. An invalid / non-existent phone keeps the page on the Customer 360°
    // search screen (no profile opens) and raises a react-toastify ERROR toast ("keyword not
    // match") — the same toast family the login screen uses (HomePage.SIGN_IN_ERROR_MESSAGE).
    // SEARCH_EMPTY_STATE is the default "Search for a Customer" prompt that remains visible while no
    // customer is loaded, making it a stable, data-independent signal that no profile was opened.
    // ----------------------------------------------------------------------------------------
    static readonly SEARCH_ERROR_TOAST = '.Toastify__toast--error';
    static readonly SEARCH_EMPTY_STATE = 'main >> text="Search for a Customer"';

    /**
     * Builds a value-driven locator for a customer detail (name, ID, email or phone). The detail
     * fields carry no distinguishing attributes, so verification asserts that the expected value
     * is itself rendered inside the profile — scoped to <main> to avoid sidebar/breadcrumb noise.
     * @param value exact detail text to locate, e.g. "CGSO0065"
     */
    static customerDetail(value: string): string {
        return `main >> text=/${value}/`;
    }

    // ----------------------------------------------------------------------------------------
    // Orders tab (inside the customer profile). The Orders tab is the default view and shows a grid
    // plus filters. The filter-field combobox switches between "Order Number" (with the search box)
    // and "Status" (which reveals a "Select Status" dropdown). Each row's Action is an icon button
    // (aria-label="View") that opens the order detail page at /customer-management/<id>/orderDetail/<no>.
    // ----------------------------------------------------------------------------------------
    static readonly ORDERS_TAB = 'main >> button:has-text("Orders")';
    static readonly ORDERS_TABLE = 'main >> table';
    static readonly ORDERS_ROWS = 'main table tbody tr';
    static readonly ORDER_VIEW_BUTTON = 'main >> button[aria-label="View"]';
    // Filters. The filter-field and date filters are <input role="combobox"> whose selected value is
    // the INPUT VALUE (not text), so they are verified with toHaveValue via ORDERS_COMBOBOX (in DOM
    // order: [0] filter field, [1] date; in Status mode: [0] field, [1] Select Status, [2] date).
    static readonly ORDERS_COMBOBOX = 'main input[role="combobox"]';
    static readonly ORDERS_SEARCH_INPUT = 'main >> [placeholder="Enter order number"]';
    // Icon-only "Open options" toggles for the Orders-tab comboboxes (index 0 = filter field,
    // index 1 in Status mode = "Select Status"). Same control family as the search-type dropdown.
    static readonly ORDERS_FILTER_TOGGLE = 'main >> button[aria-label="Open options"]';

    /** Order detail page heading, e.g. heading "Order ORD-20260602-73955B3D". */
    static orderDetailHeading(orderNumber: string): string {
        return `main >> text="Order ${orderNumber}"`;
    }

    // ----------------------------------------------------------------------------------------
    // Address Management tab (inside the customer profile). The tab carries a badge count and, when
    // selected (bg-theme-accent), shows a "View Address" list of cards. Each card renders three
    // labelled paragraphs — "Customer Name : ", "Delivery Address : ", "Customer Phone : " — and an
    // optional "Default" badge. Card count = number of "Customer Name :" paragraphs.
    // ----------------------------------------------------------------------------------------
    static readonly ADDRESS_TAB = 'main >> button:has-text("Address Management")';
    static readonly ADDRESS_TAB_SELECTED = 'main >> button.bg-theme-accent:has-text("Address Management")';
    static readonly ADDRESS_VIEW_HEADING = 'main >> text="View Address"';
    static readonly ADDRESS_CARD_NAME = 'main p:has-text("Customer Name :")';
    static readonly ADDRESS_CARD_ADDRESS = 'main p:has-text("Delivery Address :")';
    static readonly ADDRESS_CARD_PHONE = 'main p:has-text("Customer Phone :")';
    static readonly ADDRESS_DEFAULT_BADGE = 'main >> text="Default"';

    // ----------------------------------------------------------------------------------------
    // Service Requests tab (inside the customer profile). Shows a Date Range dropdown + Apply, a
    // "Service Request Statistics" panel, and a table (Date, SR Number, Description, Status, Action).
    // With no records (default "Today" range) the table shows the empty-state message below.
    // ----------------------------------------------------------------------------------------
    static readonly SR_TAB = 'main >> button:has-text("Service Requests")';
    static readonly SR_TAB_SELECTED = 'main >> button.bg-theme-accent:has-text("Service Requests")';
    static readonly SR_DATE_RANGE_DROPDOWN = 'main >> input[role="combobox"]';
    static readonly SR_APPLY_BUTTON = 'main >> button:has-text("Apply")';
    static readonly SR_STATISTICS = 'main >> text="Service Request Statistics"';
    static readonly SR_TABLE = 'main >> table';
    static readonly SR_ROWS = 'main table tbody tr';
    static readonly SR_EMPTY_MESSAGE = 'main >> text="No service requests found for the selected range."';
    // Best-effort Action control in a service-request row (records-exist branch only).
    static readonly SR_VIEW_BUTTON = 'main table tbody tr button';
}
