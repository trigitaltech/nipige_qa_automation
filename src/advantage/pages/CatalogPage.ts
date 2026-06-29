export default class CatalogPage {
    static readonly CATALOG_PATH = "catalog";

    // ── Main screen ───────────────────────────────────────────────────────────
    // Page shows breadcrumb "Home > Catalog" and h1 "Catalog"
    static readonly PAGE_HEADING = 'h1:has-text("Catalog"), h2:has-text("Catalog")';

    // ── Catalog Tree ──────────────────────────────────────────────────────────
    // Left panel has "CATALOG TREE" label (uppercase) above the tree
    static readonly CATALOG_TREE_HEADING = 'p:text-is("CATALOG TREE"), span:text-is("CATALOG TREE"), div:text-is("CATALOG TREE")';

    // Tree node text — use has-text (contains) not text-is (exact) for robustness
    static treeNode(name: string): string {
        return `span:has-text("${name}"), p:has-text("${name}"), div:has-text("${name}"):not(:has(*:has-text("${name}")))`;
    }

    // The expand chevron row selector — finds the clickable row item for a given node
    static treeNodeRow(name: string): string {
        return `[class*="tree"] *:has-text("${name}"):not(:has(*:has-text("${name}")))`;
    }

    // ── Catalog Details panel ─────────────────────────────────────────────────
    // Right panel: "Catalog Details" heading, then "+ Create Catalog", "Details", "Delete Catalog" buttons
    // Below: label + empty input pairs (Name, Catalog Type, Display Name, Long Description, Short Description)
    // and "Attribute Count" label with "0" value
    static readonly DETAILS_EMPTY_STATE = '.no-catalog, [class*="empty-state"], p:text-is("No catalog selected")';

    static readonly CREATE_CATALOG_BTN = 'button:has-text("+ Create Catalog"), button:has-text("Create Catalog")';
    static readonly DETAILS_BTN = 'button:has-text("Details")';
    static readonly DELETE_CATALOG_BTN = 'button:has-text("Delete Catalog")';
    static readonly CATALOG_DETAILS_HEADING = 'h1:has-text("Catalog Details"), h2:has-text("Catalog Details"), h3:has-text("Catalog Details"), p:has-text("Catalog Details"), span:has-text("Catalog Details")';

    // Detail fields — from the screenshot these are plain <input> elements with NO placeholder
    // The label is a standalone text element to the left, input is a sibling to the right
    // Pattern: find the row div that contains the label text, then get its input
    static readonly DETAIL_NAME = [
        'input[name="name"]',
        'input[placeholder*="Name" i]:not([placeholder*="Display"])',
        'div:has(> label:text-is("Name")) input',
        'div:has(> p:text-is("Name")) input',
        'div:has(> span:text-is("Name")) input',
        'tr:has(td:text-is("Name")) input',
    ].join(', ');

    static readonly DETAIL_DISPLAY_NAME = [
        'input[name="displayName"]',
        'input[placeholder*="Display Name" i]',
        'div:has(> label:text-is("Display Name")) input',
        'div:has(> p:text-is("Display Name")) input',
        'div:has(> span:text-is("Display Name")) input',
        'tr:has(td:text-is("Display Name")) input',
    ].join(', ');

    static readonly DETAIL_LONG_DESC = [
        'textarea[name="longDescription"]',
        'input[name="longDescription"]',
        'textarea[placeholder*="Long" i]',
        'div:has(> label:text-is("Long Description")) input',
        'div:has(> p:text-is("Long Description")) input',
        'div:has(> p:text-is("Long Description")) textarea',
        'tr:has(td:text-is("Long Description")) input',
    ].join(', ');

    static readonly DETAIL_SHORT_DESC = [
        'textarea[name="shortDescription"]',
        'input[name="shortDescription"]',
        'textarea[placeholder*="Short" i]',
        'div:has(> label:text-is("Short Description")) input',
        'div:has(> p:text-is("Short Description")) input',
        'div:has(> p:text-is("Short Description")) textarea',
        'tr:has(td:text-is("Short Description")) input',
    ].join(', ');

    static readonly DETAIL_CATALOG_TYPE = [
        'input[name="catalogType"]',
        'select[name="catalogType"]',
        'div:has(> label:text-is("Catalog Type")) input',
        'div:has(> p:text-is("Catalog Type")) input',
        'div:has(> span:text-is("Catalog Type")) input',
        'tr:has(td:text-is("Catalog Type")) input',
    ].join(', ');

    // Attribute Count shows the number "0" as a text node next to the label
    static readonly DETAIL_ATTRIBUTE_COUNT = [
        'div:has(> label:text-is("Attribute Count")) input',
        'div:has(> p:text-is("Attribute Count")) p:not(:text-is("Attribute Count"))',
        'div:has(> p:text-is("Attribute Count")) span',
        'tr:has(td:text-is("Attribute Count")) td:last-child',
        // Fall back: the "0" text visible in the screenshot
        'p:text-is("0"), span:text-is("0")',
    ].join(', ');

    // ── Catalog Details screen (after clicking "Details" button) ──────────────
    static readonly DETAIL_LANGUAGE_DROPDOWN = 'select[name="language"], label:has-text("Language") + select, div:has(p:text-is("Language")) select';
    static readonly DETAIL_CATALOG_LEVEL = 'div:has(p:text-is("Catalog Level")) input, div:has(p:text-is("Catalog Level")) p:last-child';
    static readonly DETAIL_PARENT = 'div:has(p:text-is("Parent")) input, div:has(p:text-is("Parent")) p:last-child';
    static readonly DETAIL_ALIAS = 'div:has(p:text-is("Alias")) input, div:has(p:text-is("Catalog Alias")) input, div:has(p:text-is("Alias")) p:last-child';

    // Icon / image
    static readonly ICON_UPLOAD_INPUT = 'input[type="file"]';
    static readonly ICON_PREVIEW = 'img[alt*="icon"], img[alt*="catalog"], [class*="icon"] img, [class*="preview"] img';
    static readonly CHANGE_IMAGE_BTN = 'button:has-text("Change Image"), button:has-text("Change")';

    // Image library
    static readonly IMAGE_LIBRARY_SECTION = '[class*="image-library"], [class*="media-library"], [class*="ImageLibrary"]';
    static readonly ADD_IMAGE_BTN = 'button:has-text("Add Image"), button:has-text("Upload Image")';
    static readonly IMAGE_LIBRARY_ITEMS = '[class*="image-library"] img, [class*="media-library"] img';

    // Attributes table
    static readonly ATTRIBUTES_TABLE = 'table, [class*="attribute-table"]';
    static readonly ADD_ATTRIBUTE_BTN = 'button:has-text("Add Attribute"), button:has-text("+ Add Attribute"), button:has-text("Add Attribute +")';
    static readonly ATTRIBUTE_SEARCH_INPUT = 'input[placeholder*="Search" i], input[type="search"]';
    static readonly ATTRIBUTE_ROWS = 'table tbody tr, [class*="attribute-row"]';
    static readonly NO_ATTRIBUTE_RECORDS = 'td:has-text("No data"), td:has-text("No records"), td:has-text("Data Not Found"), p:has-text("No data"), [class*="empty"]';
    static readonly PAGINATION_NEXT = 'button[aria-label="Next page"], button:has-text("Next"), [class*="pagination"] button:last-child';

    static toggleInRow(rowLocator: string, label: string): string {
        return `${rowLocator} label:has-text("${label}") input[type="checkbox"], `
            + `${rowLocator} [aria-label="${label}"] input`;
    }

    // Form layout section
    static readonly FORM_LAYOUT_SECTION = '[class*="form-layout"], [class*="FormLayout"], [data-testid="form-layout"]';
    static readonly ADD_BLOCK_BTN = 'button:has-text("Add Block"), button:has-text("+ Add Block")';

    // ── Create Catalog form ───────────────────────────────────────────────────
    static readonly CREATE_FORM_HEADING = [
        'h1:has-text("Create Catalog")',
        'h2:has-text("Create Catalog")',
        'h3:has-text("Create Catalog")',
        'p:has-text("Create Catalog")',
        'span:has-text("Create Catalog")',
    ].join(', ');

    static readonly FORM_NAME_INPUT = [
        'input[name="name"]',
        'input[placeholder*="Name" i]:not([placeholder*="Display"])',
        'label:has-text("Name") + input',
        'div:has(> label:has-text("Name")) input',
    ].join(', ');

    static readonly FORM_DISPLAY_NAME_INPUT = [
        'input[name="displayName"]',
        'input[placeholder*="Display Name" i]',
        'label:has-text("Display Name") + input',
        'div:has(> label:has-text("Display Name")) input',
    ].join(', ');

    static readonly FORM_LONG_DESC_INPUT = [
        'textarea[name="longDescription"]',
        'textarea[placeholder*="Long" i]',
        'label:has-text("Long Description") + textarea',
        'div:has(> label:has-text("Long Description")) textarea',
        'input[name="longDescription"]',
    ].join(', ');

    static readonly FORM_SHORT_DESC_INPUT = [
        'textarea[name="shortDescription"]',
        'textarea[placeholder*="Short" i]',
        'label:has-text("Short Description") + textarea',
        'div:has(> label:has-text("Short Description")) textarea',
        'input[name="shortDescription"]',
    ].join(', ');

    static readonly FORM_CATALOG_TYPE_SELECT = [
        'select[name="catalogType"]',
        'label:has-text("Catalog Type") + select',
        '[aria-label*="Catalog Type" i]',
    ].join(', ');

    static readonly FORM_PARENT_SELECT = [
        'select[name="parent"]',
        'select[name="parentCatalog"]',
        'label:has-text("Parent") + select',
        'label:has-text("Parent Catalog") + select',
        'div:has(> label:has-text("Parent")) select',
    ].join(', ');

    static readonly FORM_LANGUAGE_SELECT = [
        'select[name="language"]',
        'label:has-text("Language") + select',
    ].join(', ');

    static readonly THUMBNAIL_INPUT = 'input[type="file"]';
    static readonly THUMBNAIL_PREVIEW = 'img[alt*="thumbnail"], img[alt*="preview"], [class*="thumbnail"] img, [class*="preview"] img';
    static readonly SAVE_BTN = 'button:has-text("Save"), button[type="submit"]:not(:has-text("Cancel"))';
    static readonly CANCEL_BTN = 'button:has-text("Cancel")';

    // ── Validation messages ───────────────────────────────────────────────────
    static readonly VALIDATION_MSG = 'p[class*="error"], p[class*="text-red"], span[class*="error"], [class*="validation"], [class*="invalid-feedback"], .error-message';
    static readonly REQUIRED_FIELD_ERROR = '[class*="required"], [class*="error"]:visible, p:has-text("required"), p:has-text("Required")';

    // ── Delete Catalog popup ──────────────────────────────────────────────────
    static readonly DELETE_POPUP = '.swal2-popup, [role="dialog"], [class*="modal"], [class*="confirm"]';
    static readonly DELETE_CONFIRM_BTN = 'button:has-text("Yes, Delete it!"), button:has-text("Yes, Delete"), button:has-text("Confirm"), .swal2-confirm';
    static readonly DELETE_CANCEL_BTN = '.swal2-cancel, [role="dialog"] button:has-text("Cancel")';
    static readonly DELETE_CLOSE_BTN = 'button[aria-label="Close"], .swal2-close, button.close';

    // ── Feedback toasts ───────────────────────────────────────────────────────
    static readonly SUCCESS_TOAST = '.Toastify__toast--success, .swal2-success, [class*="toast-success"], [class*="alert-success"]';
    static readonly ERROR_TOAST = '.Toastify__toast--error, .swal2-error, [class*="toast-error"], [class*="alert-error"]';
    static readonly SUCCESS_TITLE = '#swal2-title, .swal2-title';
}
