export default class SkillConstants {
    static readonly PAGE_URL_SEGMENT   = "setup/skill";
    static readonly CREATE_URL_SEGMENT = "setup/skill/create";
    static readonly EDIT_URL_SEGMENT   = "setup/skill/edit";

    static readonly PAGE_TITLE   = "Skill Setup";
    static readonly CREATE_TITLE = "Create Skill";
    static readonly EDIT_TITLE   = "Edit Skill";

    // Exact column header text (CSS uppercased in browser, actual DOM is title-case)
    static readonly EXPECTED_COLUMNS = [
        "Skill Name", "Code", "Category", "Description", "Sort Order",
    ] as const;

    // All category options confirmed from DOM inspection
    static readonly CATEGORY_POOL = [
        "Electrical", "Plumbing", "Cleaning", "Painting", "Carpentry",
        "Pest Control", "Ac", "Appliance", "Beauty",
    ] as const;
    static readonly CATEGORY_OTHER = "Other";

    // Confirmed from DOM: the "No skills" row text when nothing matches
    static readonly NO_RECORDS_TEXT = "No skills found for the selected filters.";

    // Search terms
    static readonly NO_MATCH_SEARCH    = "ZZNOTEXIST_SKILL_9999_XQ";
    static readonly SPECIAL_CHAR_SEARCH = "!@#$%^&*";

    // Timing (kept same as TaxCode for consistency)
    static readonly TABLE_SETTLE_MS  = 600;
    static readonly DROPDOWN_OPEN_MS = 400;
    static readonly ICON_PREVIEW_MS  = 1200; // wait for icon URL to preview
}
