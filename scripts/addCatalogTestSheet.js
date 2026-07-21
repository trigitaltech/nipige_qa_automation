/**
 * Updates the "CatalogTest" sheet in testData.xlsx — updates descriptions and expected results for all 140 rows.
 * Run once: node scripts/addCatalogTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "CatalogTest";

const updates = {
    // ── Catalog Main Screen (TC01 to TC20) ──
    "TC01_MainScreen_PageLoads": {
        "Description": "Verify Catalog page loads successfully with Catalog Tree and Catalog Details sections displayed.",
        "ExpectedResult": "Catalog page loads successfully with tree and details sections."
    },
    "TC02_MainScreen_ExpandNode": {
        "Description": "Verify expanding a catalog node displays all child categories correctly.",
        "ExpectedResult": "All child categories are displayed correctly under parent."
    },
    "TC03_MainScreen_SelectNode": {
        "Description": "Verify selecting a catalog item populates the Catalog Details panel with correct information.",
        "ExpectedResult": "Catalog Details panel populates with correct information."
    },
    "TC04_MainScreen_CreateButton": {
        "Description": "Verify Create Catalog button opens the catalog creation form/modal successfully.",
        "ExpectedResult": "Catalog creation form/modal opens successfully."
    },
    "TC05_MainScreen_NameField": {
        "Description": "Verify catalog Name field displays the selected catalog name correctly.",
        "ExpectedResult": "Name field displays the correct selected name."
    },
    "TC06_MainScreen_DisplayNameField": {
        "Description": "Verify Display Name field shows the correct display name for the selected catalog.",
        "ExpectedResult": "Display Name field shows the correct display name."
    },
    "TC07_MainScreen_LongDescField": {
        "Description": "Verify Long Description field displays saved catalog description correctly.",
        "ExpectedResult": "Long Description displays the saved description text."
    },
    "TC08_MainScreen_ShortDescField": {
        "Description": "Verify Short Description field displays saved catalog summary correctly.",
        "ExpectedResult": "Short Description displays the saved summary text."
    },
    "TC09_MainScreen_AttributeCount": {
        "Description": "Verify Attribute Count displays the correct number of attributes for the selected catalog.",
        "ExpectedResult": "Attribute Count matches actual catalog attributes."
    },
    "TC10_MainScreen_TreeHierarchy": {
        "Description": "Verify Catalog Tree hierarchy is displayed in the correct parent-child structure.",
        "ExpectedResult": "Catalog Tree displays in correct parent-child structure."
    },
    "TC11_MainScreen_EmptyDetails": {
        "Description": "Verify Catalog Details section remains empty or shows a message when no catalog is selected.",
        "ExpectedResult": "Empty details message or empty section displays."
    },
    "TC12_MainScreen_APIFailure": {
        "Description": "Verify system handles Catalog API failure without crashing the page.",
        "ExpectedResult": "Graceful error toaster or message shows."
    },
    "TC13_MainScreen_InvalidNodes": {
        "Description": "Verify invalid or deleted catalog nodes are not displayed in the Catalog Tree.",
        "ExpectedResult": "Deleted or invalid nodes do not show."
    },
    "TC14_MainScreen_MissingDetails": {
        "Description": "Verify selecting a catalog with missing details does not break the UI.",
        "ExpectedResult": "UI handles blank or null details gracefully."
    },
    "TC15_MainScreen_UnauthorizedCreate": {
        "Description": "Verify Create Catalog action is restricted for unauthorized users.",
        "ExpectedResult": "Action blocked or access denied error."
    },
    "TC16_MainScreen_LongNameDisplay": {
        "Description": "Verify extremely long catalog names are displayed without UI overlap or truncation issues.",
        "ExpectedResult": "Text wraps or scrolls cleanly without breaking layout."
    },
    "TC17_MainScreen_EmptyTree": {
        "Description": "Verify Catalog Tree handles empty catalog data gracefully.",
        "ExpectedResult": "No data/empty tree displays safely."
    },
    "TC18_MainScreen_DuplicateName": {
        "Description": "Verify system prevents duplicate catalog creation when the same catalog name already exists.",
        "ExpectedResult": "Validation error blocks duplicate creation."
    },
    "TC19_MainScreen_LargeHierarchy": {
        "Description": "Verify page remains responsive when loading a very large catalog hierarchy (1000+ nodes).",
        "ExpectedResult": "Hierarchy loads successfully and page stays responsive."
    },
    "TC20_MainScreen_DisabledButtons": {
        "Description": "Verify clicking disabled Details/Delete Catalog buttons without selecting a catalog does not trigger any action.",
        "ExpectedResult": "No actions are triggered on click."
    },

    // ── Catalog Details Screen (TC21 to TC90) ──
    "TC21_Details_PageLoads": {
        "Description": "Verify Catalog Details page loads successfully with all sections displayed.",
        "ExpectedResult": "Catalog Details page loads successfully."
    },
    "TC22_Details_AllFieldsPopulated": {
        "Description": "Verify selected catalog information is populated correctly in all fields.",
        "ExpectedResult": "All details fields populate correctly."
    },
    "TC23_Details_NameField": {
        "Description": "Verify Name field displays the correct catalog name.",
        "ExpectedResult": "Name field displays correct catalog name."
    },
    "TC24_Details_DisplayNameField": {
        "Description": "Verify Display Name field displays the correct value.",
        "ExpectedResult": "Display Name field displays correct value."
    },
    "TC25_Details_LongDescField": {
        "Description": "Verify Long Description field displays saved data correctly.",
        "ExpectedResult": "Long Description displays correct saved data."
    },
    "TC26_Details_ShortDescField": {
        "Description": "Verify Short Description field displays saved data correctly.",
        "ExpectedResult": "Short Description displays correct saved data."
    },
    "TC27_Details_LanguageDropdown": {
        "Description": "Verify Select Language dropdown displays available languages.",
        "ExpectedResult": "Language dropdown lists all available translation options."
    },
    "TC28_Details_ChangeLanguage": {
        "Description": "Verify changing language updates localized catalog details correctly.",
        "ExpectedResult": "Localized catalog details update correctly."
    },
    "TC29_Details_CatalogLevel": {
        "Description": "Verify Catalog Level field displays correct hierarchy level.",
        "ExpectedResult": "Catalog Level shows correct hierarchy depth."
    },
    "TC30_Details_ParentField": {
        "Description": "Verify Parent field displays correct parent catalog.",
        "ExpectedResult": "Parent catalog displays correctly."
    },
    "TC31_Details_AliasField": {
        "Description": "Verify Catalog Alias field displays correct alias values.",
        "ExpectedResult": "Catalog Alias shows correct alias values."
    },
    "TC32_Details_CatalogTypeField": {
        "Description": "Verify Catalog Type field displays assigned catalog type.",
        "ExpectedResult": "Catalog Type shows assigned type details."
    },
    "TC33_Details_IconUpload": {
        "Description": "Verify icon image uploads successfully with supported image format.",
        "ExpectedResult": "Icon image uploads successfully."
    },
    "TC34_Details_IconPreview": {
        "Description": "Verify uploaded icon preview is displayed correctly.",
        "ExpectedResult": "Icon preview displays correctly."
    },
    "TC35_Details_ChangeImage": {
        "Description": "Verify Change Image button allows replacing existing image.",
        "ExpectedResult": "Image replaced successfully."
    },
    "TC36_Details_ImageLibrary": {
        "Description": "Verify Image Library section displays uploaded images correctly.",
        "ExpectedResult": "Uploaded library images display correctly."
    },
    "TC37_Details_AddImage": {
        "Description": "Verify Add Image button uploads additional images successfully.",
        "ExpectedResult": "Additional images uploaded successfully."
    },
    "TC38_Details_ImageTitle": {
        "Description": "Verify image title is displayed correctly in Image Library.",
        "ExpectedResult": "Image title displays correctly."
    },
    "TC39_Details_ImageDescription": {
        "Description": "Verify image description is displayed correctly in Image Library.",
        "ExpectedResult": "Image description displays correctly."
    },
    "TC40_Details_AddAttribute": {
        "Description": "Verify Add Attribute button creates a new attribute successfully.",
        "ExpectedResult": "New attribute created successfully."
    },
    "TC41_Details_AttributeSearch": {
        "Description": "Verify attribute search returns matching attributes.",
        "ExpectedResult": "Attribute search returns matching attributes."
    },
    "TC42_Details_VisibleToggle": {
        "Description": "Verify Visible toggle updates attribute visibility successfully.",
        "ExpectedResult": "Attribute visibility updates successfully."
    },
    "TC43_Details_RequiredToggle": {
        "Description": "Verify Required toggle updates attribute requirement successfully.",
        "ExpectedResult": "Attribute requirement updates successfully."
    },
    "TC44_Details_SearchableToggle": {
        "Description": "Verify Searchable toggle updates attribute searchability successfully.",
        "ExpectedResult": "Attribute searchability updates successfully."
    },
    "TC45_Details_InventoryableToggle": {
        "Description": "Verify Inventoryable toggle updates inventory settings correctly.",
        "ExpectedResult": "Inventory settings update correctly."
    },
    "TC46_Details_VariantToggle": {
        "Description": "Verify Variant toggle updates variant settings correctly.",
        "ExpectedResult": "Variant settings update correctly."
    },
    "TC47_Details_VisibleOnCreate": {
        "Description": "Verify Visible on Create toggle updates successfully.",
        "ExpectedResult": "Visible on Create updates successfully."
    },
    "TC48_Details_VisibleOnUpdate": {
        "Description": "Verify Visible on Update toggle updates successfully.",
        "ExpectedResult": "Visible on Update updates successfully."
    },
    "TC49_Details_VisibleOnShow": {
        "Description": "Verify Visible on Show toggle updates successfully.",
        "ExpectedResult": "Visible on Show updates successfully."
    },
    "TC50_Details_AttributeSorting": {
        "Description": "Verify attribute sorting updates display order correctly.",
        "ExpectedResult": "Sorting updates attribute display order correctly."
    },
    "TC51_Details_FormLayout": {
        "Description": "Verify Form Layout section displays all configured fields correctly.",
        "ExpectedResult": "Form Layout displays all fields correctly."
    },
    "TC52_Details_AddBlock": {
        "Description": "Verify Add Block button creates a new form block successfully.",
        "ExpectedResult": "New form block created successfully."
    },
    "TC53_Details_AddAttrToBlock": {
        "Description": "Verify Add Attribute to block works successfully.",
        "ExpectedResult": "Attribute added to block successfully."
    },
    "TC54_Details_OrderTypes": {
        "Description": "Verify Order Types section displays assigned order types correctly.",
        "ExpectedResult": "Assigned order types display correctly."
    },
    "TC55_Details_Pagination": {
        "Description": "Verify pagination works correctly when multiple attributes exist.",
        "ExpectedResult": "Pagination navigates correctly between attribute pages."
    },
    "TC56_Details_APIFailure": {
        "Description": "Verify page handles Catalog Details API failure gracefully.",
        "ExpectedResult": "API failure handled gracefully."
    },
    "TC57_Details_EmptyState": {
        "Description": "Verify page displays empty state when catalog details are unavailable.",
        "ExpectedResult": "Empty state displays successfully."
    },
    "TC58_Details_SpecialCharsName": {
        "Description": "Verify Name field rejects unsupported special characters if restricted.",
        "ExpectedResult": "Unsupported characters rejected with validation."
    },
    "TC59_Details_DuplicateAlias": {
        "Description": "Verify duplicate catalog alias values are not allowed.",
        "ExpectedResult": "Duplicate alias values blocked with validation."
    },
    "TC60_Details_MissingTranslation": {
        "Description": "Verify language selection handles missing translations gracefully.",
        "ExpectedResult": "Missing translations handled gracefully."
    },
    "TC61_Details_UnsupportedImageFormat": {
        "Description": "Verify unsupported image formats are rejected during icon upload.",
        "ExpectedResult": "Unsupported image format rejected."
    },
    "TC62_Details_ImageSizeExceeded": {
        "Description": "Verify image upload fails when file size exceeds allowed limit.",
        "ExpectedResult": "Oversized image rejected."
    },
    "TC63_Details_CorruptedImage": {
        "Description": "Verify corrupted image files cannot be uploaded.",
        "ExpectedResult": "Corrupted image upload blocked."
    },
    "TC64_Details_InvalidImageURL": {
        "Description": "Verify image preview does not break when image URL is invalid.",
        "ExpectedResult": "Invalid URL preview handles gracefully."
    },
    "TC65_Details_ImageUploadFailure": {
        "Description": "Verify Add Image action handles upload service failure gracefully.",
        "ExpectedResult": "Upload service failure handled gracefully."
    },
    "TC66_Details_DeleteImage": {
        "Description": "Verify deleting an image removes it from Image Library successfully.",
        "ExpectedResult": "Image deleted from library successfully."
    },
    "TC67_Details_DuplicateImage": {
        "Description": "Verify duplicate image uploads are handled appropriately.",
        "ExpectedResult": "Duplicate image handled appropriately."
    },
    "TC68_Details_AddAttrMandatoryMissing": {
        "Description": "Verify Add Attribute fails when mandatory attribute information is missing.",
        "ExpectedResult": "Attribute addition blocked."
    },
    "TC69_Details_DuplicateAttribute": {
        "Description": "Verify duplicate attributes cannot be added to the same catalog.",
        "ExpectedResult": "Duplicate attribute addition blocked."
    },
    "TC70_Details_InvalidAttrType": {
        "Description": "Verify invalid attribute types are rejected.",
        "ExpectedResult": "Invalid attribute types rejected."
    },
    "TC71_Details_AttrSearchNoResults": {
        "Description": "Verify attribute search with invalid text returns no results.",
        "ExpectedResult": "Search returns no results."
    },
    "TC72_Details_ToggleAPIFailure": {
        "Description": "Verify attribute toggles handle API failures without UI corruption.",
        "ExpectedResult": "Toggle API failure handled gracefully."
    },
    "TC73_Details_InvalidSortPosition": {
        "Description": "Verify sorting attributes with invalid positions is prevented.",
        "ExpectedResult": "Invalid sorting prevented."
    },
    "TC74_Details_RequiredToggleUnsupported": {
        "Description": "Verify Required toggle cannot be enabled for unsupported attribute types.",
        "ExpectedResult": "Required toggle disabled for unsupported types."
    },
    "TC75_Details_DeleteAttribute": {
        "Description": "Verify deleting an attribute updates the list correctly without page refresh issues.",
        "ExpectedResult": "Attribute list updates successfully."
    },
    "TC76_Details_EmptyBlock": {
        "Description": "Verify Form Layout handles empty blocks correctly.",
        "ExpectedResult": "Empty blocks handled correctly."
    },
    "TC77_Details_DuplicateFieldInBlock": {
        "Description": "Verify adding duplicate fields to the same block is restricted.",
        "ExpectedResult": "Duplicate fields in block restricted."
    },
    "TC78_Details_BlockDeletion": {
        "Description": "Verify block deletion updates layout correctly.",
        "ExpectedResult": "Layout updates correctly after block deletion."
    },
    "TC79_Details_InvalidDragDrop": {
        "Description": "Verify drag-and-drop reordering handles invalid drop positions.",
        "ExpectedResult": "Invalid drop positions handled gracefully."
    },
    "TC80_Details_MandatoryFieldsMissing": {
        "Description": "Verify system prevents saving layout with mandatory fields missing.",
        "ExpectedResult": "Layout save blocked with validation."
    },
    "TC81_Details_LayoutAfterRefresh": {
        "Description": "Verify layout remains intact after browser refresh.",
        "ExpectedResult": "Layout remains intact after refresh."
    },
    "TC82_Details_LargeAttrCount": {
        "Description": "Verify page handles large numbers of attributes (500+) without performance issues.",
        "ExpectedResult": "Large numbers of attributes handled without lag."
    },
    "TC83_Details_UnauthorizedModify": {
        "Description": "Verify unauthorized users cannot modify catalog details.",
        "ExpectedResult": "Modification blocked for unauthorized users."
    },
    "TC84_Details_UnauthorizedImageUpload": {
        "Description": "Verify unauthorized users cannot upload images.",
        "ExpectedResult": "Image upload blocked."
    },
    "TC85_Details_UnauthorizedAttr": {
        "Description": "Verify unauthorized users cannot add or delete attributes.",
        "ExpectedResult": "Attribute modification blocked."
    },
    "TC86_Details_EmptyOrderTypes": {
        "Description": "Verify Order Types section handles empty order type assignments correctly.",
        "ExpectedResult": "Empty order types handled correctly."
    },
    "TC87_Details_PaginationDynamic": {
        "Description": "Verify pagination does not break when record count changes dynamically.",
        "ExpectedResult": "Pagination handles dynamic changes."
    },
    "TC88_Details_NullValues": {
        "Description": "Verify null values in catalog details do not break the UI.",
        "ExpectedResult": "Null values do not break UI."
    },
    "TC89_Details_ConcurrentUpdates": {
        "Description": "Verify concurrent updates by multiple users are handled correctly.",
        "ExpectedResult": "Concurrent updates handled correctly."
    },
    "TC90_Details_BackRefreshUnsaved": {
        "Description": "Verify browser back/refresh actions do not cause unsaved data corruption.",
        "ExpectedResult": "No data corruption on back/refresh."
    },

    // ── Delete Catalog Popup (TC91 to TC100) ──
    "TC91_Delete_ConfirmDeletes": {
        "Description": "Verify clicking \"Yes, Delete it!\" successfully deletes the selected catalog and removes it from the Catalog Tree.",
        "ExpectedResult": "Catalog deleted successfully."
    },
    "TC92_Delete_CancelKeeps": {
        "Description": "Verify clicking \"Cancel\" closes the delete confirmation popup without deleting the catalog.",
        "ExpectedResult": "Popup closes; catalog kept."
    },
    "TC93_Delete_PopupDisplayed": {
        "Description": "Verify the delete confirmation popup is displayed when Delete Catalog button is clicked.",
        "ExpectedResult": "Delete confirmation popup displays."
    },
    "TC94_Delete_SuccessMessage": {
        "Description": "Verify after successful deletion, a success message/notification is displayed.",
        "ExpectedResult": "Success message displays."
    },
    "TC95_Delete_RedirectAfterDelete": {
        "Description": "Verify the system redirects or refreshes the Catalog Details section correctly after catalog deletion.",
        "ExpectedResult": "System redirects/refreshes details correctly."
    },
    "TC96_Delete_CancelNoDelete": {
        "Description": "Verify catalog is not deleted when user clicks \"Cancel\" on the confirmation popup.",
        "ExpectedResult": "Catalog is not deleted."
    },
    "TC97_Delete_CloseNoDelete": {
        "Description": "Verify catalog is not deleted when the popup is closed using the X/Close option (if available).",
        "ExpectedResult": "Catalog remains unchanged."
    },
    "TC98_Delete_APIError": {
        "Description": "Verify deletion fails gracefully and displays an error message when the delete API returns an error.",
        "ExpectedResult": "Deletion fails gracefully with error message."
    },
    "TC99_Delete_RapidClicks": {
        "Description": "Verify user cannot perform multiple delete requests by rapidly clicking \"Yes, Delete it!\" multiple times.",
        "ExpectedResult": "Only one request processes."
    },
    "TC100_Delete_DependentChild": {
        "Description": "Verify deletion is restricted and an appropriate validation/error message is shown when the catalog contains dependent child catalogs/products.",
        "ExpectedResult": "Deletion blocked with validation message."
    },

    // ── Create Catalog Screen (TC101 to TC140) ──
    "TC101_Create_AllMandatory": {
        "Description": "Verify catalog is created successfully with all mandatory fields populated.",
        "ExpectedResult": "Catalog created successfully."
    },
    "TC102_Create_ValidFields": {
        "Description": "Verify user can create a catalog with valid Name, Display Name, Long Description, and Short Description.",
        "ExpectedResult": "Catalog created successfully with detailed fields."
    },
    "TC103_Create_EnglishLanguage": {
        "Description": "Verify user can select English language and save the catalog successfully.",
        "ExpectedResult": "Catalog saved successfully in English."
    },
    "TC104_Create_ProductType": {
        "Description": "Verify user can select Product Type catalog type and save successfully.",
        "ExpectedResult": "Product Type catalog saved successfully."
    },
    "TC105_Create_ValidParent": {
        "Description": "Verify user can select a valid Parent Catalog from the dropdown.",
        "ExpectedResult": "Valid Parent Catalog selected."
    },
    "TC106_Create_ThumbnailUpload": {
        "Description": "Verify thumbnail image upload works with a valid image file (JPG/PNG).",
        "ExpectedResult": "Thumbnail image uploaded."
    },
    "TC107_Create_ThumbnailPreview": {
        "Description": "Verify uploaded thumbnail is displayed correctly before saving.",
        "ExpectedResult": "Thumbnail preview displays correctly."
    },
    "TC108_Create_AddAttribute": {
        "Description": "Verify user can add an external attribute successfully.",
        "ExpectedResult": "External attribute added."
    },
    "TC109_Create_SearchableToggle": {
        "Description": "Verify user can enable/disable Searchable toggle for an attribute.",
        "ExpectedResult": "Searchable toggle updates."
    },
    "TC110_Create_RequiredToggle": {
        "Description": "Verify user can enable/disable Required toggle for an attribute.",
        "ExpectedResult": "Required toggle updates."
    },
    "TC111_Create_VisibleOnCreate": {
        "Description": "Verify user can enable/disable Visible on Create toggle.",
        "ExpectedResult": "Visible on Create updates."
    },
    "TC112_Create_VisibleOnUpdate": {
        "Description": "Verify user can enable/disable Visible on Update toggle.",
        "ExpectedResult": "Visible on Update updates."
    },
    "TC113_Create_VisibleOnShow": {
        "Description": "Verify user can enable/disable Visible on Show toggle.",
        "ExpectedResult": "Visible on Show updates."
    },
    "TC114_Create_ReorderAttributes": {
        "Description": "Verify user can reorder attributes using sort arrows.",
        "ExpectedResult": "Attributes sorted successfully."
    },
    "TC115_Create_AttrSearch": {
        "Description": "Verify attribute search returns matching attributes.",
        "ExpectedResult": "Search returns matching attributes."
    },
    "TC116_Create_OrderInputAttr": {
        "Description": "Verify order input attributes can be added successfully.",
        "ExpectedResult": "Order input attribute added."
    },
    "TC117_Create_MultipleAttributes": {
        "Description": "Verify multiple attributes can be configured before saving.",
        "ExpectedResult": "Multiple attributes configured successfully."
    },
    "TC118_Create_AppearsInTree": {
        "Description": "Verify saved catalog appears under the selected parent in the Catalog Tree.",
        "ExpectedResult": "Catalog appears in Catalog Tree."
    },
    "TC119_Create_Pagination": {
        "Description": "Verify pagination works correctly in the External Attribute section.",
        "ExpectedResult": "Pagination navigates correctly."
    },
    "TC120_Create_SaveSuccess": {
        "Description": "Verify clicking Save persists all catalog details and displays a success message.",
        "ExpectedResult": "Details saved with success toaster."
    },
    "TC121_Create_BlankName": {
        "Description": "Verify catalog creation fails when Name field is left blank.",
        "ExpectedResult": "Blank Name rejected with validation."
    },
    "TC122_Create_BlankDisplayName": {
        "Description": "Verify catalog creation fails when Display Name field is blank.",
        "ExpectedResult": "Blank Display Name rejected."
    },
    "TC123_Create_BlankLongDesc": {
        "Description": "Verify catalog creation fails when Long Description is blank.",
        "ExpectedResult": "Blank Long Description rejected."
    },
    "TC124_Create_BlankShortDesc": {
        "Description": "Verify catalog creation fails when Short Description is blank.",
        "ExpectedResult": "Blank Short Description rejected."
    },
    "TC125_Create_NoCatalogType": {
        "Description": "Verify catalog creation fails when no Catalog Type is selected.",
        "ExpectedResult": "Catalog Type missing validation error."
    },
    "TC126_Create_NoParent": {
        "Description": "Verify catalog creation fails when no Parent Catalog is selected.",
        "ExpectedResult": "Parent Catalog missing validation error."
    },
    "TC127_Create_DuplicateName": {
        "Description": "Verify user cannot create a catalog with a duplicate catalog name.",
        "ExpectedResult": "Duplicate catalog name validation warning displays."
    },
    "TC128_Create_NameTooLong": {
        "Description": "Verify validation message appears when Name exceeds maximum allowed length.",
        "ExpectedResult": "Validation warns on Name length limit."
    },
    "TC129_Create_DisplayNameTooLong": {
        "Description": "Verify validation message appears when Display Name exceeds maximum allowed length.",
        "ExpectedResult": "Validation warns on Display Name limit."
    },
    "TC130_Create_SpecialCharsName": {
        "Description": "Verify special characters not allowed in catalog name are rejected.",
        "ExpectedResult": "Special characters name rejected with warning."
    },
    "TC131_Create_NonImageFile": {
        "Description": "Verify upload fails when a non-image file (PDF, EXE, TXT) is uploaded as thumbnail.",
        "ExpectedResult": "Non-image upload rejected."
    },
    "TC132_Create_OversizedImage": {
        "Description": "Verify upload fails when image size exceeds the allowed limit.",
        "ExpectedResult": "Oversized image upload rejected."
    },
    "TC133_Create_CorruptedImage": {
        "Description": "Verify corrupted image files cannot be uploaded.",
        "ExpectedResult": "Corrupted image upload blocked."
    },
    "TC134_Create_MissingRequiredAttr": {
        "Description": "Verify clicking Save without selecting required attributes shows validation.",
        "ExpectedResult": "Validation prompts on required attributes."
    },
    "TC135_Create_DuplicateAttr": {
        "Description": "Verify duplicate attributes cannot be added multiple times.",
        "ExpectedResult": "Duplicate attribute additions blocked."
    },
    "TC136_Create_IncompleteAttrConfig": {
        "Description": "Verify system prevents saving when mandatory attribute configuration is incomplete.",
        "ExpectedResult": "Configuration incomplete validation warning."
    },
    "TC137_Create_AttrSearchNoResults": {
        "Description": "Verify attribute search with invalid text returns no results without errors.",
        "ExpectedResult": "Attribute search returns empty list."
    },
    "TC138_Create_RapidSaveClicks": {
        "Description": "Verify rapid multiple clicks on Save do not create duplicate catalogs.",
        "ExpectedResult": "Only one request processes."
    },
    "TC139_Create_APIFailureSave": {
        "Description": "Verify system handles API/server failure during save and shows an error message.",
        "ExpectedResult": "Save fails with error message."
    },
    "TC140_Create_DeleteMandatoryAttr": {
        "Description": "Verify user cannot delete a mandatory default attribute from the attribute list.",
        "ExpectedResult": "Deletion of mandatory default attribute blocked."
    }
};

try {
    const wb = XLSX.readFile(FILE);
    const ws = wb.Sheets[SHEET_NAME];
    if (!ws) {
        throw new Error(`Sheet "${SHEET_NAME}" not found`);
    }

    const rows = XLSX.utils.sheet_to_json(ws);
    console.log(`Original rows length: ${rows.length}`);

    // Update each row's Description and ExpectedResult based on its TestID
    let count = 0;
    rows.forEach((row) => {
        const id = row.TestID;
        if (updates[id]) {
            row.Description = updates[id].Description;
            row.ExpectedResult = updates[id].ExpectedResult;
            count++;
        }
    });

    console.log(`Updated: ${count} rows`);

    // Write it back to the workbook sheet
    const wsHeaders = Object.keys(rows[0]);
    const wsData = [
        wsHeaders,
        ...rows.map((row) => wsHeaders.map((h) => row[h] === undefined ? "" : row[h]))
    ];

    const newWs = XLSX.utils.aoa_to_sheet(wsData);

    const idx = wb.SheetNames.indexOf(SHEET_NAME);
    wb.SheetNames.splice(idx, 1);
    delete wb.Sheets[SHEET_NAME];
    XLSX.utils.book_append_sheet(wb, newWs, SHEET_NAME);

    XLSX.writeFile(wb, FILE);
    console.log(`Successfully saved CatalogTest workbook!`);
} catch (err) {
    console.error("Failed to update testData.xlsx:", err.message);
    process.exit(1);
}
