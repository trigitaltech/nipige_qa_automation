/**
 * Updates (or replaces) the "BusinessPlanTest" sheet in testData.xlsx — 80 test cases.
 * Run once: node scripts/addBusinessPlanTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "BusinessPlanTest";

const rows = [
    // ── Business Plan Listing Screen ──
    {
        "TestID": "TC_LIST_01",
        "Issue": "15001",
        "Description": "Verify Business Plan page loads successfully with all plan cards displayed.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Business Plan page loads successfully with all plan cards displayed."
    },
    {
        "TestID": "TC_LIST_02",
        "Issue": "15002",
        "Description": "Verify plan name, description, features, and pricing are displayed correctly for each plan.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Plan details are shown correctly."
    },
    {
        "TestID": "TC_LIST_03",
        "Issue": "15003",
        "Description": "Verify clicking View More opens the detailed Business Plan information page/modal.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Detailed information page opens successfully."
    },
    {
        "TestID": "TC_LIST_04",
        "Issue": "15004",
        "Description": "Verify Create Business Plan button navigates to the Business Plan creation screen.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "User is redirected to Create screen."
    },
    {
        "TestID": "TC_LIST_05",
        "Issue": "15005",
        "Description": "Verify pagination works correctly when clicking Next.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Listing advances to next page of plans."
    },
    {
        "TestID": "TC_LIST_06",
        "Issue": "15006",
        "Description": "Verify pagination works correctly when clicking a specific page number (e.g., 2 or 3).",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Correct page loads successfully."
    },
    {
        "TestID": "TC_LIST_07",
        "Issue": "15007",
        "Description": "Verify Previous button navigates back to the previous page.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Loads the previous page of plans."
    },
    {
        "TestID": "TC_LIST_08",
        "Issue": "15008",
        "Description": "Verify refresh icon reloads the latest Business Plan data successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Listing is refreshed with latest plan data."
    },
    {
        "TestID": "TC_LIST_09",
        "Issue": "15009",
        "Description": "Verify plan cards display the correct monthly price format and currency.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Price formatting matches plan currency."
    },
    {
        "TestID": "TC_LIST_10",
        "Issue": "15010",
        "Description": "Verify all listed features are displayed correctly under the respective Business Plan.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Features list displays correctly under plans."
    },
    {
        "TestID": "TC_LIST_11",
        "Issue": "15011",
        "Description": "Verify an appropriate message is displayed when no Business Plans exist.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "No Business Plans or empty state message is shown."
    },
    {
        "TestID": "TC_LIST_12",
        "Issue": "15012",
        "Description": "Verify clicking View More on a corrupted/inactive plan does not crash the application.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Graceful error message is shown without crash."
    },
    {
        "TestID": "TC_LIST_13",
        "Issue": "15013",
        "Description": "Verify pagination controls are disabled when only one page of Business Plans exists.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Pagination controls are hidden or disabled."
    },
    {
        "TestID": "TC_LIST_14",
        "Issue": "15014",
        "Description": "Verify clicking Next on the last page does not navigate beyond available pages.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Next button is disabled or ignores clicks."
    },
    {
        "TestID": "TC_LIST_15",
        "Issue": "15015",
        "Description": "Verify clicking Previous on the first page does not navigate to a negative page number.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Previous button is disabled or ignores clicks."
    },
    {
        "TestID": "TC_LIST_16",
        "Issue": "15016",
        "Description": "Verify broken or missing plan images display a default placeholder image.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "Welcome@123",
        "persona": "admin",
        "ExpectedResult": "Default placeholder image renders."
    },
    {
        "TestID": "TC_LIST_17",
        "Issue": "15017",
        "Description": "Verify duplicate Business Plans are not displayed in the plan listing.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Unique list is displayed."
    },
    {
        "TestID": "TC_LIST_18",
        "Issue": "15018",
        "Description": "Verify system handles extremely long plan names without UI overlap or truncation issues.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "UI scales text size or handles wrapping cleanly."
    },
    {
        "TestID": "TC_LIST_19",
        "Issue": "15019",
        "Description": "Verify system handles very large feature lists without breaking the card layout.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Features display correctly inside the cards."
    },
    {
        "TestID": "TC_LIST_20",
        "Issue": "15020",
        "Description": "Verify refresh action during slow network conditions does not display duplicate or inconsistent data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "System updates listing cleanly without duplicate entries."
    },

    // ── Create Business Plan Screen ──
    {
        "TestID": "TC_CREATE_01",
        "Issue": "15021",
        "Description": "Verify user can create a Business Plan with valid Plan Name, Description, Logo, Subscription, and Feature.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Business Plan is created successfully."
    },
    {
        "TestID": "TC_CREATE_02",
        "Issue": "15022",
        "Description": "Verify Business Plan Name field accepts valid alphanumeric values and saves successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Name accepted and plan saved successfully."
    },
    {
        "TestID": "TC_CREATE_03",
        "Issue": "15023",
        "Description": "Verify Description field accepts valid text and is saved correctly.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Description saved successfully."
    },
    {
        "TestID": "TC_CREATE_04",
        "Issue": "15024",
        "Description": "Verify user can upload a valid logo image (JPG/PNG) successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Logo uploads successfully."
    },
    {
        "TestID": "TC_CREATE_05",
        "Issue": "15025",
        "Description": "Verify uploaded logo preview/display is shown correctly after upload.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Logo preview renders in the form."
    },
    {
        "TestID": "TC_CREATE_06",
        "Issue": "15026",
        "Description": "Verify Subscription dropdown loads available subscriptions successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Dropdown loads list of active subscriptions."
    },
    {
        "TestID": "TC_CREATE_07",
        "Issue": "15027",
        "Description": "Verify user can select a subscription and add it to the subscription grid.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Subscription added to the table grid."
    },
    {
        "TestID": "TC_CREATE_08",
        "Issue": "15028",
        "Description": "Verify added subscription displays correct Plan Name, Description, and Price.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "All subscription fields match configured plan details."
    },
    {
        "TestID": "TC_CREATE_09",
        "Issue": "15029",
        "Description": "Verify user can add multiple subscriptions to the Business Plan.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Multiple subscription rows added to the grid."
    },
    {
        "TestID": "TC_CREATE_10",
        "Issue": "15030",
        "Description": "Verify Feature dropdown loads available features successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Dropdown displays list of features."
    },
    {
        "TestID": "TC_CREATE_11",
        "Issue": "15031",
        "Description": "Verify user can select a feature and add it to the feature grid.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature added to the grid successfully."
    },
    {
        "TestID": "TC_CREATE_12",
        "Issue": "15032",
        "Description": "Verify added feature displays correct Feature Name, Description, and Permissions.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature details and permissions match configuration."
    },
    {
        "TestID": "TC_CREATE_13",
        "Issue": "15033",
        "Description": "Verify user can add multiple features to the Business Plan.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Multiple features added to the grid."
    },
    {
        "TestID": "TC_CREATE_14",
        "Issue": "15034",
        "Description": "Verify Reload button refreshes the subscription list successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Subscription dropdown reloaded."
    },
    {
        "TestID": "TC_CREATE_15",
        "Issue": "15035",
        "Description": "Verify Reload button refreshes the feature list successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature dropdown reloaded."
    },
    {
        "TestID": "TC_CREATE_16",
        "Issue": "15036",
        "Description": "Verify user can remove an added subscription from the grid.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Subscription is removed from the grid."
    },
    {
        "TestID": "TC_CREATE_17",
        "Issue": "15037",
        "Description": "Verify user can remove an added feature from the grid.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Feature is removed from the grid."
    },
    {
        "TestID": "TC_CREATE_18",
        "Issue": "15038",
        "Description": "Verify Back button navigates to the previous page successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Redirects back to Listing screen."
    },
    {
        "TestID": "TC_CREATE_19",
        "Issue": "15039",
        "Description": "Verify Save/Create action successfully creates the Business Plan with all selected data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Plan created successfully."
    },
    {
        "TestID": "TC_CREATE_20",
        "Issue": "15040",
        "Description": "Verify newly created Business Plan appears in the Business Plan listing page.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Created plan is visible in the cards."
    },
    {
        "TestID": "TC_CREATE_21",
        "Issue": "15041",
        "Description": "Verify Business Plan cannot be created when Plan Name is left blank.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Name is required."
    },
    {
        "TestID": "TC_CREATE_22",
        "Issue": "15042",
        "Description": "Verify Business Plan cannot be created when Description is left blank.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Description is required."
    },
    {
        "TestID": "TC_CREATE_23",
        "Issue": "15043",
        "Description": "Verify Business Plan cannot be created without uploading a logo.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows Logo is required."
    },
    {
        "TestID": "TC_CREATE_24",
        "Issue": "15044",
        "Description": "Verify error message is displayed when uploading an unsupported file type (e.g., .exe, .txt).",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "File type rejected with validation message."
    },
    {
        "TestID": "TC_CREATE_25",
        "Issue": "15045",
        "Description": "Verify system rejects logo files exceeding the maximum allowed size.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "File rejected with validation message."
    },
    {
        "TestID": "TC_CREATE_26",
        "Issue": "15046",
        "Description": "Verify Business Plan Name field does not accept only spaces.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows invalid name input."
    },
    {
        "TestID": "TC_CREATE_27",
        "Issue": "15047",
        "Description": "Verify Business Plan Name validation prevents special characters if restricted.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error shows special characters not allowed."
    },
    {
        "TestID": "TC_CREATE_28",
        "Issue": "15048",
        "Description": "Verify Description field does not accept only blank spaces.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error is shown."
    },
    {
        "TestID": "TC_CREATE_29",
        "Issue": "15049",
        "Description": "Verify clicking Add Subscription without selecting a subscription does not add a record.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "No row is appended to grid."
    },
    {
        "TestID": "TC_CREATE_30",
        "Issue": "15050",
        "Description": "Verify clicking Add Feature without selecting a feature does not add a record.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "No row is appended to grid."
    },
    {
        "TestID": "TC_CREATE_31",
        "Issue": "15051",
        "Description": "Verify duplicate subscriptions cannot be added to the same Business Plan.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Warning or validation message appears."
    },
    {
        "TestID": "TC_CREATE_32",
        "Issue": "15052",
        "Description": "Verify duplicate features cannot be added to the same Business Plan.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Warning or validation message appears."
    },
    {
        "TestID": "TC_CREATE_33",
        "Issue": "15053",
        "Description": "Verify application handles empty Subscription dropdown data gracefully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Dropdown loads empty state without UI issues."
    },
    {
        "TestID": "TC_CREATE_34",
        "Issue": "15054",
        "Description": "Verify application handles empty Feature dropdown data gracefully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Dropdown loads empty state without UI issues."
    },
    {
        "TestID": "TC_CREATE_35",
        "Issue": "15055",
        "Description": "Verify Save action fails when mandatory fields are missing.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Validation error is shown on form."
    },
    {
        "TestID": "TC_CREATE_36",
        "Issue": "15056",
        "Description": "Verify system displays validation message when uploaded image is corrupted.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Image rejected with error message."
    },
    {
        "TestID": "TC_CREATE_37",
        "Issue": "15057",
        "Description": "Verify user cannot add deleted/inactive subscriptions to the plan.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Inactive subscriptions do not load or are blocked."
    },
    {
        "TestID": "TC_CREATE_38",
        "Issue": "15058",
        "Description": "Verify user cannot add deleted/inactive features to the plan.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Inactive features do not load or are blocked."
    },
    {
        "TestID": "TC_CREATE_39",
        "Issue": "15059",
        "Description": "Verify application handles network failure during Business Plan creation without data corruption.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Creation is blocked and appropriate message shown."
    },
    {
        "TestID": "TC_CREATE_40",
        "Issue": "15060",
        "Description": "Verify rapid multiple clicks on Save/Create do not create duplicate Business Plans.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Only one request is sent and duplicate plans are not created."
    },

    // ── Business Plan Details Screen ──
    {
        "TestID": "TC_DETAILS_01",
        "Issue": "15061",
        "Description": "Verify Business Plan Details page loads successfully with correct plan information.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Plan details are displayed correctly."
    },
    {
        "TestID": "TC_DETAILS_02",
        "Issue": "15062",
        "Description": "Verify plan name, description, logo, and price are displayed correctly.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Plan fields match backend values."
    },
    {
        "TestID": "TC_DETAILS_03",
        "Issue": "15063",
        "Description": "Verify Added Subscription section displays associated subscription details correctly.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Subscriptions details are correct in details view."
    },
    {
        "TestID": "TC_DETAILS_04",
        "Issue": "15064",
        "Description": "Verify subscription plan name is displayed accurately.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Subscription plan name is correct."
    },
    {
        "TestID": "TC_DETAILS_05",
        "Issue": "15065",
        "Description": "Verify subscription price matches the configured plan price.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Price matches plan configuration."
    },
    {
        "TestID": "TC_DETAILS_06",
        "Issue": "15066",
        "Description": "Verify Added Feature section displays all linked features correctly.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Linked features list displays correctly."
    },
    {
        "TestID": "TC_DETAILS_07",
        "Issue": "15067",
        "Description": "Verify permission count is displayed correctly for each feature.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Permission counts are accurate."
    },
    {
        "TestID": "TC_DETAILS_08",
        "Issue": "15068",
        "Description": "Verify pagination navigates successfully to the next feature page.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Loads next page of features."
    },
    {
        "TestID": "TC_DETAILS_09",
        "Issue": "15069",
        "Description": "Verify Edit Business Plan button opens the edit screen with pre-populated data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Navigates to edit screen successfully."
    },
    {
        "TestID": "TC_DETAILS_10",
        "Issue": "15070",
        "Description": "Verify Back button navigates to the Business Plan listing page successfully.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Redirects back to list page successfully."
    },
    {
        "TestID": "TC_DETAILS_11",
        "Issue": "15071",
        "Description": "Verify an appropriate message is displayed when Business Plan details are unavailable.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Error placeholder or message is shown."
    },
    {
        "TestID": "TC_DETAILS_12",
        "Issue": "15072",
        "Description": "Verify broken or missing plan logo displays a default placeholder image.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Placeholder image is shown."
    },
    {
        "TestID": "TC_DETAILS_13",
        "Issue": "15073",
        "Description": "Verify page does not crash when the Business Plan has no associated subscriptions.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Details display cleanly without subscriptions."
    },
    {
        "TestID": "TC_DETAILS_14",
        "Issue": "15074",
        "Description": "Verify page does not crash when the Business Plan has no associated features.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Details display cleanly without features."
    },
    {
        "TestID": "TC_DETAILS_15",
        "Issue": "15075",
        "Description": "Verify clicking Next on the last feature page does not navigate beyond available pages.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Next button is disabled."
    },
    {
        "TestID": "TC_DETAILS_16",
        "Issue": "15076",
        "Description": "Verify clicking Previous on the first feature page does not navigate to an invalid page.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Previous button is disabled."
    },
    {
        "TestID": "TC_DETAILS_17",
        "Issue": "15077",
        "Description": "Verify Edit button is inaccessible for users without edit permissions.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Edit button is disabled, hidden, or access denied occurs."
    },
    {
        "TestID": "TC_DETAILS_18",
        "Issue": "15078",
        "Description": "Verify Delete button is inaccessible for users without delete permissions.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Delete button is disabled, hidden, or access denied occurs."
    },
    {
        "TestID": "TC_DETAILS_19",
        "Issue": "15079",
        "Description": "Verify long plan descriptions do not break the page layout or overlap UI elements.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Text wraps cleanly within container."
    },
    {
        "TestID": "TC_DETAILS_20",
        "Issue": "15080",
        "Description": "Verify refresh/reload during slow network conditions does not display duplicate or inconsistent data.",
        "UserName": "nipigev2@yopmail.com",
        "Password": "admin@123",
        "persona": "admin",
        "ExpectedResult": "Grid displays correct information without duplicating rows."
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
