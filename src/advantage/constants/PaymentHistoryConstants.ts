export default class PaymentHistoryConstants {
    // ── URL segment ───────────────────────────────────────────────────────────
    static readonly PAGE_URL_SEGMENT = "payment-history";

    // ── Page copy ─────────────────────────────────────────────────────────────
    static readonly PAGE_TITLE = "Payment History";
    static readonly PAGE_SUBTITLE = "Review checkout transactions across providers, time ranges, and payment states.";

    // ── Time Period options ───────────────────────────────────────────────────
    static readonly TIME_LAST_7_DAYS = "Last 7 days";
    static readonly TIME_LAST_15_DAYS = "Last 15 days";
    static readonly TIME_LAST_30_DAYS = "Last 30 days";
    static readonly TIME_LAST_3_MONTHS = "Last 3 Months";
    static readonly TIME_LAST_6_MONTHS = "Last 6 Months";

    static readonly TIME_PERIOD_OPTIONS = [
        "Last 7 days",
        "Last 15 days",
        "Last 30 days",
        "Last 3 Months",
        "Last 6 Months",
    ];

    // ── Provider options ──────────────────────────────────────────────────────
    static readonly PROVIDER_ALL = "All Providers";
    static readonly PROVIDER_BRANCH_OFFICE = "Branch Office";
    static readonly PROVIDER_FRESH_MARKET = "Fresh Market";
    static readonly PROVIDER_FRESH_TOWN_MARKET = "Fresh Town Market";
    static readonly PROVIDER_GREEN_MARKET = "Green Market";

    static readonly PROVIDER_OPTIONS = [
        "All Providers",
        "Branch Office",
        "Fresh Market",
        "Fresh Town Market",
        "Green Market",
    ];

    // ── Payment Status options ────────────────────────────────────────────────
    static readonly STATUS_PENDING = "PENDING";
    static readonly STATUS_REFUNDED = "REFUNDED";
    static readonly STATUS_PAID = "PAID";
    static readonly STATUS_CANCELLED = "CANCELLED";
    static readonly STATUS_FAILED = "FAILED";

    static readonly STATUS_OPTIONS = ["PENDING", "REFUNDED", "PAID", "CANCELLED", "FAILED"];

    // ── Table column headers ──────────────────────────────────────────────────
    static readonly COL_TRANSACTION_ID = "TRANSACTION ID";
    static readonly COL_CUSTOMER = "CUSTOMER";
    static readonly COL_PAYMENT_TYPE = "PAYMENT TYPE";
    static readonly COL_AMOUNT = "Amount";
    static readonly COL_PAYMENT_STATUS = "PAYMENT STATUS";
    static readonly COL_DATE = "Date";

    // ── KPI card labels ───────────────────────────────────────────────────────
    static readonly KPI_VISIBLE_TRANSACTIONS = "Visible Transactions";
    static readonly KPI_VISIBLE_AMOUNT = "Visible Amount";
    static readonly KPI_PAID_TRANSACTIONS = "Paid Transactions";

    // ── Search ────────────────────────────────────────────────────────────────
    static readonly VALID_TXN_ID_PREFIX = "ORD-";
    static readonly INVALID_TXN_ID = "INVALID-TXN-XYZ999999";
    static readonly SPECIAL_CHARS = "!@#$%^&*()";
    static readonly BLANK_SEARCH = "   ";
    static readonly LONG_INPUT_LENGTH = 500;

    // ── Timing ────────────────────────────────────────────────────────────────
    static readonly SETTLE_MS = 800;
    static readonly TOAST_TIMEOUT_MS = 8000;
    static readonly DROPDOWN_OPEN_MS = 400;
    static readonly SEARCH_DEBOUNCE_MS = 600;
}
