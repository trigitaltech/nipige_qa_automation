export default class CommissionRulePage {
    static readonly PAGE_PATH = "setup/commission";

    // Headings
    static readonly PAGE_HEADING = ':is(h1,h2,h3):has-text("Commission Rules")';
    static readonly CREATE_HEADING = ':is(h1,h2,h3,h4,div):has-text("Rule Definition")';
    static readonly EDIT_HEADING = ':is(h1,h2,h3):has-text("Edit Commission Rule")';
    static readonly VIEW_HEADING = ':is(h1,h2,h3):has-text("View Commission Rule")';

    // Stat cards
    static readonly ACTIVE_RULES_CARD = ':has-text("ACTIVE RULES")';
    static readonly AVG_COMMISSION_CARD = ':has-text("AVG COMMISSION")';
    static readonly PARTIES_COVERED_CARD = ':has-text("PARTIES COVERED")';
    static readonly MONTH_TO_DATE_CARD = ':has-text("MONTH-TO-DATE")';

    // Tabs & Filters
    static readonly TABS_CONTAINER = 'div:has(button:has-text("All Rules"))';
    static readonly SEARCH_INPUT = 'input[placeholder*="Search rule" i]';
    static readonly APPLICABLE_TO_FILTER = 'select, button:has-text("All Applicable To"), [role="combobox"]:has-text("All Applicable To")';
    static readonly DROPDOWN_OPTION = '[role="option"], [role="listbox"] li, select option';

    // Buttons
    static readonly CREATE_BTN = 'button:has-text("+ Create Commission Rule"), a:has-text("+ Create Commission Rule")';
    static readonly EXPORT_BTN = 'button:has-text("Export"), a:has-text("Export"), button[title*="Export" i], button[title*="Download" i], [aria-label*="Export" i], [aria-label*="Download" i]';
    static readonly BACK_BTN = 'button:has-text("Back"), a:has-text("Back")';
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';
    static readonly SAVE_BTN = 'button:has-text("Save")';
    static readonly UPDATE_RULE_BTN = 'button:has-text("Update Rule")';
    static readonly DELETE_BTN = 'button:has-text("Delete")';
    static readonly EDIT_RULE_BTN = 'button:has-text("Edit Rule"), a:has-text("Edit Rule")';

    // Table
    static readonly TABLE = 'table';
    static readonly TABLE_HEADERS = 'table thead th';
    static readonly TABLE_ROWS = 'table tbody tr';
    static readonly CELL_RULE_NAME = 'td:nth-child(1)';
    static readonly CELL_RULE_TYPE = 'td:nth-child(2)';
    static readonly CELL_APPLICABLE_TO = 'td:nth-child(3)';
    static readonly CELL_APPLIED_ON = 'td:nth-child(4)';
    static readonly CELL_RATE = 'td:nth-child(5)';
    static readonly CELL_ACTIONS = 'td:nth-child(6), td:last-child';
    static readonly NO_RECORDS = 'td:has-text("No records"), td:has-text("No data found"), [class*="empty-state"], :text("No results")';
    
    static rowFor(ruleName: string): string {
        return `table tbody tr:has(td:has-text("${ruleName}"))`;
    }

    // Pagination
    static readonly NEXT_BTN = 'button:has-text("Next"), a:has-text("Next"), li[data-slot="pagination-item"]:has-text("Next")';
    static readonly PREV_BTN = 'button:has-text("Previous"), a:has-text("Previous"), li[data-slot="pagination-item"]:has-text("Previous")';

    // Create / Edit Form
    static readonly RULE_NAME_INPUT = 'xpath=//div[contains(@class, "flex") or contains(@class, "grid")][.//text()[contains(., "Rule Name")]]//input[not(@type="range") and not(@type="number")] | //input[@placeholder="Rule Name"]';
    static readonly RULE_TYPE_SELECT = 'select, [role="combobox"]'; // Requires scoping in steps
    static readonly EVENT_TYPE_SELECT = 'select, [role="combobox"]';
    static readonly APPLICABLE_TO_SELECT = 'select, [role="combobox"]';
    static readonly APPLIED_ON_SELECT = 'select, [role="combobox"]';
    static readonly CHARGE_CODE_INPUT = 'xpath=//div[contains(@class, "flex") or contains(@class, "grid")][.//text()[contains(., "Charge Code")]]//input[not(@type="range") and not(@type="number")] | //input[@placeholder="Charge Code"]';
    
    static readonly COMMISSION_VALUE_INPUT = 'input[type="number"], input[type="text"]';
    static readonly COMMISSION_VALUE_SLIDER = 'input[type="range"]';

    static readonly LIVE_PREVIEW_SECTION = 'xpath=//div[child::*[contains(text(), "Live Preview")]] | //div[contains(@class, "bg-white")][.//text()[contains(., "Live Preview")]]';
    static readonly LIVE_PREVIEW_RATE = 'xpath=//*[contains(text(), "Commission rate")]/following-sibling::*';

    // Validation
    static readonly VALIDATION_MESSAGE = '[role="alert"], .text-red-500, .text-danger, [class*="error"], :text("required"), :text("invalid")';
    
    // View Page
    static readonly VIEW_CONFIG_SECTION = ':has-text("Configuration")';
    static readonly RECENT_APPLICATIONS_SECTION = ':has-text("Recent Applications")';
}
