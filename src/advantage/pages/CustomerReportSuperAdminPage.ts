export default class CustomerReportSuperAdminPage {
    static readonly URL_PATH = "customer";
    static readonly URL_GUARD = /\/customer/i;
    
    // Sidebar
    static readonly SIDEBAR_LINK = "Customer";

    // Header & Info
    static readonly PAGE_HEADING = "h1:has-text('Customer Report'), h2:has-text('Customer Report')";
    static readonly DOWNLOAD_BUTTON = "button:has-text('Download Report')";
    
    // Search & Filter
    static readonly SEARCH_INPUT = "input[placeholder*='Customer No'], input[placeholder*='Name']";
    static readonly REFRESH_BUTTON = "button:right-of(button:has-text('Download Report'))";
    
    // Table
    static readonly TABLE = "table";
    static readonly TABLE_HEADERS = "thead th";
    static readonly TABLE_ROWS = "tbody tr";
    static readonly TABLE_CELLS = "td";
    
    // Empty state
    static readonly EMPTY_STATE = "tr:has-text('No customers found'), tr:has-text('No results found'), tr:has-text('No data found')";

    // Pagination
    static readonly PAGINATION_CONTAINER = "nav[aria-label*='pagination'], .pagination";
    static readonly PREVIOUS_BUTTON = "button:has-text('Previous'), a:has-text('Previous')";
    static readonly NEXT_BUTTON = "button:has-text('Next'), a:has-text('Next')";
    static readonly PAGE_NUMBERS = "button:has-text('1'), button:has-text('2'), button:has-text('3')";
    
    // Download Popup
    static readonly POPUP_DIALOG = "div[role='dialog'], .modal";
    static readonly POPUP_HEADING = "h2:has-text('Download Report'), div[role='dialog'] h3:has-text('Download Report')";
    static readonly REPORT_COUNT_INPUT = "input[type='number'], input[placeholder*='count']";
    static readonly POPUP_DOWNLOAD_BTN = "div[role='dialog'] button:has-text('Download')";
    static readonly POPUP_CANCEL_BTN = "div[role='dialog'] button:has-text('Cancel')";
    
    // Toasts/Validation
    static readonly TOAST = ".Toastify__toast";
    static readonly VALIDATION_ERROR = ".text-red-500, .error-message, span[class*='error']";
}
