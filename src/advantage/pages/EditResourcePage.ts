/**
 * EditResourcePage — selectors for /setup/currency/{id}/edit.
 *
 * DOM observations from Nipige FreshCart admin screenshots:
 *   • URL pattern: /setup/currency/{mongoId}/edit
 *   • Heading: "Edit Resource — {CODE}" (e.g. "Edit Resource — AOA")
 *   • Same form fields as Add Resource, but pre-populated
 *   • Audit Trail panel on the right (Rate updated, Resource created)
 *   • Update / Cancel buttons in top-right area
 */
export default class EditResourcePage {
    // ── URL pattern ───────────────────────────────────────────────────────────
    static readonly URL_PATTERN = /setup\/currency\/.+\/edit/;

    // ── Page heading ──────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = ':is(h1,h2,h3):has-text("Edit Resource")';

    // ── Form fields (same selectors as AddResourcePage) ───────────────────────
    static readonly RESOURCE_CODE_INPUT = [
        'input[placeholder="e.g. USD"]',
        'input[placeholder*="e.g. USD" i]',
    ].join(", ");

    static readonly RESOURCE_NAME_INPUT = [
        'input[placeholder="e.g. United States Dollar"]',
        'input[placeholder*="United States Dollar" i]',
        'input[placeholder*="resource name" i]',
        // Label-based fallbacks for edit form
        'label:has-text("RESOURCE NAME") ~ * input',
        'label:has-text("Resource Name") ~ * input',
        ':has-text("RESOURCE NAME") input:visible',
    ].join(", ");

    static readonly SYMBOL_INPUT = [
        'input[placeholder="$"]',
        'input[placeholder*="symbol" i]',
    ].join(", ");

    static readonly RESOURCE_TYPE_SELECT = "select";
    static readonly RESOURCE_ID_INPUT = [
        'input[placeholder="e.g. 840"]',
        'input[placeholder*="840" i]',
    ].join(", ");

    static readonly CURRENCY_TOGGLE = 'button[role="switch"], input[role="switch"]';

    // Exchange Rate History (same as Add form)
    static readonly EXCHANGE_RATE_SECTION = ':has-text("Exchange Rate History")';
    static readonly ADD_RATE_BTN = [
        'button:text-is("+")',
        'button[aria-label="Add"]',
        'button[aria-label="Add rate"]',
    ].join(", ");

    // ── Audit Trail panel ─────────────────────────────────────────────────────
    static readonly AUDIT_TRAIL = ':has-text("Audit Trail")';

    // ── Buttons ───────────────────────────────────────────────────────────────
    static readonly UPDATE_BTN = [
        'button:text-is("Update")',
        'button:has-text("Update")',
    ].join(", ");
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';

    // ── Validation ────────────────────────────────────────────────────────────
    static readonly VALIDATION_MESSAGE = [
        '[role="alert"]',
        '.text-red-500',
        '.text-red-600',
        '[class*="error"]',
        ':text("required")',
        ':text("Required")',
    ].join(", ");
}
