/**
 * Updates (or replaces) the "Permission( Super admin)" sheet in testData.xlsx — 46 test cases.
 * Run once: node scripts/addPermissionTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "Permission( Super admin)";

const rows = [
    // ── Permission Listing Screen: Positive (TC_PERM_01 to TC_PERM_08) ──
    {
        "TestID": "TC_PERM_01",
        "Issue": "20001",
        "Description": "Verify all permissions are displayed correctly with Resource, Permission, Method, and Actions columns.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "All permissions are displayed correctly in the grid listing.",
        "TC_ID": "TC_PERM_01",
        "Expected_Result": "Verify all permissions are displayed correctly with Resource, Permission, Method, and Actions columns.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_02",
        "Issue": "20002",
        "Description": "Verify searching with a valid permission name returns matching permission records.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Matching permission records are displayed in the list view.",
        "TC_ID": "TC_PERM_02",
        "Expected_Result": "Verify searching with a valid permission name returns matching permission records.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_03",
        "Issue": "20003",
        "Description": "Verify clicking Create Permission opens the Create Permission page/modal successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Create Permission dialog popup is displayed.",
        "TC_ID": "TC_PERM_03",
        "Expected_Result": "Verify clicking Create Permission opens the Create Permission page/modal successfully.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_04",
        "Issue": "20004",
        "Description": "Verify clicking the Permission Assignment (Lock) icon opens the permission-role mapping screen.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Mapping assignments panel opens successfully.",
        "TC_ID": "TC_PERM_04",
        "Expected_Result": "Verify clicking the Permission Assignment (Lock) icon opens the permission-role mapping screen.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_05",
        "Issue": "20005",
        "Description": "Verify clicking the Edit icon opens the selected permission in edit mode with populated data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Edit Permission popup opens with values populated.",
        "TC_ID": "TC_PERM_05",
        "Expected_Result": "Verify clicking the Edit icon opens the selected permission in edit mode with populated data.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_06",
        "Issue": "20006",
        "Description": "Verify clicking the Delete icon opens the delete confirmation popup.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete confirmation popup is displayed correctly.",
        "TC_ID": "TC_PERM_06",
        "Expected_Result": "Verify clicking the Delete icon opens the delete confirmation popup.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_07",
        "Issue": "20007",
        "Description": "Verify clicking the Refresh button reloads the permission list with the latest data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Grid list reloads newest permission values.",
        "TC_ID": "TC_PERM_07",
        "Expected_Result": "Verify clicking the Refresh button reloads the permission list with the latest data.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_08",
        "Issue": "20008",
        "Description": "Verify pagination navigation (Previous, Next, page numbers) loads the correct permission records.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Next/Prev clicks advances table pages.",
        "TC_ID": "TC_PERM_08",
        "Expected_Result": "Verify pagination navigation (Previous, Next, page numbers) loads the correct permission records.",
        "Type": "Positive"
    },

    // ── Permission Listing Screen: Negative (TC_PERM_NEG_01 to TC_PERM_NEG_08) ──
    {
        "TestID": "TC_PERM_NEG_01",
        "Issue": "20009",
        "Description": "Verify searching with a non-existing permission name displays no matching records and an appropriate message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "No records found is displayed.",
        "TC_ID": "TC_PERM_NEG_01",
        "Expected_Result": "Verify searching with a non-existing permission name displays no matching records.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_02",
        "Issue": "20010",
        "Description": "Verify special characters entered in the search field do not break the search functionality.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Search handles characters safely without breaking.",
        "TC_ID": "TC_PERM_NEG_02",
        "Expected_Result": "Verify special characters entered in the search field do not break functionality.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_03",
        "Issue": "20011",
        "Description": "Verify clicking Delete and canceling the confirmation popup does not remove the permission.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission is retained in the listing.",
        "TC_ID": "TC_PERM_NEG_03",
        "Expected_Result": "Verify clicking Delete and canceling confirmation popup does not remove permission.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_04",
        "Issue": "20012",
        "Description": "Verify deleting a permission currently assigned to a role displays a proper validation/error message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows delete failed due to active mapping.",
        "TC_ID": "TC_PERM_NEG_04",
        "Expected_Result": "Verify deleting permission currently assigned to a role displays validation error.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_05",
        "Issue": "20013",
        "Description": "Verify the application handles permission list API failures gracefully and displays an error notification.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Error toaster is displayed and list fails gracefully.",
        "TC_ID": "TC_PERM_NEG_05",
        "Expected_Result": "Verify application handles API failures gracefully.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_06",
        "Issue": "20014",
        "Description": "Verify unauthorized users cannot access Create, Edit, Delete, or Assign Permission actions.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Action buttons are disabled or hidden.",
        "TC_ID": "TC_PERM_NEG_06",
        "Expected_Result": "Verify unauthorized users cannot access permission actions.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_07",
        "Issue": "20015",
        "Description": "Verify multiple rapid clicks on the Refresh button do not create duplicate API requests or UI issues.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Only one network request is sent and UI remains stable.",
        "TC_ID": "TC_PERM_NEG_07",
        "Expected_Result": "Verify multiple rapid refresh clicks do not cause UI issues.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_08",
        "Issue": "20016",
        "Description": "Verify pagination controls are disabled or hidden when there is only one page of permission records.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Pagination remains hidden or disabled.",
        "TC_ID": "TC_PERM_NEG_08",
        "Expected_Result": "Verify pagination controls are disabled when only one page exists.",
        "Type": "Negative"
    },

    // ── Edit Permission Popup: Positive (TC_PERM_09 to TC_PERM_13) ──
    {
        "TestID": "TC_PERM_09",
        "Issue": "20017",
        "Description": "Verify the permission is updated successfully when valid Permission Name, Method, and Resource URL are modified and Update is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission is updated successfully.",
        "TC_ID": "TC_PERM_09",
        "Expected_Result": "Verify permission is updated successfully when valid data is modified.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_10",
        "Issue": "20018",
        "Description": "Verify the updated permission details are reflected in the Permission List after successful update.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission details update correctly in listing.",
        "TC_ID": "TC_PERM_10",
        "Expected_Result": "Verify updated permission details are reflected in Permission List.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_11",
        "Issue": "20019",
        "Description": "Verify clicking Cancel closes the Edit Permission popup without saving any changes.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes and no changes are saved.",
        "TC_ID": "TC_PERM_11",
        "Expected_Result": "Verify clicking Cancel closes Edit popup without saving.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_12",
        "Issue": "20020",
        "Description": "Verify the Method dropdown allows selecting a valid HTTP method (GET, POST, PUT, PATCH, DELETE) and saves correctly.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Selected method is saved successfully.",
        "TC_ID": "TC_PERM_12",
        "Expected_Result": "Verify Method dropdown allows selecting valid HTTP method.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_13",
        "Issue": "20021",
        "Description": "Verify the existing Permission Name, Method, and Resource URL are pre-populated when the Edit Permission popup opens.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "All fields are pre-populated.",
        "TC_ID": "TC_PERM_13",
        "Expected_Result": "Verify existing permission details are pre-populated in Edit popup.",
        "Type": "Positive"
    },

    // ── Edit Permission Popup: Negative (TC_PERM_NEG_09 to TC_PERM_NEG_13) ──
    {
        "TestID": "TC_PERM_NEG_09",
        "Issue": "20022",
        "Description": "Verify an error message is displayed when Permission Name is cleared and Update is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Name is required.",
        "TC_ID": "TC_PERM_NEG_09",
        "Expected_Result": "Verify error when Permission Name is cleared.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_10",
        "Issue": "20023",
        "Description": "Verify updating a permission with an invalid or empty Resource URL is prevented and validation is shown.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows URL is required.",
        "TC_ID": "TC_PERM_NEG_10",
        "Expected_Result": "Verify error when updating with invalid or empty Resource URL.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_11",
        "Issue": "20024",
        "Description": "Verify the system prevents updating a permission with a duplicate Permission Name that already exists.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows duplicate name restriction.",
        "TC_ID": "TC_PERM_NEG_11",
        "Expected_Result": "Verify system prevents duplicate Permission Name updates.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_12",
        "Issue": "20025",
        "Description": "Verify the application displays an error message when the permission update API returns a failure response.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Error toast displays API update failure.",
        "TC_ID": "TC_PERM_NEG_12",
        "Expected_Result": "Verify application displays error on API update failure.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_13",
        "Issue": "20026",
        "Description": "Verify multiple rapid clicks on the Update button do not create duplicate update requests or inconsistent data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Only one click processed safely.",
        "TC_ID": "TC_PERM_NEG_13",
        "Expected_Result": "Verify rapid update clicks do not create duplicate requests.",
        "Type": "Negative"
    },

    // ── Delete Permission Confirmation Popup: Positive (TC_PERM_14 to TC_PERM_18) ──
    {
        "TestID": "TC_PERM_14",
        "Issue": "20027",
        "Description": "Verify clicking Delete successfully removes the selected permission and updates the permission list.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission is deleted successfully.",
        "TC_ID": "TC_PERM_14",
        "Expected_Result": "Verify clicking Delete successfully removes the selected permission.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_15",
        "Issue": "20028",
        "Description": "Verify a success message is displayed after successful permission deletion.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Success toast is displayed correctly.",
        "TC_ID": "TC_PERM_15",
        "Expected_Result": "Verify a success message is displayed after successful deletion.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_16",
        "Issue": "20029",
        "Description": "Verify clicking Cancel closes the confirmation popup without deleting the permission.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes and permission is retained.",
        "TC_ID": "TC_PERM_16",
        "Expected_Result": "Verify clicking Cancel closes confirmation popup without deleting.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_17",
        "Issue": "20030",
        "Description": "Verify the permission count/list is refreshed automatically after successful deletion.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Count is refreshed automatically.",
        "TC_ID": "TC_PERM_17",
        "Expected_Result": "Verify permission count is refreshed automatically after deletion.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_18",
        "Issue": "20031",
        "Description": "Verify the delete confirmation popup is displayed when the user clicks the Delete icon for a permission.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete confirmation popup is displayed.",
        "TC_ID": "TC_PERM_18",
        "Expected_Result": "Verify delete confirmation popup is displayed on Delete icon click.",
        "Type": "Positive"
    },

    // ── Delete Permission Confirmation Popup: Negative (TC_PERM_NEG_14 to TC_PERM_NEG_18) ──
    {
        "TestID": "TC_PERM_NEG_14",
        "Issue": "20032",
        "Description": "Verify deleting a permission assigned to one or more roles is prevented and an appropriate error message is displayed.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation blocks deletion.",
        "TC_ID": "TC_PERM_NEG_14",
        "Expected_Result": "Verify deleting assigned permission is prevented.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_15",
        "Issue": "20033",
        "Description": "Verify permission deletion fails gracefully when the delete API returns an error response.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete fails gracefully showing API error.",
        "TC_ID": "TC_PERM_NEG_15",
        "Expected_Result": "Verify deletion fails gracefully on API error.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_16",
        "Issue": "20034",
        "Description": "Verify multiple rapid clicks on the Delete button do not trigger duplicate delete requests.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Only one click processed.",
        "TC_ID": "TC_PERM_NEG_16",
        "Expected_Result": "Verify rapid delete clicks do not trigger duplicate requests.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_17",
        "Issue": "20035",
        "Description": "Verify the permission remains unchanged when the popup is dismissed or canceled.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission is retained unchanged.",
        "TC_ID": "TC_PERM_NEG_17",
        "Expected_Result": "Verify permission remains unchanged on popup cancel.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_18",
        "Issue": "20036",
        "Description": "Verify unauthorized users cannot delete permissions and receive an access-denied message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete is blocked and access denied displays.",
        "TC_ID": "TC_PERM_NEG_18",
        "Expected_Result": "Verify unauthorized users cannot delete permissions.",
        "Type": "Negative"
    },

    // ── Create Permission Popup: Positive (TC_PERM_19 to TC_PERM_23) ──
    {
        "TestID": "TC_PERM_19",
        "Issue": "20037",
        "Description": "Verify a new permission is created successfully when valid Permission Name, Method, and Resource URL are provided.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission is created successfully.",
        "TC_ID": "TC_PERM_19",
        "Expected_Result": "Verify new permission is created successfully with valid data.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_20",
        "Issue": "20038",
        "Description": "Verify the created permission appears in the permissions list immediately after saving.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Created permission is shown in list view grid.",
        "TC_ID": "TC_PERM_20",
        "Expected_Result": "Verify created permission appears in list immediately.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_21",
        "Issue": "20039",
        "Description": "Verify all supported HTTP methods (GET, POST, PUT, PATCH, DELETE) can be selected and saved successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "All HTTP method options save successfully.",
        "TC_ID": "TC_PERM_21",
        "Expected_Result": "Verify all supported HTTP methods can be saved.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_22",
        "Issue": "20040",
        "Description": "Verify clicking Cancel closes the popup without creating a permission.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes without saving any new permission.",
        "TC_ID": "TC_PERM_22",
        "Expected_Result": "Verify clicking Cancel closes popup without creating.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_PERM_23",
        "Issue": "20041",
        "Description": "Verify the popup closes and a success notification is displayed after successful permission creation.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes and success toast appears.",
        "TC_ID": "TC_PERM_23",
        "Expected_Result": "Verify popup closes and success notification displays.",
        "Type": "Positive"
    },

    // ── Create Permission Popup: Negative (TC_PERM_NEG_19 to TC_PERM_NEG_23) ──
    {
        "TestID": "TC_PERM_NEG_19",
        "Issue": "20042",
        "Description": "Verify an error message is displayed when attempting to save with an empty Permission Name.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Name is required.",
        "TC_ID": "TC_PERM_NEG_19",
        "Expected_Result": "Verify error message when saving with empty Permission Name.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_20",
        "Issue": "20043",
        "Description": "Verify an error message is displayed when Method is not selected.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Method must be selected.",
        "TC_ID": "TC_PERM_NEG_20",
        "Expected_Result": "Verify error message when Method is not selected.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_21",
        "Issue": "20044",
        "Description": "Verify an error message is displayed when Resource URL is left blank.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Resource URL is required.",
        "TC_ID": "TC_PERM_NEG_21",
        "Expected_Result": "Verify error message when Resource URL is blank.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_22",
        "Issue": "20045",
        "Description": "Verify duplicate Permission Names cannot be created and an appropriate validation message is shown.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows duplicate name is restricted.",
        "TC_ID": "TC_PERM_NEG_22",
        "Expected_Result": "Verify duplicate Permission Names cannot be created.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_PERM_NEG_23",
        "Issue": "20046",
        "Description": "Verify invalid Resource URL formats (e.g., special characters only or malformed path) are rejected and the permission is not created.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Resource URL is malformed.",
        "TC_ID": "TC_PERM_NEG_23",
        "Expected_Result": "Verify invalid Resource URL formats are rejected.",
        "Type": "Negative"
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
    "TC_ID",
    "Expected_Result",
    "Type"
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
