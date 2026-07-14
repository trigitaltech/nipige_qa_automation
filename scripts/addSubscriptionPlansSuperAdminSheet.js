/**
 * Updates (or replaces) the "Subscription plans( Super admin" sheet in testData.xlsx — 50 test cases.
 * Run once: node scripts/addSubscriptionPlansSuperAdminSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "Subscription plans( Super admin";

const rows = [
    // ── Subscription Plans Screen: Positive (TC_SUB_01 to TC_SUB_10) ──
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify Subscription Plans page loads successfully with all summary cards and plan records displayed.",
        "TC_ID": "TC_SUB_01",
        "Scenario": "Verify Subscription Plans page loads successfully with all summary cards and plan records displayed.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify Total Plans count matches the number of plans available in the system.",
        "TC_ID": "TC_SUB_02",
        "Scenario": "Verify Total Plans count matches the number of plans available in the system.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify Active Plans count displays correct active subscription plans.",
        "TC_ID": "TC_SUB_03",
        "Scenario": "Verify Active Plans count displays correct active subscription plans.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify Tenant count displays correct number of tenants.",
        "TC_ID": "TC_SUB_04",
        "Scenario": "Verify Tenant count displays correct number of tenants.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify Total Amount displays correct aggregated subscription amount.",
        "TC_ID": "TC_SUB_05",
        "Scenario": "Verify Total Amount displays correct aggregated subscription amount.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify search functionality returns matching plans based on Plan Name.",
        "TC_ID": "TC_SUB_06",
        "Scenario": "Verify search functionality returns matching plans based on Plan Name.",
        "Test Data": "ValidPlan",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify Scope dropdown filters plans correctly based on selected scope.",
        "TC_ID": "TC_SUB_07",
        "Scenario": "Verify Scope dropdown filters plans correctly based on selected scope.",
        "Test Data": "PUBLIC",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify Clear button resets search text and scope filter values.",
        "TC_ID": "TC_SUB_08",
        "Scenario": "Verify Clear button resets search text and scope filter values.",
        "Test Data": "TestSearch",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify Edit icon opens the selected subscription plan in edit mode.",
        "TC_ID": "TC_SUB_09",
        "Scenario": "Verify Edit icon opens the selected subscription plan in edit mode.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify Create Plan button navigates user to the Create Subscription Plan page.",
        "TC_ID": "TC_SUB_10",
        "Scenario": "Verify Create Plan button navigates user to the Create Subscription Plan page.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },

    // ── Subscription Plans Screen: Negative (TC_SUB_NEG_01 to TC_SUB_NEG_10) ──
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify search with a non-existing plan name returns \"No Records Found\" or empty results.",
        "TC_ID": "TC_SUB_NEG_01",
        "Scenario": "Verify search with a non-existing plan name returns \"No Records Found\" or empty results.",
        "Test Data": "UNKNOWN_PLAN_999",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify search field handles special characters without application crash.",
        "TC_ID": "TC_SUB_NEG_02",
        "Scenario": "Verify search field handles special characters without application crash.",
        "Test Data": "!@#$%^&*()",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify SQL injection input in search field does not affect database operations.",
        "TC_ID": "TC_SUB_NEG_03",
        "Scenario": "Verify SQL injection input in search field does not affect database operations.",
        "Test Data": "' OR '1'='1",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify XSS scripts entered in search field are not executed.",
        "TC_ID": "TC_SUB_NEG_04",
        "Scenario": "Verify XSS scripts entered in search field are not executed.",
        "Test Data": "<script>alert(1)</script>",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify invalid scope selection does not break the page.",
        "TC_ID": "TC_SUB_NEG_05",
        "Scenario": "Verify invalid scope selection does not break the page.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify deleting a plan with active subscriptions shows appropriate validation/error message.",
        "TC_ID": "TC_SUB_NEG_06",
        "Scenario": "Verify deleting a plan with active subscriptions shows appropriate validation/error message.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify user cannot access Edit functionality without proper permissions.",
        "TC_ID": "TC_SUB_NEG_07",
        "Scenario": "Verify user cannot access Edit functionality without proper permissions.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify user cannot delete a subscription plan without required permissions.",
        "TC_ID": "TC_SUB_NEG_08",
        "Scenario": "Verify user cannot delete a subscription plan without required permissions.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify the UI does not break when encountering unusually long plan names or descriptions.",
        "TC_ID": "TC_SUB_NEG_09",
        "Scenario": "Verify the UI does not break when encountering unusually long plan names or descriptions.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify pagination controls remain disabled when only one page of records exists.",
        "TC_ID": "TC_SUB_NEG_10",
        "Scenario": "Verify pagination controls remain disabled when only one page of records exists.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },

    // ── Update Subscription popup: Positive (TC_SUB_11 to TC_SUB_15) ──
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify the Update Subscription popup opens with existing plan details prefilled.",
        "TC_ID": "TC_SUB_11",
        "Scenario": "Verify the Update Subscription popup opens with existing plan details prefilled.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify user can successfully update Plan Name and save changes.",
        "TC_ID": "TC_SUB_12",
        "Scenario": "Verify user can successfully update Plan Name and save changes.",
        "Test Data": "Updated Plan Name",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify user can successfully update Plan Amount with a valid numeric value.",
        "TC_ID": "TC_SUB_13",
        "Scenario": "Verify user can successfully update Plan Amount with a valid numeric value.",
        "Test Data": "150",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify user can successfully update Description and save changes.",
        "TC_ID": "TC_SUB_14",
        "Scenario": "Verify user can successfully update Description and save changes.",
        "Test Data": "Updated Description Text",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify clicking Update saves changes and displays a success message.",
        "TC_ID": "TC_SUB_15",
        "Scenario": "Verify clicking Update saves changes and displays a success message.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },

    // ── Update Subscription popup: Negative (TC_SUB_NEG_11 to TC_SUB_NEG_15) ──
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify update is prevented when Plan Name is left blank.",
        "TC_ID": "TC_SUB_NEG_11",
        "Scenario": "Verify update is prevented when Plan Name is left blank.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify update is prevented when Plan Amount is left blank.",
        "TC_ID": "TC_SUB_NEG_12",
        "Scenario": "Verify update is prevented when Plan Amount is left blank.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify update is prevented when Plan Amount contains non-numeric characters.",
        "TC_ID": "TC_SUB_NEG_13",
        "Scenario": "Verify update is prevented when Plan Amount contains non-numeric characters.",
        "Test Data": "abc",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify update is prevented when Description is left blank if it is mandatory.",
        "TC_ID": "TC_SUB_NEG_14",
        "Scenario": "Verify update is prevented when Description is left blank if it is mandatory.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify system displays an appropriate error message when update API fails.",
        "TC_ID": "TC_SUB_NEG_15",
        "Scenario": "Verify system displays an appropriate error message when update API fails.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },

    // ── Delete Subscription Plan confirmation popup: Positive (TC_SUB_16 to TC_SUB_20) ──
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify clicking the Delete icon opens the Delete Subscription Plan confirmation popup.",
        "TC_ID": "TC_SUB_16",
        "Scenario": "Verify clicking the Delete icon opens the Delete Subscription Plan confirmation popup.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify clicking Cancel closes the popup without deleting the subscription plan.",
        "TC_ID": "TC_SUB_17",
        "Scenario": "Verify clicking Cancel closes the popup without deleting the subscription plan.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify clicking Yes, delete it! successfully deletes the selected subscription plan.",
        "TC_ID": "TC_SUB_18",
        "Scenario": "Verify clicking Yes, delete it! successfully deletes the selected subscription plan.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify a success message is displayed after successful deletion of the subscription plan.",
        "TC_ID": "TC_SUB_19",
        "Scenario": "Verify a success message is displayed after successful deletion of the subscription plan.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify the deleted subscription plan is removed from the subscription plans list after page refresh.",
        "TC_ID": "TC_SUB_20",
        "Scenario": "Verify the deleted subscription plan is removed from the subscription plans list after page refresh.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },

    // ── Delete Subscription Plan confirmation popup: Negative (TC_SUB_NEG_16 to TC_SUB_NEG_20) ──
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify the subscription plan is not deleted when the Cancel button is clicked.",
        "TC_ID": "TC_SUB_NEG_16",
        "Scenario": "Verify the subscription plan is not deleted when the Cancel button is clicked.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify deletion fails gracefully when the backend/API returns an error.",
        "TC_ID": "TC_SUB_NEG_17",
        "Scenario": "Verify deletion fails gracefully when the backend/API returns an error.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify an active subscription plan with associated tenants cannot be deleted if restricted by business rules.",
        "TC_ID": "TC_SUB_NEG_18",
        "Scenario": "Verify an active subscription plan with associated tenants cannot be deleted if restricted by business rules.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify unauthorized users cannot delete subscription plans even if the delete popup is displayed.",
        "TC_ID": "TC_SUB_NEG_19",
        "Scenario": "Verify unauthorized users cannot delete subscription plans even if the delete popup is displayed.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify multiple rapid clicks on Yes, delete it! do not trigger duplicate delete requests.",
        "TC_ID": "TC_SUB_NEG_20",
        "Scenario": "Verify multiple rapid clicks on Yes, delete it! do not trigger duplicate delete requests.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },

    // ── Create Plan Screen: Positive (TC_SUB_21 to TC_SUB_25) ──
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify a new subscription plan is created successfully with valid Plan Name, Plan Amount, and Description.",
        "TC_ID": "TC_SUB_21",
        "Scenario": "Verify a new subscription plan is created successfully with valid Plan Name, Plan Amount, and Description.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify clicking Save adds the new subscription plan and displays it in the subscription list.",
        "TC_ID": "TC_SUB_22",
        "Scenario": "Verify clicking Save adds the new subscription plan and displays it in the subscription list.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify the created plan is visible after page refresh.",
        "TC_ID": "TC_SUB_23",
        "Scenario": "Verify the created plan is visible after page refresh.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify clicking Cancel closes the popup without creating a subscription plan.",
        "TC_ID": "TC_SUB_24",
        "Scenario": "Verify clicking Cancel closes the popup without creating a subscription plan.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify the popup closes successfully when the Close (X) icon is clicked.",
        "TC_ID": "TC_SUB_25",
        "Scenario": "Verify the popup closes successfully when the Close (X) icon is clicked.",
        "Test Data": "",
        "Expected Result": "Plan should be handled successfully",
        "Actual Result": "",
        "Status": ""
    },

    // ── Create Plan Screen: Negative (TC_SUB_NEG_21 to TC_SUB_NEG_25) ──
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify validation message is displayed when Plan Name is left blank and Save is clicked.",
        "TC_ID": "TC_SUB_NEG_21",
        "Scenario": "Verify validation message is displayed when Plan Name is left blank and Save is clicked.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify validation message is displayed when Plan Amount is left blank and Save is clicked.",
        "TC_ID": "TC_SUB_NEG_22",
        "Scenario": "Verify validation message is displayed when Plan Amount is left blank and Save is clicked.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify validation message is displayed when Description is left blank and Save is clicked.",
        "TC_ID": "TC_SUB_NEG_23",
        "Scenario": "Verify validation message is displayed when Description is left blank and Save is clicked.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify non-numeric values are not accepted in the Plan Amount field.",
        "TC_ID": "TC_SUB_NEG_24",
        "Scenario": "Verify non-numeric values are not accepted in the Plan Amount field.",
        "Test Data": "abc",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    },
    {
        "Module": "Subscription plans( Super admin)",
        "Description": "Verify duplicate subscription plan names cannot be created and an appropriate error message is displayed.",
        "TC_ID": "TC_SUB_NEG_25",
        "Scenario": "Verify duplicate subscription plan names cannot be created and an appropriate error message is displayed.",
        "Test Data": "",
        "Expected Result": "Validation/Error should be handled",
        "Actual Result": "",
        "Status": ""
    }
];

const headers = [
    "Module",
    "Description",
    "TC_ID",
    "Scenario",
    "Test Data",
    "Expected Result",
    "Actual Result",
    "Status"
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
