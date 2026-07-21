/**
 * Updates (or replaces) the "Return Cancellation Regression" sheet in testData.xlsx — 30 test cases.
 * Run once: node scripts/addReturnCancellationPolicyTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "Return Cancellation Regression";

const rows = [
    {
        "TestID": "TC_RCP_001",
        "Issue": "17001",
        "Description": "Verify user can enable the Cancellation policy and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Cancellation policy is enabled and saved successfully."
    },
    {
        "TestID": "TC_RCP_002",
        "Issue": "17002",
        "Description": "Verify user cannot save Cancellation policy when required fields are empty.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows required fields are empty and save is blocked."
    },
    {
        "TestID": "TC_RCP_003",
        "Issue": "17003",
        "Description": "Verify Window Minutes accepts valid numeric values and saves correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Window minutes are saved correctly."
    },
    {
        "TestID": "TC_RCP_004",
        "Issue": "17004",
        "Description": "Verify Window Minutes rejects negative numbers, alphabets, and special characters.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears indicating invalid window minutes."
    },
    {
        "TestID": "TC_RCP_005",
        "Issue": "17005",
        "Description": "Verify user can select one or more valid \"Free Cancellation Before Status\" values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Statuses are selected and saved successfully."
    },
    {
        "TestID": "TC_RCP_006",
        "Issue": "17006",
        "Description": "Verify duplicate or invalid statuses cannot be selected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate selections are blocked."
    },
    {
        "TestID": "TC_RCP_007",
        "Issue": "17007",
        "Description": "Verify user can select multiple \"Allowed Before Statuses\" and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Multiple statuses are saved correctly."
    },
    {
        "TestID": "TC_RCP_008",
        "Issue": "17008",
        "Description": "Verify cancellation is not allowed after the configured status is reached.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Cancellation request is blocked and validation warning displays."
    },
    {
        "TestID": "TC_RCP_009",
        "Issue": "17009",
        "Description": "Verify Flat Cancellation Fee is saved and applied correctly during cancellation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Cancellation fee is applied on cancellation."
    },
    {
        "TestID": "TC_RCP_010",
        "Issue": "17010",
        "Description": "Verify negative Cancellation Fee values are not accepted.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears on flat fee input."
    },
    {
        "TestID": "TC_RCP_011",
        "Issue": "17011",
        "Description": "Verify Percentage Cancellation Fee calculates correctly based on order amount.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Percentage fee is calculated and applied to the final refund."
    },
    {
        "TestID": "TC_RCP_012",
        "Issue": "17012",
        "Description": "Verify Percentage Cancellation Fee rejects values greater than the allowed limit.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears indicating percentage limit."
    },
    {
        "TestID": "TC_RCP_013",
        "Issue": "17013",
        "Description": "Verify Auto Refund on Approval automatically triggers refund creation after cancellation approval.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Refund triggers automatically."
    },
    {
        "TestID": "TC_RCP_014",
        "Issue": "17014",
        "Description": "Verify refund is not auto-generated when Auto Refund on Approval is disabled.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Manual approval steps are required."
    },
    {
        "TestID": "TC_RCP_015",
        "Issue": "17015",
        "Description": "Verify Return policy can be enabled and saved successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Return policy is saved and enabled successfully."
    },
    {
        "TestID": "TC_RCP_016",
        "Issue": "17016",
        "Description": "Verify Return policy changes are not persisted without clicking Save.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigating away restores original settings."
    },
    {
        "TestID": "TC_RCP_017",
        "Issue": "17017",
        "Description": "Verify Return Window Days accepts valid values and allows returns within the configured period.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Return window is updated successfully."
    },
    {
        "TestID": "TC_RCP_018",
        "Issue": "17018",
        "Description": "Verify return requests are rejected after the return window expires.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Return button is disabled or request is blocked with error message."
    },
    {
        "TestID": "TC_RCP_019",
        "Issue": "17019",
        "Description": "Verify user can add valid Returnable Item Types and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Item types added to returnable list."
    },
    {
        "TestID": "TC_RCP_020",
        "Issue": "17020",
        "Description": "Verify duplicate Returnable Item Types cannot be added.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate items block displays warning."
    },
    {
        "TestID": "TC_RCP_021",
        "Issue": "17021",
        "Description": "Verify user can add valid Non-Returnable Item Types and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Item types added to non-returnable list."
    },
    {
        "TestID": "TC_RCP_022",
        "Issue": "17022",
        "Description": "Verify an item type cannot exist in both Returnable and Non-Returnable lists.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation warning prevents cross-listing."
    },
    {
        "TestID": "TC_RCP_023",
        "Issue": "17023",
        "Description": "Verify Require Images setting forces image upload for return requests.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Image selection upload container is forced on UI."
    },
    {
        "TestID": "TC_RCP_024",
        "Issue": "17024",
        "Description": "Verify return request submission fails when images are mandatory but not uploaded.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error prevents submitting return request."
    },
    {
        "TestID": "TC_RCP_025",
        "Issue": "17025",
        "Description": "Verify Restocking Fee (Flat/Percentage) is calculated correctly during refund processing.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Restocking fee is applied to the final refund."
    },
    {
        "TestID": "TC_RCP_026",
        "Issue": "17026",
        "Description": "Verify invalid Restocking Fee values (negative, text, special characters) are rejected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error displays on fee field."
    },
    {
        "TestID": "TC_RCP_027",
        "Issue": "17027",
        "Description": "Verify Replacement policy allows replacement requests within configured Window Days and Max Per Order limits.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Replacement request is created within limits."
    },
    {
        "TestID": "TC_RCP_028",
        "Issue": "17028",
        "Description": "Verify replacement requests exceeding Max Per Order are blocked.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows maximum limit is exceeded."
    },
    {
        "TestID": "TC_RCP_029",
        "Issue": "17029",
        "Description": "Verify approved Refund requests credit the correct amount after applying cancellation/restocking fees.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Correct credit amount is calculated and shown."
    },
    {
        "TestID": "TC_RCP_030",
        "Issue": "17030",
        "Description": "Verify refund requests outside configured eligibility rules (expired window, invalid reason, non-refundable item) are rejected with appropriate validation messages.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message blocks ineligible refunds."
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
