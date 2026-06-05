/**
 * SkillPage — selectors for /setup/skill (list, create, edit).
 *
 * Verified from live DOM inspection of the Nipige FreshCart tenant app:
 *   • Listing search:  input[placeholder="Search here .."]  (2 dots — sidebar is "Search here")
 *   • Category filter: hidden native <select>; use force:true to selectOption
 *   • No-records row:  td containing "No skills found for the selected filters."
 *   • Edit URL pattern: /setup/skill/edit/:id
 *   • Other category:  selecting "Other" reveals input[placeholder="Enter custom category"]
 *   • Edit save button: "Update Skill" (not "Save Skill")
 */
export default class SkillPage {
    // ── Direct navigation ─────────────────────────────────────────────────────
    static readonly SKILL_PATH = "setup/skill";

    // ── Home page & sidebar indicators (TC_SKILL_01 E2E flow) ─────────────────
    static readonly PROFILE_MENU     = 'button[aria-haspopup="true"]';
    static readonly HOME_GREETING    = 'h1[class*="tracking-tight"]';
    static readonly SIDEBAR_NAV      = 'nav.flex-1';
    // "Setup" is a collapsible sidebar button; Skills Setup link is only in DOM after it expands
    static readonly SETUP_MENU_BTN         = 'nav button:has-text("Setup")';
    static readonly SKILLS_SUBMENU_LINK    = 'a[href="/setup/skill"]';

    // ── Page headings ─────────────────────────────────────────────────────────
    // DOM inspection showed headings across h1/h2/h3 — use :is() to be resilient
    static readonly PAGE_HEADING   = ':is(h1,h2,h3):has-text("Skill Setup")';
    static readonly CREATE_HEADING = ':is(h1,h2,h3):has-text("Create Skill")';
    static readonly EDIT_HEADING   = ':is(h1,h2,h3):has-text("Edit Skill")';

    // ── Listing — search & filter ─────────────────────────────────────────────
    // Confirmed placeholder — sidebar input has "Search here" (no dots)
    static readonly SEARCH_INPUT = 'input[placeholder="Search here .."]';

    // Category filter is a custom React combobox (DOM-confirmed: role="combobox", aria-expanded toggles).
    // Clicking it opens a dropdown; options appear as [role="option"] in a portal.
    // Note: the page also has a hidden native <select> but it has no <option> children — unusable.
    static readonly CATEGORY_FILTER_TRIGGER = '[role="combobox"]';
    // Only [role="option"] — NOT "ul li" which also matches pagination items on the same page
    static readonly DROPDOWN_OPTION = '[role="option"]';

    // ── Create button & refresh ───────────────────────────────────────────────
    static readonly CREATE_BTN   = 'button:has-text("Create Skill"), a:has-text("Create Skill")';
    static readonly REFRESH_BTN  = 'button[aria-label="Refresh"], button[title="Refresh"]';

    // ── Table ─────────────────────────────────────────────────────────────────
    static readonly TABLE         = 'table';
    static readonly TABLE_HEADERS = 'table thead th';
    static readonly TABLE_ROWS    = 'table tbody tr';
    // Column positions (0-indexed: Icon=0, Name=1, Code=2, Category=3, Desc=4, SortOrder=5, Actions=6)
    static readonly CELL_SKILL_NAME  = 'table tbody tr td:nth-child(2)';
    static readonly CELL_CODE        = 'table tbody tr td:nth-child(3)';
    static readonly CELL_CATEGORY    = 'table tbody tr td:nth-child(4)';
    static readonly CELL_SORT_ORDER  = 'table tbody tr td:nth-child(6)';

    // No-records: the empty-state is a single <tr> whose <td> contains the message text.
    static readonly NO_RECORDS = 'td:has-text("No skills found for the selected filters.")';

    // ── Row-scoped helper ─────────────────────────────────────────────────────
    static rowFor(skillName: string): string {
        return `table tbody tr:has(td:has-text("${skillName}"))`;
    }

    // ── Pagination (same HeroUI pattern as TaxCode) ───────────────────────────
    static readonly NEXT_PAGE_BTN = [
        'a[aria-label="Go to next page"]',
        'button[aria-label="Go to next page"]',
        'li[data-slot="pagination-item"]:has-text("Next") > a',
        'button:has-text("Next")',
    ].join(", ");
    static readonly PREV_PAGE_BTN = [
        'a[aria-label="Go to previous page"]',
        'button[aria-label="Go to previous page"]',
        'button:has-text("Previous")',
    ].join(", ");

    // ── Navigation buttons ────────────────────────────────────────────────────
    static readonly BACK_BTN   = 'button:has-text("Back"), a:has-text("Back")';
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';

    // ── Create / Edit form fields (confirmed placeholders from DOM inspection) ─
    // Sidebar search has placeholder "Search here" (no dots) — excluded from form selectors
    static readonly CODE_INPUT        = 'input[placeholder="INVERTER_REPAIR"]';
    static readonly NAME_INPUT        = 'input[placeholder="Inverter Repair"]';
    static readonly DESCRIPTION_INPUT = 'textarea[placeholder="Home inverter and UPS repair services"]';
    // Category: native <select> (first/only select inside the form)
    static readonly CATEGORY_SELECT   = 'select';
    // "Enter custom category" field appears only when Category = "Other"
    static readonly OTHER_CATEGORY_INPUT = 'input[placeholder="Enter custom category"]';
    // Icon URL input
    static readonly ICON_INPUT        = 'input[placeholder="lightning or https://..."]';
    // Sort Order: number input (placeholder "0" is actually placeholder attr, not value)
    static readonly SORT_ORDER_INPUT  = 'input[type="number"][placeholder="0"], input[type="number"]';
    // All required form inputs (for HTML5 :invalid check)
    static readonly FORM_INPUTS = 'form input, form select, form textarea';

    // ── Submit buttons ────────────────────────────────────────────────────────
    static readonly SAVE_BTN   = 'button:has-text("Save Skill")';
    static readonly UPDATE_BTN = 'button:has-text("Update Skill")';

    // ── Icon preview ──────────────────────────────────────────────────────────
    // An <img> appears inside the preview panel once a valid URL is entered
    static readonly ICON_PREVIEW_IMG = '[class*="preview"] img, [class*="icon"] img, img[alt*="icon" i]';

    // ── Delete confirmation (SweetAlert2) ─────────────────────────────────────
    static readonly DELETE_POPUP      = '.swal2-popup, [role="alertdialog"], [role="dialog"]';
    static readonly DELETE_YES_BTN    = '.swal2-confirm, button:has-text("Yes, delete it!"), button:has-text("Yes, Delete")';
    static readonly DELETE_CANCEL_BTN = '.swal2-cancel';

    // ── Toast / alerts ────────────────────────────────────────────────────────
    // Use the individual toast element, NOT the always-present container <section class="Toastify">.
    // [role="alert"] is also excluded — it's an empty ARIA live region always in the DOM.
    static readonly TOAST = '.Toastify__toast';

    // ── Validation ────────────────────────────────────────────────────────────
    // Form uses HTML5 required attribute — browser shows native popup.
    // Checking :invalid pseudo-class in JS is the reliable DOM approach.
    static readonly INVALID_INPUTS = 'form input:invalid, form select:invalid, form textarea:invalid';
}
