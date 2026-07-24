export default class ItemPage {
    static readonly ITEM_PATH = "item";

    // ── Item List page ────────────────────────────────────────────────────────
    static readonly PAGE_HEADING = 'h1:has-text("Items"), h2:has-text("Items")';
    static readonly PAGE_SUBTITLE = 'p:has-text("Browse and manage catalog items")';

    // Filters
    static readonly MARKET_DROPDOWN = [
        'div:has(> label:has-text("Market")) select',
        'label:has-text("Market") + div select',
        'div:has(p:text-is("Market")) select',
        // Custom dropdown trigger
        'div:has(p:text-is("Market")) button',
        '[aria-label*="Market" i]',
    ].join(', ');

    // The filter row has three custom combobox dropdowns (Market, Category, Product Catalog).
    // Each renders as: <label>Market</label><input role="combobox" placeholder="Select Market">
    // Clicking the input OR the adjacent chevron button opens the listbox.
    static readonly MARKET_DROPDOWN_TRIGGER = 'input[role="combobox"][placeholder="Select Market"]';
    static readonly CATEGORY_DROPDOWN_TRIGGER = 'input[role="combobox"][placeholder="Select Category"]';
    static readonly PRODUCT_CATALOG_DROPDOWN_TRIGGER = 'input[role="combobox"][placeholder="Select Product Catalog"]';

    // Dropdown option list (open state) — app uses plain div/li, no role="option"
    static dropdownOption(text: string): string {
        return [
            `[role="option"]:text-is("${text}")`,
            `li:text-is("${text}")`,
            `[class*="option"]:text-is("${text}")`,
            `div:text-is("${text}")`,
        ].join(', ');
    }

    static readonly CLEAR_FILTER_BTN = [
        'button:has-text("Clear Filter")',
        'button:has-text("Clear")',
        '[aria-label*="clear" i]',
    ].join(', ');

    // Right-side content area search box (NOT the left nav global search).
    // Scoped to the main content region — the left panel search has the same placeholder
    // so we must pick the second occurrence (the one inside the page body, not the sidebar).
    static readonly SEARCH_INPUT = [
        // Most specific: search box that sits beside the refresh/reload icon button
        'main input[placeholder*="Search" i]',
        '[class*="content"] input[placeholder*="Search" i]',
        '[class*="main"] input[placeholder*="Search" i]',
        // The right-side search is typically inside a div that also contains the refresh button
        'div:has(button[aria-label*="refresh" i]) input[placeholder*="Search" i]',
        'div:has(button svg) input[placeholder*="Search" i]',
        // Fallback: second search input on the page (index 1, left panel is index 0)
        'input[placeholder*="Search" i]:nth-of-type(2)',
    ].join(', ');

    static readonly REFRESH_BTN = [
        'button[aria-label*="refresh" i]',
        'button:has(svg[class*="refresh"])',
        '[data-testid="refresh"]',
        // Icon-only button adjacent to the search box
        'div[class*="search"] + button',
    ].join(', ');

    // ── Item table ─────────────────────────────────────────────────────────────
    static readonly TABLE = 'table, [class*="item-list"], [class*="data-table"]';
    static readonly TABLE_HEADERS = 'thead th, [class*="table-header"] [class*="col"]';
    static readonly TABLE_ROWS = 'tbody tr:has(td:not([colspan])), [class*="table-row"]:not([class*="header"]):not(:has-text("No items found")):not(:has-text("No Records Found"))';
    static readonly NO_ITEMS_MSG = [
        'td:has-text("No items found")',
        'p:has-text("No items found")',
        '[class*="empty"]:has-text("No items found")',
        'td:has-text("No Records Found")',
        'p:has-text("No Records Found")',
        'td:has-text("No data")',
    ].join(', ');

    // ── Toolbar buttons ───────────────────────────────────────────────────────
    static readonly CREATE_BTN = [
        'button:has-text("Create")',
        'a:has-text("Create")',
        'button[aria-label*="Create" i]',
    ].join(', ');

    static readonly BULK_CREATE_BTN = [
        'button:has-text("Bulk Create")',
        'a:has-text("Bulk Create")',
    ].join(', ');

    // ── Row-level action icons ─────────────────────────────────────────────────
    // View icon (eye icon) — inside a table row
    static viewIcon(rowIndex = 0): string {
        return `tbody tr:nth-child(${rowIndex + 1}) button[aria-label*="view" i],`
            + ` tbody tr:nth-child(${rowIndex + 1}) [class*="view"],`
            + ` tbody tr:nth-child(${rowIndex + 1}) [title*="View" i]`;
    }

    static editIcon(rowIndex = 0): string {
        return `tbody tr:nth-child(${rowIndex + 1}) button[aria-label*="edit" i],`
            + ` tbody tr:nth-child(${rowIndex + 1}) [class*="edit"],`
            + ` tbody tr:nth-child(${rowIndex + 1}) [title*="Edit" i]`;
    }

    static deleteIcon(rowIndex = 0): string {
        return `tbody tr:nth-child(${rowIndex + 1}) button[aria-label*="delete" i],`
            + ` tbody tr:nth-child(${rowIndex + 1}) [class*="delete"],`
            + ` tbody tr:nth-child(${rowIndex + 1}) [title*="Delete" i]`;
    }

    // Status toggle — inside a table row
    static statusToggle(rowIndex = 0): string {
        return `tbody tr:nth-child(${rowIndex + 1}) input[type="checkbox"][class*="toggle"],`
            + ` tbody tr:nth-child(${rowIndex + 1}) label[class*="toggle"],`
            + ` tbody tr:nth-child(${rowIndex + 1}) [role="switch"]`;
    }

    // Generic row action buttons (for any icon in the Actions column)
    static rowActions(rowIndex = 0): string {
        return `tbody tr:nth-child(${rowIndex + 1}) [class*="action"] button,`
            + ` tbody tr:nth-child(${rowIndex + 1}) td:last-child button`;
    }

    // ── View Item Details page ─────────────────────────────────────────────────
    static readonly VIEW_PAGE_HEADING = [
        'h1:has-text("Item")',
        'h2:has-text("Item Details")',
        'h1:has-text("Item Details")',
    ].join(', ');

    static readonly BACK_BTN = [
        'button:has-text("Back")',
        'a:has-text("Back")',
        '[aria-label*="back" i]',
    ].join(', ');

    // Organization detail fields
    static readonly DETAIL_MARKET = [
        'div:has(p:text-is("Market")) p:last-child',
        'div:has(label:text-is("Market")) span',
        'div:has(label:text-is("Market")) p',
    ].join(', ');

    static readonly DETAIL_CATEGORY = [
        'div:has(p:text-is("Category")) p:last-child',
        'div:has(label:text-is("Category")) span',
    ].join(', ');

    static readonly DETAIL_CATALOG = [
        'div:has(p:text-is("Catalog")) p:last-child',
        'div:has(p:text-is("Product Catalog")) p:last-child',
    ].join(', ');

    static readonly DETAIL_STORE = [
        'div:has(p:text-is("Store")) p:last-child',
        'div:has(label:text-is("Store")) span',
    ].join(', ');

    // Pricing
    static readonly DETAIL_PRICE = [
        'div:has(p:text-is("Price")) p:last-child',
        'div:has(label:text-is("Price")) span',
        'input[name="price"]',
    ].join(', ');

    static readonly DETAIL_DISCOUNT = [
        'div:has(p:text-is("Discount")) p:last-child',
        'input[name="discount"]',
    ].join(', ');

    static readonly DETAIL_DEAL_PRICE = [
        'div:has(p:text-is("Deal Price")) p:last-child',
        'input[name="dealPrice"]',
    ].join(', ');

    // Inventory
    static readonly DETAIL_INVENTORY_TYPE = [
        'div:has(p:text-is("Inventory Type")) p:last-child',
        'input[name="inventoryType"]',
    ].join(', ');

    static readonly DETAIL_STOCK_COUNT = [
        'div:has(p:text-is("Stock Count")) p:last-child',
        'input[name="stockCount"]',
    ].join(', ');

    // Media
    static readonly MEDIA_ICON = 'img[alt*="icon" i], [class*="icon-preview"] img';
    static readonly MEDIA_THUMBNAIL = 'img[alt*="thumbnail" i], [class*="thumbnail"] img';
    static readonly MEDIA_MAIN_PHOTO = 'img[alt*="main" i], img[alt*="photo" i], [class*="main-photo"] img';

    // Availability
    static readonly DETAIL_AVAILABILITY = [
        'div:has(p:text-is("Availability")) p:last-child',
        'input[name="availability"]',
        '[class*="availability"]',
    ].join(', ');

    // ── Create / Edit Item form ────────────────────────────────────────────────
    static readonly CREATE_PAGE_HEADING = [
        'h1:has-text("Create Item")',
        'h2:has-text("Create Item")',
        'h1:has-text("Create Product")',
        'h2:has-text("Create Product")',
    ].join(', ');

    static readonly EDIT_PAGE_HEADING = [
        'h1:has-text("Edit Item")',
        'h2:has-text("Edit Item")',
        'h1:has-text("Update Item")',
    ].join(', ');

    // Form fields
    static readonly FORM_NAME_INPUT = [
        'input[name="name"]',
        'input[placeholder*="Name" i]:not([placeholder*="Search"])',
        'label:has-text("Name") + input',
    ].join(', ');

    static readonly FORM_PRICE_INPUT = [
        'input[name="price"]',
        'input[placeholder*="Price" i]',
        'label:has-text("Price") + input',
    ].join(', ');

    static readonly FORM_QUANTITY_INPUT = [
        'input[name="quantity"]',
        'input[placeholder*="Quantity" i]',
    ].join(', ');

    static readonly FORM_DISCOUNT_INPUT = [
        'input[name="discount"]',
        'input[placeholder*="Discount" i]',
    ].join(', ');

    static readonly FORM_DEAL_PRICE_INPUT = [
        'input[name="dealPrice"]',
        'input[placeholder*="Deal" i]',
    ].join(', ');

    static readonly FORM_STOCK_COUNT_INPUT = [
        'input[name="stockCount"]',
        'input[placeholder*="Stock" i]',
    ].join(', ');

    static readonly FORM_PRODUCT_TYPE_SELECT = [
        'select[name="productType"]',
        'label:has-text("Product Type") + select',
        'div:has(label:text-is("Product Type")) select',
    ].join(', ');

    static readonly FORM_TYPE_SELECT = [
        'select[name="type"]',
        'label:has-text("Type") + select',
    ].join(', ');

    static readonly FORM_INVENTORY_TYPE_SELECT = [
        'select[name="inventoryType"]',
        'label:has-text("Inventory Type") + select',
    ].join(', ');

    static readonly FORM_AVAILABILITY_SELECT = [
        'select[name="availability"]',
        'label:has-text("Availability") + select',
    ].join(', ');

    static readonly FORM_BRAND_INPUT = [
        'input[name="brand"]',
        'input[placeholder*="Brand" i]',
    ].join(', ');

    // Address fields
    static readonly FORM_ADDRESS_INPUT = [
        'input[name="address"]',
        'input[placeholder*="Search Address" i]',
        'input[placeholder*="address" i]',
    ].join(', ');

    static readonly FORM_CITY_INPUT = [
        'input[name="city"]',
        'input[placeholder*="City" i]',
    ].join(', ');

    static readonly FORM_STATE_INPUT = [
        'input[name="state"]',
        'input[placeholder*="State" i]',
    ].join(', ');

    static readonly FORM_COUNTRY_INPUT = [
        'input[name="country"]',
        'input[placeholder*="Country" i]',
    ].join(', ');

    static readonly FORM_LATITUDE_INPUT = [
        'input[name="latitude"]',
        'input[placeholder*="Latitude" i]',
    ].join(', ');

    static readonly FORM_LONGITUDE_INPUT = [
        'input[name="longitude"]',
        'input[placeholder*="Longitude" i]',
    ].join(', ');

    // Media upload inputs
    static readonly ICON_UPLOAD_INPUT = 'input[type="file"][name*="icon" i], input[type="file"]:nth-of-type(1)';
    static readonly THUMBNAIL_UPLOAD_INPUT = 'input[type="file"][name*="thumbnail" i], input[type="file"]:nth-of-type(2)';
    static readonly MAIN_PHOTO_UPLOAD_INPUT = 'input[type="file"][name*="main" i], input[type="file"]:nth-of-type(3)';

    // Toggles
    static readonly IS_SELLABLE_TOGGLE = [
        'input[name="isSellable"]',
        'label:has-text("Is Sellable") input',
        '[aria-label*="Sellable" i]',
    ].join(', ');

    static readonly PRICE_INCLUDES_TAX_TOGGLE = [
        'input[name="priceIncludesTax"]',
        'label:has-text("Price Includes Tax") input',
    ].join(', ');

    // Save / Cancel / Update
    static readonly SAVE_BTN = [
        'button:has-text("Save Item")',
        'button:has-text("Save")',
        'button[type="submit"]:not(:has-text("Cancel"))',
    ].join(', ');

    static readonly UPDATE_BTN = [
        'button:has-text("Update Item")',
        'button:has-text("Update")',
    ].join(', ');

    static readonly CANCEL_BTN = 'button:has-text("Cancel")';

    // ── Delete popup ──────────────────────────────────────────────────────────
    // The app renders a custom confirmation dialog (not swal2 or a native dialog).
    static readonly DELETE_POPUP = [
        '.swal2-popup',
        '[role="dialog"]',
        '[role="alertdialog"]',
        '[class*="modal"]',
        '[class*="confirm"]',
        // Match any overlay that contains the confirm/cancel buttons
        'div:has(button:has-text("Yes, delete it"))',
    ].join(', ');

    static readonly DELETE_CONFIRM_BTN = [
        'button:has-text("Yes, delete it")',
        'button:has-text("Yes, Delete it")',
        'button:has-text("Yes, delete it!")',
        'button:has-text("Yes, Delete it!")',
        'button:has-text("Confirm")',
        '.swal2-confirm',
    ].join(', ');

    static readonly DELETE_CANCEL_BTN = [
        '.swal2-cancel',
        'button:has-text("No")',
        'button:has-text("Cancel")',
        'div:has(button:has-text("Yes, delete it")) button:has-text("No")',
        'div:has(button:has-text("Yes, Delete it")) button:has-text("No")',
        '[role="dialog"] button:has-text("No")',
        '[role="alertdialog"] button:has-text("No")',
    ].join(', ');

    // ── Feedback toasts & validation ──────────────────────────────────────────
    static readonly SUCCESS_TOAST = [
        '.Toastify__toast--success',
        '.swal2-success',
        '[class*="toast-success"]',
        '[class*="alert-success"]',
    ].join(', ');

    static readonly ERROR_TOAST = [
        '.Toastify__toast--error',
        '.swal2-error',
        '[class*="toast-error"]',
        '[class*="alert-error"]',
    ].join(', ');

    static readonly VALIDATION_MSG = [
        'p[class*="error"]',
        'span[class*="error"]',
        '[class*="validation"]',
        '[class*="invalid-feedback"]',
        '.error-message',
        'p:has-text("required")',
        'p:has-text("Required")',
    ].join(', ');
}
