export default class FAQConstants {
    static readonly PAGE_URL_SEGMENT = "setup/faq";
    static readonly PAGE_TITLE = "FAQ Master Config";
    static readonly CREATE_URL_SEGMENT = "setup/faq/create";

    static readonly SCOPE_PARTNER = "PARTNER";
    static readonly SCOPE_CUSTOMER = "CUSTOMER";
    static readonly SCOPE_STAFF = "STAFF";

    static readonly CATEGORY_ORDER = "Order";
    static readonly CATEGORY_PAYMENT = "Payment";
    static readonly CATEGORY_RETURNS = "Returns";
    static readonly CATEGORY_DELIVERY = "Delivery";

    static readonly MEDIA_NONE = "None";
    static readonly MEDIA_VIDEO = "VIDEO";
    static readonly MEDIA_IMAGE = "IMAGE";
    static readonly MEDIA_DOCUMENT = "DOCUMENT";

    static readonly TOTAL_FAQS_LABEL = "TOTAL FAQS";
    static readonly PARTNER_FAQS_LABEL = "PARTNER FAQS";
    static readonly CUSTOMER_FAQS_LABEL = "CUSTOMER FAQS";
    static readonly WITH_MEDIA_LABEL = "WITH MEDIA";

    static readonly EXPECTED_CARDS = [
        FAQConstants.TOTAL_FAQS_LABEL,
        FAQConstants.PARTNER_FAQS_LABEL,
        FAQConstants.CUSTOMER_FAQS_LABEL,
        FAQConstants.WITH_MEDIA_LABEL,
    ];

    static readonly EXPECTED_COLUMNS = ["SCOPE", "CATEGORY", "TOPIC & DESCRIPTION", "MEDIA", "ACTIONS"];

    static readonly NO_MATCH_SEARCH = "NO_FAQ_MATCH_!@#_999999";
    static readonly SPECIAL_CHAR_SEARCH = "!@#$%^&*";
    static readonly LONG_TOPIC = "A".repeat(500);
    static readonly DEFAULT_SORT_ORDER = "10";

    static readonly TABLE_SETTLE_MS = 600;
    static readonly DROPDOWN_OPEN_MS = 400;
    static readonly PREVIEW_UPDATE_MS = 600;
}
