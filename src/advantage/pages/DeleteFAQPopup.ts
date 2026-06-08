/**
 * DeleteFAQPopup — selectors for the FAQ delete confirmation dialog.
 *
 * Selector assumptions:
 *   • Uses SweetAlert2-style popup (same as TaxCode and Skill modules)
 *   • Confirm button text: "Yes, delete it!" or "Yes, Delete"
 *   • Cancel button: .swal2-cancel
 */
export default class DeleteFAQPopup {
    // ── Popup container ───────────────────────────────────────────────────────
    static readonly POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]';

    // ── Action buttons ────────────────────────────────────────────────────────
    static readonly CONFIRM_BTN = [
        '.swal2-confirm',
        'button:has-text("Yes, delete it!")',
        'button:has-text("Yes, Delete")',
        'button:has-text("Delete")',
    ].join(", ");
    static readonly CANCEL_BTN = '.swal2-cancel, button:has-text("No, keep it"), button:has-text("Cancel")';
    static readonly CLOSE_BTN = '.swal2-close, button[aria-label="Close"]';
}
