export default class AdvertisementConstants {
    // ── URL segments ──────────────────────────────────────────────────────────
    static readonly PAGE_URL_SEGMENT = "advertisement";
    static readonly CREATE_URL_SEGMENT = "advertisement/create";
    static readonly VIEW_URL_SEGMENT = "advertisement/view";
    static readonly EDIT_URL_SEGMENT = "advertisement/edit";

    // ── Page titles ───────────────────────────────────────────────────────────
    static readonly PAGE_TITLE = "Advertisements";
    static readonly CREATE_TITLE = "Create Advertisement";
    static readonly VIEW_TITLE = "View Advertisement";
    static readonly EDIT_TITLE = "Edit Advertisement";

    // ── Wizard step labels ────────────────────────────────────────────────────
    static readonly STEP1_LABEL = "Basic Info & Target";
    static readonly STEP2_LABEL = "Banner Details";

    // ── Advertisement types ───────────────────────────────────────────────────
    static readonly TYPE_BANNER = "Banner";
    static readonly TYPE_SLIDER = "Slider";
    static readonly TYPE_VIDEO = "Video";

    // ── Visibility options ────────────────────────────────────────────────────
    static readonly VISIBILITY_GLOBAL = "Global";
    static readonly VISIBILITY_PARTNER = "Partner";
    static readonly VISIBILITY_MARKET = "Market";

    // ── Navigation criteria ───────────────────────────────────────────────────
    static readonly NAV_CRITERIA_URL = "Navigation URL";
    static readonly NAV_CRITERIA_SEARCH = "Search Criteria";

    // ── Navigation types ──────────────────────────────────────────────────────
    static readonly NAV_TYPE_GLOBAL = "Global";
    static readonly NAV_TYPE_PARTNER = "Partner";

    // ── Text positions ────────────────────────────────────────────────────────
    static readonly TEXT_POS_LEFT = "Left";
    static readonly TEXT_POS_RIGHT = "Right";
    static readonly TEXT_POS_CENTER = "Center";

    // ── Table columns ─────────────────────────────────────────────────────────
    static readonly EXPECTED_COLUMNS = ["TYPE", "PLACEMENT", "VISIBILITY", "ACTIVE", "ACTIONS"] as const;

    // ── Test data ─────────────────────────────────────────────────────────────
    static readonly NO_MATCH_SEARCH = "ZZNOTEXIST_ADV_9999_XQ";
    static readonly SPECIAL_CHAR_SEARCH = "!@#$%^&*";
    static readonly BANNER_CONTENT = "Automation test banner content TC_ADV";
    static readonly TEST_NAV_URL = "https://test.nipige.automation.example.com";

    // ── Timing ────────────────────────────────────────────────────────────────
    static readonly TABLE_SETTLE_MS = 800;
    static readonly WIZARD_TRANSITION_MS = 1000;
    static readonly TOAST_TIMEOUT_MS = 30000;
    static readonly UPLOAD_SETTLE_MS = 2000;
    static readonly DROPDOWN_OPEN_MS = 400;
}
