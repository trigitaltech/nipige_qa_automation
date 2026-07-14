/**
 * Updates (or replaces) the "BulkNotification" sheet in testData.xlsx — 20 test cases.
 * Run once: node scripts/addBulkNotificationTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "BulkNotification";

const rows = [
    {
        "TestID": "TC01_CreateCriteriaPage",
        "Issue": "26001",
        "Description": "Verify that clicking Create Criteria opens the Manage Bulk Notification page successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Manage Bulk Notification page is loaded successfully.",
        "Entity": "Customer", "Criteria": "", "Operator": "", "Value": "", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC02_EntityDropdownOptions",
        "Issue": "26002",
        "Description": "Verify that the Select Entity dropdown displays available entities (e.g., Customer).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Customer option is available in the Select Entity dropdown.",
        "Entity": "Customer", "Criteria": "", "Operator": "", "Value": "", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC03_SelectEntityLoadsCriteria",
        "Issue": "26003",
        "Description": "Verify that selecting Customer loads the corresponding criteria fields in the Criteria Selection section.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Corresponding customer criteria fields are loaded.",
        "Entity": "Customer", "Criteria": "", "Operator": "", "Value": "", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC04_CriteriaDropdownOptions",
        "Issue": "26004",
        "Description": "Verify that the Select Criteria dropdown displays all available criteria options (First Name, Last Name, Email, Phone, City, State, etc.).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All customer attributes display in criteria selection.",
        "Entity": "Customer", "Criteria": "", "Operator": "", "Value": "First Name | Last Name | Email | Phone | City | State", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC05_AddConditionRow",
        "Issue": "26005",
        "Description": "Verify that a user can select a criterion, operator, and value, then add the condition successfully using the (+) button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "New condition row is added successfully.",
        "Entity": "Customer", "Criteria": "First Name", "Operator": "Equal To", "Value": "John", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC06_MultipleConditionRows",
        "Issue": "26006",
        "Description": "Verify that multiple criteria rows can be added and saved with AND/OR operators.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Multiple rows display with AND/OR operators.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To | Equal To", "Value": "Dallas | Austin", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC07_ImpactedCustomerCount",
        "Issue": "26007",
        "Description": "Verify that the Impacted Customer Count is calculated correctly after entering valid criteria.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Impacted customer count matches criteria.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "Dallas", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC08_ViewImpactedCustomerList",
        "Issue": "26008",
        "Description": "Verify that clicking View Impacted Customer displays the filtered customer list matching the criteria.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Filtered list shows correct records.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "Dallas", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC09_DownloadImpactedList",
        "Issue": "26009",
        "Description": "Verify that the Download button downloads the impacted customer list when customer count is greater than zero.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "List download succeeds.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "Dallas", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC10_SubmitNotification",
        "Issue": "26010",
        "Description": "Verify that a user can select a valid Notification Type, Template, Schedule Date, and Schedule Time and submit successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Bulk notification is submitted and scheduled successfully.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "Dallas", "NotificationType": "SMS", "Template": "Template 1", "ScheduleDate": "2026-12-31", "ScheduleTime": "12:00 PM"
    },
    {
        "TestID": "TC11_MissingNotificationType",
        "Issue": "26011",
        "Description": "Verify that clicking Submit without selecting a Notification Type displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error on Notification Type is displayed.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "Dallas", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC12_MissingTemplate",
        "Issue": "26012",
        "Description": "Verify that clicking Submit without selecting a Template displays a validation error.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error on Template is displayed.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "Dallas", "NotificationType": "SMS", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC13_BlankMandatoryCriteria",
        "Issue": "26013",
        "Description": "Verify that the system prevents submission when mandatory criteria fields are left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation prompts on blank criteria fields.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC14_DownloadDisabledZeroCount",
        "Issue": "26014",
        "Description": "Verify that the Download button remains disabled when Impacted Customer Count is zero.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Download button is disabled.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "NonExistentCityXYZ", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC15_SpecialCharacterValue",
        "Issue": "26015",
        "Description": "Verify that entering special characters or invalid data in the criteria value field does not break the application and shows proper validation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation triggers or handles characters safely.",
        "Entity": "Customer", "Criteria": "First Name", "Operator": "Equal To", "Value": "!@#$%^&*", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC16_OperatorWithoutValue",
        "Issue": "26016",
        "Description": "Verify that selecting an operator without entering a value prevents criteria processing.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Criteria processing is blocked.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC17_PastScheduleRejected",
        "Issue": "26017",
        "Description": "Verify that the system does not allow scheduling a notification with a past date and time.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Past schedule date validation error displays.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "Dallas", "NotificationType": "SMS", "Template": "Template 1", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC18_NoMatchingCustomers",
        "Issue": "26018",
        "Description": "Verify that the system displays an appropriate message when no customers match the selected criteria.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Zero count displays.",
        "Entity": "Customer", "Criteria": "City", "Operator": "Equal To", "Value": "NonExistentCityXYZ", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC19_ListingDateFilter",
        "Issue": "26019",
        "Description": "Verify that the Bulk Notification listing page correctly filters records when selecting Today, 7 Days, 30 Days, or Custom from the date filter dropdown.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Listing is filtered correctly.",
        "Entity": "", "Criteria": "", "Operator": "", "Value": "Today | 7 Days | 30 Days", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
    },
    {
        "TestID": "TC20_InvalidCustomDateRange",
        "Issue": "26020",
        "Description": "Verify that selecting an invalid Custom date range (From Date > To Date) displays a validation message and prevents search execution.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displays.",
        "Entity": "", "Criteria": "", "Operator": "", "Value": "2026-12-31 | 2026-01-01", "NotificationType": "", "Template": "", "ScheduleDate": "", "ScheduleTime": ""
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
    "Entity",
    "Criteria",
    "Operator",
    "Value",
    "NotificationType",
    "Template",
    "ScheduleDate",
    "ScheduleTime"
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
