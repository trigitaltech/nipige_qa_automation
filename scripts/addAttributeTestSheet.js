/**
 * Updates (or replaces) the "AttributeTest" sheet in testData.xlsx — 98 test cases.
 * Run once: node scripts/addAttributeTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "AttributeTest";

const rows = [
    // ── Attribute List Screen: Positive (TC_LIST_01 to TC_LIST_10) ──
    {
        "TestID": "TC_LIST_01",
        "Issue": "25001",
        "Description": "Verify the Attribute list page loads successfully with all columns (Field Name, Type, Description, Action).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Grid displays with headers: Field Name, Type, Description, and Actions.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_02",
        "Issue": "25002",
        "Description": "Verify the search box returns matching attributes when a valid attribute name is entered.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Search returns matching attributes.",
        "FieldName": "TestAttr", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_03",
        "Issue": "25003",
        "Description": "Verify clicking the View (Eye) icon opens the selected attribute details page successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "View Attribute details screen opens successfully.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_04",
        "Issue": "25004",
        "Description": "Verify clicking the Edit (Pencil) icon opens the selected attribute in edit mode.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Edit Attribute screen opens successfully.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_05",
        "Issue": "25005",
        "Description": "Verify attribute details can be updated successfully and reflected in the grid.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Updated fields display in listing grid.",
        "FieldName": "UpdatedName", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_06",
        "Issue": "25006",
        "Description": "Verify clicking Create Attribute navigates to the attribute creation page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Create Attribute page loads successfully.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_07",
        "Issue": "25007",
        "Description": "Verify a new attribute can be created successfully with valid data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "New attribute displays in main listing grid.",
        "FieldName": "NewAttr", "Type": "String", "DescriptionText": "Desc Text", "UIConcern": "TextBox", "Languages": "English", "FieldLabels": "Label", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_08",
        "Issue": "25008",
        "Description": "Verify clicking the Delete icon and confirming deletion removes the selected attribute.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Selected attribute is deleted.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_09",
        "Issue": "25009",
        "Description": "Verify pagination (Previous, Next, page numbers) navigates correctly between pages.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Grid records change according to selected page.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_10",
        "Issue": "25010",
        "Description": "Verify the Refresh button reloads the latest attribute data successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Attribute list reloads latest values.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },

    // ── Attribute List Screen: Negative (TC_LIST_NEG_01 to TC_LIST_NEG_10) ──
    {
        "TestID": "TC_LIST_NEG_01",
        "Issue": "25011",
        "Description": "Verify searching with a non-existing attribute name returns \"No Records Found\" or an empty result.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "No Records Found displays in table.",
        "FieldName": "NONEXISTENT_ATTR_XYZ_999", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_NEG_02",
        "Issue": "25012",
        "Description": "Verify searching with special characters only (e.g., @#$%) does not crash the application.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Search handles special characters cleanly.",
        "FieldName": "!@#$%^", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_NEG_03",
        "Issue": "25013",
        "Description": "Verify searching with a very long string (>255 characters) is handled gracefully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Very long string input is truncated or safely handled.",
        "FieldName": "A".repeat(300), "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_NEG_04",
        "Issue": "25014",
        "Description": "Verify clicking Edit on an attribute deleted by another user displays an appropriate error message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error displays showing item unavailable.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_NEG_05",
        "Issue": "25015",
        "Description": "Verify clicking View for an unavailable/deleted attribute shows an error instead of a blank page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Graceful error fallback is displayed.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_NEG_06",
        "Issue": "25016",
        "Description": "Verify deleting an attribute currently mapped to a catalog/product is blocked with a validation message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Warning displays delete blocked.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_NEG_07",
        "Issue": "25017",
        "Description": "Verify deletion fails gracefully when the delete API returns an error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Graceful toaster failure alert displays.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_NEG_08",
        "Issue": "25018",
        "Description": "Verify unauthorized users cannot access Create/Edit/Delete actions.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Actions are hidden or disabled.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_NEG_09",
        "Issue": "25019",
        "Description": "Verify pagination does not break when navigating beyond the last available page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Table remains on the last valid page.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_LIST_NEG_10",
        "Issue": "25020",
        "Description": "Verify clicking action buttons repeatedly (double-click on View/Edit/Delete) does not create duplicate requests or system errors.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Double click triggers are handled safely.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },

    // ── View Attribute Screen: Positive (TC_VIEW_01 to TC_VIEW_10) ──
    {
        "TestID": "TC_VIEW_01",
        "Issue": "25021",
        "Description": "Verify the View Attribute page loads successfully with all attribute details displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Details load correctly in read-only form fields.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_02",
        "Issue": "25022",
        "Description": "Verify the Field Name value matches the selected attribute from the Attribute List page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Loaded name matches search.",
        "FieldName": "TestAttr", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_03",
        "Issue": "25023",
        "Description": "Verify the Type field displays the correct attribute type (e.g., String).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Displays type String.",
        "FieldName": "", "Type": "String", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_04",
        "Issue": "25024",
        "Description": "Verify the Description field displays the saved description correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Displays correct description.",
        "FieldName": "", "Type": "", "DescriptionText": "Attribute description", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_05",
        "Issue": "25025",
        "Description": "Verify the UI Concern dropdown shows the configured value (e.g., MultiSelect).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "UI concern MultiSelect shows.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "MultiSelect", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_06",
        "Issue": "25026",
        "Description": "Verify all configured Enum Values (AVAILABLE, OCCUPIED, MAINTENANCE) are displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enums are displayed correctly.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": "AVAILABLE, OCCUPIED, MAINTENANCE"
    },
    {
        "TestID": "TC_VIEW_07",
        "Issue": "25027",
        "Description": "Verify the selected language (English) is checked and displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Language selection displays English checked.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "English", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_08",
        "Issue": "25028",
        "Description": "Verify the Field Label English value matches the saved attribute label.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Field label matches the saved value.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "EnglishLabel", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_09",
        "Issue": "25029",
        "Description": "Verify clicking the Back button navigates back to the Attribute List page successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigates back to the list.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_10",
        "Issue": "25030",
        "Description": "Verify all fields are displayed in read-only mode and cannot be modified in View mode.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Form controls are disabled or read-only.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },

    // ── View Attribute Screen: Negative (TC_VIEW_NEG_01 to TC_VIEW_NEG_10) ──
    {
        "TestID": "TC_VIEW_NEG_01",
        "Issue": "25031",
        "Description": "Verify the page displays a proper error message when the attribute ID is invalid.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Fallback error message displays on invalid ID.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_NEG_02",
        "Issue": "25032",
        "Description": "Verify opening a deleted attribute directly via URL does not load the details page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Direct routing shows not found error page.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_NEG_03",
        "Issue": "25033",
        "Description": "Verify unauthorized users cannot access the View Attribute page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirects or blocks details access.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_NEG_04",
        "Issue": "25034",
        "Description": "Verify the page handles missing Field Name data without UI breaking.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Displays placeholder for blank name safely.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_NEG_05",
        "Issue": "25035",
        "Description": "Verify the page handles missing Description data gracefully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Displays placeholder for blank description safely.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_NEG_06",
        "Issue": "25036",
        "Description": "Verify the page handles missing Enum Values without displaying errors.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enum list remains empty and stable.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_NEG_07",
        "Issue": "25037",
        "Description": "Verify the page displays a validation message when attribute data retrieval API fails.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Graceful toaster alert shows connection problem.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_NEG_08",
        "Issue": "25038",
        "Description": "Verify special characters or HTML content in the attribute fields are rendered safely and not executed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Special characters are sanitized and do not trigger XSS script runs.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_NEG_09",
        "Issue": "25039",
        "Description": "Verify clicking Back during a server/network failure does not crash the application.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "App remains stable.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_VIEW_NEG_10",
        "Issue": "25040",
        "Description": "Verify the page remains stable when viewing attributes with extremely long names, descriptions, or labels.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Page UI layout behaves correctly without breaking.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },

    // ── Edit Attribute Screen: Positive (TC_EDIT_01 to TC_EDIT_10) ──
    {
        "TestID": "TC_EDIT_01",
        "Issue": "25041",
        "Description": "Verify the Edit Attribute page loads successfully with existing attribute details populated.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Edit Attribute screen opens successfully with existing details pre-filled.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_02",
        "Issue": "25042",
        "Description": "Verify the user can update the Field Name and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Updated Field Name is saved successfully.",
        "FieldName": "UpdatedName", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_03",
        "Issue": "25043",
        "Description": "Verify the user can update the Description and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Updated Description is saved successfully.",
        "FieldName": "", "Type": "", "DescriptionText": "Updated description", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_04",
        "Issue": "25044",
        "Description": "Verify the user can change the Type dropdown value and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Updated Type is saved successfully.",
        "FieldName": "", "Type": "Number", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_05",
        "Issue": "25045",
        "Description": "Verify the user can change the UI Concern value and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Updated UI concern value is saved successfully.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "Select", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_06",
        "Issue": "25046",
        "Description": "Verify the user can add a new valid Enum Value and it is displayed in the list.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "New enum displays in list view.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": "AVAILABLE, OCCUPIED, MAINTENANCE, PENDING"
    },
    {
        "TestID": "TC_EDIT_07",
        "Issue": "25047",
        "Description": "Verify the user can remove an existing Enum Value using the X icon and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Removed enum vanishes from list.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": "AVAILABLE, OCCUPIED"
    },
    {
        "TestID": "TC_EDIT_08",
        "Issue": "25048",
        "Description": "Verify the user can select additional languages (Bengali, Telugu, Hindi) and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Additional languages checked successfully.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "English, Bengali, Telugu, Hindi", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_09",
        "Issue": "25049",
        "Description": "Verify the user can update the Field Label English and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Field label English saves successfully.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "EnglishLabelUpdated", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_10",
        "Issue": "25050",
        "Description": "Verify clicking Save with valid modifications updates the attribute and displays a success message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Updates save; success toast displays.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },

    // ── Edit Attribute Screen: Negative (TC_EDIT_NEG_01 to TC_EDIT_NEG_10) ──
    {
        "TestID": "TC_EDIT_NEG_01",
        "Issue": "25051",
        "Description": "Verify saving with an empty Field Name displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Name is required.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_NEG_02",
        "Issue": "25052",
        "Description": "Verify saving with an empty Description (if mandatory) displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Description is required.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_NEG_03",
        "Issue": "25053",
        "Description": "Verify saving without selecting a Type displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Type is required.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_NEG_04",
        "Issue": "25054",
        "Description": "Verify saving without selecting a UI Concern displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows UI concern is required.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_NEG_05",
        "Issue": "25055",
        "Description": "Verify adding a blank Enum Value and clicking Add is not allowed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Add button remains disabled or validation displays.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_NEG_06",
        "Issue": "25056",
        "Description": "Verify adding a duplicate Enum Value (e.g., AVAILABLE) displays an error or prevents duplication.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate enum warning displays.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": "AVAILABLE"
    },
    {
        "TestID": "TC_EDIT_NEG_07",
        "Issue": "25057",
        "Description": "Verify entering special characters-only in Field Name is rejected if not supported.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Name format is invalid.",
        "FieldName": "!@#$%^", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_NEG_08",
        "Issue": "25058",
        "Description": "Verify entering a Field Name exceeding the maximum allowed length displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows name length exceeded limit.",
        "FieldName": "A".repeat(300), "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_NEG_09",
        "Issue": "25059",
        "Description": "Verify clicking Save during API/server failure displays an appropriate error message and does not lose entered data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "API update failure message is displayed.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_EDIT_NEG_10",
        "Issue": "25060",
        "Description": "Verify unauthorized users cannot access the Edit Attribute page or save changes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirects or blocks edit action access.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },

    // ── Attribute Delete Popup: Positive (TC_DEL_01 to TC_DEL_06) ──
    {
        "TestID": "TC_DEL_01",
        "Issue": "25061",
        "Description": "Verify clicking \"Yes, Delete it!\" successfully deletes the selected attribute and removes it from the Attribute list.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Attribute is deleted successfully.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_02",
        "Issue": "25062",
        "Description": "Verify clicking \"Cancel\" closes the delete confirmation popup without deleting the attribute.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Confirmation popup closes and attribute is retained.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_03",
        "Issue": "25063",
        "Description": "Verify a success message is displayed after successful attribute deletion.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Success toast is displayed.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_04",
        "Issue": "25064",
        "Description": "Verify the Attribute list refreshes automatically after deletion and no longer displays the deleted attribute.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Attribute list refreshes automatically.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_05",
        "Issue": "25065",
        "Description": "Verify the delete confirmation popup displays the correct warning message and action buttons.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Warning message displays correctly.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_06",
        "Issue": "25066",
        "Description": "Verify only the selected attribute is deleted when confirming the delete action.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only the selected attribute is removed.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },

    // ── Attribute Delete Popup: Negative (TC_DEL_NEG_01 to TC_DEL_NEG_06) ──
    {
        "TestID": "TC_DEL_NEG_01",
        "Issue": "25067",
        "Description": "Verify clicking outside the popup (if supported) does not accidentally delete the attribute.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Popup closes; attribute remains.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_NEG_02",
        "Issue": "25068",
        "Description": "Verify deletion fails gracefully when the delete API returns an error message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delete fails gracefully showing API error.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_NEG_03",
        "Issue": "25069",
        "Description": "Verify an attribute that is already deleted cannot be deleted again.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error toaster is displayed showing API error.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_NEG_04",
        "Issue": "25070",
        "Description": "Verify deleting an attribute linked to active catalogs/products displays a validation error and prevents deletion.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation toast blocks delete.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_NEG_05",
        "Issue": "25071",
        "Description": "Verify unauthorized users cannot delete attributes even if they access the delete popup.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delete is blocked and access denied displays.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_DEL_NEG_06",
        "Issue": "25072",
        "Description": "Verify rapid multiple clicks on \"Yes, Delete it!\" do not trigger duplicate delete requests or application errors.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only one delete request processed.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },

    // ── Create Attribute Screen: Positive (TC_CREATE_01 to TC_CREATE_18) ──
    {
        "TestID": "TC_CREATE_01",
        "Issue": "25073",
        "Description": "Verify the Create Attribute page loads successfully with all fields and controls visible.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Create page controls display.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_02",
        "Issue": "25074",
        "Description": "Verify a new attribute can be created with valid Field Name, Type, Description, and Language.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Attribute is created successfully.",
        "FieldName": "ValidAttr", "Type": "String", "DescriptionText": "Valid desc", "UIConcern": "TextBox", "Languages": "English", "FieldLabels": "ValidLabel", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_03",
        "Issue": "25075",
        "Description": "Verify each Type option (Object, Array, String, Number, Boolean, Image, Date) can be selected successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Option is selected successfully in dropdown.",
        "FieldName": "", "Type": "Array", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_04",
        "Issue": "25076",
        "Description": "Verify each UI Concern option (TextBox, Checkbox, Select, MultiSelect, Object, Radio) can be selected successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Option is selected successfully in dropdown.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "Radio", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_05",
        "Issue": "25077",
        "Description": "Verify the user can enter a valid Field Name and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Valid field name accepted.",
        "FieldName": "ValidFieldName", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_06",
        "Issue": "25078",
        "Description": "Verify the user can enter a valid Description and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Valid description accepted.",
        "FieldName": "", "Type": "", "DescriptionText": "Valid description text", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_07",
        "Issue": "25079",
        "Description": "Verify the user can select English language and save the attribute.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "English language selected.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "English", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_08",
        "Issue": "25080",
        "Description": "Verify the user can select multiple languages simultaneously and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Multiple languages selected.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "English, Bengali, Telugu, Hindi", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_09",
        "Issue": "25081",
        "Description": "Verify the Save button creates the attribute and displays a success message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Creation saves; success toast displays.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_10",
        "Issue": "25082",
        "Description": "Verify the newly created attribute appears in the Attribute listing page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Newly created attribute shows in grid.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_11",
        "Issue": "25083",
        "Description": "Verify the Back button navigates to the Attribute list page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigates back to the list.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_12",
        "Issue": "25084",
        "Description": "Verify the String type attribute is created successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "String type attribute created successfully.",
        "FieldName": "StrAttr", "Type": "String", "DescriptionText": "Desc text", "UIConcern": "TextBox", "Languages": "English", "FieldLabels": "StrLabel", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_13",
        "Issue": "25085",
        "Description": "Verify the Number type attribute is created successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Number type attribute created successfully.",
        "FieldName": "NumAttr", "Type": "Number", "DescriptionText": "Desc text", "UIConcern": "TextBox", "Languages": "English", "FieldLabels": "NumLabel", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_14",
        "Issue": "25086",
        "Description": "Verify the Boolean type attribute is created successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Boolean type attribute created successfully.",
        "FieldName": "BoolAttr", "Type": "Boolean", "DescriptionText": "Desc text", "UIConcern": "Checkbox", "Languages": "English", "FieldLabels": "BoolLabel", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_15",
        "Issue": "25087",
        "Description": "Verify the Date type attribute is created successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Date type attribute created successfully.",
        "FieldName": "DateAttr", "Type": "Date", "DescriptionText": "Desc text", "UIConcern": "TextBox", "Languages": "English", "FieldLabels": "DateLabel", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_16",
        "Issue": "25088",
        "Description": "Verify the Image type attribute is created successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Image type attribute created successfully.",
        "FieldName": "ImgAttr", "Type": "Image", "DescriptionText": "Desc text", "UIConcern": "TextBox", "Languages": "English", "FieldLabels": "ImgLabel", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_17",
        "Issue": "25089",
        "Description": "Verify optional UI Concern can be left blank and the attribute is still created successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Created successfully with blank UI concern.",
        "FieldName": "OptAttr", "Type": "String", "DescriptionText": "Desc text", "UIConcern": "", "Languages": "English", "FieldLabels": "OptLabel", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_18",
        "Issue": "25090",
        "Description": "Verify page data persists correctly until Save is clicked.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Entered fields retain values until save/clear is clicked.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },

    // ── Create Attribute Screen: Negative (TC_CREATE_NEG_01 to TC_CREATE_NEG_18) ──
    {
        "TestID": "TC_CREATE_NEG_01",
        "Issue": "25091",
        "Description": "Verify saving without entering Field Name displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Name is required.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_02",
        "Issue": "25092",
        "Description": "Verify saving with an empty Description displays a validation error (if mandatory).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Description is required.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_03",
        "Issue": "25093",
        "Description": "Verify saving without selecting a Type displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Type is required.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_04",
        "Issue": "25094",
        "Description": "Verify saving without selecting any language displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Language is required.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_05",
        "Issue": "25095",
        "Description": "Verify entering only spaces in the Field Name is not accepted.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error triggers on spaces-only name.",
        "FieldName": "   ", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_06",
        "Issue": "25096",
        "Description": "Verify entering special characters only (e.g., @#$%^&) in Field Name is rejected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Name format is invalid.",
        "FieldName": "!@#$%^", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_07",
        "Issue": "25097",
        "Description": "Verify creating an attribute with a duplicate Field Name displays an error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows duplicate name is restricted.",
        "FieldName": "DuplicateName", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_08",
        "Issue": "25098",
        "Description": "Verify entering a Field Name exceeding the maximum allowed length is rejected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows name length exceeded limit.",
        "FieldName": "A".repeat(300), "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_09",
        "Issue": "25099",
        "Description": "Verify entering a Description exceeding the maximum allowed length is rejected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows description length exceeded limit.",
        "FieldName": "", "Type": "", "DescriptionText": "A".repeat(3000), "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_10",
        "Issue": "25100",
        "Description": "Verify entering HTML/JavaScript code in Field Name is sanitized and not executed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "HTML/script inputs are sanitized cleanly.",
        "FieldName": "<script>alert('XSS')</script>", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_11",
        "Issue": "25101",
        "Description": "Verify entering SQL injection strings in Field Name is rejected safely.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "SQL inject strings are treated as literal text cleanly.",
        "FieldName": "1' OR '1'='1", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_12",
        "Issue": "25102",
        "Description": "Verify clicking Save repeatedly does not create duplicate attributes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only one attribute creation request is processed.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_13",
        "Issue": "25103",
        "Description": "Verify the application handles API failure during attribute creation gracefully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error toast displays API creation failure.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_14",
        "Issue": "25104",
        "Description": "Verify network interruption during Save displays an appropriate error message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Connection warning toast displays gracefully.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_15",
        "Issue": "25105",
        "Description": "Verify unauthorized users cannot access the Create Attribute page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirects or blocks creation screen access.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_16",
        "Issue": "25106",
        "Description": "Verify unauthorized users cannot create new attributes through direct API calls.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "API returns 403 Forbidden.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_17",
        "Issue": "25107",
        "Description": "Verify selecting an incompatible UI Concern for a Type (if restricted by business rules) displays validation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation warns on incompatible combination.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
    },
    {
        "TestID": "TC_CREATE_NEG_18",
        "Issue": "25108",
        "Description": "Verify page remains stable when extremely large input values are entered into text fields.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Input sizes are limited or handled safely.",
        "FieldName": "", "Type": "", "DescriptionText": "", "UIConcern": "", "Languages": "", "FieldLabels": "", "EnumValues": ""
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
    "FieldName",
    "Type",
    "DescriptionText",
    "UIConcern",
    "Languages",
    "FieldLabels",
    "EnumValues"
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
