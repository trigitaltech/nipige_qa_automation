/**
 * BusinessPlanPage — selectors for /businessPlan (listing, create, details, edit).
 *
 * The listing page is CARD-based (not a table). The create/edit form has two
 * sub-sections: "Add Subscription" and "Add Feature", each with their own
 * dropdown + table. The details page shows read-only plan info with two tables.
 */
export default class BusinessPlanPage {
    // ── Direct navigation paths ───────────────────────────────────────────────
    static readonly BP_PATH = "businessPlan";
    static readonly BP_CREATE_PATH = "businessPlan/create-business-plan";

    // ── Sidebar navigation ────────────────────────────────────────────────────
    static readonly PRICING_MENU_BTN = [
        'nav button:has-text("Pricing")',
        'nav a:has-text("Business Plan")',
    ].join(", ");

    static readonly BP_SUBMENU_LINK = [
        'a[href="/businessPlan"]',
        'a[href*="businessPlan"]',
        'a:has-text("Business Plan")',
    ].join(", ");

    // ── Page headings ─────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = [
        ':is(h1,h2,h3):has-text("Business Plan")',
    ].join(", ");

    static readonly CREATE_HEADING = [
        ':is(h1,h2,h3):has-text("Add Business Plan")',
        ':is(h1,h2,h3):has-text("Create Business Plan")',
    ].join(", ");

    static readonly DETAILS_HEADING = [
        ':is(h1,h2,h3):has-text("Business Plan Details")',
    ].join(", ");

    static readonly EDIT_HEADING = [
        ':is(h1,h2,h3):has-text("Edit Business Plan")',
    ].join(", ");

    // ── Listing page actions ──────────────────────────────────────────────────
    static readonly CREATE_BTN = [
        'button:has-text("Create Business Plan")',
        'a:has-text("Create Business Plan")',
    ].join(", ");

    static readonly REFRESH_BTN = [
        'button[aria-label*="Refresh" i]',
        'button[aria-label*="Reload" i]',
        'button:has(svg[class*="refresh"])',
        'button:has(svg[class*="rotate"])',
        'button.p-2:not(:has-text("Create"))',
    ].join(", ");

    // ── Plan cards (listing) ──────────────────────────────────────────────────
    static readonly PLAN_CARDS = [
        '[class*="card"]',
        'div[class*="rounded"][class*="shadow"]',
        'div[class*="plan"]',
    ].join(", ");

    static readonly VIEW_MORE_BTN = 'button:has-text("View More")';

    static cardContaining(planName: string): string {
        return [
            `div:has(h2:has-text("${planName}"))`,
            `div:has(h3:has-text("${planName}"))`,
            `[class*="card"]:has-text("${planName}")`,
        ].join(", ");
    }

    static viewMoreInCard(cardSelector: string): string {
        return `${cardSelector} button:has-text("View More")`;
    }

    // ── Pagination ────────────────────────────────────────────────────────────
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

    static pageNumBtn(num: number): string {
        return [
            `button:text-is("${num}")`,
            `a:text-is("${num}")`,
            `[aria-label="${num}"]`,
        ].join(", ");
    }

    // ── No data ───────────────────────────────────────────────────────────────
    static readonly NO_RECORDS = [
        ':text("No data available")',
        ':text("No Business Plans")',
        ':text("No plans found")',
        ':text("No records")',
        ':text("No data found")',
    ].join(", ");

    // ── Create / Edit form fields ─────────────────────────────────────────────
    static readonly PLAN_NAME_INPUT = [
        'input[placeholder*="Business Plan Name" i]',
        'input[name*="planName" i]',
        'input[name="name"]',
    ].join(", ");

    static readonly DESCRIPTION_TEXTAREA = [
        'textarea[placeholder*="Description" i]',
        'textarea[name*="description" i]',
        'textarea',
    ].join(", ");

    // File upload for logo
    static readonly LOGO_FILE_INPUT = 'input[type="file"]';
    static readonly LOGO_PREVIEW = [
        'img[alt*="logo" i]',
        ':text("Logo uploaded")',
        'div:has(img[src*="blob"])',
    ].join(", ");

    // heading used inside "Add Subscription" and "Add Feature" sub-sections.
    // Intentionally excludes 'div' to keep the section scope tight.
    private static readonly ANY_HEADING = ':is(h1,h2,h3,h4,h5,p,span,label)';

    // ── Add Subscription sub-section ──────────────────────────────────────────
    static readonly SUB_SECTION = `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Subscription"))`;

    static readonly SELECT_SUBSCRIPTION = [
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Subscription")) [placeholder*="Select Subscription" i]`,
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Subscription")) [class*="select__input"]`,
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Subscription")) [role="combobox"]`,
    ].join(", ");

    // Subscription section controls — use .first() in steps/tests (subscription is always first)
    static readonly SELECT_SUBSCRIPTION_CONTROL = '[class*="select__control"]';

    static readonly ADD_SUBSCRIPTION_BTN = 'button:has-text("Add")';

    static readonly RELOAD_SUBSCRIPTION_BTN = 'button:has-text("Reload")';

    static readonly SUBSCRIPTION_TABLE_ROWS = [
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Subscription")) table tbody tr`,
    ].join(", ");

    static readonly SUBSCRIPTION_NO_DATA = [
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Subscription")) :text("No data available")`,
    ].join(", ");

    // ── Add Feature sub-section ───────────────────────────────────────────────
    static readonly FEAT_SECTION = `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Feature"))`;

    static readonly SELECT_FEATURE = [
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Feature")) [placeholder*="Select Feature" i]`,
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Feature")) [class*="select__input"]`,
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Feature")) [role="combobox"]`,
    ].join(", ");

    // Feature section controls — use .nth(1) in steps/tests (feature is always second)
    static readonly SELECT_FEATURE_CONTROL = '[class*="select__control"]';

    static readonly ADD_FEATURE_BTN = 'button:has-text("Add")';

    static readonly RELOAD_FEATURE_BTN = 'button:has-text("Reload")';

    static readonly FEATURE_TABLE_ROWS = [
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Feature")) table tbody tr`,
    ].join(", ");

    static readonly FEATURE_NO_DATA = [
        `div:has(${BusinessPlanPage.ANY_HEADING}:has-text("Add Feature")) :text("No data available")`,
    ].join(", ");

    // ── Dropdown options (shared between subscription / feature) ──────────────
    static readonly DROPDOWN_OPTION = (text: string) => [
        `[role="option"]:has-text("${text}")`,
        `.select__option:has-text("${text}")`,
        `li:has-text("${text}")`,
        `div[class*="option"]:has-text("${text}")`,
    ].join(", ");

    // Remove button inside a table row
    static removeInRow(rowSel: string): string {
        return [
            `${rowSel} button:has-text("Remove")`,
            `${rowSel} span:has-text("Remove")`,
            `${rowSel} [class*="remove"]`,
            `${rowSel} [class*="text-red"]:has-text("Remove")`,
        ].join(", ");
    }

    // ── Create / Edit action buttons ──────────────────────────────────────────
    static readonly SAVE_BTN = [
        'button:has-text("Save")',
        'button:has-text("Create")',
        'button[type="submit"]',
    ].join(", ");

    static readonly UPDATE_BTN = [
        'button:has-text("Update")',
        'button:has-text("Save")',
        'button[type="submit"]',
    ].join(", ");

    static readonly CANCEL_BTN = 'button:has-text("Cancel")';
    static readonly BACK_BTN = 'button:has-text("Back"), a:has-text("Back")';

    // ── Details page action buttons ───────────────────────────────────────────
    static readonly EDIT_BP_BTN = [
        'button:has-text("Edit Business Plan")',
        'a:has-text("Edit Business Plan")',
    ].join(", ");

    static readonly DELETE_BTN = 'button:has-text("Delete")';

    // ── Details page — Added Subscription/Feature tables ─────────────────────
    static readonly ADDED_SUB_TABLE_ROWS = [
        'div:has(h2:has-text("Added Subscription")) table tbody tr',
        'div:has(h3:has-text("Added Subscription")) table tbody tr',
        'section:has(:text("Added Subscription")) table tbody tr',
    ].join(", ");

    static readonly ADDED_FEAT_TABLE_ROWS = [
        'div:has(h2:has-text("Added Feature")) table tbody tr',
        'div:has(h3:has-text("Added Feature")) table tbody tr',
        'section:has(:text("Added Feature")) table tbody tr',
    ].join(", ");

    // ── Validation messages ───────────────────────────────────────────────────
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

    // ── Toast notifications ───────────────────────────────────────────────────
    static readonly TOAST = ".Toastify__toast, [data-sonner-toast]";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";

    // ── Delete confirmation popup ─────────────────────────────────────────────
    static readonly DELETE_POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]';
    static readonly DELETE_CONFIRM_BTN = [
        'button:has-text("Delete"):visible',
        '.swal2-confirm:visible',
        'button:has-text("Yes"):visible',
    ].join(", ");

    static readonly DELETE_CANCEL_BTN = [
        'button:has-text("Cancel"):visible',
        '.swal2-cancel:visible',
    ].join(", ");
}
