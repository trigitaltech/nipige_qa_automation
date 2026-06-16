/**
 * Adds (or replaces) the BulkNotification sheet in testData.xlsx.
 * Run once: node scripts/addBulkNotificationTestSheet.js
 *
 * Columns: TestID | Description | persona | Entity | Criteria | Operator | Value | CriteriaValue |
 *          NotificationType | Template | ScheduleDate | ScheduleTime | Issue
 *
 * Notes:
 * - "Value" is reused per-test for whichever field that TC mainly drives (criteria value, dropdown
 *   option list joined by "|", or "from|to" pairs for date ranges) — see BulkNotificationTest.spec.ts
 *   for exactly how each row's columns are consumed.
 * - persona matches HomeSteps.login's "Login as" persona (e.g. "Tenant").
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");

const rows = [
  {
    TestID: "TC01_CreateCriteriaPage",
    Description: "Verify that clicking Create Criteria opens the Manage Bulk Notification page successfully.",
    persona: "tenant", Entity: "", Criteria: "", Operator: "", Value: "", CriteriaValue: "",
    NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC02_EntityDropdownOptions",
    Description: "Verify that the Select Entity dropdown displays available entities (e.g., Customer).",
    persona: "tenant", Entity: "Customer", Criteria: "", Operator: "", Value: "", CriteriaValue: "",
    NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC03_SelectEntityLoadsCriteria",
    Description: "Verify that selecting Customer loads the corresponding criteria fields in the Criteria Selection section.",
    persona: "tenant", Entity: "Customer", Criteria: "", Operator: "", Value: "", CriteriaValue: "",
    NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC04_CriteriaDropdownOptions",
    Description: "Verify that the Select Criteria dropdown displays all available criteria options (First Name, Last Name, Email, Phone, City, State, Referer Id, Customer No, Date).",
    persona: "tenant", Entity: "Customer", Criteria: "", Operator: "",
    Value: "First Name|Last Name|Email|Phone|City|State|Referer Id|Customer No|Date", CriteriaValue: "",
    NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC05_AddConditionRow",
    Description: "Verify that a user can select a criterion, operator, and value, then add the condition successfully using the (+) button.",
    persona: "tenant", Entity: "Customer", Criteria: "First Name", Operator: "Equal (eq)", Value: "John",
    CriteriaValue: "", NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC06_MultipleConditionRows",
    Description: "Verify that multiple criteria rows can be added and saved with AND/OR operators.",
    // Confirmed live: Select Entity/Criteria stay single — (+) adds another Operator/Value row
    // under the SAME criteria field (e.g. City = Chennai, City = Mumbai), not a second field.
    persona: "tenant", Entity: "Customer", Criteria: "City", Operator: "Equal (eq)|Equal (eq)",
    Value: "Chennai|Mumbai", CriteriaValue: "",
    NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC07_ImpactedCustomerCount",
    Description: "Verify that the Impacted Customer Count is calculated correctly after entering valid criteria.",
    persona: "tenant", Entity: "Customer", Criteria: "City", Operator: "Equal (eq)", Value: "Chennai",
    CriteriaValue: "", NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC08_ViewImpactedCustomerList",
    Description: "Verify that clicking View Impacted Customer displays the filtered customer list matching the criteria.",
    persona: "tenant", Entity: "Customer", Criteria: "City", Operator: "Equal (eq)", Value: "Chennai",
    CriteriaValue: "", NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC09_DownloadImpactedList",
    Description: "Verify that the Download button downloads the impacted customer list when customer count is greater than zero.",
    persona: "tenant", Entity: "Customer", Criteria: "City", Operator: "Equal (eq)", Value: "Chennai",
    CriteriaValue: "", NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC10_SubmitNotification",
    Description: "Verify that a user can select a valid Notification Type, Template, Schedule Date, and Schedule Time and submit successfully.",
    persona: "tenant", Entity: "Customer", Criteria: "City", Operator: "Equal (eq)", Value: "Chennai",
    CriteriaValue: "", NotificationType: "Email", Template: "PROMOTIONAL",
    ScheduleDate: "30-06-2026", ScheduleTime: "10:00 AM", Issue: "",
  },
  {
    TestID: "TC11_MissingNotificationType",
    Description: "Verify that clicking Submit without selecting a Notification Type displays a validation error.",
    persona: "tenant", Entity: "Customer", Criteria: "City", Operator: "Equal (eq)", Value: "Chennai",
    CriteriaValue: "", NotificationType: "", Template: "PROMOTIONAL",
    ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC12_MissingTemplate",
    Description: "Verify that clicking Submit without selecting a Template displays a validation error.",
    persona: "tenant", Entity: "Customer", Criteria: "City", Operator: "Equal (eq)", Value: "Chennai",
    CriteriaValue: "", NotificationType: "Email", Template: "",
    ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC13_BlankMandatoryCriteria",
    Description: "Verify that the system prevents submission when mandatory criteria fields are left blank.",
    persona: "tenant", Entity: "Customer", Criteria: "", Operator: "", Value: "", CriteriaValue: "",
    NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC14_DownloadDisabledZeroCount",
    Description: "Verify that the Download button remains disabled when Impacted Customer Count is zero.",
    persona: "tenant", Entity: "Customer", Criteria: "Email", Operator: "Equal (eq)",
    Value: "no-such-customer-9999@example.com", CriteriaValue: "",
    NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC15_SpecialCharacterValue",
    Description: "Verify that entering special characters or invalid data in the criteria value field does not break the application and shows proper validation.",
    persona: "tenant", Entity: "Customer", Criteria: "First Name", Operator: "Equal (eq)",
    Value: "@#$%^&*()", CriteriaValue: "", NotificationType: "", Template: "",
    ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC16_OperatorWithoutValue",
    Description: "Verify that selecting an operator without entering a value prevents criteria processing.",
    persona: "tenant", Entity: "Customer", Criteria: "First Name", Operator: "Equal (eq)", Value: "",
    CriteriaValue: "", NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC17_PastScheduleRejected",
    Description: "Verify that the system does not allow scheduling a notification with a past date and time.",
    persona: "tenant", Entity: "Customer", Criteria: "City", Operator: "Equal (eq)",
    Value: "01-01-2020|09:00 AM", CriteriaValue: "Chennai",
    NotificationType: "Email", Template: "PROMOTIONAL", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC18_NoMatchingCustomers",
    Description: "Verify that the system displays an appropriate message when no customers match the selected criteria.",
    persona: "tenant", Entity: "Customer", Criteria: "Email", Operator: "Equal (eq)",
    Value: "definitely-no-match-99999@example.com", CriteriaValue: "",
    NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC19_ListingDateFilter",
    Description: "Verify that the Bulk Notification listing page correctly filters records when selecting Today, 7 Days, 30 Days, or Custom from the date filter dropdown.",
    persona: "tenant", Entity: "", Criteria: "", Operator: "", Value: "Today|7 days|30 days",
    CriteriaValue: "", NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
  {
    TestID: "TC20_InvalidCustomDateRange",
    Description: "Verify that selecting an invalid Custom date range (From Date > To Date) displays a validation message and prevents search execution.",
    persona: "tenant", Entity: "", Criteria: "", Operator: "", Value: "30-06-2026|01-06-2026",
    CriteriaValue: "", NotificationType: "", Template: "", ScheduleDate: "", ScheduleTime: "", Issue: "",
  },
];

const SHEET = "BulkNotification";
const wb = XLSX.readFile(FILE);

const headers = [
  "TestID", "Description", "persona", "Entity", "Criteria", "Operator", "Value", "CriteriaValue",
  "NotificationType", "Template", "ScheduleDate", "ScheduleTime", "Issue",
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
