/**
 * Updates (or replaces) the "FeaturesSuperAdminTest" and "Features(Admin)" sheets in testData.xlsx — 66 test cases.
 * Run once: node scripts/addFeaturesTestSheets.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");

const rows = [
    // ── Positive Test Cases (TC_FEAT_01 to TC_FEAT_33) ──
    {
        "TestID": "TC_FEAT_01",
        "Issue": "24001",
        "Description": "Verify the Features page loads successfully with Feature Name, Description, Permissions, and Action columns displayed.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Features listing page loads with expected controls, columns and records.",
        "TC_ID": "TC_FEAT_01",
        "Scenario": "Verify Features landing page loads successfully with expected elements.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_02",
        "Issue": "24002",
        "Description": "Verify searching with a valid Feature Name returns the correct feature record.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Matching Feature Name is displayed in listing.",
        "TC_ID": "TC_FEAT_02",
        "Scenario": "Verify searching with a valid Feature Name returns the correct feature record.",
        "Test Data": "F"
    },
    {
        "TestID": "TC_FEAT_03",
        "Issue": "24003",
        "Description": "Verify clicking Create Feature opens the Create Feature popup/page successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Create Feature form input fields load successfully.",
        "TC_ID": "TC_FEAT_03",
        "Scenario": "Verify clicking Create Feature opens the Create Feature form.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_04",
        "Issue": "24004",
        "Description": "Verify clicking the View (Eye) icon opens the selected feature details page.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature details page opens.",
        "TC_ID": "TC_FEAT_04",
        "Scenario": "Verify clicking the View icon opens details screen.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_05",
        "Issue": "24005",
        "Description": "Verify clicking the Edit icon opens the feature edit form with pre-populated data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Edit form loads pre-populated correctly.",
        "TC_ID": "TC_FEAT_05",
        "Scenario": "Verify clicking Edit opens edit screen with values.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_06",
        "Issue": "24006",
        "Description": "Verify clicking the Delete icon opens the delete confirmation popup.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete confirmation modal displays.",
        "TC_ID": "TC_FEAT_06",
        "Scenario": "Verify clicking Delete icon opens delete warning.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_07",
        "Issue": "24007",
        "Description": "Verify the Permissions count displayed for each feature matches the actual assigned permissions.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Correct count matches grid table values.",
        "TC_ID": "TC_FEAT_07",
        "Scenario": "Verify permissions count value logic matches.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_08",
        "Issue": "24008",
        "Description": "Verify clicking the Refresh icon reloads the latest feature data successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Listing reloads newest database records.",
        "TC_ID": "TC_FEAT_08",
        "Scenario": "Verify refresh trigger updates list values.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_09",
        "Issue": "24009",
        "Description": "Verify pagination/navigation loads the correct records when moving between pages.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Next/Prev buttons advances pagination pages.",
        "TC_ID": "TC_FEAT_09",
        "Scenario": "Verify pagination updates grid records.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_10",
        "Issue": "24010",
        "Description": "Verify Feature Details page loads successfully with correct Feature Name and Description.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Selected name and description load correct details.",
        "TC_ID": "TC_FEAT_10",
        "Scenario": "Verify Feature details screen loads correctly.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_11",
        "Issue": "24011",
        "Description": "Verify all assigned permissions are displayed with correct Resource, Permission, and Method values.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Assigned permissions list values display correctly.",
        "TC_ID": "TC_FEAT_11",
        "Scenario": "Verify permission attributes display cleanly.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_12",
        "Issue": "24012",
        "Description": "Verify clicking Edit Feature opens the Edit Feature screen with pre-populated data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Edit screen redirect matches current feature.",
        "TC_ID": "TC_FEAT_12",
        "Scenario": "Verify edit details screen redirects correctly.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_13",
        "Issue": "24013",
        "Description": "Verify clicking Delete Feature opens the delete confirmation popup.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete confirmation modal displays on click.",
        "TC_ID": "TC_FEAT_13",
        "Scenario": "Verify delete details warning popup loads.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_14",
        "Issue": "24014",
        "Description": "Verify clicking the Back Arrow navigates back to the Features listing page successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Redirects back to main listing view grid.",
        "TC_ID": "TC_FEAT_14",
        "Scenario": "Verify back arrow redirects back to features list.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_15",
        "Issue": "24015",
        "Description": "Verify permission details displayed match the data stored for the selected feature.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permissions matching feature store record values display.",
        "TC_ID": "TC_FEAT_15",
        "Scenario": "Verify details permission store record validation.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_16",
        "Issue": "24016",
        "Description": "Verify feature details are pre-populated correctly when the Edit Feature page loads.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Inputs match current values.",
        "TC_ID": "TC_FEAT_16",
        "Scenario": "Verify pre-populated edit fields matching feature.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_17",
        "Issue": "24017",
        "Description": "Verify the feature is updated successfully when valid Feature Name and Description are modified and Update is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature updates persist successfully.",
        "TC_ID": "TC_FEAT_17",
        "Scenario": "Verify save updates features values successfully.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_18",
        "Issue": "24018",
        "Description": "Verify a permission can be selected from the dropdown and added successfully using the Add button.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission is added to edit layout grid.",
        "TC_ID": "TC_FEAT_18",
        "Scenario": "Verify select dropdown option adds permission.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_19",
        "Issue": "24019",
        "Description": "Verify multiple permissions can be added to the feature and displayed in the permissions table.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Multiple rows render in edit permissions layout.",
        "TC_ID": "TC_FEAT_19",
        "Scenario": "Verify multiple permissions mapping in table.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_20",
        "Issue": "24020",
        "Description": "Verify the Refresh icon reloads the latest permission list successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission select choices updates.",
        "TC_ID": "TC_FEAT_20",
        "Scenario": "Verify refresh updates dropdown items.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_21",
        "Issue": "24021",
        "Description": "Verify clicking Cancel navigates back without saving any changes.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Redirects back to main grid; no updates saved.",
        "TC_ID": "TC_FEAT_21",
        "Scenario": "Verify cancel edit closes screen without update.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_22",
        "Issue": "24022",
        "Description": "Verify the updated feature details and permissions are reflected correctly after saving.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Main grid reflects saved changes.",
        "TC_ID": "TC_FEAT_22",
        "Scenario": "Verify updates reflect correctly on listing grid.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_23",
        "Issue": "24023",
        "Description": "Verify clicking \"Yes, delete\" successfully deletes the selected feature and removes it from the feature list.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature is deleted successfully.",
        "TC_ID": "TC_FEAT_23",
        "Scenario": "Verify confirming delete removes the feature.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_24",
        "Issue": "24024",
        "Description": "Verify clicking \"Cancel\" closes the confirmation popup without deleting the feature.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Confirmation popup closes and feature is retained.",
        "TC_ID": "TC_FEAT_24",
        "Scenario": "Verify cancelling delete popup keeps the feature.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_25",
        "Issue": "24025",
        "Description": "Verify clicking the Close (X) icon closes the popup and retains the feature.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Popup closes; feature remains.",
        "TC_ID": "TC_FEAT_25",
        "Scenario": "Verify X close warning popup keeps the feature.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_26",
        "Issue": "24026",
        "Description": "Verify a success message is displayed after successful feature deletion.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Success toast is displayed.",
        "TC_ID": "TC_FEAT_26",
        "Scenario": "Verify delete success toast displays.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_27",
        "Issue": "24027",
        "Description": "Verify a new feature is created successfully when valid Feature Name, Description, and Permission are provided.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature is created successfully.",
        "TC_ID": "TC_FEAT_27",
        "Scenario": "Verify creation with valid data succeeds.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_28",
        "Issue": "24028",
        "Description": "Verify multiple permissions can be added to the feature and displayed correctly in the permissions table.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Multiple permissions rows displayed.",
        "TC_ID": "TC_FEAT_28",
        "Scenario": "Verify mapping multiple permissions in creation.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_29",
        "Issue": "24029",
        "Description": "Verify the selected permission details (Resource, Permission, Method) appear in the table after clicking Add.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Row displays valid details in creation grid.",
        "TC_ID": "TC_FEAT_29",
        "Scenario": "Verify details render on permission mapping grid.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_30",
        "Issue": "24030",
        "Description": "Verify clicking Refresh reloads the latest permission list in the dropdown.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Dropdown list refreshes successfully.",
        "TC_ID": "TC_FEAT_30",
        "Scenario": "Verify refresh updates creation dropdown values.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_31",
        "Issue": "24031",
        "Description": "Verify clicking Save successfully stores the feature and redirects to the Features list page.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature stores; redirects user to main listing page.",
        "TC_ID": "TC_FEAT_31",
        "Scenario": "Verify save updates features database successfully.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_32",
        "Issue": "24032",
        "Description": "Verify clicking Cancel navigates back without creating a new feature.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Redirects back to main grid; no new record saved.",
        "TC_ID": "TC_FEAT_32",
        "Scenario": "Verify cancel closes creation popup without saving.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_33",
        "Issue": "24033",
        "Description": "Verify the newly created feature appears in the Features listing with the correct permission count.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "New feature displays in main grid list.",
        "TC_ID": "TC_FEAT_33",
        "Scenario": "Verify new feature appears in main grid listing.",
        "Test Data": ""
    },

    // ── Negative Test Cases (TC_FEAT_NEG_01 to TC_FEAT_NEG_33) ──
    {
        "TestID": "TC_FEAT_NEG_01",
        "Issue": "24034",
        "Description": "Verify searching with a non-existent Feature Name displays \"No Records Found\" or an empty result set.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "\"No Records Found\" is displayed.",
        "TC_ID": "TC_FEAT_NEG_01",
        "Scenario": "Verify empty results state on invalid searches.",
        "Test Data": "NON_EXISTENT_FEAT_XYZ_9999"
    },
    {
        "TestID": "TC_FEAT_NEG_02",
        "Issue": "24035",
        "Description": "Verify searching with special characters only (e.g., @#$%^) does not crash the application.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Special characters are handled safely.",
        "TC_ID": "TC_FEAT_NEG_02",
        "Scenario": "Verify special characters handled safely.",
        "Test Data": "@#$%^&*()_+"
    },
    {
        "TestID": "TC_FEAT_NEG_03",
        "Issue": "24036",
        "Description": "Verify clicking View for a deleted/non-existing feature shows an appropriate error message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Details fallback error displays.",
        "TC_ID": "TC_FEAT_NEG_03",
        "Scenario": "Verify fallback error on deleted details view.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_04",
        "Issue": "24037",
        "Description": "Verify clicking Edit for a feature without sufficient permissions displays an access denied message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Access Denied warning displays.",
        "TC_ID": "TC_FEAT_NEG_04",
        "Scenario": "Verify unauthorized edit blocks action.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_05",
        "Issue": "24038",
        "Description": "Verify clicking Delete and canceling the confirmation does not remove the feature.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature is retained.",
        "TC_ID": "TC_FEAT_NEG_05",
        "Scenario": "Verify cancelling delete confirms retention.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_06",
        "Issue": "24039",
        "Description": "Verify attempting to delete a feature linked to active permissions shows a proper validation/error message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation blocks deletion.",
        "TC_ID": "TC_FEAT_NEG_06",
        "Scenario": "Verify delete linked mapping is prevented.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_07",
        "Issue": "24040",
        "Description": "Verify the page handles API/network failure gracefully while loading features.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Graceful error alert is displayed.",
        "TC_ID": "TC_FEAT_NEG_07",
        "Scenario": "Verify page handles list API failures.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_08",
        "Issue": "24041",
        "Description": "Verify pagination controls are disabled or handled correctly when no additional pages exist.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Pagination remains disabled.",
        "TC_ID": "TC_FEAT_NEG_08",
        "Scenario": "Verify pagination disabled state logic.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_09",
        "Issue": "24042",
        "Description": "Verify rapid repeated clicks on Refresh, View, Edit, or Delete do not create duplicate requests or UI inconsistencies.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "UI is stable; requests are single-processed.",
        "TC_ID": "TC_FEAT_NEG_09",
        "Scenario": "Verify rapid list actions handles safely.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_10",
        "Issue": "24043",
        "Description": "Verify an appropriate error message is displayed when the feature details API returns no data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "API empty response warning is displayed.",
        "TC_ID": "TC_FEAT_NEG_10",
        "Scenario": "Verify details empty API warning logic.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_11",
        "Issue": "24044",
        "Description": "Verify the page handles network/API failure gracefully while loading feature details.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Toaster error shows connection problem gracefully.",
        "TC_ID": "TC_FEAT_NEG_11",
        "Scenario": "Verify graceful error on details API failure.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_12",
        "Issue": "24045",
        "Description": "Verify clicking Edit Feature without edit permission displays an access denied message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Edit option blocked.",
        "TC_ID": "TC_FEAT_NEG_12",
        "Scenario": "Verify details edit blocks unauthorized actions.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_13",
        "Issue": "24046",
        "Description": "Verify clicking Delete Feature without delete permission does not allow feature deletion.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete action blocked.",
        "TC_ID": "TC_FEAT_NEG_13",
        "Scenario": "Verify details delete blocks unauthorized actions.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_14",
        "Issue": "24047",
        "Description": "Verify the page displays a proper message when a feature has no assigned permissions.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "\"No Permissions Assigned\" is displayed.",
        "TC_ID": "TC_FEAT_NEG_14",
        "Scenario": "Verify empty permissions list warning display.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_15",
        "Issue": "24048",
        "Description": "Verify accessing the details page with an invalid/deleted Feature ID shows a \"Feature Not Found\" error page/message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "\"Feature Not Found\" fallback is displayed.",
        "TC_ID": "TC_FEAT_NEG_15",
        "Scenario": "Verify invalid ID details view throws not found.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_16",
        "Issue": "24049",
        "Description": "Verify an error message is displayed when Feature Name is cleared and Update is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Name is required.",
        "TC_ID": "TC_FEAT_NEG_16",
        "Scenario": "Verify error when saving cleared feature name.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_17",
        "Issue": "24050",
        "Description": "Verify an error message is displayed when Description is left empty and Update is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Description is required.",
        "TC_ID": "TC_FEAT_NEG_17",
        "Scenario": "Verify error when saving empty description.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_18",
        "Issue": "24051",
        "Description": "Verify a duplicate permission cannot be added to the same feature.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Warning shows duplicate permission mapping is restricted.",
        "TC_ID": "TC_FEAT_NEG_18",
        "Scenario": "Verify duplicate permission mapping blocked.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_19",
        "Issue": "24052",
        "Description": "Verify clicking Add without selecting a permission does not add any record and shows validation.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "No row is added; validation triggers.",
        "TC_ID": "TC_FEAT_NEG_19",
        "Scenario": "Verify empty mapping add click validation.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_20",
        "Issue": "24053",
        "Description": "Verify special characters-only input in Feature Name is rejected if validation rules do not allow it.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Name format is invalid.",
        "TC_ID": "TC_FEAT_NEG_20",
        "Scenario": "Verify special character name inputs rejected.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_21",
        "Issue": "24054",
        "Description": "Verify the page handles API/network failure gracefully during feature update.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Error toast displays gracefully.",
        "TC_ID": "TC_FEAT_NEG_21",
        "Scenario": "Verify graceful error on edit update failure.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_22",
        "Issue": "24055",
        "Description": "Verify deleting/removing a permission and clicking Cancel does not persist the change.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission is retained in the feature mapping.",
        "TC_ID": "TC_FEAT_NEG_22",
        "Scenario": "Verify cancelling edit doesn't persist removals.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_23",
        "Issue": "24056",
        "Description": "Verify deletion is prevented and an error message is displayed if the feature is associated with active dependencies.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation toast blocks delete.",
        "TC_ID": "TC_FEAT_NEG_23",
        "Scenario": "Verify delete linked dependencies is prevented.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_24",
        "Issue": "24057",
        "Description": "Verify the popup handles API/server failure gracefully when \"Yes, delete\" is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Error toast displays gracefully on delete failure.",
        "TC_ID": "TC_FEAT_NEG_24",
        "Scenario": "Verify graceful error on delete API failure.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_25",
        "Issue": "24058",
        "Description": "Verify multiple rapid clicks on \"Yes, delete\" do not trigger duplicate delete requests.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Only one click is processed.",
        "TC_ID": "TC_FEAT_NEG_25",
        "Scenario": "Verify rapid delete clicks handles safely.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_26",
        "Issue": "24059",
        "Description": "Verify attempting to delete a feature without delete permission displays an authorization/access denied message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete is blocked and access denied displays.",
        "TC_ID": "TC_FEAT_NEG_26",
        "Scenario": "Verify unauthorized delete action is blocked.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_27",
        "Issue": "24060",
        "Description": "Verify an error message is displayed when Feature Name is left blank and Save is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Name is required.",
        "TC_ID": "TC_FEAT_NEG_27",
        "Scenario": "Verify error when saving blank feature name.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_28",
        "Issue": "24061",
        "Description": "Verify an error message is displayed when Description is left blank and Save is clicked.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Description is required.",
        "TC_ID": "TC_FEAT_NEG_28",
        "Scenario": "Verify error when saving blank description.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_29",
        "Issue": "24062",
        "Description": "Verify clicking Add without selecting a permission does not add any record.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "No mapping is created.",
        "TC_ID": "TC_FEAT_NEG_29",
        "Scenario": "Verify empty mapping adds nothing in creation.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_30",
        "Issue": "24063",
        "Description": "Verify duplicate permissions cannot be added to the same feature.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Warning displays duplicate permission is restricted.",
        "TC_ID": "TC_FEAT_NEG_30",
        "Scenario": "Verify duplicate permission is blocked in creation.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_31",
        "Issue": "24064",
        "Description": "Verify creating a feature with an existing Feature Name displays a duplicate feature validation message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows duplicate feature restriction.",
        "TC_ID": "TC_FEAT_NEG_31",
        "Scenario": "Verify duplicate name creation is blocked.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_32",
        "Issue": "24065",
        "Description": "Verify special characters-only values in Feature Name are rejected if validation rules do not allow them.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Name format is invalid.",
        "TC_ID": "TC_FEAT_NEG_32",
        "Scenario": "Verify special character creation inputs rejected.",
        "Test Data": ""
    },
    {
        "TestID": "TC_FEAT_NEG_33",
        "Issue": "24066",
        "Description": "Verify the application handles API/network failure gracefully during feature creation and displays an appropriate error message.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Error toast displays API creation failure.",
        "TC_ID": "TC_FEAT_NEG_33",
        "Scenario": "Verify graceful error on creation API failure.",
        "Test Data": ""
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
    "Scenario",
    "Test Data"
];

const wsData = [
    headers,
    ...rows.map((r) => headers.map((h) => r[h] || "")),
];

try {
    const wb = XLSX.readFile(FILE);

    // Write to FeaturesSuperAdminTest
    if (wb.SheetNames.includes("FeaturesSuperAdminTest")) {
        const idx = wb.SheetNames.indexOf("FeaturesSuperAdminTest");
        wb.SheetNames.splice(idx, 1);
        delete wb.Sheets["FeaturesSuperAdminTest"];
    }
    const ws1 = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws1, "FeaturesSuperAdminTest");
    console.log(`Successfully updated ${rows.length} rows in 'FeaturesSuperAdminTest' sheet.`);

    // Write to Features(Admin)
    if (wb.SheetNames.includes("Features(Admin)")) {
        const idx = wb.SheetNames.indexOf("Features(Admin)");
        wb.SheetNames.splice(idx, 1);
        delete wb.Sheets["Features(Admin)"];
    }
    const ws2 = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws2, "Features(Admin)");
    console.log(`Successfully updated ${rows.length} rows in 'Features(Admin)' sheet.`);

    XLSX.writeFile(wb, FILE);
    console.log(`Successfully saved both Features sheets in ${FILE}`);
} catch (err) {
    console.error("Failed to update testData.xlsx:", err.message);
    process.exit(1);
}
