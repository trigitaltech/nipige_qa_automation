/**
 * ResourcePage — selectors for the Resource Setup listing page (/setup/currency).
 *
 * DOM observations from Nipige FreshCart admin screenshots:
 *   • URL: /setup/currency   — heading "Resource Setup"
 *   • Sidebar entry: CONFIGURATIONS > Setup > Resources  (href="/setup/currency")
 *   • Stat cards: TOTAL CURRENCIES, ACTIVE RATES, PENDING UPDATE, LAST SYNC
 *   • Export button (top-right of listing)
 *   • + Create Resource button (top-right of listing)
 *   • Search box: input[placeholder="Search code, name, symbol..."]
 *   • Type filter dropdown: "All Types" / "Currency" / "Non Currency"
 *   • Table columns: RESOURCE, TYPE, SYMBOL, CURRENT RATE, LAST UPDATED, STATUS
 *   • Row actions: View (eye), Edit (pencil), Delete (trash) — visible on hover
 *   • Pagination links
 */
export default class ResourcePage {
    // ── Direct navigation path ────────────────────────────────────────────────
    static readonly RESOURCE_PATH = "setup/currency";

    // ── Home / Sidebar elements ───────────────────────────────────────────────
    static readonly PROFILE_MENU = 'button[aria-haspopup="true"]';
    static readonly HOME_GREETING = 'h1[class*="tracking-tight"]';
    static readonly SIDEBAR_NAV = "nav.flex-1";
    static readonly SETUP_MENU_BTN = 'nav button:has-text("Setup")';
    static readonly RESOURCES_SUBMENU_LINK = [
        'a[href="/setup/currency"]',
        'nav a:has-text("Resources")[href*="currency"]',
        'nav a:has-text("Resources")',
    ].join(", ");

    // ── Page heading ──────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = ':is(h1,h2,h3):has-text("Resource Setup")';

    // ── Stat cards ────────────────────────────────────────────────────────────
    static readonly TOTAL_CURRENCIES_CARD = ':has-text("TOTAL CURRENCIES")';
    static readonly ACTIVE_RATES_CARD = ':has-text("ACTIVE RATES")';
    static readonly PENDING_UPDATE_CARD = ':has-text("PENDING UPDATE")';
    static readonly LAST_SYNC_CARD = ':has-text("LAST SYNC")';

    // ── Action buttons (top-right area) ──────────────────────────────────────
    static readonly EXPORT_BTN = [
        'button:has-text("Export")',
        'a:has-text("Export")',
    ].join(", ");
    static readonly CREATE_RESOURCE_BTN = [
        'button:has-text("Create Resource")',
        'a:has-text("Create Resource")',
    ].join(", ");

    // ── Search ────────────────────────────────────────────────────────────────
    // Scope to main content to avoid matching the sidebar nav search
    static readonly SEARCH_INPUT = [
        'main input[placeholder="Search code, name, symbol..."]',
        'main input[placeholder*="Search code" i]',
        'input[placeholder="Search code, name, symbol..."]',
        'input[placeholder*="Search code" i]',
    ].join(", ");

    // ── Type filter ───────────────────────────────────────────────────────────
    // The UI shows a native <select> styled as "All Types" dropdown
    static readonly TYPE_FILTER_BTN = [
        'select',
        'button:has-text("All Types")',
        '[role="combobox"]:has-text("All Types")',
        '[data-slot="select-trigger"]',
    ].join(", ");
    static readonly TYPE_FILTER_OPTION = ':is(' + [
        'select option',
        '[role="option"]',
        '[role="listbox"] li',
        'li[data-slot="listbox-item"]',
    ].join(", ") + ')';

    // ── Table ─────────────────────────────────────────────────────────────────
    static readonly TABLE = "table";
    static readonly TABLE_HEADERS = "table thead th";
    static readonly TABLE_ROWS = "table tbody tr";
    static readonly NO_RECORDS = [
        'td:has-text("No records")',
        'td:has-text("No data")',
        'td:has-text("No resources")',
        ':text("No records found")',
        ':text("No data found")',
        '[class*="empty-state"]',
    ].join(", ");

    // ── Row helpers ───────────────────────────────────────────────────────────
    static rowFor(code: string): string {
        return `table tbody tr:has(td:has-text("${code}"))`;
    }

    // ── Row action icons (aria-label pattern from FAQ / TaxCode) ─────────────
    static readonly ROW_VIEW_BTN = '[aria-label="View"]';
    static readonly ROW_EDIT_BTN = '[aria-label="Edit"]';
    static readonly ROW_DELETE_BTN = '[aria-label="Delete"]';

    // ── Pagination ────────────────────────────────────────────────────────────
    static readonly NEXT_PAGE_BTN = [
        'a[aria-label="Go to next page"]',
        'button[aria-label="Go to next page"]',
        'li[data-slot="pagination-item"]:has-text("Next") > a',
        'button:has-text("Next")',
    ].join(", ");

    // ── Toast ─────────────────────────────────────────────────────────────────
    static readonly TOAST = ".Toastify__toast";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";
}
