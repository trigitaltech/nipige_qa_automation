/**
 * Updates (or replaces) the "RoleManagementTest" sheet in testData.xlsx — 38 test cases.
 * Run once: node scripts/addRoleManagementTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "RoleManagementTest";

const rows = [
    // ── Listing Screen (TC01 to TC10) ──
    {
        "TestID": "TC01_RolePageLoad",
        "Issue": "31001",
        "Description": "Verify all roles are displayed in the grid with correct Name, Description, and Action icons.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Grid displays role headers and elements.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC02_RoleGridDisplay",
        "Issue": "31002",
        "Description": "Verify the role listing grid displays edit/delete action controls successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Action icons are visible for records.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC03_SearchValidRole",
        "Issue": "31003",
        "Description": "Verify the Search functionality returns matching roles when a valid role name is entered.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Search returns matched role successfully.",
        "SearchTerm": "Admin", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC04_SearchInvalidRole",
        "Issue": "31004",
        "Description": "Verify no records are displayed and a proper message appears when searching with a non-existing role name.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "No records found is displayed.",
        "SearchTerm": "NONEXISTENT_ROLE_99999", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC05_CreateRoleButtonPopup",
        "Issue": "31005",
        "Description": "Verify clicking Create Role navigates to the Create Role page/modal successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Create popup opens successfully.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC06_LockIconPermPage",
        "Issue": "31006",
        "Description": "Verify clicking the Permission (Lock) icon opens the role permissions page for the selected role.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Redirects to Role Permissions screen.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC07_EditIconPopup",
        "Issue": "31007",
        "Description": "Verify clicking the Edit icon opens the selected role details in edit mode.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Edit role popup is visible.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC08_DeleteIconPopup",
        "Issue": "31008",
        "Description": "Verify clicking the Delete icon displays the delete confirmation popup.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete confirmation popup displays.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC09_RefreshReloads",
        "Issue": "31009",
        "Description": "Verify clicking the Refresh button reloads the role list with the latest data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Listing updates with latest roles.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC10_PaginationVisible",
        "Issue": "31010",
        "Description": "Verify pagination works correctly when navigating between role list pages.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Pagination controls redirect matching rows.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },

    // ── Create Role (TC11 to TC17) ──
    {
        "TestID": "TC11_CreateRoleSuccess",
        "Issue": "31011",
        "Description": "Verify a new role is created successfully when valid Role Name and Description are entered.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Role is created successfully.",
        "SearchTerm": "", "RoleName": "AutoRole", "Description_Input": "Description for AutoRole", "PermissionName": ""
    },
    {
        "TestID": "TC12_CreatedRoleInListing",
        "Issue": "31012",
        "Description": "Verify the newly created role appears in the Role List after successful creation.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Role displays in grid.",
        "SearchTerm": "", "RoleName": "ListRole", "Description_Input": "Description for ListRole", "PermissionName": ""
    },
    {
        "TestID": "TC13_CancelClosesCreatePopup",
        "Issue": "31013",
        "Description": "Verify clicking Cancel closes the Create Role popup without creating a role.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes; listing is unchanged.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC14_CloseXClosesCreatePopup",
        "Issue": "31014",
        "Description": "Verify the Close (X) icon closes the popup successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes safely.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC15_RoleNameRequiredValidation",
        "Issue": "31015",
        "Description": "Verify an error message is displayed when Role Name is left blank and Create Role is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Name is required.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "Description for invalid name", "PermissionName": ""
    },
    {
        "TestID": "TC16_SpacesOnlyRoleName",
        "Issue": "31016",
        "Description": "Verify role creation is prevented when only spaces are entered in the Role Name field.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Spaces only is blocked with validation warning.",
        "SearchTerm": "", "RoleName": "     ", "Description_Input": "Description for spaces name", "PermissionName": ""
    },
    {
        "TestID": "TC17_DuplicateRoleValidation",
        "Issue": "31017",
        "Description": "Verify creating a role with an existing Role Name displays a duplicate-role validation message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Warning toast displays duplicate validation block.",
        "SearchTerm": "", "RoleName": "DuplicateRole", "Description_Input": "Description for duplicate", "PermissionName": ""
    },

    // ── Permissions On Role (TC18 to TC26) ──
    {
        "TestID": "TC18_PermissionPageOpens",
        "Issue": "31018",
        "Description": "Verify role permission screen page opens for the role.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Role permissions heading is visible.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC19_AssignPermissionToast",
        "Issue": "31019",
        "Description": "Verify a permission can be successfully selected from the dropdown and assigned to the role.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Assigned successfully toaster displays.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": "View Features"
    },
    {
        "TestID": "TC20_PermissionCountIncrements",
        "Issue": "31020",
        "Description": "Verify the Permissions Assigned count increments by 1 after adding a new permission.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permissions count increments.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": "View Features"
    },
    {
        "TestID": "TC21_PermissionSearchValid",
        "Issue": "31021",
        "Description": "Verify searching with a valid permission name displays matching permissions in the list.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Search returns matched permission row.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": "View Features"
    },
    {
        "TestID": "TC22_PermissionSearchInvalid",
        "Issue": "31022",
        "Description": "Verify searching with an invalid/non-existing permission name returns no matching results.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Zero records found displayed.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": "NONEXISTENT_PERMISSION_XYZ_99999"
    },
    {
        "TestID": "TC23_DeletePermission",
        "Issue": "31023",
        "Description": "Verify clicking the Delete icon removes the selected permission from the role successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission is removed from list.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": "View Features"
    },
    {
        "TestID": "TC24_PermissionCountDecrements",
        "Issue": "31024",
        "Description": "Verify the Permissions Assigned count decrements after a permission is removed.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permissions count decrements.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": "View Features"
    },
    {
        "TestID": "TC25_BackButtonReturnsListing",
        "Issue": "31025",
        "Description": "Verify the Back button navigates the user back to the Role List screen.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Redirects back to main Role List screen.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC26_AssignWithoutSelectValidation",
        "Issue": "31026",
        "Description": "Verify clicking Assign Permission without selecting a permission displays a validation message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation warns on empty selection.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },

    // ── Edit Role (TC27 to TC33) ──
    {
        "TestID": "TC27_EditPopupPrePopulated",
        "Issue": "31027",
        "Description": "Verify the existing Role Name and Description are pre-populated when the Edit popup is opened.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Existing description and names are pre-filled in dialog.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC28_UpdateDescription",
        "Issue": "31028",
        "Description": "Verify the role description can be updated successfully with valid data and a success message is displayed.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Update finishes; success toast displays.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "Updated Description", "PermissionName": ""
    },
    {
        "TestID": "TC29_UpdatedDescriptionSaved",
        "Issue": "31029",
        "Description": "Verify clicking Update saves the modified role details and refreshes the role list with updated information.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "New description is visible.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "Persisted Updated Description", "PermissionName": ""
    },
    {
        "TestID": "TC30_CancelClosesEditPopup",
        "Issue": "31030",
        "Description": "Verify clicking Cancel closes the Edit Role popup without saving any changes.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes; fields rollback.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC31_CloseXClosesEditPopup",
        "Issue": "31031",
        "Description": "Verify the Edit Role popup closes successfully when the Close (X) icon is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes cleanly.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC32_EmptyDescriptionValidation",
        "Issue": "31032",
        "Description": "Verify an error message is displayed when the Description field is cleared and Update is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Description is required.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC33_SpacesDescriptionValidation",
        "Issue": "31033",
        "Description": "Verify the system prevents updating a role with only spaces entered in the Description field.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Spaces only is blocked with validation warning.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "     ", "PermissionName": ""
    },

    // ── Delete Role (TC34 to TC38) ──
    {
        "TestID": "TC34_DeletePopupVisible",
        "Issue": "31034",
        "Description": "Verify the delete confirmation popup displays when the user clicks the Delete icon for a role.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete warning modal opens successfully.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC35_CancelDeletePreservesRole",
        "Issue": "31035",
        "Description": "Verify clicking \"Cancel\" closes the confirmation popup without deleting the role.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes; role is preserved in list.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC36_ConfirmDeleteSuccess",
        "Issue": "31036",
        "Description": "Verify clicking \"Yes, delete it!\" successfully deletes the selected role and removes it from the role list.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Role deleted successfully.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC37_DeletedRoleNotInListing",
        "Issue": "31037",
        "Description": "Verify the role count/list is refreshed automatically after successful deletion.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Deleted role no longer visible in list.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    },
    {
        "TestID": "TC38_DeleteSuccessMessage",
        "Issue": "31038",
        "Description": "Verify a success message is displayed after successful role deletion.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Success toast is displayed.",
        "SearchTerm": "", "RoleName": "", "Description_Input": "", "PermissionName": ""
    }
];

const headers = [
    "TestID",
    "Issue",
    "Description",
    "UserName",
    "Password",
    "persona",
    "ExpectedResult",
    "SearchTerm",
    "RoleName",
    "Description_Input",
    "PermissionName"
];

const wsData = [
    headers,
    ...rows.map((r) => headers.map((h) => r[h] || "")),
];

try {
    const wb = XLSX.readFile(FILE);
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    if (wb.SheetNames.includes(SHEET_NAME)) {
        const idx = wb.SheetNames.indexOf(SHEET_NAME);
        wb.SheetNames.splice(idx, 1);
        delete wb.Sheets[SHEET_NAME];
        console.log(`Removed existing sheet: "${SHEET_NAME}"`);
    }

    XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
    XLSX.writeFile(wb, FILE);
    console.log(`Successfully updated ${rows.length} rows in '${SHEET_NAME}' sheet in ${FILE}`);
} catch (err) {
    console.error("Failed to update testData.xlsx:", err.message);
    process.exit(1);
}
