export default class RolePermissionPage {
    // ── Permission page container ─────────────────────────────────────────────
    // Heading / page indicator confirming the permission assignment screen is loaded
    static readonly PAGE_HEADING = 'h1:has-text("Permission"), h2:has-text("Permission"), '
        + '[class*="heading"]:has-text("Permission"), '
        + 'p:has-text("Role Permission"), span:has-text("Role Permission")';

    // ── Permission dropdown ───────────────────────────────────────────────────
    // Native <select> or custom combobox for selecting a permission
    static readonly PERMISSION_DROPDOWN = 'select[name*="permission"], select[id*="permission"], '
        + 'select:visible, [role="combobox"]:visible';

    // ── Assign Permission button ──────────────────────────────────────────────
    static readonly ASSIGN_BUTTON = 'button:has-text("Assign Permission"), '
        + 'button:has-text("Assign"), '
        + 'button:has-text("Add Permission")';

    // ── Assigned permissions list ─────────────────────────────────────────────
    // Container holding the list of already-assigned permissions
    static readonly ASSIGNED_LIST = '[class*="assigned"], [class*="permission-list"], '
        + 'table tbody, ul[class*="permission"]';

    // A single assigned permission row — scoped by the permission name text
    static assignedPermissionRow(permissionName: string): string {
        return `div:has(p:text-is("${permissionName}")), tr:has-text("${permissionName}"), li:has-text("${permissionName}"), `
            + `[class*="permission-item"]:has-text("${permissionName}")`;
    }

    // ── Permissions count ─────────────────────────────────────────────────────
    // Element showing the total number of assigned permissions ("96 Permissions Assigned", etc.)
    static readonly PERMISSION_COUNT = 'div:has(> p:text-is("Permissions Assigned")), '
        + 'div:has(> span:text-is("Permissions Assigned")), '
        + 'div:has(> p:has-text("Permissions Assigned")), '
        + 'div:has(> span:has-text("Permissions Assigned")), '
        + '[class*="count"]:has-text("Permission"), '
        + 'span:has-text("Permissions Assigned"), '
        + 'p:has-text("Permissions Assigned")';

    // Numeric count inside the count element
    static readonly PERMISSION_COUNT_NUMBER = 'text=/\\d+ Permissions? Assigned/i';

    // ── Search permissions ────────────────────────────────────────────────────
    static readonly PERMISSION_SEARCH = 'input[placeholder*="Search permission"], '
        + 'input[placeholder*="search"], '
        + 'input[type="search"]';

    // ── Delete permission icon ────────────────────────────────────────────────
    // Delete icon scoped to a specific permission row
    static deletePermissionIcon(permissionName: string): string {
        return `div:has(p:text-is("${permissionName}")) button[title="Remove permission"], `
            + `div:has(p:text-is("${permissionName}")) button[aria-label="Remove permission"], `
            + `tr:has-text("${permissionName}") button[title="Delete"], `
            + `tr:has-text("${permissionName}") button[aria-label*="delete"], `
            + `li:has-text("${permissionName}") button[title="Delete"], `
            + `li:has-text("${permissionName}") button[aria-label*="delete"]`;
    }

    // First delete icon when no specific permission name is needed
    static readonly FIRST_DELETE_ICON = 'button[title="Remove permission"], '
        + 'button[aria-label="Remove permission"], '
        + 'tbody tr:first-child button[title="Delete"], '
        + 'ul li:first-child button[title="Delete"]';

    // ── Back button ───────────────────────────────────────────────────────────
    static readonly BACK_BUTTON = 'button:has-text("Back"), a:has-text("Back"), '
        + 'button[aria-label*="Back"]';

    // ── No results / empty state ──────────────────────────────────────────────
    static readonly NO_RESULTS_MESSAGE = 'div:text-is("No data available"), :text-is("No data available"), '
        + 'td:has-text("No data"), td:has-text("No record"), '
        + 'td:has-text("No results"), [class*="empty"]:visible';

    // ── Toast notifications ───────────────────────────────────────────────────
    static readonly SUCCESS_TOAST = '.Toastify__toast--success';
    static readonly ERROR_TOAST = '.Toastify__toast--error';

    // ── Validation messages ───────────────────────────────────────────────────
    static readonly VALIDATION_MESSAGE = '[class*="error"]:visible, [class*="invalid"]:visible, '
        + 'p[class*="text-red"]:visible, span[class*="text-red"]:visible, '
        + '.Toastify__toast--warning:visible, .Toastify__toast--error:visible';
}
