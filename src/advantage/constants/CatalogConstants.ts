export default class CatalogConstants {
    static readonly PAGE_URL_SEGMENT = "catalog";
    static readonly PAGE_TITLE = "Catalog";

    static readonly NO_MATCH_SEARCH = "XYZ_NON_EXISTENT_CATALOG_9999";
    static readonly SPECIAL_CHARS = "@#$%^&*()";
    static readonly LONG_NAME = "A".repeat(260);

    static readonly CATALOG_TYPES = ["Product", "Service", "Category"];
    static readonly LANGUAGES = ["English", "Bengali", "Hindi", "Telugu"];
    static readonly SUPPORTED_IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "webp"];

    static readonly TABLE_SETTLE_MS = 600;
    static readonly TREE_EXPAND_MS = 500;
    static readonly TOAST_TIMEOUT_MS = 8_000;
    static readonly NAV_TIMEOUT_MS = 15_000;
}
