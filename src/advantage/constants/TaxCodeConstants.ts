export default class TaxCodeConstants {
    static readonly PAGE_URL_SEGMENT = "setup/taxcode";
    static readonly PAGE_TITLE = "Tax Setup";
    static readonly PAGE_SUBTITLE = "Manage tax codes and rates for all jurisdictions";

    static readonly TOTAL_CODES_LABEL = "Total Codes";
    static readonly ACTIVE_LABEL = "Active";
    static readonly COUNTRIES_LABEL = "Countries";
    static readonly EXPIRING_SOON_LABEL = "Expiring Soon";

    static readonly EXPECTED_COLUMNS = ["TAX CODE", "COUNTRY", "START DATE", "END DATE", "STATUS"];

    static readonly STATUS_ACTIVE = "Active";
    static readonly STATUS_EXPIRED = "Expired";

    static readonly TAX_LINE_TYPE_PERCENTAGE = "Percentage";
    static readonly COUNTRY_ALL = "All Countries";

    // Countries available in the Tenant Country create-form combobox
    static readonly COUNTRY_POOL = ["IND", "India", "USA", "NIGERIAN"];

    // Reduced from 800/500 — network-idle waits replace most fixed pauses
    static readonly TABLE_SETTLE_MS = 500;
    static readonly DROPDOWN_OPEN_MS = 300;
}
