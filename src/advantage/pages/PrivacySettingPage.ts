export default class PrivacySettingPage {
    // URL routes
    static readonly PRIVACY_SETTING_PATH = "privacy-setting";
    static readonly CREATE_PATH = "privacy-setting/create";
    static readonly EDIT_PATH = "privacy-setting/edit";

    // Sidebar navigation
    static readonly PRIVACY_SETTING_SUBMENU_LINK = [
        'a[href="/privacy-setting"]',
        'a[href*="privacy-setting"]',
        'a:has-text("Privacy Setting")',
    ].join(", ");

    // Page headings
    static readonly LIST_HEADING = ':is(h1,h2,h3):has-text("Privacy Setting")';
    static readonly CREATE_HEADING = ':is(h1,h2,h3):has-text("Create Privacy Setting")';
    static readonly EDIT_HEADING = ':is(h1,h2,h3):has-text("Edit Privacy Setting")';

    // Listing Page Elements
    static readonly CREATE_BTN = [
        'button:has-text("Create Privacy Setting")',
        'a:has-text("Create Privacy Setting")',
    ].join(", ");
    static readonly TABLE = "table";
    static readonly TABLE_HEADERS = "table thead th";
    static readonly TABLE_ROWS = "table tbody tr";
    static readonly NO_RECORDS = [
        'td:has-text("No records")',
        'td:has-text("No data")',
        ':text("No records found")',
        ':text("No data found")',
    ].join(", ");

    // Row-scoped Helpers
    static rowContaining(title: string): string {
        return `table tbody tr:has(td:has-text("${title}"))`;
    }

    static activeToggleInRow(rowSelector: string): string {
        return [
            `${rowSelector} td:nth-child(6) button`,
            `${rowSelector} td:nth-child(6) input`,
            `${rowSelector} button[role="switch"]`,
            `${rowSelector} input[type="checkbox"]`,
            `${rowSelector} [class*="toggle"]`,
            `${rowSelector} [class*="switch"]`,
        ].join(", ");
    }

    static editBtnInRow(rowSelector: string): string {
        return [
            `${rowSelector} td:last-child button:has(svg.lucide-pencil)`,
            `${rowSelector} td:last-child button:nth-child(1)`,
            `${rowSelector} td:last-child button:first-child`,
            `${rowSelector} td:last-child a[href*="edit"]`,
        ].join(", ");
    }

    static deleteBtnInRow(rowSelector: string): string {
        return [
            `${rowSelector} td:last-child button:has(svg.lucide-trash)`,
            `${rowSelector} td:last-child button:last-child`,
        ].join(", ");
    }

    // Pagination
    static readonly NEXT_PAGE_BTN = [
        'button:has-text("Next")',
        'a:has-text("Next")',
        '[aria-label*="next" i]',
    ].join(", ");

    static readonly PREV_PAGE_BTN = [
        'button:has-text("Previous")',
        'a:has-text("Previous")',
        '[aria-label*="prev" i]',
    ].join(", ");

    // Create / Edit Form Elements
    static readonly APP_DROPDOWN_TRIGGER = [
        'div:has(> label:has-text("Select App")) button',
        'div:has(> label:has-text("Select App")) div[role="combobox"]',
        '[class*="select-app"]',
        'button:has-text("Select App")',
    ].join(", ");

    static readonly TYPE_DROPDOWN_TRIGGER = [
        'div:has(> label:has-text("Select Type")) button',
        'div:has(> label:has-text("Select Type")) div[role="combobox"]',
        '[class*="select-type"]',
        'button:has-text("Select Type")',
    ].join(", ");

    static readonly DROPDOWN_OPTION = (text: string) => [
        `[role="option"]:has-text("${text}")`,
        `div[class*="option"]:has-text("${text}")`,
        `li:has-text("${text}")`,
        `[role="option"] >> text="${text}"`,
    ].join(", ");

    static readonly TITLE_INPUT = [
        'input[name="title"]',
        'div:has(> label:text-is("Title *")) input',
        'div:has(> label:text-is("Title")) input',
    ].join(", ");

    static readonly BACK_BTN = [
        'button:has-text("Back")',
        'a:has-text("Back")',
    ].join(", ");

    // Sub Section selectors
    static readonly SUBSECTION_CONTAINER = 'div:has(h3,span:has-text("Sub Section")), div[class*="subsection"]';
    static readonly SUBSECTION_TITLE = [
        'input[name="subTitle"]',
        'input[name="subtitle"]',
        'div:has(> label:text-is("Sub Title *")) input',
        'div:has(> label:text-is("Sub Title")) input',
        'div:has(h3,span:has-text("Sub Section")) input[placeholder="Enter Title"]',
    ].join(", ");
    static readonly SUBSECTION_EDITOR = [
        '[contenteditable="true"]',
        '.ql-editor',
        '[class*="editor"][contenteditable]',
    ].join(", ");
    static readonly ADD_SUBSECTION_BTN = [
        'button:has-text("+")',
        'button:has(svg.lucide-plus)',
        'button[class*="plus"]',
        'svg.lucide-plus',
    ].join(", ");

    // Formatting buttons inside editor toolbar
    static readonly BOLD_BTN = 'button[class*="bold"], button:has-text("B"), button:has(svg.lucide-bold)';
    static readonly ITALIC_BTN = 'button[class*="italic"], button:has-text("I"), button:has(svg.lucide-italic)';
    static readonly H1_BTN = 'button[class*="h1"], button:has-text("H1")';
    static readonly H2_BTN = 'button[class*="h2"], button:has-text("H2")';
    static readonly H3_BTN = 'button[class*="h3"], button:has-text("H3")';
    static readonly BULLET_LIST_BTN = 'button[class*="list"][value="bullet"], button:has(svg.lucide-list)';

    // Form Action buttons
    static readonly SAVE_BTN = [
        'button:has-text("Save")',
        'button:has-text("Create")',
        'button[type="submit"]',
        'button:has-text("Update")', // Fallback if edit screen uses Save
    ].join(", ");

    static readonly UPDATE_BTN = [
        'button:has-text("Update")',
        'button:has-text("Save Changes")',
        'button[type="submit"]',
    ].join(", ");

    static readonly CANCEL_BTN = [
        'button:has-text("Cancel")',
        'a:has-text("Cancel")',
    ].join(", ");

    // Delete Popup
    static readonly DELETE_POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]';
    static readonly DELETE_YES_BTN = [
        '.swal2-confirm',
        'button:has-text("Yes, delete it!")',
        'button:has-text("Yes, Delete")',
        'button:has-text("Delete")',
    ].map(sel => `${sel}:visible`).join(", ");
    static readonly DELETE_CANCEL_BTN = [
        '.swal2-cancel',
        'button:has-text("Cancel")',
        'button:has-text("No")',
    ].map(sel => `${sel}:visible`).join(", ");

    // Toast/Alert
    static readonly TOAST = ".Toastify__toast, [data-sonner-toast]";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";

    // Validation alerts
    static readonly VALIDATION_MSG = [
        '.text-red-500',
        '[role="alert"]',
        '[class*="error"]',
        '.invalid-feedback',
    ].join(", ");
}
