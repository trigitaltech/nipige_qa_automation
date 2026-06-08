/**
 * DeleteResourcePopup — selectors for the Resource delete confirmation dialog.
 *
 * Uses SweetAlert2-style popup — same pattern as FAQ, TaxCode, Skill modules.
 */
export default class DeleteResourcePopup {
    // ── Popup container ───────────────────────────────────────────────────────
    static readonly POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]';

    // ── Action buttons ────────────────────────────────────────────────────────
    static readonly CONFIRM_BTN = [
        '.swal2-confirm',
        'button:has-text("Yes, delete it!")',
        'button:has-text("Yes, Delete")',
        'button:has-text("Delete")',
        'button:has-text("Confirm")',
    ].join(", ");

    static readonly CANCEL_BTN = [
        '.swal2-cancel',
        'button:has-text("No, keep it")',
        'button:has-text("No")',
        'button:has-text("Cancel")',
    ].join(", ");

    static readonly CLOSE_BTN = '.swal2-close, button[aria-label="Close"]';
}
