/**
 * ReturnCancellationPolicyPage — selectors for /setup/policy (5-tab settings page).
 * Tabs: Cancellation | Return | Replacement | Refund | Market Policies
 */
export default class ReturnCancellationPolicyPage {
    // ── Direct navigation path ────────────────────────────────────────────────
    static readonly POLICY_PATH = "setup/policy";

    // ── Sidebar navigation ────────────────────────────────────────────────────
    static readonly SETUP_MENU_BTN = 'nav button:has-text("Setup")';
    static readonly POLICY_SUBMENU_LINK = [
        'a[href*="setup/policy"]',
        'a[href="/setup/policy"]',
        'a:has-text("Return & Cancellation")',
        'a:has-text("Return & Cancellation Policy")',
        'a:has-text("Policy")',
    ].join(", ");
    static readonly PROFILE_MENU = 'button[aria-haspopup="true"]';
    static readonly SIDEBAR_NAV = 'nav.flex-1';
    static readonly HOME_GREETING = 'h1[class*="tracking-tight"]';

    // ── Page heading ──────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = [
        ':is(h1,h2,h3):has-text("Return, Cancellation")',
        ':is(h1,h2,h3):has-text("Return & Cancellation")',
        ':is(h1,h2,h3):has-text("Market Policies")',
        ':is(h1,h2,h3):has-text("Policy")',
    ].join(", ");

    // ── Tab label strings (used in clickTab filter) ───────────────────────────
    // Tabs are plain <button> elements — no role="tab". We locate them in
    // clickTab() using .filter({ hasText: /^label$/ }) so that "Cancellation"
    // matches the tab but NOT the sidebar's "Return & Cancellation..." button.
    static readonly TAB_CANCELLATION = "Cancellation";
    static readonly TAB_RETURN = "Return";
    static readonly TAB_REPLACEMENT = "Replacement";
    static readonly TAB_REFUND = "Refund";
    static readonly TAB_MARKET_POLICIES = "Market Policies";

    // ── Shared: Enabled toggle (top-right of every tab) ───────────────────────
    static readonly ENABLED_TOGGLE = [
        'label:has-text("Enabled") + button[role="switch"]',
        'label:has-text("Enabled") ~ button[role="switch"]',
        'div:has(> span:has-text("Enabled")) button[role="switch"]',
        'div:has(> label:has-text("Enabled")) input[type="checkbox"]',
        'span:has-text("Enabled") ~ button[role="switch"]',
        'p:has-text("Enabled") ~ button[role="switch"]',
        'div.flex.justify-end button[role="switch"]',
        'div.items-center.justify-end button[role="switch"]',
    ].join(", ");

    // ── Shared: Save button (tab-level, not modal) ────────────────────────────
    // Use :text-is for exact match so "Save Market" modal button is not matched.
    static readonly SAVE_BTN = [
        'button:text-is("Save")',
        'button[type="submit"]:text-is("Save")',
        'button[type="submit"]',
        'button.bg-primary',
    ].join(", ");

    // ── Shared: Toast ─────────────────────────────────────────────────────────
    static readonly TOAST = ".Toastify__toast";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";

    // ── Shared: Validation messages ───────────────────────────────────────────
    static readonly VALIDATION_MSG = [
        '[role="alert"]',
        ".text-red-500",
        ".text-red-600",
        "[class*='error']",
        "[class*='invalid']",
    ].join(", ");

    // ── CANCELLATION TAB ──────────────────────────────────────────────────────

    static readonly CANCEL_WINDOW_MINUTES = [
        'input[type="number"][aria-label*="window" i]',
        'label:has-text("Window Minutes") + input',
        'label:has-text("Window Minutes") ~ input',
        'div:has(> label:has-text("Window Minutes")) input[type="number"]',
        'div:has(> p:has-text("Window Minutes")) input[type="number"]',
        'input[type="number"]:first-of-type',
    ].join(", ");

    // Scoped to the section containing the "Allowed Before Statuses" label.
    // Deliberately excludes bare input[placeholder*="Search"] — that matches the sidebar.
    static readonly CANCEL_ALLOWED_BEFORE_STATUSES = [
        'div:has(label:has-text("Allowed Before Statuses")) [role="combobox"]',
        'div:has(p:has-text("Allowed Before Statuses")) [role="combobox"]',
        'div:has(span:has-text("Allowed Before Statuses")) [role="combobox"]',
        'label:has-text("Allowed Before Statuses") ~ div [role="combobox"]',
    ].join(", ");

    static readonly CANCEL_FREE_BEFORE_STATUS = [
        'label:has-text("Free Cancellation Before Status") ~ select',
        'div:has(label:has-text("Free Cancellation Before Status")) select',
        'select:first-of-type',
        '[role="combobox"][aria-label*="cancellation" i]',
    ].join(", ");

    static readonly CANCEL_COD_ALLOWED_TOGGLE = [
        'label:has-text("COD Allowed") + button[role="switch"]',
        'label:has-text("COD Allowed") ~ button[role="switch"]',
        'div:has(label:has-text("COD Allowed")) button[role="switch"]',
        'span:has-text("COD Allowed") ~ button[role="switch"]',
        'p:has-text("COD Allowed") ~ button[role="switch"]',
    ].join(", ");

    static readonly CANCEL_AUTO_APPROVE_TOGGLE = [
        'label:has-text("Auto Approve") + button[role="switch"]',
        'div:has(label:has-text("Auto Approve")) button[role="switch"]',
        'span:has-text("Auto Approve") ~ button[role="switch"]',
        'p:has-text("Auto Approve") ~ button[role="switch"]',
    ].join(", ");

    static readonly CANCEL_AUTO_REFUND_TOGGLE = [
        'label:has-text("Auto Refund On Approval") ~ button[role="switch"]',
        'div:has(label:has-text("Auto Refund On Approval")) button[role="switch"]',
        'span:has-text("Auto Refund On Approval") ~ button[role="switch"]',
        'p:has-text("Auto Refund On Approval") ~ button[role="switch"]',
    ].join(", ");

    static readonly CANCEL_FEE_TYPE_FLAT = [
        'input[type="radio"][value="FLAT"]',
        'label:has-text("FLAT") input[type="radio"]',
        'input[type="radio"]:nth-of-type(1)',
    ].join(", ");

    static readonly CANCEL_FEE_TYPE_PERCENTAGE = [
        'input[type="radio"][value="PERCENTAGE"]',
        'label:has-text("PERCENTAGE") input[type="radio"]',
        'input[type="radio"]:nth-of-type(2)',
    ].join(", ");

    static readonly CANCEL_FEE_INPUT = [
        'label:has-text("Cancellation Fee") ~ input',
        'div:has(label:has-text("Cancellation Fee")) input[type="number"]',
        'div:has(p:has-text("Cancellation Fee")) input',
    ].join(", ");

    static readonly CANCEL_REASONS_INPUT = [
        'input[placeholder*="reason" i]',
        'input[placeholder*="Add reason" i]',
        'div:has(label:has-text("Reasons")) input',
        'div:has(p:has-text("Reasons")) input',
    ].join(", ");

    static readonly CANCEL_REASON_TAGS = [
        '[class*="tag"]',
        '[class*="chip"]',
        '[class*="badge"]:has-text("CHANGED_MIND"), [class*="badge"]:has-text("FOUND_CHEAPER")',
        'span.inline-flex:has-text("CHANGED_MIND")',
    ].join(", ");

    // ── RETURN TAB ────────────────────────────────────────────────────────────

    static readonly RETURN_WINDOW_DAYS = [
        'label:has-text("Window Days") ~ input[type="number"]',
        'div:has(label:has-text("Window Days")) input[type="number"]',
        'div:has(p:has-text("Window Days")) input[type="number"]',
    ].join(", ");

    static readonly RETURN_ITEM_TYPES_INPUT = [
        'input[placeholder*="item types" i]',
        'input[placeholder*="returnable" i]',
        'div:has(label:has-text("Returnable Item Types")) input',
        'div:has(p:has-text("Returnable Item Types")) input',
    ].join(", ");

    static readonly RETURN_NON_RETURNABLE_SELECT = [
        'div:has(label:has-text("Non Returnable")) [role="combobox"]',
        'div:has(p:has-text("Non Returnable")) select',
        'label:has-text("Non Returnable Item Types") ~ select',
    ].join(", ");

    static readonly RETURN_SHIPPING_PAID_BY = [
        'label:has-text("Shipping Paid By") ~ select',
        'div:has(label:has-text("Shipping Paid By")) select',
        'div:has(p:has-text("Shipping Paid By")) select',
    ].join(", ");

    static readonly RETURN_AUTO_APPROVE_BELOW = [
        'label:has-text("Auto Approve Below") ~ input',
        'div:has(label:has-text("Auto Approve Below")) input[type="number"]',
        'div:has(p:has-text("Auto Approve Below")) input',
    ].join(", ");

    static readonly RETURN_REQUIRE_IMAGES_TOGGLE = [
        'label:has-text("Require Images") ~ button[role="switch"]',
        'div:has(label:has-text("Require Images")) button[role="switch"]',
        'span:has-text("Require Images") ~ button[role="switch"]',
        'p:has-text("Require Images") ~ button[role="switch"]',
    ].join(", ");

    static readonly RETURN_MIN_IMAGES = [
        'label:has-text("Min Images") ~ input',
        'div:has(label:has-text("Min Images")) input[type="number"]',
        'div:has(p:has-text("Min Images")) input',
    ].join(", ");

    static readonly RETURN_RESTOCKING_FEE_TYPE_FLAT = [
        'div:has(label:has-text("Restocking Fee Type")) input[value="FLAT"]',
        'div:has(p:has-text("Restocking Fee Type")) input[type="radio"]:first-of-type',
        'label:has-text("Restocking Fee Type") ~ div input[value="FLAT"]',
    ].join(", ");

    static readonly RETURN_RESTOCKING_FEE = [
        'label:has-text("Restocking Fee") ~ input',
        'div:has(label:has-text("Restocking Fee")) input[type="number"]',
        'div:has(p:has-text("Restocking Fee")) input',
    ].join(", ");

    static readonly RETURN_QUALITY_CHECK_TOGGLE = [
        'label:has-text("Quality Check Required") ~ button[role="switch"]',
        'div:has(label:has-text("Quality Check Required")) button[role="switch"]',
        'span:has-text("Quality Check Required") ~ button[role="switch"]',
        'p:has-text("Quality Check Required") ~ button[role="switch"]',
    ].join(", ");

    static readonly RETURN_AUTO_APPROVE_TOGGLE = [
        'label:has-text("Auto Approve"):not(:has-text("Below")) ~ button[role="switch"]',
        'div:has(label:has-text("Auto Approve")):not(:has(label:has-text("Below"))) button[role="switch"]',
        'p:has-text("Auto Approve"):not(:has-text("Below")) ~ button[role="switch"]',
    ].join(", ");

    static readonly RETURN_REASONS_INPUT = [
        'input[placeholder*="reason" i]',
        'input[placeholder*="Add reason" i]',
        'div:has(label:has-text("Reasons")) input',
    ].join(", ");

    // ── REPLACEMENT TAB ───────────────────────────────────────────────────────

    static readonly REPLACEMENT_WINDOW_DAYS = [
        'label:has-text("Window Days") ~ input[type="number"]',
        'div:has(label:has-text("Window Days")) input[type="number"]',
        'div:has(p:has-text("Window Days")) input[type="number"]',
    ].join(", ");

    static readonly REPLACEMENT_SHIPPING_PAID_BY = [
        'label:has-text("Shipping Paid By") ~ select',
        'div:has(label:has-text("Shipping Paid By")) select',
    ].join(", ");

    static readonly REPLACEMENT_MAX_PER_ORDER = [
        'label:has-text("Max Per Order") ~ input',
        'div:has(label:has-text("Max Per Order")) input[type="number"]',
        'div:has(p:has-text("Max Per Order")) input',
    ].join(", ");

    static readonly REPLACEMENT_REQUIRE_ORIGINAL_TOGGLE = [
        'label:has-text("Require Original Return") ~ button[role="switch"]',
        'div:has(label:has-text("Require Original Return")) button[role="switch"]',
        'p:has-text("Require Original Return") ~ button[role="switch"]',
    ].join(", ");

    static readonly REPLACEMENT_REQUIRE_IMAGES_TOGGLE = [
        'label:has-text("Require Images") ~ button[role="switch"]',
        'div:has(label:has-text("Require Images")) button[role="switch"]',
        'p:has-text("Require Images") ~ button[role="switch"]',
    ].join(", ");

    static readonly REPLACEMENT_AUTO_APPROVE_TOGGLE = [
        'label:has-text("Auto Approve") ~ button[role="switch"]',
        'div:has(label:has-text("Auto Approve")):not(:has(label:has-text("Below"))) button[role="switch"]',
        'p:has-text("Auto Approve") ~ button[role="switch"]',
    ].join(", ");

    static readonly REPLACEMENT_REASONS_INPUT = [
        'input[placeholder*="reason" i]',
        'div:has(label:has-text("Reasons")) input',
    ].join(", ");

    // ── REFUND TAB ────────────────────────────────────────────────────────────

    static readonly REFUND_METHOD_SELECT = [
        'label:has-text("Refund Method"):not(:has-text("COD")) ~ select',
        'div:has(label:has-text("Refund Method")):not(:has(label:has-text("COD"))) select',
        'div:has(p:has-text("Refund Method")):not(:has(p:has-text("COD"))) select',
    ].join(", ");

    static readonly COD_REFUND_METHOD_SELECT = [
        'label:has-text("COD Refund Method") ~ select',
        'div:has(label:has-text("COD Refund Method")) select',
        'div:has(p:has-text("COD Refund Method")) select',
    ].join(", ");

    static readonly REFUND_PROCESSING_DAYS = [
        'label:has-text("Processing Days") ~ input',
        'div:has(label:has-text("Processing Days")) input[type="number"]',
        'div:has(p:has-text("Processing Days")) input',
    ].join(", ");

    static readonly REFUND_PARTIAL_ALLOWED_TOGGLE = [
        'label:has-text("Partial Refund Allowed") ~ button[role="switch"]',
        'div:has(label:has-text("Partial Refund Allowed")) button[role="switch"]',
        'p:has-text("Partial Refund Allowed") ~ button[role="switch"]',
        'span:has-text("Partial Refund Allowed") ~ button[role="switch"]',
    ].join(", ");

    static readonly REFUND_SHIPPING_REFUNDABLE_TOGGLE = [
        'label:has-text("Shipping Refundable") ~ button[role="switch"]',
        'div:has(label:has-text("Shipping Refundable")) button[role="switch"]',
        'p:has-text("Shipping Refundable") ~ button[role="switch"]',
        'span:has-text("Shipping Refundable") ~ button[role="switch"]',
    ].join(", ");

    static readonly REFUND_DEDUCT_CANCEL_FEE_TOGGLE = [
        'label:has-text("Deduct Cancellation Fee") ~ button[role="switch"]',
        'div:has(label:has-text("Deduct Cancellation Fee")) button[role="switch"]',
        'p:has-text("Deduct Cancellation Fee") ~ button[role="switch"]',
        'span:has-text("Deduct Cancellation Fee") ~ button[role="switch"]',
    ].join(", ");

    static readonly REFUND_DEDUCT_RESTOCKING_FEE_TOGGLE = [
        'label:has-text("Deduct Restocking Fee") ~ button[role="switch"]',
        'div:has(label:has-text("Deduct Restocking Fee")) button[role="switch"]',
        'p:has-text("Deduct Restocking Fee") ~ button[role="switch"]',
        'span:has-text("Deduct Restocking Fee") ~ button[role="switch"]',
    ].join(", ");

    // ── MARKET POLICIES TAB ───────────────────────────────────────────────────

    static readonly MARKET_ADD_BTN = [
        'button:has-text("+ Add Market")',
        'button:has-text("Add Market")',
        'a:has-text("Add Market")',
        'button:has-text("+ Add")',
    ].join(", ");

    static readonly MARKET_EMPTY_STATE = [
        ':text("No market overrides configured")',
        'p:has-text("No market")',
        'td:has-text("No market")',
        '[class*="empty"]:has-text("market")',
    ].join(", ");

    // ── Market Modal ──────────────────────────────────────────────────────────
    static readonly MARKET_MODAL = [
        '[role="dialog"]',
        'dialog[open]',
        '.modal',
        '[class*="modal"]',
        '[class*="dialog"]',
    ].join(", ");

    static readonly MARKET_MODAL_HEADING = [
        '[role="dialog"] :is(h1,h2,h3,h4):has-text("Market")',
        'dialog[open] :is(h1,h2,h3,h4):has-text("Market")',
        ':is(h1,h2,h3,h4):has-text("Market Policy Override")',
    ].join(", ");

    static readonly MARKET_NAME_SELECT = [
        '[role="dialog"] select',
        'dialog[open] select',
        '[role="dialog"] [role="combobox"]',
        '.modal select',
    ].join(", ");

    static readonly MARKET_CONDITIONS_INPUT = [
        '[role="dialog"] input[placeholder*="condition" i]',
        '[role="dialog"] input:not([type="checkbox"])',
        'dialog[open] input',
        '.modal input[placeholder*="condition" i]',
    ].join(", ");

    static readonly MARKET_OVERRIDE_CANCEL_TOGGLE = [
        '[role="dialog"] button[role="switch"]:nth-of-type(1)',
        '.modal button[role="switch"]:nth-of-type(1)',
    ].join(", ");

    static readonly MARKET_SAVE_BTN = [
        'button:has-text("Save Market")',
        '[role="dialog"] button:has-text("Save")',
        'dialog[open] button:has-text("Save")',
        '.modal button:has-text("Save")',
    ].join(", ");

    static readonly MARKET_CANCEL_BTN = [
        'button:has-text("Cancel"):visible',
        '[role="dialog"] button:has-text("Cancel")',
        'dialog[open] button:has-text("Cancel")',
        '.modal button:has-text("Cancel")',
    ].join(", ");

    static readonly MARKET_CLOSE_BTN = [
        '[role="dialog"] button[aria-label*="close" i]',
        'dialog[open] button[aria-label*="close" i]',
        '[role="dialog"] button:has-text("×")',
        '[role="dialog"] button:has-text("✕")',
        '[role="dialog"] button.close',
    ].join(", ");

    static readonly MARKET_TABLE_ROWS = [
        '[class*="market"] table tbody tr',
        'table tbody tr',
    ].join(", ");

    // Inline action buttons in the market list rows (outside any modal)
    static readonly MARKET_ROW_EDIT_BTN = 'button:has-text("Edit"), [role="button"]:has-text("Edit")';
    static readonly MARKET_ROW_DELETE_BTN_INLINE = 'button:has-text("Delete"), [role="button"]:has-text("Delete")';

    // Delete confirmation dialog that appears after clicking Delete on a market row
    static readonly MARKET_DELETE_CONFIRM_DIALOG = [
        '[role="alertdialog"]',
        '[role="dialog"]:has-text("Delete market")',
    ].join(", ");
}
