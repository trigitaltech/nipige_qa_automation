export default class PrivacySettingConstants {
    static readonly PAGE_URL_SEGMENT = "privacy-setting";
    static readonly CREATE_URL_SEGMENT = "privacy-setting/create";
    static readonly EDIT_URL_SEGMENT = "privacy-setting/edit";

    static readonly APP_CUSTOMER = "Customer";
    static readonly APP_SELLER = "Seller";
    static readonly APP_AGENT = "Agent";

    static readonly TYPE_TERMS = "Terms & Conditions";
    static readonly TYPE_POLICY = "Privacy Policy";
    static readonly TYPE_ABOUT = "About Us";

    static readonly EXPECTED_COLUMNS = ["TITLE", "TYPE", "SCOPE", "CREATED ON", "UPDATED ON", "STATUS", "ACTION"];

    static readonly TABLE_SETTLE_MS = 600;
    static readonly DROPDOWN_OPEN_MS = 500;
}
