export default class ServiceTicketPage {
    // ── Sidebar navigation ────────────────────────────────────────────────────
    // Confirmed from DevTools: <a href="/serviceticket"><span class="truncate">Service Ticket</span></a>
    static readonly MENU_SERVICE_TICKET = 'a[href="/serviceticket"]';

    // ── Listing page ──────────────────────────────────────────────────────────
    // Confirmed from DevTools: ticket listing search field
    static readonly SEARCH_INPUT = 'input[placeholder*="Search ticket"]';

    // Confirmed from DevTools: <td data-slot="table-cell" colspan="9">No data available.</td>
    static readonly EMPTY_STATE_MESSAGE = 'td[data-slot="table-cell"]:has-text("No data available.")';

    // Eye icon / View button scoped to the row containing the given ticket ID
    static ticketViewButton(ticketId: string): string {
        return `tr:has-text("${ticketId}") button[title="View"], tr:has-text("${ticketId}") button:has(svg), tr:has-text("${ticketId}") a[title="View"], tr:has-text("${ticketId}") button:first-of-type`;
    }

    // Confirmed from DevTools: <button title="Edit" data-slot="button"> — title attribute matches View pattern
    static ticketEditButton(ticketId: string): string {
        return `tr:has-text("${ticketId}") button[title="Edit"], tr:has-text("${ticketId}") button:nth-of-type(2), tr:has-text("${ticketId}") a[title="Edit"]`;
    }

    // Row selector scoped to the ticket ID — used to chain .nth() in steps
    static ticketRow(ticketId: string): string {
        return `tr:has-text("${ticketId}")`;
    }

    // Badge selector used with .nth(1) to reach Status (index 0 = Priority, index 1 = Status)
    static readonly BADGE = 'span[data-slot="badge"]';

    // "Open" filter tab on the listing page — filters the grid to show only OPEN tickets.
    // Confirmed from DevTools: <button aria-selected="false">Open\n16</button> — one of 5 tabs
    // with aria-selected attribute (All tickets / Open / In progress / Waiting / Closed).
    // Using aria-selected attribute scopes the selector to the tab strip only, preventing
    // false matches on any sidebar or header text that also contains the word "Open".
    static readonly OPEN_FILTER_TAB       = 'button[aria-selected]:has-text("Open")';

    // Selector waits for the Open tab to be active before reading the first row.
    // Confirmed from DevTools: Open tab flips to aria-selected="true" after click.
    static readonly OPEN_FILTER_TAB_ACTIVE = 'button[aria-selected="true"]:has-text("Open")';

    // First ticket ID cell after applying the Open filter.
    // Confirmed from DevTools: ticket ID is inside a <button class="font-mono ..."> within
    // the first <td> of the first <tr> in <tbody>. innerText of the td equals the SR number.
    static readonly FIRST_OPEN_TICKET_ID  = 'table tbody tr:first-child td:first-child';

    // ── View / Detail page ────────────────────────────────────────────────────
    // TODO: verify selectors — inspect each read-only field on the View detail panel

    // Confirmed from DevTools: label <p>Service Number</p> followed by value <p class="mt-1 ...">
    static readonly VIEW_SERVICE_NUMBER = 'p:has-text("Service Number") + p';
    // Confirmed from DevTools: <span class="text-sm font-semibold text-foreground">Biswarup Roy</span>
    static readonly VIEW_CUSTOMER_NAME = 'span.text-sm.font-semibold.text-foreground';
    // Confirmed from DevTools: <p>Subject</p> followed by <p class="mt-1 ...">Test</p>
    static readonly VIEW_SUBJECT = 'p:has-text("Subject") + p';
    // Confirmed from DevTools: <span data-slot="badge">OPEN</span>
    static readonly VIEW_STATUS = 'span[data-slot="badge"]';

    // Back / breadcrumb link that returns to the listing from the View page
    // TODO: verify selector — inspect the back button or breadcrumb on the View page
    static readonly BACK_TO_LIST_BUTTON = 'button:text-is("Back")';

    // ── Edit page ─────────────────────────────────────────────────────────────
    // TODO: verify selectors — inspect each field on the Edit form

    // Confirmed from DevTools: card header section present on the Edit page
    static readonly EDIT_PAGE_HEADING = '[data-slot="card-header"]';

    // Confirmed from DevTools: native <select> with no name attribute, scoped by its label
    static readonly STATUS_DROPDOWN = 'div:has-text("Status") select';

    // Confirmed from DevTools: <textarea placeholder="Enter note to customer..." ...>
    static readonly NOTE_TO_CUSTOMER_INPUT = 'textarea[placeholder*="customer" i], textarea[placeholder*="note" i], textarea:first-of-type';
    // Confirmed from DevTools: <textarea placeholder="Enter internal note..." ...>
    static readonly INTERNAL_NOTE_INPUT = 'textarea[placeholder*="internal" i], textarea:nth-of-type(2)';
    // Confirmed from DevTools: <button type="submit">Update</button>
    static readonly UPDATE_BUTTON = 'button:has-text("Update"), button[type="submit"]';

    // Confirmed from DevTools: icon-only button with aria-label="Reload"
    static readonly REFRESH_BUTTON = 'button[aria-label="Reload"]';

    // ── Toast notifications ───────────────────────────────────────────────────
    // Reuses the same Toastify class already confirmed in HomePage.ts
    static readonly SUCCESS_TOAST = '.Toastify__toast--success';
}
