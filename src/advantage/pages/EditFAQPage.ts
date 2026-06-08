/**
 * EditFAQPage — selectors for /setup/faq/edit/{id1}/{id2}.
 *
 * URL confirmed via DOM inspection: /setup/faq/edit/{id1}/{id2}
 * Page heading: "Edit FAQ" (confirmed)
 * Submit button: "Update" (confirmed)
 *
 * Edit form selects (native <select>, each in its own div):
 *   .nth(0) → SCOPE
 *   .nth(1) → CATEGORY
 *   .nth(2) → MEDIA TYPE
 */
export default class EditFAQPage {
    // ── URL pattern ───────────────────────────────────────────────────────────
    static readonly URL_PATTERN = /setup\/faq\/edit/;

    // ── Page heading (confirmed "Edit FAQ") ───────────────────────────────────
    static readonly PAGE_HEADING = ':is(h1,h2,h3):has-text("Edit FAQ")';

    // ── All native selects — use .nth(index) in steps ─────────────────────────
    static readonly ALL_SELECTS = 'select';

    // ── Text fields ───────────────────────────────────────────────────────────
    static readonly TOPIC_INPUT = [
        'input[placeholder*="How do I pay" i]',
        'input[placeholder*="topic" i]',
        'input[placeholder*="pay online" i]',
    ].join(", ");
    static readonly DESCRIPTION_TEXTAREA = [
        'textarea[placeholder*="Step-by-step" i]',
        'textarea',
    ].join(", ");
    static readonly SORT_ORDER_INPUT = 'input[type="number"]';

    // ── Buttons ───────────────────────────────────────────────────────────────
    // Live app confirmed: the submit button on /setup/faq/edit/:id is labelled "Update"
    static readonly SAVE_CHANGES_BTN = [
        'button:text-is("Update")',
        'button:has-text("Save FAQ")',
        'button:has-text("Update FAQ")',
        'button:has-text("Save Changes")',
    ].join(", ");
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';
}
