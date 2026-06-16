/**
 * CouponPage — selectors for /setup/Coupon (list, create, edit, view).
 */
export default class CouponPage {
    // Nav route
    static readonly COUPON_PATH = "setup/Coupon";

    // Sidebar selectors
    static readonly SETUP_MENU_BTN = 'nav button:has-text("Setup")';
    static readonly COUPON_SUBMENU_LINK = [
        'a[href="/setup/Coupon"]',
        'a[href*="Coupon"]',
        'a:has-text("Coupon & Promotion")',
    ].join(", ");

    // Page headings
    static readonly PAGE_HEADING = ':is(h1,h2,h3):has-text("Coupons & Promotions")';
    static readonly CREATE_HEADING = ':is(h1,h2,h3,span,p):has-text("Create Coupon")';
    static readonly VIEW_HEADING = ':is(h1,h2,h3,span,p):has-text("Coupon Details")';
    static readonly EDIT_HEADING = ':is(h1,h2,h3,span,p):has-text("Edit Coupon"), :is(h1,h2,h3,span,p):has-text("Coupon Details"), :is(h1,h2,h3,span,p):has-text("Update Coupon")';

    // Stat cards
    static readonly STAT_CARDS = '[class*="card"], div[class*="shadow"]';
    static readonly STAT_CARD_BY_LABEL = (label: string) => `div:has(> span:has-text("${label}")), div:has(> p:has-text("${label}")), div:has-text("${label}")`;

    // Filters & search
    static readonly SEARCH_INPUT = 'input[placeholder*="Search coupon code..."]';
    static readonly STATUS_FILTER_TRIGGER = 'input[placeholder="All Status"]';
    static readonly PERIOD_FILTER_TRIGGER = 'input[placeholder="All Periods"]';

    static readonly DROPDOWN_OPTION = (text: string) => [
        `[role="option"]:has-text("${text}")`,
        `li:has-text("${text}")`,
        `[class*="option"]:has-text("${text}")`,
        `div[class*="select-dropdown"] div:has-text("${text}")`,
    ].join(", ");

    static readonly CLEAR_BTN = 'button:has-text("Clear")';
    static readonly CREATE_BTN = 'button:has-text("Create Coupon"), a:has-text("Create Coupon"), button:has-text("+ Create Coupon")';

    // Grid table
    static readonly TABLE = 'table';
    static readonly TABLE_HEADERS = 'table thead th';
    static readonly TABLE_ROWS = 'table tbody tr';
    static readonly NO_RECORDS = [
        'td:has-text("No records")',
        'td:has-text("No data")',
        ':text("No records found")',
        ':text("No data found")',
        ':text("No Coupons")',
    ].join(", ");

    // Row helpers
    static rowContaining(code: string): string {
        return `table tbody tr:has(td:has-text("${code}"))`;
    }

    static viewBtnInRow(rowSelector: string): string {
        return [
            `${rowSelector} td:last-child button[title*="View" i]`,
            `${rowSelector} td:last-child button[aria-label*="View" i]`,
            `${rowSelector} td:last-child button:has(svg.lucide-eye)`,
            `${rowSelector} td:last-child a[href*="view"]`,
            `${rowSelector} td:last-child button:first-child`,
        ].join(", ");
    }

    static editBtnInRow(rowSelector: string): string {
        return [
            `${rowSelector} td:last-child button[title*="Edit" i]`,
            `${rowSelector} td:last-child button[aria-label*="Edit" i]`,
            `${rowSelector} td:last-child button:has(svg.lucide-pencil)`,
            `${rowSelector} td:last-child a[href*="edit"]`,
            `${rowSelector} td:last-child button:nth-child(2)`,
        ].join(", ");
    }

    static deleteBtnInRow(rowSelector: string): string {
        return [
            `${rowSelector} td:last-child button[title*="Delete" i]`,
            `${rowSelector} td:last-child button[aria-label*="Delete" i]`,
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

    // Create / Edit coupon fields
    static readonly COUPON_CODE_INPUT = 'input[placeholder*="SAVE20"], input[placeholder*="FIRST50"], input[name="code"]';
    static readonly APPLICABLE_ON_TRIGGER = 'div:has(> label:has-text("APPLICABLE ON")) button, div:has(> label:has-text("APPLICABLE ON")) div[role="combobox"], div:has(> span:has-text("APPLICABLE ON")) button';
    static readonly TITLE_INPUT = 'input[placeholder="Coupon title"], input[name="title"]';
    static readonly DESCRIPTION_INPUT = 'input[placeholder="Short description"], input[name="description"]';
    
    // Dates
    // Dates
    static readonly START_DATE_INPUT = 'input[type="date"] >> nth=0';
    static readonly END_DATE_INPUT = 'input[type="date"] >> nth=1';

    // Values & Limits
    static readonly DISCOUNT_TYPE_TRIGGER = 'div:has(> label:has-text("DISCOUNT TYPE")) button, div:has(> label:has-text("DISCOUNT TYPE")) div[role="combobox"]';
    static readonly REWARD_TYPE_TRIGGER = 'div:has(> label:has-text("REWARD TYPE")) button, div:has(> label:has-text("REWARD TYPE")) div[role="combobox"]';
    
    static readonly REWARD_VALUE_INPUT = 'input[placeholder="e.g. 50, 10"], input[type="number"] >> nth=0';
    static readonly MAX_REWARD_VALUE_INPUT = 'input[placeholder="Maximum discount cap"], input[type="number"] >> nth=1';
    static readonly MIN_AMOUNT_INPUT = 'input[placeholder="Minimum cart value"], input[type="number"] >> nth=2';
    static readonly FREQUENCY_INPUT = 'input[placeholder*="1440"], input[type="number"] >> nth=3';
    
    static readonly TOTAL_ALLOWED_INPUT = 'input[type="number"] >> nth=4';
    static readonly MAX_EXISTING_ORDERS_INPUT = 'input[type="number"] >> nth=5';
    static readonly MIN_EXISTING_ORDERS_INPUT = 'input[type="number"] >> nth=6';
    static readonly MAX_QUANTITY_INPUT = 'input[type="number"] >> nth=7';
    static readonly MIN_QUANTITY_INPUT = 'input[type="number"] >> nth=8';

    // Settings & Options Toggles
    static readonly LOCATION_RULE_TOGGLE = 'div:has(> span:has-text("Location Rule")) button, button[aria-label*="Location"]';
    static readonly MULTI_DISCOUNT_TOGGLE = 'div:has(> span:has-text("Allow MultiDiscount")) button, button[aria-label*="MultiDiscount"]';
    static readonly PROMOTE_TOGGLE = 'div:has(> span:has-text("Promote")) button, button[aria-label*="Promote"]';
    static readonly AUTO_APPLY_TOGGLE = 'div:has(> span:has-text("Auto Apply")) button, button[aria-label*="Auto Apply"]';

    // Terms & Conditions
    static readonly TERMS_TEXTAREA = 'textarea[placeholder*="terms"], textarea[placeholder*="Terms"], textarea';

    // Save/Cancel/Back actions
    static readonly SAVE_COUPON_BTN = 'button:has-text("Save Coupon"), button:has-text("Save")';
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';
    static readonly BACK_BTN = 'button:has-text("Back"), a:has-text("Back")';

    static readonly VALIDATION_MSG = [
        '[role="alert"]',
        '.text-red-500',
        '.text-red-600',
        '[class*="error"]',
        '[class*="invalid"]',
        ':text("required")',
        ':text("is required")',
        ':text("invalid")',
    ].join(", ");

    static readonly TOAST = ".Toastify__toast, [data-sonner-toast]";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";

    // Delete Popup Confirmation
    static readonly DELETE_POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]';
    static readonly DELETE_YES_BTN = 'button:has-text("Yes, delete it!"), button:has-text("Yes, Delete"), .swal2-confirm';
    static readonly DELETE_CANCEL_BTN = '.swal2-cancel';
}
