export default class ConcernConstants {
    static readonly PAGE_URL_SEGMENT = "setup/concern";
    static readonly CREATE_URL_SEGMENT = "setup/concern/create";

    // Page titles match actual h1 text
    static readonly PAGE_TITLE = "Concerns";
    static readonly CREATE_TITLE = "Create Concern";

    // ── Stat card labels ──────────────────────────────────────────────────────
    // These are the actual DOM text node values (visually uppercase via CSS only).
    static readonly TOTAL_CONCERNS_LABEL = "Total Concerns";
    static readonly SYSTEM_LABEL = "System";
    static readonly CUSTOM_LABEL = "Custom";
    static readonly IN_USE_LABEL = "In Use";

    static readonly EXPECTED_SUMMARY_CARDS = [
        ConcernConstants.TOTAL_CONCERNS_LABEL,
        ConcernConstants.SYSTEM_LABEL,
        ConcernConstants.CUSTOM_LABEL,
        ConcernConstants.IN_USE_LABEL,
    ] as const;

    // ── Table column headers (actual text, visually uppercase via CSS) ─────────
    static readonly EXPECTED_COLUMNS = [
        "Concern Name",
        "Type",
        "Usage",
        "Created By",
        "Created Date",
    ] as const;

    // ── Type badge values (lowercase in DOM, displayed uppercase via CSS) ──────
    static readonly TYPE_SYSTEM_BADGE = "system";
    static readonly TYPE_CUSTOM_BADGE = "custom";

    // ── Filter tab labels ─────────────────────────────────────────────────────
    static readonly FILTER_ALL = "All Types";
    static readonly FILTER_SYSTEM = "System";
    static readonly FILTER_CUSTOM = "Custom";

    // ── Default form values ───────────────────────────────────────────────────
    static readonly DEFAULT_CHANNEL = "Notification";
    static readonly DEFAULT_PRIORITY = "Normal";

    // ── Search test data ──────────────────────────────────────────────────────
    // "PROMOTIONAL" is a seeded system concern that always exists
    static readonly SEARCH_VALID_TERM = "PROMOTIONAL";
    static readonly NO_MATCH_SEARCH = "ZZNOTEXIST_999_XQ";
    static readonly SPECIAL_CHAR_SEARCH = "!@#$%^&*";

    // ── No-records message (exact text from DOM) ──────────────────────────────
    static readonly NO_RECORDS_TEXT = "No concerns found.";

    // ── Max-length test data ──────────────────────────────────────────────────
    static readonly LONG_NAME = "A".repeat(256);

    // ── Timing ────────────────────────────────────────────────────────────────
    static readonly TABLE_SETTLE_MS = 600;
    static readonly TOAST_TIMEOUT_MS = 10000;
}
