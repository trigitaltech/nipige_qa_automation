/**
 * AddResourcePage — selectors for /setup/currency/add.
 *
 * DOM observations from Nipige FreshCart admin screenshots:
 *   • RESOURCE CODE: searchable combobox (input placeholder "e.g. USD" + chevron)
 *   • RESOURCE NAME: text input (placeholder "e.g. United States Dollar")
 *   • SYMBOL: text input (pre-fills after code selection)
 *   • RESOURCE TYPE: dropdown (Currency / Non Currency)
 *   • RESOURCE ID: numeric text input (placeholder "e.g. 840")
 *   • "Is this a currency?" toggle: button[role="switch"]
 *   • Exchange Rate History: BASE CURRENCY combobox, EXCHANGE RATE input, date inputs, + button
 *   • Preview panel on the right side
 *   • Save / Cancel buttons
 */
export default class AddResourcePage {
    // ── Page heading ──────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = ':is(h1,h2,h3):has-text("Add Resource")';
    static readonly PAGE_SUBTITLE = ':has-text("Register a new currency")';

    // ── Resource Code combobox ────────────────────────────────────────────────
    // The combobox is a searchable input wrapped with a chevron trigger
    static readonly RESOURCE_CODE_INPUT = [
        'input[placeholder="e.g. USD"]',
        'input[placeholder*="e.g. USD" i]',
    ].join(", ");
    static readonly RESOURCE_CODE_DROPDOWN_OPTION = [
        '[role="option"]',
        '[role="listbox"] li',
        'li[data-slot="listbox-item"]',
        '[class*="option"]:not(button)',
    ].join(", ");

    // ── Resource Name ─────────────────────────────────────────────────────────
    static readonly RESOURCE_NAME_INPUT = [
        'input[placeholder="e.g. United States Dollar"]',
        'input[placeholder*="United States Dollar" i]',
        'input[placeholder*="resource name" i]',
    ].join(", ");

    // ── Symbol ────────────────────────────────────────────────────────────────
    static readonly SYMBOL_INPUT = [
        'input[placeholder="$"]',
        'input[placeholder*="symbol" i]',
    ].join(", ");

    // ── Resource Type select ──────────────────────────────────────────────────
    static readonly RESOURCE_TYPE_SELECT = "select";
    static readonly RESOURCE_TYPE_OPTION = '[role="option"], [role="listbox"] li';

    // ── Resource ID ───────────────────────────────────────────────────────────
    static readonly RESOURCE_ID_INPUT = [
        'input[placeholder="e.g. 840"]',
        'input[placeholder*="840" i]',
    ].join(", ");

    // ── Currency toggle ───────────────────────────────────────────────────────
    static readonly CURRENCY_TOGGLE = 'button[role="switch"], input[role="switch"], [data-slot="toggle"]';

    // ── Preview panel ─────────────────────────────────────────────────────────
    static readonly PREVIEW_SECTION = [
        ':text-is("Preview")',
        ':has-text("Preview")',
        '[class*="preview" i]',
    ].join(", ");

    // ── Exchange Rate History section ─────────────────────────────────────────
    static readonly EXCHANGE_RATE_SECTION = ':has-text("Exchange Rate History")';

    // Base currency inside exchange rate section
    static readonly BASE_CURRENCY_INPUT = [
        'input[placeholder*="base currency" i]',
        'input[placeholder*="Select base" i]',
        '[placeholder*="Select base currency" i]',
    ].join(", ");
    static readonly BASE_CURRENCY_TRIGGER = [
        'button:has-text("Select base currency")',
        '[role="combobox"]:has-text("Select base")',
        'select[name*="base" i]',
    ].join(", ");
    static readonly BASE_CURRENCY_OPTION = [
        '[role="option"]',
        '[role="listbox"] li',
        'li[data-slot="listbox-item"]',
    ].join(", ");

    // Exchange rate value input
    static readonly EXCHANGE_RATE_INPUT = [
        'input[placeholder="1.00"]',
        'input[placeholder*="1.00"]',
        'input[type="number"][placeholder*="1"]',
    ].join(", ");

    // Date inputs (start / end)
    static readonly DATE_INPUTS = 'input[type="date"], input[placeholder="dd-mm-yyyy"]';

    // Add rate row button (the "+" icon button at end of the rate form row)
    static readonly ADD_RATE_BTN = [
        'button[aria-label="Add"]',
        'button[aria-label="Add rate"]',
        'button[aria-label="add exchange rate" i]',
        'button:text-is("+")',
        'button[class*="plus" i]',
        'button[class*="add" i]:not([type="submit"])',
    ].join(", ");

    // Exchange rate history table rows
    static readonly RATE_TABLE_ROWS = 'table tbody tr, [class*="rate-row"]';

    // ── Form-level selectors ──────────────────────────────────────────────────
    static readonly ALL_INPUTS = 'input:visible';
    static readonly FORM_INPUTS = 'input, select, textarea';
    static readonly VALIDATION_MESSAGE = [
        '[role="alert"]',
        '.text-red-500',
        '.text-red-600',
        '.text-danger',
        '[class*="error"]',
        '[class*="invalid"]',
        ':text("required")',
        ':text("Required")',
        ':text("must")',
        ':text("invalid")',
    ].join(", ");

    // ── Buttons ───────────────────────────────────────────────────────────────
    static readonly SAVE_BTN = 'button:has-text("Save Resource")';
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';
}
