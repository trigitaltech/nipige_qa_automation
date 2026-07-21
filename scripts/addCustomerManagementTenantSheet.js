/**
 * Updates (or replaces) the "Customer Management( Tenant)" sheet in testData.xlsx — 60 test cases.
 * Run once: node scripts/addCustomerManagementTenantSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "Customer Management( Tenant)";

const rows = [
    // ── Positive Test Cases (TC_CM_01 to TC_CM_30) ──
    {
        "TC_ID": "TC_CM_01",
        "Type": "Positive",
        "Description": "Verify customer search by valid Customer Number returns correct customer details.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer search by valid Customer Number returns correct customer details."
    },
    {
        "TC_ID": "TC_CM_02",
        "Type": "Positive",
        "Description": "Verify customer search by valid Mobile Number returns matching customer.",
        "SearchType": "Mobile Number",
        "SearchValue": "8145031601",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer search by valid Mobile Number returns matching customer."
    },
    {
        "TC_ID": "TC_CM_03",
        "Type": "Positive",
        "Description": "Verify customer search by valid E-mail ID returns matching customer.",
        "SearchType": "E-mail Id",
        "SearchValue": "sandi90saha@gmail.com",
        "CustomerName": "New User",
        "CustomerID": "CGSO0009",
        "Email": "sandi90saha@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer search by valid E-mail ID returns matching customer."
    },
    {
        "TC_ID": "TC_CM_04",
        "Type": "Positive",
        "Description": "Verify customer search by valid Order Number returns matching customer.",
        "SearchType": "Order Number",
        "SearchValue": "ORD-20260619-898B5FFA",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer search by valid Order Number returns matching customer."
    },
    {
        "TC_ID": "TC_CM_05",
        "Type": "Positive",
        "Description": "Verify customer search by valid Service Ticket returns matching customer.",
        "SearchType": "Service Ticket",
        "SearchValue": "SR8319109611",
        "CustomerName": "New User",
        "CustomerID": "CGSO0009",
        "Email": "sandi90saha@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer search by valid Service Ticket returns matching customer."
    },
    {
        "TC_ID": "TC_CM_06",
        "Type": "Positive",
        "Description": "Verify customer search by valid Customer Name returns matching records.",
        "SearchType": "Name",
        "SearchValue": "Biswarup",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer search by valid Customer Name returns matching records."
    },
    {
        "TC_ID": "TC_CM_07",
        "Type": "Positive",
        "Description": "Verify Search button is enabled when valid search criteria and value are entered.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify Search button is enabled when valid search criteria and value are entered."
    },
    {
        "TC_ID": "TC_CM_08",
        "Type": "Positive",
        "Description": "Verify pressing Enter triggers customer search.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify pressing Enter triggers customer search."
    },
    {
        "TC_ID": "TC_CM_09",
        "Type": "Positive",
        "Description": "Verify customer details page opens after successful search.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer details page opens after successful search."
    },
    {
        "TC_ID": "TC_CM_10",
        "Type": "Positive",
        "Description": "Verify customer name is displayed correctly in details page.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer name is displayed correctly in details page."
    },
    {
        "TC_ID": "TC_CM_11",
        "Type": "Positive",
        "Description": "Verify customer ID is displayed correctly.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer ID is displayed correctly."
    },
    {
        "TC_ID": "TC_CM_12",
        "Type": "Positive",
        "Description": "Verify customer email is displayed correctly.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer email is displayed correctly."
    },
    {
        "TC_ID": "TC_CM_13",
        "Type": "Positive",
        "Description": "Verify customer phone number is displayed correctly.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify customer phone number is displayed correctly."
    },
    {
        "TC_ID": "TC_CM_14",
        "Type": "Positive",
        "Description": "Verify Orders tab opens successfully.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify Orders tab opens successfully."
    },
    {
        "TC_ID": "TC_CM_15",
        "Type": "Positive",
        "Description": "Verify Address Management tab opens successfully.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify Address Management tab opens successfully."
    },
    {
        "TC_ID": "TC_CM_16",
        "Type": "Positive",
        "Description": "Verify Service Requests tab opens successfully.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify Service Requests tab opens successfully."
    },
    {
        "TC_ID": "TC_CM_17",
        "Type": "Positive",
        "Description": "Verify Award Benefits tab opens successfully.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify Award Benefits tab opens successfully."
    },
    {
        "TC_ID": "TC_CM_18",
        "Type": "Positive",
        "Description": "Verify Order Number filter dropdown loads all available options.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify Order Number filter dropdown loads all available options."
    },
    {
        "TC_ID": "TC_CM_19",
        "Type": "Positive",
        "Description": "Verify Status filter dropdown loads all statuses.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify Status filter dropdown loads all statuses."
    },
    {
        "TC_ID": "TC_CM_20",
        "Type": "Positive",
        "Description": "Verify date range dropdown loads available periods.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify date range dropdown loads available periods."
    },
    {
        "TC_ID": "TC_CM_21",
        "Type": "Positive",
        "Description": "Verify filtering orders by Order Number returns matching records.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify filtering orders by Order Number returns matching records."
    },
    {
        "TC_ID": "TC_CM_22",
        "Type": "Positive",
        "Description": "Verify filtering orders by Status returns matching records.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify filtering orders by Status returns matching records."
    },
    {
        "TC_ID": "TC_CM_23",
        "Type": "Positive",
        "Description": "Verify filtering orders by Date Range returns matching records.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify filtering orders by Date Range returns matching records."
    },
    {
        "TC_ID": "TC_CM_24",
        "Type": "Positive",
        "Description": "Verify multiple filters can be applied together successfully.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify multiple filters can be applied together successfully."
    },
    {
        "TC_ID": "TC_CM_25",
        "Type": "Positive",
        "Description": "Verify order table displays correct column headers.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify order table displays correct column headers."
    },
    {
        "TC_ID": "TC_CM_26",
        "Type": "Positive",
        "Description": "Verify order records display correct values.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify order records display correct values."
    },
    {
        "TC_ID": "TC_CM_27",
        "Type": "Positive",
        "Description": "Verify Back button navigates to Customer Search page.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify Back button navigates to Customer Search page."
    },
    {
        "TC_ID": "TC_CM_28",
        "Type": "Positive",
        "Description": "Verify Refresh button reloads latest customer data.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify Refresh button reloads latest customer data."
    },
    {
        "TC_ID": "TC_CM_29",
        "Type": "Positive",
        "Description": "Verify search box in details page accepts valid values.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify search box in details page accepts valid values."
    },
    {
        "TC_ID": "TC_CM_30",
        "Type": "Positive",
        "Description": "Verify page loads successfully without UI alignment issues.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "Biswarup Roy1",
        "CustomerID": "CGSO0007",
        "Email": "sdfghj@gmail.com",
        "Phone": "8145031601",
        "Expected_Result": "Verify page loads successfully without UI alignment issues."
    },

    // ── Negative Test Cases (TC_CM_NEG_01 to TC_CM_NEG_30) ──
    {
        "TC_ID": "TC_CM_NEG_01",
        "Type": "Negative",
        "Description": "Verify search fails when search value field is left blank.",
        "SearchType": "Customer Number",
        "SearchValue": "",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search fails when search value field is left blank."
    },
    {
        "TC_ID": "TC_CM_NEG_02",
        "Type": "Negative",
        "Description": "Verify search with invalid Customer Number returns no records.",
        "SearchType": "Customer Number",
        "SearchValue": "INVALID_NUM_123",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with invalid Customer Number returns no records."
    },
    {
        "TC_ID": "TC_CM_NEG_03",
        "Type": "Negative",
        "Description": "Verify search with invalid Mobile Number returns no records.",
        "SearchType": "Mobile Number",
        "SearchValue": "9999999999",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with invalid Mobile Number returns no records."
    },
    {
        "TC_ID": "TC_CM_NEG_04",
        "Type": "Negative",
        "Description": "Verify search with invalid Email ID returns no records.",
        "SearchType": "E-mail Id",
        "SearchValue": "invalid@email.com",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with invalid Email ID returns no records."
    },
    {
        "TC_ID": "TC_CM_NEG_05",
        "Type": "Negative",
        "Description": "Verify search with invalid Order Number returns no records.",
        "SearchType": "Order Number",
        "SearchValue": "ORD-INVALID",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with invalid Order Number returns no records."
    },
    {
        "TC_ID": "TC_CM_NEG_06",
        "Type": "Negative",
        "Description": "Verify search with invalid Service Ticket returns no records.",
        "SearchType": "Service Ticket",
        "SearchValue": "SR-INVALID",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with invalid Service Ticket returns no records."
    },
    {
        "TC_ID": "TC_CM_NEG_07",
        "Type": "Negative",
        "Description": "Verify search with special characters only returns validation message.",
        "SearchType": "Customer Number",
        "SearchValue": "@#$%",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with special characters only returns validation message."
    },
    {
        "TC_ID": "TC_CM_NEG_08",
        "Type": "Negative",
        "Description": "Verify search with SQL injection string does not return data.",
        "SearchType": "Customer Number",
        "SearchValue": "' OR '1'='1",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with SQL injection string does not return data."
    },
    {
        "TC_ID": "TC_CM_NEG_09",
        "Type": "Negative",
        "Description": "Verify search with script tags is sanitized and blocked.",
        "SearchType": "Customer Number",
        "SearchValue": "<script>alert(1)</script>",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with script tags is sanitized and blocked."
    },
    {
        "TC_ID": "TC_CM_NEG_10",
        "Type": "Negative",
        "Description": "Verify search with excessively long input is rejected gracefully.",
        "SearchType": "Customer Number",
        "SearchValue": "A".repeat(500),
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with excessively long input is rejected gracefully."
    },
    {
        "TC_ID": "TC_CM_NEG_11",
        "Type": "Negative",
        "Description": "Verify search with spaces only does not execute.",
        "SearchType": "Customer Number",
        "SearchValue": "    ",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with spaces only does not execute."
    },
    {
        "TC_ID": "TC_CM_NEG_12",
        "Type": "Negative",
        "Description": "Verify search with unsupported characters returns validation.",
        "SearchType": "Customer Number",
        "SearchValue": "¶§¾",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search with unsupported characters returns validation."
    },
    {
        "TC_ID": "TC_CM_NEG_13",
        "Type": "Negative",
        "Description": "Verify search button remains disabled when mandatory criteria are missing.",
        "SearchType": "",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify search button remains disabled when mandatory criteria are missing."
    },
    {
        "TC_ID": "TC_CM_NEG_14",
        "Type": "Negative",
        "Description": "Verify customer details page is not opened for non-existing customer.",
        "SearchType": "Customer Number",
        "SearchValue": "INVALID_NUM_123",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify customer details page is not opened for non-existing customer."
    },
    {
        "TC_ID": "TC_CM_NEG_15",
        "Type": "Negative",
        "Description": "Verify API failure during search displays error message.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify API failure during search displays error message."
    },
    {
        "TC_ID": "TC_CM_NEG_16",
        "Type": "Negative",
        "Description": "Verify network interruption during search is handled gracefully.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify network interruption during search is handled gracefully."
    },
    {
        "TC_ID": "TC_CM_NEG_17",
        "Type": "Negative",
        "Description": "Verify Orders tab displays \"No records found\" when customer has no orders.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify Orders tab displays \"No records found\" when customer has no orders."
    },
    {
        "TC_ID": "TC_CM_NEG_18",
        "Type": "Negative",
        "Description": "Verify Address Management tab handles empty addresses correctly.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify Address Management tab handles empty addresses correctly."
    },
    {
        "TC_ID": "TC_CM_NEG_19",
        "Type": "Negative",
        "Description": "Verify Service Requests tab handles empty request history correctly.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify Service Requests tab handles empty request history correctly."
    },
    {
        "TC_ID": "TC_CM_NEG_20",
        "Type": "Negative",
        "Description": "Verify Award Benefits tab handles no benefits data correctly.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify Award Benefits tab handles no benefits data correctly."
    },
    {
        "TC_ID": "TC_CM_NEG_21",
        "Type": "Negative",
        "Description": "Verify invalid Order Number filter value does not break results.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify invalid Order Number filter value does not break results."
    },
    {
        "TC_ID": "TC_CM_NEG_22",
        "Type": "Negative",
        "Description": "Verify invalid Status filter value returns no records.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify invalid Status filter value returns no records."
    },
    {
        "TC_ID": "TC_CM_NEG_23",
        "Type": "Negative",
        "Description": "Verify invalid date range selection is handled correctly.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify invalid date range selection is handled correctly."
    },
    {
        "TC_ID": "TC_CM_NEG_24",
        "Type": "Negative",
        "Description": "Verify applying filters with no matching data displays empty state.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify applying filters with no matching data displays empty state."
    },
    {
        "TC_ID": "TC_CM_NEG_25",
        "Type": "Negative",
        "Description": "Verify rapid multiple clicks on Search do not trigger duplicate requests.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify rapid multiple clicks on Search do not trigger duplicate requests."
    },
    {
        "TC_ID": "TC_CM_NEG_26",
        "Type": "Negative",
        "Description": "Verify Refresh button during API failure shows appropriate error.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify Refresh button during API failure shows appropriate error."
    },
    {
        "TC_ID": "TC_CM_NEG_27",
        "Type": "Negative",
        "Description": "Verify unauthorized user cannot access customer details directly via URL.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify unauthorized user cannot access customer details directly via URL."
    },
    {
        "TC_ID": "TC_CM_NEG_28",
        "Type": "Negative",
        "Description": "Verify customer details are not displayed after session timeout.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify customer details are not displayed after session timeout."
    },
    {
        "TC_ID": "TC_CM_NEG_29",
        "Type": "Negative",
        "Description": "Verify system prevents access to restricted customer data without permission.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify system prevents access to restricted customer data without permission."
    },
    {
        "TC_ID": "TC_CM_NEG_30",
        "Type": "Negative",
        "Description": "Verify page handles backend timeout without crashing.",
        "SearchType": "Customer Number",
        "SearchValue": "CGSO0007",
        "CustomerName": "",
        "CustomerID": "",
        "Email": "",
        "Phone": "",
        "Expected_Result": "Verify page handles backend timeout without crashing."
    }
];

const headers = [
    "TC_ID",
    "Description",
    "Type",
    "SearchType",
    "SearchValue",
    "CustomerName",
    "CustomerID",
    "Email",
    "Phone",
    "Expected_Result"
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
