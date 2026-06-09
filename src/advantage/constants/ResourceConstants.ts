export default class ResourceConstants {
    // ── URL segments ──────────────────────────────────────────────────────────
    static readonly PAGE_URL_SEGMENT = "setup/currency";
    static readonly ADD_URL_SEGMENT = "setup/currency/add";

    // ── Page titles ───────────────────────────────────────────────────────────
    static readonly PAGE_TITLE = "Resource Setup";
    static readonly ADD_PAGE_TITLE = "Add Resource";
    static readonly EDIT_HEADING_PREFIX = "Edit Resource";

    // ── Stat card labels (exact text from DOM) ────────────────────────────────
    static readonly TOTAL_CURRENCIES_LABEL = "TOTAL CURRENCIES";
    static readonly ACTIVE_RATES_LABEL = "ACTIVE RATES";
    static readonly PENDING_UPDATE_LABEL = "PENDING UPDATE";
    static readonly LAST_SYNC_LABEL = "LAST SYNC";

    static readonly EXPECTED_STAT_CARDS = [
        ResourceConstants.TOTAL_CURRENCIES_LABEL,
        ResourceConstants.ACTIVE_RATES_LABEL,
        ResourceConstants.PENDING_UPDATE_LABEL,
        ResourceConstants.LAST_SYNC_LABEL,
    ];

    // ── Mandatory listing-page elements ──────────────────────────────────────
    static readonly MANDATORY_ELEMENTS = [
        "Create Resource button",
        "Export button",
        "Resource grid (table)",
        "Type filter",
    ];

    // ── Table columns ─────────────────────────────────────────────────────────
    static readonly EXPECTED_COLUMNS = [
        "RESOURCE", "TYPE", "SYMBOL", "CURRENT RATE", "LAST UPDATED", "STATUS",
    ];

    // ── Type filter options ───────────────────────────────────────────────────
    static readonly TYPE_ALL = "All Types";
    static readonly TYPE_CURRENCY = "Currency";
    static readonly TYPE_NON_CURRENCY = "Non Currency";

    // ── Status labels ─────────────────────────────────────────────────────────
    static readonly STATUS_ACTIVE = "Active";
    static readonly STATUS_DRAFT = "Draft";

    // ── Shared test resource (created in beforeAll, used across tests) ────────
    static readonly SHARED_CODE = "EUR";
    static readonly SHARED_NAME = "Euro";
    static readonly SHARED_SYMBOL = "€";
    static readonly SHARED_RESOURCE_ID = "978";

    // ── Secondary temp resource for delete/create-duplicate tests ─────────────
    static readonly TEMP_CODE_DELETE = "XAF";
    static readonly TEMP_NAME_DELETE = "Central African CFA Franc";
    static readonly TEMP_SYMBOL_DELETE = "Fr";

    // ── Known base currencies already in system ───────────────────────────────
    static readonly BASE_CURRENCIES = ["AED", "AOA", "INR", "USD"];
    static readonly BASE_FOR_RATE = "USD";

    // ── Exchange rate test values ─────────────────────────────────────────────
    static readonly VALID_RATE = "1.50";
    static readonly DECIMAL_RATE = "0.0012";
    static readonly NEGATIVE_RATE = "-5";
    static readonly ZERO_RATE = "0";
    static readonly VALID_START = "2026-01-01";
    static readonly VALID_END = "2030-12-31";
    static readonly END_BEFORE_START = "2025-01-01";

    // ── Search terms ──────────────────────────────────────────────────────────
    static readonly NO_MATCH_SEARCH = "ZZZNOMATCH_!@#_999";
    static readonly SPECIAL_CHAR_SEARCH = "!@#$%^&*";

    // ── Special chars for name validation test ────────────────────────────────
    static readonly SPECIAL_CHAR_NAME = "@#$%^&*()";
    static readonly VERY_LONG_NAME = "A".repeat(300);

    // ── Timing ────────────────────────────────────────────────────────────────
    static readonly TABLE_SETTLE_MS = 600;
    static readonly DROPDOWN_OPEN_MS = 400;
    static readonly TOAST_TIMEOUT_MS = 8000;
}
