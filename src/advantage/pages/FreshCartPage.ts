export default class FreshCartPage {

    // ── Login page ────────────────────────────────────────────────────────────
    // Confirmed from DevTools: <input id="identifier" type="email">
    static readonly USERNAME_INPUT       = '#identifier';
    // Confirmed from DevTools: <input id="password" type="password">
    static readonly PASSWORD_INPUT       = '#password';
    // Confirmed from DevTools: <button type="submit">
    static readonly LOGIN_BUTTON         = 'button[type="submit"]';

    // ── Top navigation ────────────────────────────────────────────────────────
    // TODO: verify selector — inspect the Orders link in the top nav
    static readonly ORDERS_LINK          = 'a:text-is("Orders")';

    // ── Orders listing page ───────────────────────────────────────────────────
    // Confirmed from DevTools: card-based layout — <a><span>View Details</span></a>
    static readonly FIRST_ORDER_VIEW_DETAILS = 'a:has(span:has-text("View Details"))';

    // ── Order detail page ─────────────────────────────────────────────────────
    // TODO: verify selector — inspect the Need Help button on the order detail page
    static readonly NEED_HELP_BUTTON     = 'button:text-is("Need Help")';

    // ── Need Help / Support panel ─────────────────────────────────────────────
    // Confirmed: rendered as a non-button/anchor element — text= matches any tag
    static readonly SUPPORT_TICKET_OPTION = 'text=Support Ticket';

    // ── Support Ticket creation ───────────────────────────────────────────────
    // TODO: verify selector — inspect the Raise Ticket button
    static readonly RAISE_TICKET_BUTTON  = 'button:text-is("Raise Ticket")';

    // Issue Type dropdown
    // Confirmed from DevTools: native <select class="w-full rounded-xl border...">
    static readonly ISSUE_TYPE_DROPDOWN  = 'select';

    // Confirmed from DevTools: <input placeholder="Enter issue title" type="text">
    static readonly ISSUE_INPUT          = 'input[placeholder="Enter issue title"]';

    // Confirmed from DevTools: <textarea rows="3" placeholder="Describe your issue...">
    static readonly DESCRIPTION_INPUT    = 'textarea[rows="3"]';

    // Confirmed from DevTools: <button>Submit Ticket</button>
    static readonly SUBMIT_TICKET_BUTTON = 'button:has-text("Submit Ticket")';

    // ── Support Tickets listing ───────────────────────────────────────────────
    // FreshCart uses ul.divide-y > li rows. Newest ticket is last-child (oldest-first sort).
    // Scoped to <p> inside <a> to read only the SR number, not the full row text.
    static readonly OPEN_TICKET_ID_CELL  = 'ul.divide-y > li:last-child a p';
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
    static readonly PROFILE_MENU         = 'button[aria-label="Account menu"]';
    // Confirmed from DevTools: logout button inside profile dropdown
    static readonly LOGOUT_LINK          = 'button:has-text("Logout")';
    // Login page indicator — #identifier is confirmed present on the login page
    static readonly LOGIN_PAGE_INDICATOR = '#identifier';
}
