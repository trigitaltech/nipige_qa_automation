export default class FreshCartPage {
    // ── Login page ────────────────────────────────────────────────────────────
    static readonly USERNAME_INPUT = '#identifier, input[name="identifier"], input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="username" i]';
    static readonly PASSWORD_INPUT = '#password, input[name="password"], input[type="password"]';
    static readonly LOGIN_BUTTON = 'button[type="submit"], button:has-text("Sign in"), button:has-text("Sign In"), button:has-text("Login")';

    // ── Top navigation ────────────────────────────────────────────────────────
    static readonly ORDERS_LINK = 'a[href*="order" i], a:has-text("Orders"), button:has-text("Orders")';

    // ── Orders listing page ───────────────────────────────────────────────────
    static readonly FIRST_ORDER_VIEW_DETAILS = 'a:has-text("View Details"), button:has-text("View Details"), a:has(span:has-text("View Details")), a[href*="order"], button:has-text("Details"), td a, li a';

    // ── Order detail page ─────────────────────────────────────────────────────
    static readonly NEED_HELP_BUTTON = 'button:has-text("Need Help"), a:has-text("Need Help"), :text("Need Help"), button:has-text("Support"), a[href*="support"]';

    // ── Need Help / Support panel ─────────────────────────────────────────────
    static readonly SUPPORT_TICKET_OPTION = ':text("Support Ticket"), button:has-text("Support Ticket"), a:has-text("Support Ticket")';

    // ── Support Ticket creation ───────────────────────────────────────────────
    static readonly RAISE_TICKET_BUTTON = 'button:has-text("Raise Ticket"), button:has-text("Create Ticket"), button:has-text("New Ticket"), :text("Raise Ticket")';

    // Issue Type dropdown
    static readonly ISSUE_TYPE_DROPDOWN = 'select, [role="combobox"], button:has-text("Select"), div[class*="select"]';

    // Confirmed from DevTools: <input placeholder="Enter issue title" type="text">
    static readonly ISSUE_INPUT = 'input[placeholder="Enter issue title"]';

    // Confirmed from DevTools: <textarea rows="3" placeholder="Describe your issue...">
    static readonly DESCRIPTION_INPUT = 'textarea[rows="3"]';

    // Confirmed from DevTools: <button>Submit Ticket</button>
    static readonly SUBMIT_TICKET_BUTTON = 'button:text-is("Submit Ticket")';

    // Success toast shown after ticket submission — text confirmed from manual run
    static readonly SUBMIT_SUCCESS_TOAST = 'text=Ticket Created Successfully';

    // ── Support Tickets listing ───────────────────────────────────────────────
    // All <p> elements across all rows — SR numbers are among these, identified by "SR" prefix
    static readonly SUPPORT_TICKET_ROWS = 'ul.divide-y > li';
    static readonly ALL_ROW_PARAGRAPHS = 'ul.divide-y > li a p';
    // Fallback single-row selectors
    static readonly OPEN_TICKET_ID_CELL = 'ul.divide-y > li:last-child a p';
    static readonly FIRST_TICKET_ID_CELL = 'ul.divide-y > li:last-child a p';

    // ── Support Tickets listing — status verification ─────────────────────────
    // TODO: replace with real selector once debug log reveals the actual DOM structure.
    // Proximity anchor: element that contains the ticket ID text — works for table, list, or div grid.
    static ticketRowAnchor(ticketId: string): string {
        return `text=${ticketId}`;
    }

    // ── Support Tickets navigation link ──────────────────────────────────────
    // TODO: verify selector — inspect the Support Tickets nav/menu link in FreshCart
    static readonly SUPPORT_TICKETS_LINK = 'a:has-text("Support Tickets"), a[href*="support"]';

    // ── Profile menu & logout ─────────────────────────────────────────────────
    // Confirmed from DevTools: <button aria-label="Account menu">
    static readonly PROFILE_MENU = 'button[aria-label="Account menu"]';
    // Confirmed from DevTools: logout button inside profile dropdown
    static readonly LOGOUT_LINK = 'button:has-text("Logout")';
    // Login page indicator — #identifier is confirmed present on the login page
    static readonly LOGIN_PAGE_INDICATOR = '#identifier';
}
