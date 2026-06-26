export default class CustomerReportSuperAdminConstants {
    // Navigation
    static readonly CUSTOMER_REPORT_LINK = "Customer";

    // Table Headers
    static readonly COL_CUSTOMER_NO = "Customer No";
    static readonly COL_NAME = "Name";
    static readonly COL_PHONE = "Phone";
    static readonly COL_CATEGORY = "Category";

    static readonly TABLE_COLUMNS = [
        CustomerReportSuperAdminConstants.COL_CUSTOMER_NO,
        CustomerReportSuperAdminConstants.COL_NAME,
        CustomerReportSuperAdminConstants.COL_PHONE,
        CustomerReportSuperAdminConstants.COL_CATEGORY
    ];

    // Page Elements
    static readonly PAGE_TITLE = "Customer Report";
    static readonly PAGE_DESCRIPTION = "Browse and manage registered customer accounts";
    static readonly REFRESH_BUTTON = "Refresh";
    static readonly DOWNLOAD_REPORT_BUTTON = "Download Report";
    
    // Popup Elements
    static readonly POPUP_TITLE = "Download Report";
    static readonly POPUP_DOWNLOAD_BTN = "Download";
    static readonly POPUP_CANCEL_BTN = "Cancel";
    
    // Validation Messages
    static readonly NO_RECORDS_MESSAGE = "No results found";
    static readonly DOWNLOAD_SUCCESS = "Report downloaded successfully";
    static readonly REQUIRED_ERROR = "Report count is required";
    static readonly MIN_COUNT_ERROR = "Count must be at least 1";
    static readonly MAX_COUNT_ERROR = "Count cannot exceed maximum limit";
    static readonly API_FAILURE_MESSAGE = "Failed to download report";
}
