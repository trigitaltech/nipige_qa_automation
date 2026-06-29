export default class AttributePage {
    static readonly ATTRIBUTE_PATH = "attribute";

    // ── Headings ──────────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = 'h1:has-text("Attribute")';
    static readonly CREATE_HEADING = 'h2:has-text("Create Attribute")';
    static readonly EDIT_HEADING = 'h2:has-text("Edit Attribute")';
    static readonly VIEW_HEADING = 'h2:has-text("View Attribute")';

    // ── Search & Buttons ──────────────────────────────────────────────────────
    static readonly SEARCH_INPUT = 'input[placeholder="Search here"]:not(#sidebar-search)';
    static readonly CREATE_BTN = 'button:has-text("Create Attribute")';
    static readonly REFRESH_BTN = 'button:has-text("Create Attribute") + button';

    // ── Listing Table ─────────────────────────────────────────────────────────
    static readonly TABLE = 'table';
    static readonly TABLE_HEADERS = 'table thead th';
    static readonly TABLE_ROWS = 'table tbody tr';
    static readonly CELL_FIELD_NAME = 'table tbody tr td:nth-child(1)';
    static readonly CELL_TYPE = 'table tbody tr td:nth-child(2)';
    static readonly CELL_DESCRIPTION = 'table tbody tr td:nth-child(3)';
    static readonly CELL_ACTIONS = 'table tbody tr td:nth-child(4)';

    // Empty state / No Records
    static readonly NO_RECORDS = 'td:has-text("Data Not Found"), td:has-text("No Records Found"), td:has-text("No records"), td:has-text("No data")';

    // Row-scoped helper
    static rowFor(attributeName: string): string {
        return `table tbody tr:has(td:has-text("${attributeName}"))`;
    }

    // Action buttons inside row
    static viewIcon(attributeName: string): string {
        return `${this.rowFor(attributeName)} button[title="View"]`;
    }

    static editIcon(attributeName: string): string {
        return `${this.rowFor(attributeName)} button[title="Edit"]`;
    }

    static deleteIcon(attributeName: string): string {
        return `${this.rowFor(attributeName)} button[title="Delete"]`;
    }

    // Pagination
    static readonly PREV_BTN = 'button:has-text("Previous")';
    static readonly NEXT_BTN = 'button:has-text("Next")';
    static readonly ACTIVE_PAGE = 'button[aria-current="page"], button.bg-blue-600'; // fallback active page btn

    // ── Form Fields (Create / Edit / View) ────────────────────────────────────
    static readonly FIELD_NAME_INPUT = 'label:has-text("Field Name") + input';
    static readonly TYPE_SELECT = 'label:has-text("Type") + select';
    static readonly DESCRIPTION_INPUT = 'label:has-text("Description") + input';
    static readonly UI_CONCERN_SELECT = 'label:has-text("UI Concern") + select';

    // Language checkboxes
    static languageCheckbox(lang: string): string {
        return `label:has-text("${lang}") input[type="checkbox"]`;
    }

    // Dynamic field labels (e.g. Field Label English, Field Label Bengali)
    static fieldLabelInput(lang: string): string {
        return `input[placeholder="Enter Field Label in ${lang}"]`;
    }

    // Enum Values
    static readonly ENUM_INPUT = 'input[placeholder="Enter a string value"]';
    static readonly ENUM_ADD_BTN = 'div:has(label:has-text("Enum Values")) button:has-text("Add")';

    static enumChip(value: string): string {
        return `span.rounded-full:has-text("${value}")`;
    }

    static enumDeleteBtn(value: string): string {
        return `${this.enumChip(value)} button`;
    }

    // Save and Back buttons
    static readonly SAVE_BTN = 'button:has-text("Save")';
    static readonly BACK_BTN = 'button:has-text("Back")';

    // ── Delete Confirmation Popup (SweetAlert2) ───────────────────────────────
    static readonly DELETE_POPUP = '.swal2-popup, [role="alertdialog"], div:has-text("Are you sure")';
    static readonly DELETE_YES_BTN = 'button:has-text("Yes, delete it!"), button:has-text("Yes, Delete"), .swal2-confirm';
    static readonly DELETE_CANCEL_BTN = 'button:has-text("Cancel"), .swal2-cancel';

    // ── Toast notifications ───────────────────────────────────────────────────
    static readonly SUCCESS_TOAST = '.Toastify__toast--success, [class*="toast"][class*="success"]';
    static readonly ERROR_TOAST = '.Toastify__toast--error, [class*="toast"][class*="error"]';
    static readonly TOAST = '.Toastify__toast';

    // ── Inline Validation message ─────────────────────────────────────────────
    static readonly VALIDATION_MESSAGE = 'p.text-red-500, p[class*="text-red"], .text-danger';
}
