/**
 * AdvertisementPage — selectors for /advertisement (list, create, view, edit).
 *
 * Follows the same conventions as DeliverySetupPage / TaxCodePage.
 * Multiple fallback selectors joined with ", " for resilience across UI changes.
 */
export default class AdvertisementPage {
    // ── Direct navigation path ────────────────────────────────────────────────
    static readonly ADVERTISEMENT_PATH = "advertisement";
    static readonly ADVERTISEMENT_CREATE_PATH = "advertisement/create";

    // ── Sidebar navigation ────────────────────────────────────────────────────
    static readonly PROFILE_MENU = 'button[aria-haspopup="true"]';
    static readonly SIDEBAR_NAV = 'nav.flex-1';
    static readonly SETUP_MENU_BTN = 'nav button:has-text("Setup")';
    static readonly ADVERTISEMENT_SUBMENU_LINK = [
        'a[href="/advertisement"]',
        'a[href*="advertisement"]',
        'a:has-text("Advertisement")',
    ].join(", ");

    // ── Page headings ─────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = [
        ':is(h1,h2,h3):has-text("Advertisements")',
        ':is(h1,h2,h3):has-text("Advertisement")',
    ].join(", ");
    static readonly CREATE_HEADING = [
        ':is(h1,h2,h3):has-text("Create Advertisement")',
    ].join(", ");
    static readonly VIEW_HEADING = [
        ':is(h1,h2,h3):has-text("View Advertisement")',
    ].join(", ");
    static readonly EDIT_HEADING = [
        ':is(h1,h2,h3):has-text("Edit Advertisement")',
    ].join(", ");

    // ── Listing page ──────────────────────────────────────────────────────────
    // Listing search — exact placeholder "Search here" or "Type / Placement" (sidebar uses "Search navigation menu")
    static readonly SEARCH_INPUT = [
        'input[placeholder="Type / Placement"]',
        'input[placeholder="Search here"]',
        'input[placeholder*="Type / Placement" i]',
        'input[placeholder*="Search" i]',
    ].join(", ");
    static readonly SEARCH_BTN = [
        'div:has(input[placeholder="Type / Placement"]) button',
        'div:has(input[placeholder="Search here"]) button',
    ].join(", ");

    static readonly CREATE_BTN = [
        'button:has-text("Create Advertisement")',
        'a:has-text("Create Advertisement")',
    ].join(", ");

    static readonly TYPE_FILTER_SELECT = [
        'select:has(option:has-text("All Types"))',
        'select[class*="filter"]',
    ].join(", ");

    static readonly TABLE = "table";
    static readonly TABLE_HEADERS = "table thead th";
    static readonly TABLE_ROWS = "table tbody tr";
    static readonly NO_RECORDS = [
        'td:has-text("No records")',
        'td:has-text("No data")',
        ':text("No records found")',
        ':text("No data found")',
        ':text("No advertisements")',
    ].join(", ");

    // ── Row-scoped helpers ────────────────────────────────────────────────────
    static rowContaining(term: string): string {
        return `table tbody tr:has(td:has-text("${term}"))`;
    }

    static activeToggleInRow(rowSelector: string): string {
        return `${rowSelector} button[role="switch"], ${rowSelector} [class*="toggle"], ${rowSelector} [class*="switch"]`;
    }

    // Action icon buttons in the last cell of a row (view=1st, edit=2nd, delete=last)
    static viewBtnInRow(rowSelector: string): string {
        return [
            `${rowSelector} td:last-child button[title*="View" i]`,
            `${rowSelector} td:last-child button[aria-label*="View" i]`,
            `${rowSelector} td:last-child button:has(svg.lucide-eye)`,
            `${rowSelector} td:last-child button:has(svg[data-lucide="eye"])`,
            `${rowSelector} td:last-child a[href*="view"]`,
            `${rowSelector} td:last-child button:first-child`,
        ].join(", ");
    }

    static editBtnInRow(rowSelector: string): string {
        return [
            `${rowSelector} td:last-child button[title*="Edit" i]`,
            `${rowSelector} td:last-child button[aria-label*="Edit" i]`,
            `${rowSelector} td:last-child button:has(svg.lucide-pencil)`,
            `${rowSelector} td:last-child button:has(svg[data-lucide="pencil"])`,
            `${rowSelector} td:last-child a[href*="edit"]`,
            `${rowSelector} td:last-child button:nth-child(2)`,
        ].join(", ");
    }

    static deleteBtnInRow(rowSelector: string): string {
        return [
            `${rowSelector} td:last-child button[title*="Delete" i]`,
            `${rowSelector} td:last-child button[aria-label*="Delete" i]`,
            `${rowSelector} td:last-child button:has(svg.lucide-trash)`,
            `${rowSelector} td:last-child button:has(svg[data-lucide="trash-2"])`,
            `${rowSelector} td:last-child button:has(svg[data-lucide="trash"])`,
            `${rowSelector} td:last-child button:last-child`,
        ].join(", ");
    }

    // ── Listing action buttons ────────────────────────────────────────────────
    static readonly RELOAD_BTN = [
        'button[aria-label*="Reload" i]',
        'button[aria-label*="Refresh" i]',
        'button:has-text("Reload")',
        'button:has-text("Refresh")',
    ].join(", ");

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

    // ── Create / Edit Step 1 — Basic Info & Target ────────────────────────────
    // Type: native <select> (first select on the form)
    static readonly TYPE_SELECT = [
        'select[name*="type" i]',
        'select[id*="type" i]',
        'form select:first-of-type',
        'select',
    ].join(", ");

    // Placement: custom combobox with search/clear
    static readonly PLACEMENT_INPUT = [
        'input[placeholder*="Placement" i]',
        'input[placeholder*="placement" i]',
        '[role="combobox"]',
    ].join(", ");

    static readonly PLACEMENT_CONTAINER = [
        'div:has(input[placeholder*="Placement" i])',
        'div:has([placeholder*="Placement" i])',
    ].join(", ");

    static readonly PLACEMENT_OPTION = (text: string) => [
        `[role="option"]:has-text("${text}")`,
        `.select__option:has-text("${text}")`,
        `li:has-text("${text}")`,
        `div[class*="option"]:has-text("${text}")`,
    ].join(", ");

    static readonly PLACEMENT_CLEAR_BTN = [
        'div:has(> label:has-text("Placement")) button',
        'div:has(> label:has-text("Placement")) [role="button"]',
        'div:has(> label:has-text("Placement")) [class*="clear"]',
        'div:has(> label:has-text("Placement")) span:has-text("×")',
        'div:has(> label:has-text("Placement")) svg',
        '.select__clear-indicator',
    ].join(", ");

    // Visibility: native <select> — second select or the one with Global/Partner/Market
    static readonly VISIBILITY_SELECT = [
        'select[name*="visibility" i]',
        'select[name*="Visibility" i]',
        'select[id*="visibility" i]',
    ].join(", ");

    // Partner dropdown (appears when visibility = Partner)
    static readonly PARTNER_SELECT = [
        'select[name*="partner" i]',
        'select[id*="partner" i]',
        'select:has(option:has-text("Daily Fresh"))',
        'select:has(option:has-text("Select Partner"))',
        'select:has(option:has-text("Choose Partner"))',
    ].join(", ");

    // Frequency dropdown (renders only for SLIDER type — no name/id, identified by its options)
    static readonly FREQUENCY_SELECT = [
        'select[name*="frequency" i]',
        'select[id*="freq" i]',
        'select:has(option:has-text("Select Frequency"))',
        'select:has(option:has-text("sec"))',
    ].join(", ");

    // Date inputs
    static readonly START_DATE_INPUT = [
        'input[name*="startDate" i]',
        'input[name*="start" i]',
        'input[id*="start" i]',
        'input[type="date"]:first-of-type',
    ].join(", ");

    static readonly END_DATE_INPUT = [
        'input[name*="endDate" i]',
        'input[name*="end" i]',
        'input[id*="end" i]',
        'input[type="date"]:last-of-type',
    ].join(", ");

    // Advance Setting checkbox
    static readonly ADVANCE_SETTING_CHECKBOX = [
        'input[type="checkbox"][name*="advance" i]',
        'input[type="checkbox"][id*="advance" i]',
        'label:has-text("Advance Setting") input[type="checkbox"]',
        'label:has-text("Advance") input[type="checkbox"]',
    ].join(", ");

    // Age range
    static readonly AGE_RANGE_CHECKBOX = [
        'input[type="checkbox"][name*="age" i]',
        'label:has-text("Age Range") input[type="checkbox"]',
        'label:has-text("Select Age Range") input[type="checkbox"]',
    ].join(", ");

    static readonly MIN_AGE_INPUT = [
        'input[name*="minAge" i]',
        'input[name*="min" i][type="number"]',
        'input[placeholder*="min" i]',
    ].join(", ");

    static readonly MAX_AGE_INPUT = [
        'input[name*="maxAge" i]',
        'input[name*="max" i][type="number"]',
        'input[placeholder*="max" i]',
    ].join(", ");

    // Icon upload (Step 1)
    static readonly ICON_UPLOAD_AREA = [
        ':text("Click to upload icon")',
        'div:has-text("Click to upload icon")',
        '[class*="upload"][class*="icon"]',
    ].join(", ");
    static readonly FILE_INPUT = 'input[type="file"]';

    // Wizard navigation buttons (Step 1)
    static readonly CONTINUE_BTN = 'button:has-text("Continue")';
    static readonly CANCEL_BTN = 'button:has-text("Cancel"), button:has-text("Back")';

    // Validation messages
    static readonly VALIDATION_MSG = [
        '[role="alert"]',
        '.text-red-500',
        '.text-red-600',
        '[class*="error"]',
        '[class*="invalid"]',
        ':text("required")',
        ':text("is required")',
    ].join(", ");

    // ── Create / Edit Step 2 — Banner Details ─────────────────────────────────
    // The screenshot confirmed Step 2 contains: a Language <select>, a [contenteditable] rich-text
    // editor, text-position radios, and navigation-criteria radios.
    // "Add New Banner" button does NOT exist in the actual app's Step 2 — use the Language select
    // or the content editor as the reliable Step 2 presence indicator.
    static readonly STEP2_INDICATOR = [
        'select:has(option:has-text("English"))',
        '[contenteditable="true"]',
        'button:has-text("Add New Banner Slider")',
        'button:has-text("Add New Banner")',
        'button:has-text("Add Banner")',
        'button:has-text("Add Video")',
        'button:has-text("Upload Video")',
        'button:has-text("Replace video")',
        'button:has-text("Replace")',
        'button:has-text("Update Advertisement")',
        'button:has-text("Create Advertisement")',
    ].join(', ');

    static readonly ADD_BANNER_SLIDER_BTN = [
        'button:has-text("Add New Banner Slider")',
        'button:has-text("Add New Banner")',
        'button:has-text("Add Banner")',
        '[contenteditable="true"]',
        'select:has(option:has-text("English"))',
    ].join(", ");

    static readonly REMOVE_SLIDER_BTN = [
        'button:has-text("Remove Slider")',
        'button:has-text("Remove")',
    ].join(", ");

    static readonly BANNER_IMAGE_UPLOAD_AREA = [
        ':text("Click the preview to upload")',
        ':text("upload or replace the image")',
        'div[class*="image"][class*="upload"]',
        'div[class*="media"][class*="upload"]',
    ].join(", ");

    // Language select (Step 2)
    static readonly LANGUAGE_SELECT = [
        'select:has(option:has-text("English"))',
        'select[name*="language" i]',
        'select[id*="language" i]',
    ].join(", ");

    // Text position radio buttons
    static readonly TEXT_POS_LEFT_RADIO = [
        'input[type="radio"][value="Left"]',
        'input[type="radio"][value="left"]',
        'label:has-text("Left") input[type="radio"]',
    ].join(", ");
    static readonly TEXT_POS_RIGHT_RADIO = [
        'input[type="radio"][value="Right"]',
        'input[type="radio"][value="right"]',
        'label:has-text("Right") input[type="radio"]',
    ].join(", ");
    static readonly TEXT_POS_CENTER_RADIO = [
        'input[type="radio"][value="Center"]',
        'input[type="radio"][value="center"]',
        'label:has-text("Center") input[type="radio"]',
    ].join(", ");

    // Rich text editor (Banner Content)
    static readonly BANNER_CONTENT_EDITOR = [
        '[contenteditable="true"]',
        '.ql-editor',
        '[class*="editor"][contenteditable]',
    ].join(", ");

    // Navigation criteria radio
    static readonly NAV_CRITERIA_URL_RADIO = [
        'label:has-text("Navigation URL") input[type="radio"]',
        'input[type="radio"][value*="url" i]',
        'input[type="radio"][value*="URL"]',
    ].join(", ");
    static readonly NAV_CRITERIA_SEARCH_RADIO = [
        'label:has-text("Search Criteria") input[type="radio"]',
        'input[type="radio"][value*="search" i]',
        'input[type="radio"][value*="Search"]',
    ].join(", ");

    // Navigation type radio
    static readonly NAV_TYPE_GLOBAL_RADIO = [
        'label:has-text("Global") input[type="radio"]',
        'input[type="radio"][value="Global"]',
    ].join(", ");
    static readonly NAV_TYPE_PARTNER_RADIO = [
        'label:has-text("Partner") input[type="radio"]',
        'input[type="radio"][value="Partner"]',
    ].join(", ");

    // Navigation URL input
    static readonly NAV_URL_INPUT = [
        'input[placeholder*="url" i]',
        'input[name*="url" i]',
        'input[type="url"]',
    ].join(", ");

    // Wizard navigation buttons (Step 2)
    static readonly CREATE_ADVERTISEMENT_BTN = [
        'button:has-text("Create Advertisement")',
    ].join(", ");
    static readonly BACK_BTN = 'button:has-text("Back"), a:has-text("Back")';
    static readonly UPDATE_ADVERTISEMENT_BTN = [
        'button:has-text("Update Advertisement")',
        'button:has-text("Save Changes")',
        'button:has-text("Update")',
        'button:has-text("Submit")',
        'button[type="submit"]',
    ].join(", ");

    // ── View page ─────────────────────────────────────────────────────────────
    static readonly VIEW_BASIC_DETAILS = [
        ':has-text("Basic Details")',
        'h2:has-text("Basic Details")',
        'h3:has-text("Basic Details")',
    ].join(", ");
    static readonly VIEW_MEDIA_SECTION = [
        ':has-text("Media")',
        'h2:has-text("Media")',
        'h3:has-text("Media")',
    ].join(", ");
    static readonly VIEW_ADDRESS_SECTION = [
        ':has-text("Address & Target")',
        'h2:has-text("Address")',
    ].join(", ");

    // ── Delete confirmation popup ─────────────────────────────────────────────
    static readonly DELETE_POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]';
    // Overlay/backdrop — click at edge to dismiss popup (allowOutsideClick must be true in the app)
    static readonly SWAL2_BACKDROP = '.swal2-container';
    static readonly DELETE_YES_BTN = [
        '.swal2-confirm',
        'button:has-text("Yes, delete it!")',
        'button:has-text("Yes")',
        'button:has-text("Confirm")',
        'button:has-text("Delete")',
    ].map(sel => `${sel}:visible`).join(", ");

    static readonly DELETE_CANCEL_BTN = [
        '.swal2-cancel',
        'button:has-text("No")',
        'button:has-text("Cancel")',
    ].map(sel => `${sel}:visible`).join(", ");

    // ── Toast notifications ───────────────────────────────────────────────────
    // Covers react-toastify (.Toastify__toast) and sonner ([data-sonner-toast])
    static readonly TOAST = ".Toastify__toast, [data-sonner-toast]";
    static readonly SUCCESS_TOAST = ".Toastify__toast--success";
    static readonly ERROR_TOAST = ".Toastify__toast--error";
}
