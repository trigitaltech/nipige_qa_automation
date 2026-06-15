export default class AttributeConstants {
    static readonly PAGE_URL_SEGMENT = "attribute";
    static readonly PAGE_TITLE = "Attribute";
    static readonly PAGE_SUBTITLE = "Manage product attributes and specification fields";

    static readonly EXPECTED_COLUMNS = ["FIELD NAME", "TYPE", "DESCRIPTION", "ACTION"];

    static readonly TYPES = ["Object", "Array", "String", "Number", "Boolean", "Image", "Date"];
    static readonly UI_CONCERNS = ["TextBox", "Checkbox", "Select", "MultiSelect", "Object", "Radio"];
    static readonly LANGUAGES = ["English", "Bengali", "Telugu", "Hindi"];

    static readonly NO_MATCH_SEARCH = "XYZ_NON_EXISTENT_9999";
    static readonly SPECIAL_CHAR_SEARCH = "@#$%";
    static readonly LONG_STRING_SEARCH = "A".repeat(260);

    static readonly TABLE_SETTLE_MS = 500;
    static readonly DROPDOWN_OPEN_MS = 300;
}
