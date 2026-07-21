/**
 * Updates (or replaces) the "NotificationTemplate" sheet in testData.xlsx — 25 test cases.
 * Run once: node scripts/addNotificationTemplateSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "NotificationTemplate";

const rows = [
    {
        "TC_ID": "TC_NT_01",
        "Description": "Verify user can open the Notification Template page successfully.",
        "Scenario": "Verify user can open the Notification Template page successfully.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "Notification Template listing page displays successfully."
    },
    {
        "TC_ID": "TC_NT_02",
        "Description": "Verify template list displays all existing templates correctly.",
        "Scenario": "Verify template list displays all existing templates correctly.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "Template list displays existing items with details."
    },
    {
        "TC_ID": "TC_NT_03",
        "Description": "Verify clicking Create Template opens the template creation screen.",
        "Scenario": "Verify clicking Create Template opens the template creation screen.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "Template creation screen opens successfully."
    },
    {
        "TC_ID": "TC_NT_04",
        "Description": "Verify system prevents template creation when Concern is not selected.",
        "Scenario": "Verify system prevents template creation when Concern is not selected.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Validation error shows Concern is required."
    },
    {
        "TC_ID": "TC_NT_05",
        "Description": "Verify user can select a valid Concern from the dropdown list.",
        "Scenario": "Verify user can select a valid Concern from the dropdown list.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Concern is selected successfully in dropdown."
    },
    {
        "TC_ID": "TC_NT_06",
        "Description": "Verify user can switch between Email, SMS, WhatsApp, and InApp template types.",
        "Scenario": "Verify user can switch between Email, SMS, WhatsApp, and InApp template types.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Forms toggle correctly based on selected template type."
    },
    {
        "TC_ID": "TC_NT_07",
        "Description": "Verify Email template is created successfully with all mandatory fields filled.",
        "Scenario": "Verify Email template is created successfully with all mandatory fields filled.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "Email template is created successfully."
    },
    {
        "TC_ID": "TC_NT_08",
        "Description": "Verify Email template creation fails when mandatory fields are left blank.",
        "Scenario": "Verify Email template creation fails when mandatory fields are left blank.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Validation warning shows required fields are empty."
    },
    {
        "TC_ID": "TC_NT_09",
        "Description": "Verify Email template creation fails with an invalid From Email format.",
        "Scenario": "Verify Email template creation fails with an invalid From Email format.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Validation error warns on malformed email format."
    },
    {
        "TC_ID": "TC_NT_10",
        "Description": "Verify SMS template is created successfully with valid Body and Template ID.",
        "Scenario": "Verify SMS template is created successfully with valid Body and Template ID.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "SMS template is created successfully."
    },
    {
        "TC_ID": "TC_NT_11",
        "Description": "Verify SMS template creation fails when Template ID is empty.",
        "Scenario": "Verify SMS template creation fails when Template ID is empty.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Validation error shows Template ID is required."
    },
    {
        "TC_ID": "TC_NT_12",
        "Description": "Verify WhatsApp template is created successfully with valid Header and Body details.",
        "Scenario": "Verify WhatsApp template is created successfully with valid Header and Body details.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "WhatsApp template is created successfully."
    },
    {
        "TC_ID": "TC_NT_13",
        "Description": "Verify WhatsApp template creation fails when mandatory Body field is blank.",
        "Scenario": "Verify WhatsApp template creation fails when mandatory Body field is blank.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Validation error shows Body field is required."
    },
    {
        "TC_ID": "TC_NT_14",
        "Description": "Verify user can add WhatsApp message variables using the (+) button.",
        "Scenario": "Verify user can add WhatsApp message variables using the (+) button.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "WhatsApp variables display successfully in text canvas."
    },
    {
        "TC_ID": "TC_NT_15",
        "Description": "Verify InApp template is created successfully with Subject, Body, and image upload.",
        "Scenario": "Verify InApp template is created successfully with Subject, Body, and image upload.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "InApp template is created successfully."
    },
    {
        "TC_ID": "TC_NT_16",
        "Description": "Verify InApp template creation fails when Subject or Body is empty.",
        "Scenario": "Verify InApp template creation fails when Subject or Body is empty.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Validation errors prompt on blank fields."
    },
    {
        "TC_ID": "TC_NT_17",
        "Description": "Verify system accepts only supported file formats for InApp image upload.",
        "Scenario": "Verify system accepts only supported file formats for InApp image upload.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Supported format uploads successfully."
    },
    {
        "TC_ID": "TC_NT_18",
        "Description": "Verify system rejects unsupported file formats during image upload.",
        "Scenario": "Verify system rejects unsupported file formats during image upload.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Validation blocks file upload."
    },
    {
        "TC_ID": "TC_NT_19",
        "Description": "Verify newly created template appears in the template list after successful submission.",
        "Scenario": "Verify newly created template appears in the template list after successful submission.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "Template displays in main listing grid."
    },
    {
        "TC_ID": "TC_NT_20",
        "Description": "Verify duplicate template creation for the same Concern and Template Type is not allowed.",
        "Scenario": "Verify duplicate template creation for the same Concern and Template Type is not allowed.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Warning toast displays duplicate validation block."
    },
    {
        "TC_ID": "TC_NT_21",
        "Description": "Verify search functionality returns matching templates for a valid keyword.",
        "Scenario": "Verify search functionality returns matching templates for a valid keyword.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "Grid displays filtered templates matching search keyword."
    },
    {
        "TC_ID": "TC_NT_22",
        "Description": "Verify search functionality returns no records for an invalid keyword.",
        "Scenario": "Verify search functionality returns no records for an invalid keyword.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "No records found displays in table."
    },
    {
        "TC_ID": "TC_NT_23",
        "Description": "Verify user can delete an existing template successfully.",
        "Scenario": "Verify user can delete an existing template successfully.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "Template deleted successfully."
    },
    {
        "TC_ID": "TC_NT_24",
        "Description": "Verify template is not deleted when delete action is cancelled.",
        "Scenario": "Verify template is not deleted when delete action is cancelled.",
        "Priority": "Medium",
        "Runnable": "Yes",
        "Expected Result": "Delete popup closes; template remains in list."
    },
    {
        "TC_ID": "TC_NT_25",
        "Description": "Verify refresh button reloads the latest template data correctly.",
        "Scenario": "Verify refresh button reloads the latest template data correctly.",
        "Priority": "High",
        "Runnable": "Yes",
        "Expected Result": "Template grid reloads latest records."
    }
];

const headers = [
    "TC_ID",
    "Description",
    "Scenario",
    "Priority",
    "Runnable",
    "Expected Result"
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
