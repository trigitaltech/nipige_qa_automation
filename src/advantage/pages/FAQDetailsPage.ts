/**
 * FAQDetailsPage — selectors for the FAQ view page.
 *
 * URL confirmed via DOM inspection: /setup/faq/view/{id1}/{id2}
 * Headings on view page: FAQ topic text (h1/h2), "FAQ Content", "Media Content",
 *   "Performance", "Revision History"
 * Buttons: "← Back", "Edit"
 * The view page does NOT have a static "View FAQ" heading — the topic IS the heading.
 */
export default class FAQDetailsPage {
    // ── URL pattern ───────────────────────────────────────────────────────────
    static readonly URL_PATTERN = /setup\/faq\/view/;

    // ── Sections always present on the view page ──────────────────────────────
    // "FAQ Content" section is the canonical signal that the view page loaded
    static readonly FAQ_CONTENT_SECTION = [
        ':text-is("FAQ Content")',
        ':has-text("FAQ Content")',
    ].join(", ");

    // ── Navigation buttons ────────────────────────────────────────────────────
    // "← Back" button — confirmed via DOM inspection
    static readonly BACK_BTN = 'button:has-text("Back"), a:has-text("Back")';
    static readonly EDIT_BTN = 'button:has-text("Edit"), a:has-text("Edit")';
}
