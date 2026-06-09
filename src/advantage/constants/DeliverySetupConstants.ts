export default class DeliverySetupConstants {
    // ── URL segments ──────────────────────────────────────────────────────────
    static readonly PAGE_URL_SEGMENT = "setup/delivery";
    static readonly CREATE_URL_SEGMENT = "setup/delivery/create";

    // ── Page titles (actual h1/h2/h3 text) ───────────────────────────────────
    static readonly PAGE_TITLE = "Delivery Setup";
    static readonly CREATE_TITLE = "Create Delivery";
    static readonly EDIT_TITLE = "Edit Delivery";

    // ── Stat card labels ──────────────────────────────────────────────────────
    static readonly TOTAL_DELIVERIES_LABEL = "Total Deliveries";
    static readonly ACTIVE_LABEL = "Active";
    static readonly INACTIVE_LABEL = "Inactive";

    static readonly EXPECTED_SUMMARY_CARDS = [
        DeliverySetupConstants.TOTAL_DELIVERIES_LABEL,
    ] as const;

    // ── Table column headers ──────────────────────────────────────────────────
    static readonly EXPECTED_COLUMNS = ["Name", "Type", "Status"] as const;

    // ── Shared delivery prefix ────────────────────────────────────────────────
    static readonly SHARED_DELIVERY_PREFIX = "AUTO_DS_SHARED";
    static readonly SHARED_DELIVERY_TYPE = "Standard";

    // ── Search test data ──────────────────────────────────────────────────────
    static readonly NO_MATCH_SEARCH = "ZZNOTEXIST_DS_9999_XQ";
    static readonly SPECIAL_CHAR_SEARCH = "!@#$%^&*";

    // ── Timing ────────────────────────────────────────────────────────────────
    static readonly TABLE_SETTLE_MS = 600;
    static readonly DROPDOWN_OPEN_MS = 400;
    static readonly TOAST_TIMEOUT_MS = 10000;
}
