/**
 * Adds (or replaces) the AttributeTest sheet in testData.xlsx.
 * Run once: node scripts/addAttributeTestSheet.js
 *
 * Columns: TestID | Description | persona | FieldName | Type | DescriptionText |
 *          UIConcern | Languages | FieldLabels | EnumValues | ExpectedResult | Issue
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");

const rows = [
  // ═══════════════════════════════════════════════════════════════════════
  // ATTRIBUTE LIST SCREEN — Positive
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_LIST_01",
    Description: "Verify the Attribute list page loads successfully with all columns (Field Name, Type, Description, Action).",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "attribute", Issue: "",
  },
  {
    TestID: "TC_LIST_02",
    Description: "Verify the search box returns matching attributes when a valid attribute name is entered.",
    persona: "admin", FieldName: "status", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "status", Issue: "",
  },
  {
    TestID: "TC_LIST_03",
    Description: "Verify clicking the View (Eye) icon opens the selected attribute details page successfully.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "mode=view", Issue: "",
  },
  {
    TestID: "TC_LIST_04",
    Description: "Verify clicking the Edit (Pencil) icon opens the selected attribute in edit mode.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "mode=edit", Issue: "",
  },
  {
    TestID: "TC_LIST_05",
    Description: "Verify attribute details can be updated successfully and reflected in the grid.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Updated via TC_LIST_05", UIConcern: "",
    Languages: "English", FieldLabels: "English:List05Label", EnumValues: "",
    ExpectedResult: "Updated via TC_LIST_05", Issue: "",
  },
  {
    TestID: "TC_LIST_06",
    Description: "Verify clicking Create Attribute navigates to the attribute creation page.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "mode=create", Issue: "",
  },
  {
    TestID: "TC_LIST_07",
    Description: "Verify a new attribute can be created successfully with valid data.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "List07 created attr", UIConcern: "",
    Languages: "English", FieldLabels: "English:List07Label", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_LIST_08",
    Description: "Verify clicking the Delete icon and confirming deletion removes the selected attribute.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_LIST_09",
    Description: "Verify pagination (Previous, Next, page numbers) navigates correctly between pages.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "pagination works", Issue: "",
  },
  {
    TestID: "TC_LIST_10",
    Description: "Verify the Refresh button reloads the latest attribute data successfully.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "attribute", Issue: "",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ATTRIBUTE LIST SCREEN — Negative
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_LIST_NEG_01",
    Description: "Verify searching with a non-existing attribute name returns No Records Found or an empty result.",
    persona: "admin", FieldName: "XYZ_NON_EXISTENT_ATTR_9999", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "No Records Found", Issue: "",
  },
  {
    TestID: "TC_LIST_NEG_02",
    Description: "Verify searching with special characters only does not crash the application.",
    persona: "admin", FieldName: "@#$%", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "No Records Found", Issue: "",
  },
  {
    TestID: "TC_LIST_NEG_03",
    Description: "Verify searching with a very long string (>255 characters) is handled gracefully.",
    persona: "admin", FieldName: "A".repeat(260), Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "No Records Found", Issue: "",
  },
  {
    TestID: "TC_LIST_NEG_04",
    Description: "Verify clicking Edit on an attribute deleted by another user displays an appropriate error message.",
    persona: "admin", FieldName: "DELETED_ATTR_GHOST_9999", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "Simulate by using a stale non-existent attribute name",
  },
  {
    TestID: "TC_LIST_NEG_05",
    Description: "Verify clicking View for an unavailable/deleted attribute shows an error instead of a blank page.",
    persona: "admin", FieldName: "DELETED_ATTR_GHOST_9999", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_LIST_NEG_06",
    Description: "Verify deleting an attribute currently mapped to a catalog/product is blocked with a validation message.",
    persona: "admin", FieldName: "mapped_attr_do_not_delete", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "Requires a pre-seeded attribute linked to catalog",
  },
  {
    TestID: "TC_LIST_NEG_07",
    Description: "Verify deletion fails gracefully when the delete API returns an error.",
    persona: "admin", FieldName: "mapped_attr_do_not_delete", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_LIST_NEG_08",
    Description: "Verify unauthorized users cannot access Create/Edit/Delete actions.",
    persona: "guest", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "login", Issue: "",
  },
  {
    TestID: "TC_LIST_NEG_09",
    Description: "Verify pagination does not break when navigating beyond the last available page.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "attribute", Issue: "",
  },
  {
    TestID: "TC_LIST_NEG_10",
    Description: "Verify clicking action buttons repeatedly (double-click on View/Edit/Delete) does not create duplicate requests.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "no duplicate", Issue: "",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // VIEW ATTRIBUTE SCREEN — Positive
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_VIEW_01",
    Description: "Verify the View Attribute page loads successfully with all attribute details displayed correctly.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "", UIConcern: "",
    Languages: "English", FieldLabels: "", EnumValues: "",
    ExpectedResult: "mode=view", Issue: "",
  },
  {
    TestID: "TC_VIEW_02",
    Description: "Verify the Field Name value matches the selected attribute from the Attribute List page.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "field name matches", Issue: "",
  },
  {
    TestID: "TC_VIEW_03",
    Description: "Verify the Type field displays the correct attribute type (e.g., String).",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "String", Issue: "",
  },
  {
    TestID: "TC_VIEW_04",
    Description: "Verify the Description field displays the saved description correctly.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "description matches", Issue: "",
  },
  {
    TestID: "TC_VIEW_05",
    Description: "Verify the UI Concern dropdown shows the configured value (e.g., MultiSelect).",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "MultiSelect",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "MultiSelect", Issue: "",
  },
  {
    TestID: "TC_VIEW_06",
    Description: "Verify all configured Enum Values (AVAILABLE, OCCUPIED, MAINTENANCE) are displayed correctly.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "AVAILABLE,OCCUPIED,MAINTENANCE",
    ExpectedResult: "AVAILABLE,OCCUPIED,MAINTENANCE", Issue: "",
  },
  {
    TestID: "TC_VIEW_07",
    Description: "Verify the selected language (English) is checked and displayed correctly.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "English", FieldLabels: "", EnumValues: "",
    ExpectedResult: "English", Issue: "",
  },
  {
    TestID: "TC_VIEW_08",
    Description: "Verify the Field Label English value matches the saved attribute label.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "English", FieldLabels: "English:TestLabel", EnumValues: "",
    ExpectedResult: "TestLabel", Issue: "",
  },
  {
    TestID: "TC_VIEW_09",
    Description: "Verify clicking the Back button navigates back to the Attribute List page successfully.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "attribute", Issue: "",
  },
  {
    TestID: "TC_VIEW_10",
    Description: "Verify all fields are displayed in read-only mode and cannot be modified in View mode.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "read-only", Issue: "",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // VIEW ATTRIBUTE SCREEN — Negative
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_VIEW_NEG_01",
    Description: "Verify the page displays a proper error message when the attribute ID is invalid.",
    persona: "admin", FieldName: "invalid-id-99999", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_VIEW_NEG_02",
    Description: "Verify opening a deleted attribute directly via URL does not load the details page.",
    persona: "admin", FieldName: "deleted-attr-id-0000", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_VIEW_NEG_03",
    Description: "Verify unauthorized users cannot access the View Attribute page.",
    persona: "guest", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "login", Issue: "",
  },
  {
    TestID: "TC_VIEW_NEG_04",
    Description: "Verify the page handles missing Field Name data without UI breaking.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "no crash", Issue: "",
  },
  {
    TestID: "TC_VIEW_NEG_05",
    Description: "Verify the page handles missing Description data gracefully.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "no crash", Issue: "",
  },
  {
    TestID: "TC_VIEW_NEG_06",
    Description: "Verify the page handles missing Enum Values without displaying errors.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "no crash", Issue: "",
  },
  {
    TestID: "TC_VIEW_NEG_07",
    Description: "Verify the page displays a validation message when attribute data retrieval API fails.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "Simulated by invalid ID",
  },
  {
    TestID: "TC_VIEW_NEG_08",
    Description: "Verify special characters or HTML content in the attribute fields are rendered safely and not executed.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "no script executed", Issue: "",
  },
  {
    TestID: "TC_VIEW_NEG_09",
    Description: "Verify clicking Back during a server/network failure does not crash the application.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "attribute", Issue: "",
  },
  {
    TestID: "TC_VIEW_NEG_10",
    Description: "Verify the page remains stable when viewing attributes with extremely long names, descriptions, or labels.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "no crash", Issue: "",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // EDIT ATTRIBUTE SCREEN — Positive
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_EDIT_01",
    Description: "Verify the Edit Attribute page loads successfully with existing attribute details populated.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "mode=edit", Issue: "",
  },
  {
    TestID: "TC_EDIT_02",
    Description: "Verify the user can update the Field Name and save successfully.",
    persona: "admin", FieldName: "UPDATED_NAME", Type: "String", DescriptionText: "Updated name test", UIConcern: "",
    Languages: "English", FieldLabels: "English:UpdatedLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_EDIT_03",
    Description: "Verify the user can update the Description and save successfully.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Updated description for TC_EDIT_03", UIConcern: "",
    Languages: "English", FieldLabels: "English:Edit03Label", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_EDIT_04",
    Description: "Verify the user can change the Type dropdown value and save successfully.",
    persona: "admin", FieldName: "", Type: "Number", DescriptionText: "Type changed to Number", UIConcern: "",
    Languages: "English", FieldLabels: "English:Edit04Label", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_EDIT_05",
    Description: "Verify the user can change the UI Concern value and save successfully.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "UI Concern changed", UIConcern: "Select",
    Languages: "English", FieldLabels: "English:Edit05Label", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_EDIT_06",
    Description: "Verify the user can add a new valid Enum Value and it is displayed in the list.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Enum add test", UIConcern: "Select",
    Languages: "English", FieldLabels: "English:Edit06Label", EnumValues: "AVAILABLE,OCCUPIED,MAINTENANCE",
    ExpectedResult: "MAINTENANCE", Issue: "",
  },
  {
    TestID: "TC_EDIT_07",
    Description: "Verify the user can remove an existing Enum Value using the X icon and save successfully.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "MAINTENANCE",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_EDIT_08",
    Description: "Verify the user can select additional languages (Bengali, Telugu, Hindi) and save successfully.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Multi language edit test", UIConcern: "",
    Languages: "English,Bengali,Telugu,Hindi",
    FieldLabels: "English:EditMultiLabel,Bengali:বাংলা,Telugu:తెలుగు,Hindi:हिंदी", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_EDIT_09",
    Description: "Verify the user can update the Field Label English and save successfully.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Field label update test", UIConcern: "",
    Languages: "English", FieldLabels: "English:NewEnglishLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_EDIT_10",
    Description: "Verify clicking Save with valid modifications updates the attribute and displays a success message.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Full valid edit", UIConcern: "",
    Languages: "English", FieldLabels: "English:FinalLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // EDIT ATTRIBUTE SCREEN — Negative
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_EDIT_NEG_01",
    Description: "Verify saving with an empty Field Name displays a validation error.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "required", Issue: "",
  },
  {
    TestID: "TC_EDIT_NEG_02",
    Description: "Verify saving with an empty Description (if mandatory) displays a validation error.",
    persona: "admin", FieldName: "EDIT_NEG02_NAME", Type: "String", DescriptionText: "", UIConcern: "",
    Languages: "English", FieldLabels: "English:Neg02Label", EnumValues: "",
    ExpectedResult: "required", Issue: "",
  },
  {
    TestID: "TC_EDIT_NEG_03",
    Description: "Verify saving without selecting a Type displays a validation error.",
    persona: "admin", FieldName: "EDIT_NEG03_NAME", Type: "", DescriptionText: "No type selected", UIConcern: "",
    Languages: "English", FieldLabels: "English:Neg03Label", EnumValues: "",
    ExpectedResult: "required", Issue: "",
  },
  {
    TestID: "TC_EDIT_NEG_04",
    Description: "Verify saving without selecting a UI Concern displays a validation error.",
    persona: "admin", FieldName: "EDIT_NEG04_NAME", Type: "String", DescriptionText: "No UI Concern", UIConcern: "",
    Languages: "English", FieldLabels: "English:Neg04Label", EnumValues: "",
    ExpectedResult: "required", Issue: "May not be mandatory; test will be skipped if not enforced",
  },
  {
    TestID: "TC_EDIT_NEG_05",
    Description: "Verify adding a blank Enum Value and clicking Add is not allowed.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "not added", Issue: "",
  },
  {
    TestID: "TC_EDIT_NEG_06",
    Description: "Verify adding a duplicate Enum Value (e.g., AVAILABLE) displays an error or prevents duplication.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "OCCUPIED",
    ExpectedResult: "duplicate", Issue: "",
  },
  {
    TestID: "TC_EDIT_NEG_07",
    Description: "Verify entering special characters-only in Field Name is rejected if not supported.",
    persona: "admin", FieldName: "@#$%^&*", Type: "String", DescriptionText: "Special char name", UIConcern: "",
    Languages: "English", FieldLabels: "English:SpecLabel", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_EDIT_NEG_08",
    Description: "Verify entering a Field Name exceeding the maximum allowed length displays a validation error.",
    persona: "admin", FieldName: "A".repeat(300), Type: "String", DescriptionText: "Long name test", UIConcern: "",
    Languages: "English", FieldLabels: "English:LongLabel", EnumValues: "",
    ExpectedResult: "validation error", Issue: "",
  },
  {
    TestID: "TC_EDIT_NEG_09",
    Description: "Verify clicking Save during API/server failure displays an appropriate error message and does not lose entered data.",
    persona: "admin", FieldName: "EDIT_NEG09_NAME", Type: "String", DescriptionText: "API failure test", UIConcern: "",
    Languages: "English", FieldLabels: "English:Neg09Label", EnumValues: "",
    ExpectedResult: "error", Issue: "Simulated via network offline or intercepted API",
  },
  {
    TestID: "TC_EDIT_NEG_10",
    Description: "Verify unauthorized users cannot access the Edit Attribute page or save changes.",
    persona: "guest", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "login", Issue: "",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ATTRIBUTE DELETE POPUP — Positive
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_DEL_01",
    Description: "Verify clicking Yes Delete it! successfully deletes the selected attribute and removes it from the Attribute list.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_DEL_02",
    Description: "Verify clicking Cancel closes the delete confirmation popup without deleting the attribute.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "popup closed", Issue: "",
  },
  {
    TestID: "TC_DEL_03",
    Description: "Verify a success message is displayed after successful attribute deletion.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_DEL_04",
    Description: "Verify the Attribute list refreshes automatically after deletion and no longer displays the deleted attribute.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "not in list", Issue: "",
  },
  {
    TestID: "TC_DEL_05",
    Description: "Verify the delete confirmation popup displays the correct warning message and action buttons.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "popup visible", Issue: "",
  },
  {
    TestID: "TC_DEL_06",
    Description: "Verify only the selected attribute is deleted when confirming the delete action.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "only target deleted", Issue: "",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // ATTRIBUTE DELETE POPUP — Negative
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_DEL_NEG_01",
    Description: "Verify clicking outside the popup does not accidentally delete the attribute.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "popup closed", Issue: "",
  },
  {
    TestID: "TC_DEL_NEG_02",
    Description: "Verify deletion fails gracefully when the delete API returns an error message.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "Simulated via mapped attribute or API interception",
  },
  {
    TestID: "TC_DEL_NEG_03",
    Description: "Verify an attribute that is already deleted cannot be deleted again.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_DEL_NEG_04",
    Description: "Verify deleting an attribute linked to active catalogs/products displays a validation error and prevents deletion.",
    persona: "admin", FieldName: "mapped_attr_do_not_delete", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "error", Issue: "Requires pre-seeded attribute linked to catalog",
  },
  {
    TestID: "TC_DEL_NEG_05",
    Description: "Verify unauthorized users cannot delete attributes even if they access the delete popup.",
    persona: "guest", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "login", Issue: "",
  },
  {
    TestID: "TC_DEL_NEG_06",
    Description: "Verify rapid multiple clicks on Yes Delete it! do not trigger duplicate delete requests or application errors.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "no duplicate", Issue: "",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CREATE ATTRIBUTE SCREEN — Positive
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_CREATE_01",
    Description: "Verify the Create Attribute page loads successfully with all fields and controls visible.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "mode=create", Issue: "",
  },
  {
    TestID: "TC_CREATE_02",
    Description: "Verify a new attribute can be created with valid Field Name, Type, Description, and Language.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Valid attribute creation", UIConcern: "",
    Languages: "English", FieldLabels: "English:CreateLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_03",
    Description: "Verify Object type option can be selected successfully.",
    persona: "admin", FieldName: "", Type: "Object", DescriptionText: "Object type test", UIConcern: "",
    Languages: "English", FieldLabels: "English:ObjLabel", EnumValues: "",
    ExpectedResult: "Object", Issue: "",
  },
  {
    TestID: "TC_CREATE_04",
    Description: "Verify Array type option can be selected successfully.",
    persona: "admin", FieldName: "", Type: "Array", DescriptionText: "Array type test", UIConcern: "",
    Languages: "English", FieldLabels: "English:ArrLabel", EnumValues: "",
    ExpectedResult: "Array", Issue: "",
  },
  {
    TestID: "TC_CREATE_05",
    Description: "Verify the user can enter a valid Field Name and save successfully.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Valid field name test", UIConcern: "",
    Languages: "English", FieldLabels: "English:Create05Label", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_06",
    Description: "Verify the user can enter a valid Description and save successfully.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Valid description for create", UIConcern: "",
    Languages: "English", FieldLabels: "English:Create06Label", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_07",
    Description: "Verify the user can select English language and save the attribute.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "English only attribute", UIConcern: "",
    Languages: "English", FieldLabels: "English:Create07Label", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_08",
    Description: "Verify the user can select multiple languages simultaneously and save successfully.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Multi-language attribute", UIConcern: "",
    Languages: "English,Bengali,Telugu,Hindi",
    FieldLabels: "English:MultiLabel,Bengali:বাংলা লেবেল,Telugu:తెలుగు లేబెల్,Hindi:हिंदी लेबल", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_09",
    Description: "Verify the Save button creates the attribute and displays a success message.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Save button test", UIConcern: "",
    Languages: "English", FieldLabels: "English:Create09Label", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_10",
    Description: "Verify the newly created attribute appears in the Attribute listing page.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Listing verification after create", UIConcern: "",
    Languages: "English", FieldLabels: "English:Create10Label", EnumValues: "",
    ExpectedResult: "visible in list", Issue: "",
  },
  {
    TestID: "TC_CREATE_11",
    Description: "Verify the Back button navigates to the Attribute list page.",
    persona: "admin", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "attribute", Issue: "",
  },
  {
    TestID: "TC_CREATE_12",
    Description: "Verify the String type attribute is created successfully.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "String type attribute", UIConcern: "",
    Languages: "English", FieldLabels: "English:StrLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_13",
    Description: "Verify the Number type attribute is created successfully.",
    persona: "admin", FieldName: "", Type: "Number", DescriptionText: "Number type attribute", UIConcern: "TextBox",
    Languages: "English", FieldLabels: "English:NumLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_14",
    Description: "Verify the Boolean type attribute is created successfully.",
    persona: "admin", FieldName: "", Type: "Boolean", DescriptionText: "Boolean type attribute", UIConcern: "",
    Languages: "English", FieldLabels: "English:BoolLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_15",
    Description: "Verify the Date type attribute is created successfully.",
    persona: "admin", FieldName: "", Type: "Date", DescriptionText: "Date type attribute", UIConcern: "",
    Languages: "English", FieldLabels: "English:DateLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_16",
    Description: "Verify the Image type attribute is created successfully.",
    persona: "admin", FieldName: "", Type: "Image", DescriptionText: "Image type attribute", UIConcern: "",
    Languages: "English", FieldLabels: "English:ImgLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_17",
    Description: "Verify optional UI Concern can be left blank and the attribute is still created successfully.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "No UI Concern blank test", UIConcern: "",
    Languages: "English", FieldLabels: "English:NoConcernLabel", EnumValues: "",
    ExpectedResult: "success", Issue: "",
  },
  {
    TestID: "TC_CREATE_18",
    Description: "Verify page data persists correctly until Save is clicked.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Data persistence test", UIConcern: "",
    Languages: "English", FieldLabels: "English:PersistLabel", EnumValues: "",
    ExpectedResult: "data present", Issue: "",
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CREATE ATTRIBUTE SCREEN — Negative
  // ═══════════════════════════════════════════════════════════════════════
  {
    TestID: "TC_CREATE_NEG_01",
    Description: "Verify saving without entering Field Name displays a validation error.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "No name test", UIConcern: "",
    Languages: "English", FieldLabels: "English:Neg01Label", EnumValues: "",
    ExpectedResult: "required", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_02",
    Description: "Verify saving with an empty Description displays a validation error (if mandatory).",
    persona: "admin", FieldName: "CRNEG02_ATTR", Type: "String", DescriptionText: "", UIConcern: "",
    Languages: "English", FieldLabels: "English:Neg02Label", EnumValues: "",
    ExpectedResult: "required", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_03",
    Description: "Verify saving without selecting a Type displays a validation error.",
    persona: "admin", FieldName: "CRNEG03_ATTR", Type: "", DescriptionText: "No type test", UIConcern: "",
    Languages: "English", FieldLabels: "English:Neg03Label", EnumValues: "",
    ExpectedResult: "required", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_04",
    Description: "Verify saving without selecting any language displays a validation error.",
    persona: "admin", FieldName: "CRNEG04_ATTR", Type: "String", DescriptionText: "No lang test", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "required", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_05",
    Description: "Verify entering only spaces in the Field Name is not accepted.",
    persona: "admin", FieldName: "   ", Type: "String", DescriptionText: "Spaces only name test", UIConcern: "",
    Languages: "English", FieldLabels: "English:SpaceLabel", EnumValues: "",
    ExpectedResult: "required", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_06",
    Description: "Verify entering special characters only (e.g., @#$%^&) in Field Name is rejected.",
    persona: "admin", FieldName: "@#$%^&", Type: "String", DescriptionText: "Special chars name test", UIConcern: "",
    Languages: "English", FieldLabels: "English:SpecLabel", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_07",
    Description: "Verify creating an attribute with a duplicate Field Name displays an error.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Duplicate name test", UIConcern: "",
    Languages: "English", FieldLabels: "English:DupLabel", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_08",
    Description: "Verify entering a Field Name exceeding the maximum allowed length is rejected.",
    persona: "admin", FieldName: "A".repeat(300), Type: "String", DescriptionText: "Long name test", UIConcern: "",
    Languages: "English", FieldLabels: "English:LongLabel", EnumValues: "",
    ExpectedResult: "validation error", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_09",
    Description: "Verify entering a Description exceeding the maximum allowed length is rejected.",
    persona: "admin", FieldName: "CRNEG09_ATTR", Type: "String", DescriptionText: "D".repeat(600), UIConcern: "",
    Languages: "English", FieldLabels: "English:LongDescLabel", EnumValues: "",
    ExpectedResult: "validation error", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_10",
    Description: "Verify entering HTML/JavaScript code in Field Name is sanitized and not executed.",
    persona: "admin", FieldName: "<script>alert('xss')</script>", Type: "String", DescriptionText: "XSS test", UIConcern: "",
    Languages: "English", FieldLabels: "English:XSSLabel", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_11",
    Description: "Verify entering SQL injection strings in Field Name is rejected safely.",
    persona: "admin", FieldName: "'; DROP TABLE attributes; --", Type: "String", DescriptionText: "SQL injection test", UIConcern: "",
    Languages: "English", FieldLabels: "English:SQLLabel", EnumValues: "",
    ExpectedResult: "error", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_12",
    Description: "Verify clicking Save repeatedly does not create duplicate attributes.",
    persona: "admin", FieldName: "", Type: "String", DescriptionText: "Double save test", UIConcern: "",
    Languages: "English", FieldLabels: "English:DblSaveLabel", EnumValues: "",
    ExpectedResult: "no duplicate", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_13",
    Description: "Verify the application handles API failure during attribute creation gracefully.",
    persona: "admin", FieldName: "CRNEG13_ATTR", Type: "String", DescriptionText: "API fail test", UIConcern: "",
    Languages: "English", FieldLabels: "English:Neg13Label", EnumValues: "",
    ExpectedResult: "error", Issue: "Simulated via network offline or API interception",
  },
  {
    TestID: "TC_CREATE_NEG_14",
    Description: "Verify network interruption during Save displays an appropriate error message.",
    persona: "admin", FieldName: "CRNEG14_ATTR", Type: "String", DescriptionText: "Network interrupt test", UIConcern: "",
    Languages: "English", FieldLabels: "English:Neg14Label", EnumValues: "",
    ExpectedResult: "error", Issue: "Simulated via network offline",
  },
  {
    TestID: "TC_CREATE_NEG_15",
    Description: "Verify unauthorized users cannot access the Create Attribute page.",
    persona: "guest", FieldName: "", Type: "", DescriptionText: "", UIConcern: "",
    Languages: "", FieldLabels: "", EnumValues: "",
    ExpectedResult: "login", Issue: "",
  },
  {
    TestID: "TC_CREATE_NEG_16",
    Description: "Verify unauthorized users cannot create new attributes through direct API calls.",
    persona: "guest", FieldName: "API_DIRECT_CREATE", Type: "String", DescriptionText: "Direct API test", UIConcern: "",
    Languages: "English", FieldLabels: "English:APILabel", EnumValues: "",
    ExpectedResult: "login", Issue: "UI-level: verify redirect to login",
  },
  {
    TestID: "TC_CREATE_NEG_17",
    Description: "Verify selecting an incompatible UI Concern for a Type (if restricted by business rules) displays validation.",
    persona: "admin", FieldName: "CRNEG17_ATTR", Type: "Boolean", DescriptionText: "Incompatible UI Concern", UIConcern: "MultiSelect",
    Languages: "English", FieldLabels: "English:Neg17Label", EnumValues: "",
    ExpectedResult: "validation error", Issue: "Depends on business rule enforcement",
  },
  {
    TestID: "TC_CREATE_NEG_18",
    Description: "Verify page remains stable when extremely large input values are entered into text fields.",
    persona: "admin", FieldName: "B".repeat(500), Type: "String", DescriptionText: "E".repeat(1000), UIConcern: "",
    Languages: "English", FieldLabels: "English:HugeLabel", EnumValues: "",
    ExpectedResult: "no crash", Issue: "",
  },
];

const SHEET = "AttributeTest";
const wb = XLSX.readFile(FILE);

const headers = [
  "TestID", "Description", "persona", "FieldName", "Type",
  "DescriptionText", "UIConcern", "Languages", "FieldLabels",
  "EnumValues", "ExpectedResult", "Issue",
];

const wsData = [
  headers,
  ...rows.map((r) =>
    headers.map((h) => (r[h] !== undefined ? r[h] : ""))
  ),
];

const ws = XLSX.utils.aoa_to_sheet(wsData);

if (wb.SheetNames.includes(SHEET)) {
  const idx = wb.SheetNames.indexOf(SHEET);
  wb.SheetNames.splice(idx, 1);
  delete wb.Sheets[SHEET];
}
XLSX.utils.book_append_sheet(wb, ws, SHEET);
XLSX.writeFile(wb, FILE);
console.log(`Written ${rows.length} rows to '${SHEET}' sheet in ${FILE}`);
