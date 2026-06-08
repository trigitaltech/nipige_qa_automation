/**
 * FAQPage — selectors for /setup/faq (listing page).
 *
 * Selector assumptions from DOM screenshots of the Nipige FreshCart tenant app:
 *   • Scope filter: button-style tabs ("All Scopes", "Partner", "Customer", "Staff")
 *   • Category filter: custom React combobox (role="combobox") on the listing page
 *   • Dashboard stat cards: <p> label with sibling numeric <p> above it
 *   • Row action buttons: View (nth 0), Edit (nth 1), Delete (last) inside td:last-child
 *   • Delete confirmation uses SweetAlert2-style popup
 *   • Table search: input[placeholder="Search topic or description..."]
 */
export default class FAQPage {
    // ── Direct navigation path ────────────────────────────────────────────────
    static readonly FAQ_PATH = "setup/faq";

    // ── Home page & sidebar indicators ───────────────────────────────────────
    static readonly PROFILE_MENU = 'button[aria-haspopup="true"]';
    static readonly HOME_GREETING = 'h1[class*="tracking-tight"]';
    static readonly SIDEBAR_NAV = 'nav.flex-1';
    static readonly SETUP_MENU_BTN = 'nav button:has-text("Setup")';
    static readonly FAQ_SUBMENU_LINK = 'a[href="/setup/faq"], a[href*="/setup/faq"]';

    // ── Page heading ──────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = ':is(h1,h2,h3):has-text("FAQ Master Config")';

    // ── Dashboard stat cards ──────────────────────────────────────────────────
    static readonly TOTAL_FAQS_CARD = ':has-text("TOTAL FAQS")';
    static readonly PARTNER_FAQS_CARD = ':has-text("PARTNER FAQS")';
    static readonly CUSTOMER_FAQS_CARD = ':has-text("CUSTOMER FAQS")';
    static readonly WITH_MEDIA_CARD = ':has-text("WITH MEDIA")';

    // ── Scope filter tabs (button-style) ──────────────────────────────────────
    static readonly ALL_FAQS_TAB = 'button:has-text("All FAQs"), [role="tab"]:has-text("All FAQs")';
    static readonly ALL_SCOPES_TAB = 'button:has-text("All Scopes"), [role="tab"]:has-text("All Scopes")';
    // Use :text-is for exact match to avoid matching "PARTNER" scope badges in the table rows
    static readonly PARTNER_SCOPE_TAB = 'button:text-is("Partner")';
    static readonly CUSTOMER_SCOPE_TAB = 'button:text-is("Customer")';
    static readonly STAFF_SCOPE_TAB = 'button:text-is("Staff")';

    // ── Category filter (custom combobox on listing page) ─────────────────────
    static readonly CATEGORY_FILTER_TRIGGER = [
        '[role="combobox"]',
        'button:has-text("All Categories")',
        'select',
    ].join(", ");
    static readonly CATEGORY_DROPDOWN_OPTION = '[role="option"]';

    // ── Search box ────────────────────────────────────────────────────────────
    static readonly SEARCH_INPUT = [
        'input[placeholder="Search topic or description..."]',
        'input[placeholder*="Search topic"]',
    ].join(", ");

    // ── Create FAQ button ─────────────────────────────────────────────────────
    static readonly CREATE_FAQ_BTN = 'button:has-text("Create FAQ"), a:has-text("Create FAQ")';

    // ── Table ─────────────────────────────────────────────────────────────────
    static readonly TABLE = 'table';
    static readonly TABLE_HEADERS = 'table thead th';
    static readonly TABLE_ROWS = 'table tbody tr';

    static readonly NO_RECORDS = [
        'td:has-text("No records")',
        'td:has-text("No data found")',
        'td:has-text("No FAQs")',
        ':text("No records found")',
        ':text("No data found")',
        '[class*="empty-state"]',
    ].join(", ");

    // ── Row action button selectors (aria-label confirmed via DOM inspection) ─
    static readonly ROW_VIEW_BTN = '[aria-label="View"]';
    static readonly ROW_EDIT_BTN = '[aria-label="Edit"]';
    static readonly ROW_DELETE_BTN = '[aria-label="Delete"]';

    // ── Row-scoped helper ─────────────────────────────────────────────────────
    static rowFor(topic: string): string {
        return `table tbody tr:has(td:has-text("${topic}"))`;
    }

    // ── Pagination ────────────────────────────────────────────────────────────
    static readonly NEXT_PAGE_BTN = [
        'a[aria-label="Go to next page"]',
        'button[aria-label="Go to next page"]',
        'li[data-slot="pagination-item"]:has-text("Next") > a',
        'button:has-text("Next")',
    ].join(", ");

    // ── Toast / alerts ────────────────────────────────────────────────────────
    static readonly TOAST = '.Toastify__toast';
    static readonly SUCCESS_TOAST = '.Toastify__toast--success';
}
