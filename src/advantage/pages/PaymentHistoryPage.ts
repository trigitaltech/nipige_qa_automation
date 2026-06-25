/**
 * PaymentHistoryPage — selectors for /payment-history.
 * Sections: Filters (Time Period / Provider / Payment Status) | KPI Cards | Transaction Table
 */
export default class PaymentHistoryPage {
    // ── Direct navigation path ────────────────────────────────────────────────
    static readonly PAGE_PATH = "payment-history";

    // ── Sidebar navigation ────────────────────────────────────────────────────
    static readonly PAYMENT_HISTORY_SIDEBAR_LINK = [
        'a[href*="payment-history"]',
        'a[href="/payment-history"]',
        'a:has-text("Payment History")',
    ].join(", ");

    // ── Page heading & subtitle ───────────────────────────────────────────────
    static readonly PAGE_HEADING = [
        ':is(h1,h2,h3):has-text("Payment History")',
        'h1:has-text("Payment")',
        'h2:has-text("Payment History")',
    ].join(", ");

    static readonly PAGE_SUBTITLE = [
        'p:has-text("Review checkout transactions")',
        'p:has-text("checkout transactions")',
        'span:has-text("checkout transactions")',
    ].join(", ");

    // ── Search (page-level input, NOT the sidebar "Search navigation menu" box) ──
    // Sidebar lives in <complementary>; page search lives in <main>.
    // Scoping to main ensures we never accidentally target the sidebar field.
    static readonly SEARCH_INPUT = [
        'main input[placeholder*="Search transaction"]',
        'main input[placeholder*="transaction ID"]',
        'main input[placeholder*="customer, payment"]',
    ].join(", ");

    static readonly SEARCH_ICON_BTN = [
        'main button[aria-label*="Search"]',
        'main button:text-is("Search")',
    ].join(", ");

    // ── Header action buttons ─────────────────────────────────────────────────
    static readonly CREATE_BUTTON = [
        'button:text-is("Create")',
        'button:has-text("Create")',
    ].join(", ");

    // DOM: button "Reload" (aria-label="Reload") — confirmed from page snapshot
    static readonly REFRESH_BUTTON = [
        'button[aria-label="Reload"]',
        'button[aria-label*="reload" i]',
        'button[aria-label*="refresh" i]',
        'button[title*="reload" i]',
        'main button:has(img):last-of-type',
    ].join(", ");

    // ── Filter: Time Period ───────────────────────────────────────────────────
    // DOM: combobox (current value) + button "Open options" — all inside main.
    static readonly TIME_PERIOD_TRIGGER = [
        'button[role="combobox"]:near(:text("Time Period"))',
        'div:has(> :text("Time Period")) button[role="combobox"]',
        'div:has(> label:text("Time Period")) button',
        'div:has(> span:text-is("Time Period")) button',
        '[data-testid*="time-period"] button',
        'button:has-text("Last 7 days")',
        'button:has-text("Last 15 days")',
        'button:has-text("Last 30 days")',
        'button:has-text("Last 3 Months")',
        'button:has-text("Last 6 Months")',
    ].join(", ");

    // ── Filter: Provider ──────────────────────────────────────────────────────
    static readonly PROVIDER_TRIGGER = [
        'button[role="combobox"]:near(:text("Provider"))',
        'div:has(> :text("Provider")) button[role="combobox"]',
        'div:has(> label:text("Provider")) button',
        'div:has(> span:text-is("Provider")) button',
        '[data-testid*="provider"] button',
        'button:has-text("All Providers")',
        'button:has-text("Branch Office")',
        'button:has-text("Fresh Market")',
        'button:has-text("Fresh Town Market")',
        'button:has-text("Green Market")',
    ].join(", ");

    // ── Filter: Payment Status ────────────────────────────────────────────────
    static readonly PAYMENT_STATUS_TRIGGER = [
        'button[role="combobox"]:near(:text("Payment Status"))',
        'div:has(> :text("Payment Status")) button[role="combobox"]',
        'div:has(> label:text("Payment Status")) button',
        'div:has(> span:text-is("Payment Status")) button',
        '[data-testid*="payment-status"] button',
        'button:has-text("PENDING")',
        'button:has-text("REFUNDED")',
        'button:has-text("PAID")',
        'button:has-text("CANCELLED")',
        'button:has-text("FAILED")',
    ].join(", ");

    // ── Dropdown option picker (shared) ───────────────────────────────────────
    // Matches an option by visible text inside the open dropdown list.
    static readonly DROPDOWN_OPTION = (text: string): string => [
        `[role="option"]:has-text("${text}")`,
        `li:has-text("${text}")`,
        `div[class*="option"]:has-text("${text}")`,
        `[role="listbox"] *:has-text("${text}")`,
    ].join(", ");

    static readonly DROPDOWN_LISTBOX = [
        '[role="listbox"]',
        'ul[class*="options"]',
        'div[class*="dropdown"]',
        'div[class*="popover"] ul',
    ].join(", ");

    // ── KPI Cards ─────────────────────────────────────────────────────────────
    static readonly KPI_VISIBLE_TRANSACTIONS_CARD = [
        'div:has(> p:has-text("Visible Transactions"))',
        'div:has(> span:has-text("Visible Transactions"))',
        'div:has-text("Visible Transactions")',
    ].join(", ");

    static readonly KPI_VISIBLE_AMOUNT_CARD = [
        'div:has(> p:has-text("Visible Amount"))',
        'div:has(> span:has-text("Visible Amount"))',
        'div:has-text("Visible Amount")',
    ].join(", ");

    static readonly KPI_PAID_TRANSACTIONS_CARD = [
        'div:has(> p:has-text("Paid Transactions"))',
        'div:has(> span:has-text("Paid Transactions"))',
        'div:has-text("Paid Transactions")',
    ].join(", ");

    // ── Transaction table ─────────────────────────────────────────────────────
    static readonly TABLE = [
        'table',
        '[role="table"]',
        'div[class*="table"]',
    ].join(", ");

    static readonly TABLE_BODY_ROWS = [
        'tbody tr',
        '[role="row"]:not([class*="header"]):not(thead tr)',
    ].join(", ");

    static readonly TABLE_EMPTY_STATE = [
        'td[colspan]:has-text("No")',
        'div:has-text("No transactions")',
        'div:has-text("No records")',
        'p:has-text("No data")',
        'span:has-text("No results")',
    ].join(", ");

    static readonly TABLE_HEADER = (columnText: string): string => [
        `th:has-text("${columnText}")`,
        `thead td:has-text("${columnText}")`,
        `[role="columnheader"]:has-text("${columnText}")`,
    ].join(", ");

    static readonly TABLE_CELL = (text: string): string => [
        `td:has-text("${text}")`,
        `[role="cell"]:has-text("${text}")`,
    ].join(", ");

    // ── Transaction count label ───────────────────────────────────────────────
    static readonly TRANSACTION_COUNT_LABEL = [
        'p:has-text("transactions")',
        'span:has-text("transactions")',
        'div[class*="subtitle"]:has-text("transactions")',
    ].join(", ");

    // ── No results / empty search state ──────────────────────────────────────
    static readonly NO_RESULTS = [
        'div:has-text("No transactions found")',
        'div:has-text("No records found")',
        'td:has-text("No")',
        'p:has-text("No results")',
        'div:has-text("no matching")',
    ].join(", ");

    // ── Error banner ──────────────────────────────────────────────────────────
    static readonly ERROR_BANNER = [
        'div[role="alert"]',
        'div[class*="error"]',
        'p[class*="error"]',
        'div:has-text("Something went wrong")',
    ].join(", ");
}
