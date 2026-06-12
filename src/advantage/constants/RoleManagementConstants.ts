export default class RoleManagementConstants {
    // Navigation
    static readonly ROLE_MANAGEMENT_PAGE = "Role Management Page";
    static readonly MENU_USER_MANAGEMENT = "User Management Menu";
    static readonly MENU_ROLE_MANAGEMENT = "Role Management Menu Item";

    // Listing page
    static readonly SEARCH_INPUT = "Role Search Input";
    static readonly CREATE_ROLE_BUTTON = "Create Role Button";
    static readonly REFRESH_BUTTON = "Refresh Button";
    static readonly NO_DATA_MESSAGE = "No Data Message";
    static readonly ROLE_ROW = "Role Table Row";

    // Columns
    static readonly COLUMN_NAME = "Name Column";
    static readonly COLUMN_DESCRIPTION = "Description Column";
    static readonly COLUMN_ACTIONS = "Actions Column";

    // Action icons per row
    static readonly PERMISSION_ICON = "Permission (Lock) Icon";
    static readonly EDIT_ICON = "Edit Icon";
    static readonly DELETE_ICON = "Delete Icon";

    // Pagination
    static readonly PAGINATION = "Pagination Controls";

    // Create Role popup
    static readonly CREATE_ROLE_POPUP = "Create Role Popup";
    static readonly ROLE_NAME_INPUT = "Role Name Input";
    static readonly DESCRIPTION_INPUT = "Description Input";
    static readonly CREATE_SUBMIT_BUTTON = "Create Role Submit Button";
    static readonly CANCEL_BUTTON = "Cancel Button";
    static readonly CLOSE_BUTTON = "Close (X) Button";

    // Edit Role popup
    static readonly EDIT_ROLE_POPUP = "Edit Role Popup";
    static readonly UPDATE_BUTTON = "Update Button";

    // Delete confirmation popup
    static readonly DELETE_POPUP = "Delete Confirmation Popup";
    static readonly DELETE_CONFIRM_BUTTON = "Yes, delete it! Button";
    static readonly DELETE_CANCEL_BUTTON = "Cancel Delete Button";

    // Role Permission page
    static readonly PERMISSION_PAGE = "Role Permission Page";
    static readonly PERMISSION_DROPDOWN = "Permission Dropdown";
    static readonly ASSIGN_BUTTON = "Assign Permission Button";
    static readonly PERMISSION_LIST = "Assigned Permissions List";
    static readonly PERMISSION_COUNT = "Assigned Permissions Count";
    static readonly PERMISSION_SEARCH = "Search Permissions Input";
    static readonly DELETE_PERMISSION_ICON = "Delete Permission Icon";
    static readonly BACK_BUTTON = "Back Button";

    // Toast messages
    static readonly SUCCESS_TOAST = "Success Toast";
    static readonly PERMISSION_ASSIGNED_TOAST = "Permission added to role!";

    // Validation
    static readonly VALIDATION_MESSAGE = "Validation Error Message";

    // Dynamic test data prefixes
    static readonly ROLE_PREFIX = "AutoRole_";
    static readonly DELETE_PREFIX = "AutoDelete_";
    static readonly EDIT_PREFIX = "AutoEdit_";

    // Static search data
    static readonly SEARCH_VALID_ROLE = "Agent";
    static readonly SEARCH_INVALID_ROLE = "INVALID_ROLE_123";
    static readonly SEARCH_INVALID_PERMISSION = "INVALID_PERMISSION_123";
}
