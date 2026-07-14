const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");

// Helper descriptions for rows 103-140 in Create Catalog tab
const extraCreateDescriptions = {
    "TC103_Create_EnglishLanguage": "Verify English language can be selected successfully.",
    "TC104_Create_ProductType": "Verify Product Type catalog type can be selected successfully.",
    "TC105_Create_ValidParent": "Verify user can select a valid Parent Catalog.",
    "TC106_Create_ThumbnailUpload": "Verify valid image upload is successful for Thumbnail.",
    "TC107_Create_ThumbnailPreview": "Verify thumbnail preview displays uploaded image.",
    "TC108_Create_AddAttribute": "Verify Add Attribute button adds selected attribute successfully.",
    "TC109_Create_SearchableToggle": "Verify Searchable toggle can be enabled successfully during creation.",
    "TC110_Create_RequiredToggle": "Verify Required toggle can be enabled successfully during creation.",
    "TC111_Create_VisibleOnCreate": "Verify Visible On Create toggle updates successfully during creation.",
    "TC112_Create_VisibleOnUpdate": "Verify Visible On Update toggle updates successfully during creation.",
    "TC113_Create_VisibleOnShow": "Verify Visible On Show toggle updates successfully during creation.",
    "TC114_Create_ReorderAttributes": "Verify user can reorder attributes using drag and drop.",
    "TC115_Create_AttrSearch": "Verify Search field filters attributes correctly.",
    "TC116_Create_OrderInputAttr": "Verify attribute sorting order input value is saved.",
    "TC117_Create_MultipleAttributes": "Verify multiple attributes can be added to the new catalog.",
    "TC118_Create_AppearsInTree": "Verify the created catalog appears in the Catalog Tree immediately after saving.",
    "TC119_Create_Pagination": "Verify pagination works correctly in attributes grid.",
    "TC120_Create_SaveSuccess": "Verify Save button creates catalog successfully and displays success message.",
    "TC121_Create_BlankName": "Verify catalog creation fails when Name field is left blank.",
    "TC122_Create_BlankDisplayName": "Verify catalog creation fails when Display Name field is left blank.",
    "TC123_Create_BlankLongDesc": "Verify catalog creation fails when Long Description is empty if mandatory.",
    "TC124_Create_BlankShortDesc": "Verify catalog creation fails when Short Description is empty if mandatory.",
    "TC125_Create_NoCatalogType": "Verify catalog creation fails when no Catalog Type is selected.",
    "TC126_Create_NoParent": "Verify catalog creation fails when no Parent is selected if required.",
    "TC127_Create_DuplicateName": "Verify duplicate catalog name cannot be created.",
    "TC128_Create_NameTooLong": "Verify Name field does not accept input beyond maximum length.",
    "TC129_Create_DisplayNameTooLong": "Verify Display Name field does not accept input beyond maximum length.",
    "TC130_Create_SpecialCharsName": "Verify special characters only are not accepted in Name field.",
    "TC131_Create_NonImageFile": "Verify unsupported file formats (.exe, .txt) cannot be uploaded as Thumbnail.",
    "TC132_Create_OversizedImage": "Verify oversized image upload is rejected.",
    "TC133_Create_CorruptedImage": "Verify corrupted image file upload fails gracefully.",
    "TC134_Create_MissingRequiredAttr": "Verify creation fails if required attribute settings are invalid.",
    "TC135_Create_DuplicateAttr": "Verify duplicate attributes cannot be added multiple times.",
    "TC136_Create_IncompleteAttrConfig": "Verify creation validation displays on invalid attribute config.",
    "TC137_Create_AttrSearchNoResults": "Verify search field handles invalid special characters without crashing.",
    "TC138_Create_RapidSaveClicks": "Verify multiple rapid clicks on Save do not create duplicate catalogs.",
    "TC139_Create_APIFailureSave": "Verify clicking Save during API failure shows proper error message.",
    "TC140_Create_DeleteMandatoryAttr": "Verify system prevents saving catalog if mandatory configurations are deleted."
};

try {
    const wb = XLSX.readFile(FILE);

    // 1. Read existing sheets for reference data
    const existingAdminRows = XLSX.utils.sheet_to_json(wb.Sheets["CatalogAdminTest"]) || [];
    const existingTenantRows = XLSX.utils.sheet_to_json(wb.Sheets["CatalogTest"]) || [];

    // Columns union
    const headers = [
        "TestID", "Issue", "Description", "UserName", "Password", "persona", "ExpectedResult",
        "CatalogNode", "ParentNode", "ChildNode", "ExpectedChildren", "ExpectedCount", "Language",
        "InvalidName", "LongName", "LongDisplayName", "SearchTerm", "ThumbnailPath", "NonImageFilePath",
        "OversizedImagePath", "CorruptedImagePath", "Name", "DisplayName", "LongDescription",
        "ShortDescription", "CatalogType", "Parent", "DuplicateName", "CreatedName"
    ];

    // Helper to find existing row data
    const findAdminRow = (testID) => existingAdminRows.find(r => r.TestID === testID) || {};
    const findTenantRow = (testID) => existingTenantRows.find(r => r.TestID === testID) || {};

    // 2. Build CatalogAdminTest (102 rows)
    const adminRows = [];
    for (let i = 1; i <= 102; i++) {
        const id = "TC" + String(i).padStart(2, "0") + (i <= 20 ? "_MainScreen_" : i <= 90 ? "_Details_" : i <= 100 ? "_Delete_" : "_Create_");
        // match by prefix
        const foundAdmin = existingAdminRows.find(r => r.TestID && r.TestID.startsWith("TC" + String(i).padStart(2, "0"))) || {};
        
        const testID = foundAdmin.TestID || ("TC" + String(i).padStart(2, "0") + "_Placeholder");
        const description = foundAdmin.Description || "Verify catalog behavior.";
        const expectedResult = foundAdmin.ExpectedResult || "Catalog behaves as expected.";

        const row = {
            "TestID": testID,
            "Issue": String(22000 + i),
            "Description": description,
            "UserName": "nipigev2@yopmail.com",
            "Password": "admin@123",
            "persona": "admin",
            "ExpectedResult": expectedResult,
            ...foundAdmin
        };
        adminRows.push(row);
    }

    // 3. Build CatalogTest (140 rows)
    const tenantRows = [];
    for (let i = 1; i <= 140; i++) {
        let prefix = "TC" + String(i).padStart(2, "0") + "_";
        let foundTenant = existingTenantRows.find(r => r.TestID && r.TestID.startsWith("TC" + String(i).padStart(2, "0"))) || {};
        
        // Also look up helper fields from Admin mapping to populate
        const foundAdminRef = existingAdminRows.find(r => r.TestID && r.TestID.startsWith("TC" + String(i).padStart(2, "0"))) || {};

        let testID = foundTenant.TestID || foundAdminRef.TestID;
        if (!testID) {
            // Find key in extraCreateDescriptions
            const suffix = Object.keys(extraCreateDescriptions).find(k => k.startsWith("TC" + String(i).padStart(2, "0")));
            testID = suffix || `TC${String(i).padStart(2, "0")}_Create_Extra`;
        }

        let description = foundTenant.Description || foundAdminRef.Description || extraCreateDescriptions[testID] || "Verify catalog behavior.";
        let expectedResult = foundTenant.ExpectedResult || foundAdminRef.ExpectedResult || "Catalog behaves as expected.";

        const row = {
            "TestID": testID,
            "Issue": String(23000 + i),
            "Description": description,
            "UserName": "freshcart@gmail.com",
            "Password": "Welcome@123",
            "persona": "tenant",
            "ExpectedResult": expectedResult,
            ...foundAdminRef,
            ...foundTenant
        };
        tenantRows.push(row);
    }

    // Write CatalogAdminTest
    if (wb.SheetNames.includes("CatalogAdminTest")) {
        const idx = wb.SheetNames.indexOf("CatalogAdminTest");
        wb.SheetNames.splice(idx, 1);
        delete wb.Sheets["CatalogAdminTest"];
    }
    const adminWSData = [headers, ...adminRows.map(r => headers.map(h => r[h] !== undefined ? String(r[h]) : ""))];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(adminWSData), "CatalogAdminTest");
    console.log(`Re-created CatalogAdminTest sheet with ${adminRows.length} rows.`);

    // Write CatalogTest
    if (wb.SheetNames.includes("CatalogTest")) {
        const idx = wb.SheetNames.indexOf("CatalogTest");
        wb.SheetNames.splice(idx, 1);
        delete wb.Sheets["CatalogTest"];
    }
    const tenantWSData = [headers, ...tenantRows.map(r => headers.map(h => r[h] !== undefined ? String(r[h]) : ""))];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tenantWSData), "CatalogTest");
    console.log(`Re-created CatalogTest sheet with ${tenantRows.length} rows.`);

    XLSX.writeFile(wb, FILE);
    console.log(`Successfully saved both Catalog sheets in ${FILE}`);
} catch (err) {
    console.error("Error updating Catalog sheets:", err.message);
    process.exit(1);
}
