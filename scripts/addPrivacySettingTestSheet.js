/**
 * Updates (or replaces) the "PrivacySettingTest" sheet in testData.xlsx — 20 test cases.
 * Run once: node scripts/addPrivacySettingTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "PrivacySettingTest";

const rows = [
    {
        "TestID": "TC_PS_01",
        "Issue": "14001",
        "Description": "Verify user can navigate to Privacy Setting page and view the privacy settings list successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Privacy settings page loads with summary counts, search and setup grids displayed."
    },
    {
        "TestID": "TC_PS_02",
        "Issue": "14002",
        "Description": "Verify clicking Create Privacy Setting opens the create form with all required fields displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Create Privacy Setting form loads with all required selection options."
    },
    {
        "TestID": "TC_PS_03",
        "Issue": "14003",
        "Description": "Verify user can create a new Terms & Conditions record with valid App, Title, Subtitle, and Content.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Terms & Conditions record is created successfully."
    },
    {
        "TestID": "TC_PS_04",
        "Issue": "14004",
        "Description": "Verify user can create a new Privacy Policy record with valid mandatory field values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Privacy Policy record is created successfully."
    },
    {
        "TestID": "TC_PS_05",
        "Issue": "14005",
        "Description": "Verify user can create a new About Us record with valid content and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "About Us record is created successfully."
    },
    {
        "TestID": "TC_PS_06",
        "Issue": "14006",
        "Description": "Verify validation message appears when Select Type is left blank and user clicks Save.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows type selection is required."
    },
    {
        "TestID": "TC_PS_07",
        "Issue": "14007",
        "Description": "Verify validation message appears when Title field is left empty during creation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Title is required."
    },
    {
        "TestID": "TC_PS_08",
        "Issue": "14008",
        "Description": "Verify system prevents saving when Content field is empty.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Content is required."
    },
    {
        "TestID": "TC_PS_09",
        "Issue": "14009",
        "Description": "Verify newly created privacy setting appears in the listing grid with correct details.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Created record is displayed in the list view."
    },
    {
        "TestID": "TC_PS_10",
        "Issue": "14010",
        "Description": "Verify user can edit an existing privacy setting and updated data is saved successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Privacy settings are updated successfully."
    },
    {
        "TestID": "TC_PS_11",
        "Issue": "14011",
        "Description": "Verify user cannot update a privacy setting with mandatory fields cleared.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Clear validation errors appear and save is blocked."
    },
    {
        "TestID": "TC_PS_12",
        "Issue": "14012",
        "Description": "Verify rich text editor formatting (Bold, Italic, Headers, Lists) is saved and displayed correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Rich text formats correctly and retains formatting values."
    },
    {
        "TestID": "TC_PS_13",
        "Issue": "14013",
        "Description": "Verify user can add multiple subsections using the (+) icon and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Subsections are created and saved successfully."
    },
    {
        "TestID": "TC_PS_14",
        "Issue": "14014",
        "Description": "Verify system handles maximum-length content without application crash or data corruption.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Maximum content size is handled gracefully."
    },
    {
        "TestID": "TC_PS_15",
        "Issue": "14015",
        "Description": "Verify status toggle changes record status from Active to Inactive and persists after page refresh.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Status is updated and persisted on list reload."
    },
    {
        "TestID": "TC_PS_16",
        "Issue": "14016",
        "Description": "Verify system shows an error or prevents action when status toggle update API fails.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error toast displays indicating status update failed."
    },
    {
        "TestID": "TC_PS_17",
        "Issue": "14017",
        "Description": "Verify clicking Delete icon opens the confirmation popup with correct message and buttons.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delete confirmation modal is displayed correctly."
    },
    {
        "TestID": "TC_PS_18",
        "Issue": "14018",
        "Description": "Verify record is permanently deleted after clicking Yes, delete it! in confirmation popup.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Record is removed from the grid."
    },
    {
        "TestID": "TC_PS_19",
        "Issue": "14019",
        "Description": "Verify record remains unchanged when user clicks Cancel in delete confirmation popup.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Popup closes and the record remains visible."
    },
    {
        "TestID": "TC_PS_20",
        "Issue": "14020",
        "Description": "Verify pagination (Previous/Next) works correctly when privacy settings exceed one page of records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Next/Prev navigation loads new sets of records correctly."
    }
];

const headers = [
    "TestID",
    "Issue",
    "Description",
    "UserName",
    "Password",
    "persona",
    "ExpectedResult"
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
