export default class RolePage {
    // ── Sidebar navigation ────────────────────────────────────────────────────
    // "User Management" parent menu — click to expand the submenu
    static readonly MENU_USER_MANAGEMENT = 'button:has-text("User Management"), a:has-text("User Management")';

    // "Role Management" submenu link
    static readonly MENU_ROLE_MANAGEMENT = 'a[href*="role"], a:has-text("Role Management"), a:has-text("Roles")';

    // ── Listing page ──────────────────────────────────────────────────────────
    // Search input on the listing page
    static readonly SEARCH_INPUT = 'main input[placeholder*="Search"], '
        + 'main input[placeholder*="search"], main input[type="search"]';

    // "Create Role" button at the top of the listing
    static readonly CREATE_ROLE_BUTTON = 'button:has-text("Create Role"), '
        + 'button:has-text("+ Role"), button:has-text("Add Role")';

    // Refresh button
    static readonly REFRESH_BUTTON = 'button[aria-label*="Refresh"], '
        + 'button[aria-label*="Reload"], button:has-text("Refresh")';

    // Table rows in role listing
    static readonly TABLE_ROW = "tbody tr";

    // Table column headers
    static readonly COLUMN_NAME_HEADER = 'th:has-text("Name"), th:has-text("Role Name")';
    static readonly COLUMN_DESCRIPTION_HEADER = 'th:has-text("Description")';
    static readonly COLUMN_ACTIONS_HEADER = 'th:has-text("Actions"), th:has-text("Action")';

    // No data / empty state message
    static readonly NO_DATA_MESSAGE = 'td:has-text("No data"), td:has-text("No record"), '
        + 'td:has-text("No results"), [class*="empty"]:visible, td[colspan]:has-text("No")';

    // Pagination controls
    static readonly PAGINATION = '[class*="pagination"], nav[aria-label*="pagination"], [data-slot="pagination"]';

    // ── Row-level action icons ─────────────────────────────────────────────────
    // Permission (Lock) icon — scoped to a row containing the given role name
    static permissionIcon(roleName: string): string {
        return `tr:has-text("${roleName}") button[title*="Permission"], `
            + `tr:has-text("${roleName}") button[title*="permission"], `
            + `tr:has-text("${roleName}") button[aria-label*="permission"], `
            + `tr:has-text("${roleName}") [data-testid*="permission"]`;
    }

    // Edit icon — scoped to a row containing the given role name
    static editIcon(roleName: string): string {
        return `tr:has-text("${roleName}") button[title="Edit"], `
            + `tr:has-text("${roleName}") button[aria-label*="edit"], `
            + `tr:has-text("${roleName}") button[title*="Edit"]`;
    }

    // Delete icon — scoped to a row containing the given role name
    static deleteIcon(roleName: string): string {
        return `tr:has-text("${roleName}") button[title="Delete"], `
            + `tr:has-text("${roleName}") button[aria-label*="delete"], `
            + `tr:has-text("${roleName}") button[title*="Delete"]`;
    }

    // Generic first action icon buttons (used when role name is not available)
    static readonly FIRST_PERMISSION_ICON = 'tbody button[title*="ermission"], '
        + 'tbody button[title*="ock"]';
    static readonly FIRST_EDIT_ICON = 'tbody button[title="Edit"]';
    static readonly FIRST_DELETE_ICON = 'tbody button[title="Delete"]';

    // Row selector by role name — used to verify existence / absence
    static roleRow(roleName: string): string {
        return `tr:has-text("${roleName}")`;
    }

    // ── Create Role popup ─────────────────────────────────────────────────────
    // Popup / modal container
    static readonly CREATE_POPUP = '[role="dialog"], [data-slot="modal-content"], '
        + '.modal-content, [class*="modal"]:visible';

    // Role Name input inside popup
    static readonly ROLE_NAME_INPUT = 'input[placeholder*="Role Name"], input[name*="name"], '
        + 'input[placeholder*="role"], input[placeholder*="Name"]';

    // Description input / textarea inside popup
    static readonly DESCRIPTION_INPUT = 'textarea[placeholder*="description" i], input[placeholder*="description" i], '
        + '[placeholder*="description" i]';

    // "Create Role" submit button inside popup
    static readonly CREATE_SUBMIT_BUTTON = '[role="dialog"] button:has-text("Create Role"), '
        + '[role="dialog"] button:has-text("Create"), '
        + 'button[type="submit"]:has-text("Create")';

    // Cancel button inside popup
    static readonly CANCEL_BUTTON = '[role="dialog"] button:has-text("Cancel"), '
        + '.modal button:has-text("Cancel")';

    // Close (X) button inside popup
    static readonly CLOSE_BUTTON = '[role="dialog"] button:has(span.sr-only:text-is("Close")), '
        + '[role="dialog"] button:has(.lucide-x), '
        + '[role="dialog"] button[aria-label*="close"]';

    // ── Edit Role popup ───────────────────────────────────────────────────────
    // Update button inside edit popup
    static readonly UPDATE_BUTTON = '[role="dialog"] button:has-text("Update"), '
        + 'button:has-text("Update")';

    // ── Delete confirmation popup ─────────────────────────────────────────────
    // SweetAlert2 / confirmation dialog container
    static readonly DELETE_POPUP = '.swal2-popup, [role="alertdialog"], [role="dialog"]:has-text("Are you sure")';

    // "Yes, delete it!" confirm button
    static readonly DELETE_CONFIRM_BUTTON = 'button:has-text("Yes, delete it!"), '
        + 'button.swal2-confirm:has-text("Yes"), button:has-text("Yes")';

    // Cancel button inside delete popup
    static readonly DELETE_CANCEL_BUTTON = '.swal2-popup button:has-text("Cancel"), button.swal2-cancel, '
        + '[role="alertdialog"] button:has-text("Cancel")';

    // ── Toast notifications ───────────────────────────────────────────────────
    static readonly SUCCESS_TOAST = '.Toastify__toast--success';
    static readonly ERROR_TOAST = '.Toastify__toast--error';

    // ── Validation messages ───────────────────────────────────────────────────
    static readonly VALIDATION_MESSAGE = '[class*="error"]:visible, [class*="invalid"]:visible, '
        + 'p[class*="text-red"]:visible, span[class*="text-red"]:visible, '
        + '.field-error:visible, [class*="helper"]:visible';
}
