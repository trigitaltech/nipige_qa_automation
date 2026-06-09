/**
 * CreateFAQPage — selectors for /setup/faq/create.
 *
 * DOM-confirmed from live screenshot (2026-06-08):
 *   • SCOPE, CATEGORY, MEDIA TYPE are native <select> elements.
 *   • Each <select> is wrapped in its own <div>, so CSS :nth-of-type is useless
 *     (each select is nth-of-type(1) within its own parent).
 *   • Use Playwright .nth(index) on 'select' in the steps layer:
 *       .nth(0) → SCOPE   (options: PARTNER / CUSTOMER / STAFF)
 *       .nth(1) → CATEGORY (options: Order / Payment / Returns / Delivery)
 *       .nth(2) → MEDIA TYPE (options: None / VIDEO / IMAGE / DOCUMENT)
 *   • TOPIC: input[placeholder*="How do I pay"]
 *   • DESCRIPTION: textarea[placeholder*="Step-by-step"]
 *   • SORT ORDER: input[type="number"]
 */
export default class CreateFAQPage {
    // ── Page heading ──────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = ':is(h1,h2,h3):has-text("Create FAQ")';

    // ── All native selects — differentiated with .nth(index) in steps ────────
    static readonly ALL_SELECTS = 'select';

    // ── Topic & Description ───────────────────────────────────────────────────
    static readonly TOPIC_INPUT = [
        'input[placeholder*="How do I pay" i]',
        'input[placeholder*="topic" i]',
        'input[placeholder*="pay online" i]',
    ].join(", ");
    static readonly DESCRIPTION_TEXTAREA = [
        'textarea[placeholder*="Step-by-step" i]',
        'textarea',
    ].join(", ");

    // ── Sort Order ────────────────────────────────────────────────────────────
    static readonly SORT_ORDER_INPUT = 'input[type="number"]';

    // ── Live Preview panel ────────────────────────────────────────────────────
    static readonly LIVE_PREVIEW_SECTION = [
        '[class*="preview" i]',
        ':has-text("Live Preview")',
    ].join(", ");

    // ── Buttons ───────────────────────────────────────────────────────────────
    static readonly SAVE_FAQ_BTN = 'button:has-text("Save FAQ")';
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';

    // ── Validation messages ───────────────────────────────────────────────────
    static readonly VALIDATION_MESSAGE = [
        '[role="alert"]',
        '.text-red-500',
        '.text-red-600',
        '.text-danger',
        '.invalid-feedback',
        '[class*="error"]',
        '[class*="invalid"]',
        ':text("required")',
        ':text("Required")',
        ':text("must")',
    ].join(", ");

    static readonly FORM_INPUTS = 'input, select, textarea';
}
