/**
 * ResourceDetailsPage — selectors for /setup/currency/{id}/view.
 *
 * DOM observations from Nipige FreshCart admin screenshots:
 *   • URL pattern: /setup/currency/{mongoId}/view
 *   • Heading: resource name (e.g. "Angolan kwanza") with resource code avatar (e.g. AOA)
 *   • Resource Details section: RESOURCE CODE, RESOURCE NAME, SYMBOL, TYPE, CURRENT RATE, LAST UPDATED
 *   • Exchange Rate History table: BASE, RATE, TREND, EFFECTIVE START, EFFECTIVE END, STATUS
 *   • 30-Day Trend chart panel (right column)
 *   • Usage panel: Rates on file, Active periods, Base currencies
 *   • Back button + Edit button in top-right area
 */
export default class ResourceDetailsPage {
    // ── URL pattern ───────────────────────────────────────────────────────────
    static readonly URL_PATTERN = /setup\/currency\/.+\/view/;

    // ── Navigation buttons ────────────────────────────────────────────────────
    static readonly BACK_BTN = 'button:has-text("Back"), a:has-text("Back"), a:has-text("← Back")';
    static readonly EDIT_BTN = 'button:has-text("Edit"), a:has-text("Edit")';

    // ── Resource Details section ──────────────────────────────────────────────
    static readonly RESOURCE_DETAILS_SECTION = ':has-text("Resource Details")';

    // Individual field labels (used to confirm section rendered)
    static readonly RESOURCE_CODE_LABEL = ':has-text("RESOURCE CODE")';
    static readonly RESOURCE_NAME_LABEL = ':has-text("RESOURCE NAME")';
    static readonly SYMBOL_LABEL = ':has-text("SYMBOL")';
    static readonly TYPE_LABEL = ':has-text("TYPE")';
    static readonly CURRENT_RATE_LABEL = ':has-text("CURRENT RATE")';
    static readonly LAST_UPDATED_LABEL = ':has-text("LAST UPDATED")';

    // ── Exchange Rate History section ─────────────────────────────────────────
    static readonly EXCHANGE_RATE_SECTION = ':has-text("Exchange Rate History")';
    static readonly RATE_TABLE_ROWS = 'table tbody tr';

    // ── 30-Day Trend chart ────────────────────────────────────────────────────
    static readonly TREND_CHART = ':has-text("30-Day Trend")';

    // ── Usage panel ───────────────────────────────────────────────────────────
    static readonly USAGE_PANEL = ':has-text("Usage")';
    static readonly RATES_ON_FILE = ':has-text("Rates on file")';
    static readonly ACTIVE_PERIODS = ':has-text("Active periods")';
    static readonly BASE_CURRENCIES = ':has-text("Base currencies")';
}
