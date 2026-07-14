/**
 * Updates (or replaces) the "FAQ (Tenant)" sheet in testData.xlsx — 60 test cases.
 * Run once: node scripts/addFAQTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "FAQ (Tenant)";

const rows = [
    // ── FAQ Master Config screen ──
    {
        "TestID": "TC_FAQ_01",
        "Issue": "9001",
        "Description": "Verify FAQ Master Config page loads successfully with all dashboard statistics and FAQ records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ Master Config page loads successfully with all dashboard statistics and FAQ records."
    },
    {
        "TestID": "TC_FAQ_02",
        "Issue": "9002",
        "Description": "Verify user can create a new FAQ by clicking the Create FAQ button and providing valid details.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User can create a new FAQ successfully."
    },
    {
        "TestID": "TC_FAQ_03",
        "Issue": "9003",
        "Description": "Verify user can search an FAQ using a valid topic name and view matching results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching FAQ records are displayed based on topic name search."
    },
    {
        "TestID": "TC_FAQ_04",
        "Issue": "9004",
        "Description": "Verify user can filter FAQs by Scope (Partner, Customer, Staff) and view corresponding records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only FAQs matching the selected scope are displayed."
    },
    {
        "TestID": "TC_FAQ_05",
        "Issue": "9005",
        "Description": "Verify user can filter FAQs using the Category dropdown and view matching FAQs.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only FAQs matching the selected category are displayed."
    },
    {
        "TestID": "TC_FAQ_06",
        "Issue": "9006",
        "Description": "Verify clicking the View icon opens the selected FAQ details successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ details view opens successfully."
    },
    {
        "TestID": "TC_FAQ_07",
        "Issue": "9007",
        "Description": "Verify clicking the Edit icon allows the user to update FAQ information successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ edit screen is displayed successfully."
    },
    {
        "TestID": "TC_FAQ_08",
        "Issue": "9008",
        "Description": "Verify clicking the Delete icon removes the selected FAQ after confirmation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ is deleted successfully after confirmation."
    },
    {
        "TestID": "TC_FAQ_09",
        "Issue": "9009",
        "Description": "Verify searching with a non-existing FAQ topic displays no records found.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Grid displays 'No Records Found' message."
    },
    {
        "TestID": "TC_FAQ_10",
        "Issue": "9010",
        "Description": "Verify search field handles special characters without causing application errors.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Search handles special characters safely and displays empty state without crash."
    },
    {
        "TestID": "TC_FAQ_11",
        "Issue": "9011",
        "Description": "Verify system prevents creating an FAQ with mandatory fields left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation errors are displayed on required fields and save is blocked."
    },
    {
        "TestID": "TC_FAQ_12",
        "Issue": "9012",
        "Description": "Verify system displays an error when uploading an unsupported media file type.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message indicating unsupported media type is displayed."
    },
    {
        "TestID": "TC_FAQ_13",
        "Issue": "9013",
        "Description": "Verify user cannot create duplicate FAQs with identical Topic and Scope if duplicates are restricted.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate validation message is displayed."
    },
    {
        "TestID": "TC_FAQ_14",
        "Issue": "9014",
        "Description": "Verify deleting an FAQ without required permissions displays an authorization error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access Denied or authorization error is displayed."
    },
    {
        "TestID": "TC_FAQ_15",
        "Issue": "9015",
        "Description": "Verify Category filter displays an empty state when no FAQs exist for the selected category.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty state message is displayed safely without grid crashing."
    },
    {
        "TestID": "TC_FAQ_16",
        "Issue": "9016",
        "Description": "Verify application handles API/network failure gracefully while loading FAQ records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Graceful error message is displayed and the page does not crash."
    },

    // ── Create FAQ Screen ──
    {
        "TestID": "TC_FAQ_17",
        "Issue": "9017",
        "Description": "Verify user can create a new FAQ by entering valid mandatory fields and clicking Save FAQ.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ is created successfully and success toast notification is displayed."
    },
    {
        "TestID": "TC_FAQ_18",
        "Issue": "9018",
        "Description": "Verify user can select different Scope values and save the FAQ successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Selected scope settings are stored and displayed correctly."
    },
    {
        "TestID": "TC_FAQ_19",
        "Issue": "9019",
        "Description": "Verify user can select a valid Category and the FAQ is created successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ is saved under the correct category."
    },
    {
        "TestID": "TC_FAQ_20",
        "Issue": "9020",
        "Description": "Verify the Live Preview section updates dynamically when Topic and Description are entered.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Preview panel updates immediately when topic or description text changes."
    },
    {
        "TestID": "TC_FAQ_21",
        "Issue": "9021",
        "Description": "Verify user can create an FAQ with Media Type = None successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ is created successfully without media attachment."
    },
    {
        "TestID": "TC_FAQ_22",
        "Issue": "9022",
        "Description": "Verify user can upload a valid image/video (if Media Type is selected) and save the FAQ successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Media uploads successfully and is saved with the FAQ."
    },
    {
        "TestID": "TC_FAQ_23",
        "Issue": "9023",
        "Description": "Verify Sort Order accepts valid numeric values and saves correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Form accepts numeric value and stores sort order correctly."
    },
    {
        "TestID": "TC_FAQ_24",
        "Issue": "9024",
        "Description": "Verify clicking Cancel navigates back without creating a new FAQ.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Discard changes navigates user back to list page safely."
    },
    {
        "TestID": "TC_FAQ_25",
        "Issue": "9025",
        "Description": "Verify system displays a validation error when Topic is left blank and Save FAQ is clicked.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows Topic is required and save is blocked."
    },
    {
        "TestID": "TC_FAQ_26",
        "Issue": "9026",
        "Description": "Verify system displays a validation error when Description is left blank and Save FAQ is clicked.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows Description is required and save is blocked."
    },
    {
        "TestID": "TC_FAQ_27",
        "Issue": "9027",
        "Description": "Verify system prevents FAQ creation when Scope is not selected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows Scope is required and save is blocked."
    },
    {
        "TestID": "TC_FAQ_28",
        "Issue": "9028",
        "Description": "Verify system prevents FAQ creation when Category is not selected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows Category is required and save is blocked."
    },
    {
        "TestID": "TC_FAQ_29",
        "Issue": "9029",
        "Description": "Verify system rejects unsupported file formats during media upload.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error or error toast appears for unsupported file formats."
    },
    {
        "TestID": "TC_FAQ_30",
        "Issue": "9030",
        "Description": "Verify Sort Order field does not accept alphabetic or special characters.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Field rejects letters or symbols, or shows validation error."
    },
    {
        "TestID": "TC_FAQ_31",
        "Issue": "9031",
        "Description": "Verify system handles excessively long Topic text without UI breakage or save failure.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Text is truncated, restricted, or validation message appears without UI crashing."
    },
    {
        "TestID": "TC_FAQ_32",
        "Issue": "9032",
        "Description": "Verify an appropriate error message is displayed when FAQ creation fails due to API/network issues.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Network error toast or message is displayed."
    },

    // ── FAQ Details Screen ──
    {
        "TestID": "TC_FAQ_33",
        "Issue": "9033",
        "Description": "Verify FAQ details page loads successfully with correct FAQ content, category, scope, and description.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All details match the FAQ database values correctly."
    },
    {
        "TestID": "TC_FAQ_34",
        "Issue": "9034",
        "Description": "Verify clicking the Edit button opens the FAQ edit screen with pre-populated data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User navigates to Edit screen with existing FAQ values."
    },
    {
        "TestID": "TC_FAQ_35",
        "Issue": "9035",
        "Description": "Verify clicking the Back button navigates the user to the FAQ listing page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is returned safely to the FAQ Master Config page."
    },
    {
        "TestID": "TC_FAQ_36",
        "Issue": "9036",
        "Description": "Verify media content is displayed correctly when the FAQ contains an image or video attachment.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Attached image or video player renders correctly on the details page."
    },
    {
        "TestID": "TC_FAQ_37",
        "Issue": "9037",
        "Description": "Verify clicking the Download button successfully downloads the attached media file.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Media download triggers and saves locally."
    },
    {
        "TestID": "TC_FAQ_38",
        "Issue": "9038",
        "Description": "Verify an appropriate error message is displayed when FAQ details fail to load due to API/network failure.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Network failure message appears and details are not shown."
    },
    {
        "TestID": "TC_FAQ_39",
        "Issue": "9039",
        "Description": "Verify the page handles missing or deleted media files gracefully without UI breakage.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Page displays missing media placeholder or hides attachment section safely."
    },
    {
        "TestID": "TC_FAQ_40",
        "Issue": "9040",
        "Description": "Verify clicking Download on an unavailable media file displays an appropriate error message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error toast indicating download failed is displayed."
    },
    {
        "TestID": "TC_FAQ_41",
        "Issue": "9041",
        "Description": "Verify users without edit permissions cannot access the FAQ edit screen.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access Denied or redirection occurs when trying to access the edit URL."
    },
    {
        "TestID": "TC_FAQ_42",
        "Issue": "9042",
        "Description": "Verify the Revision History section handles missing history records by displaying an appropriate empty-state message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Grid displays 'No History Records' message safely."
    },

    // ── Edit FAQ Screen ──
    {
        "TestID": "TC_FAQ_43",
        "Issue": "9043",
        "Description": "Verify user can successfully update the FAQ by modifying valid fields and clicking Update.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ is updated successfully and updates appear in listing."
    },
    {
        "TestID": "TC_FAQ_44",
        "Issue": "9044",
        "Description": "Verify changes made to Scope, Category, Topic, Description, Media Type, and Sort Order are saved successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All modified field values are saved."
    },
    {
        "TestID": "TC_FAQ_45",
        "Issue": "9045",
        "Description": "Verify the Preview section updates dynamically when Topic or Description is modified.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Live preview panel changes immediately."
    },
    {
        "TestID": "TC_FAQ_46",
        "Issue": "9046",
        "Description": "Verify user can replace the existing media with a valid PNG, JPG, or MP4 file and update successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Media uploads and replaces old attachment successfully."
    },
    {
        "TestID": "TC_FAQ_47",
        "Issue": "9047",
        "Description": "Verify clicking the Download button downloads the currently attached media file successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Currently attached media file downloads successfully."
    },
    {
        "TestID": "TC_FAQ_48",
        "Issue": "9048",
        "Description": "Verify system displays a validation error when the Topic field is cleared and Update is clicked.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows Topic is required and update is blocked."
    },
    {
        "TestID": "TC_FAQ_49",
        "Issue": "9049",
        "Description": "Verify system displays a validation error when the Description field is left blank and Update is clicked.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows Description is required and update is blocked."
    },
    {
        "TestID": "TC_FAQ_50",
        "Issue": "9050",
        "Description": "Verify system rejects unsupported file formats during media replacement upload.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error toast or warning appears indicating file format not allowed."
    },
    {
        "TestID": "TC_FAQ_51",
        "Issue": "9051",
        "Description": "Verify system prevents uploading media files larger than the allowed 10 MB limit.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Warning indicates file exceeds maximum size and upload is blocked."
    },
    {
        "TestID": "TC_FAQ_52",
        "Issue": "9052",
        "Description": "Verify an appropriate error message is displayed when the FAQ update fails due to API/network issues.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Network error message is displayed and update is not performed."
    },

    // ── Delete FAQ Screen ──
    {
        "TestID": "TC_FAQ_53",
        "Issue": "9053",
        "Description": "Verify clicking Yes, delete it successfully deletes the selected FAQ and removes it from the FAQ list.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ record is removed from grid."
    },
    {
        "TestID": "TC_FAQ_54",
        "Issue": "9054",
        "Description": "Verify clicking No closes the delete confirmation popup without deleting the FAQ.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Popup closes and the FAQ record remains."
    },
    {
        "TestID": "TC_FAQ_55",
        "Issue": "9055",
        "Description": "Verify the delete confirmation popup displays the correct FAQ name before deletion.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "FAQ name matches the selected record."
    },
    {
        "TestID": "TC_FAQ_56",
        "Issue": "9056",
        "Description": "Verify the FAQ count/dashboard statistics are updated correctly after successful FAQ deletion.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dashboard counters update instantly."
    },
    {
        "TestID": "TC_FAQ_57",
        "Issue": "9057",
        "Description": "Verify the system displays an appropriate error message when FAQ deletion fails due to an API/network issue.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delete error message is displayed and FAQ remains."
    },
    {
        "TestID": "TC_FAQ_58",
        "Issue": "9058",
        "Description": "Verify a user without delete permissions cannot delete an FAQ and receives an authorization error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Authorization error is displayed and delete is blocked."
    },
    {
        "TestID": "TC_FAQ_59",
        "Issue": "9059",
        "Description": "Verify the FAQ remains unchanged when the delete popup is closed using outside click or Escape key (if supported).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Popup closes and FAQ remains."
    },
    {
        "TestID": "TC_FAQ_60",
        "Issue": "9060",
        "Description": "Verify repeated clicks on Yes, delete it do not trigger multiple delete requests or duplicate actions.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Double click is blocked or only first request is sent."
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
