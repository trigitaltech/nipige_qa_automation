/**
 * Updates (or replaces) the "BulkPromotion" sheet in testData.xlsx — 16 automation + 76 manual test cases = 92 rows.
 * Run once: node scripts/addBulkPromotionSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "BulkPromotion";

const preservedRows = [
    {
        "TestID": "TC01_Customer_FirstName",
        "Description": "Validate Customer First Name",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "First Name",
        "Value": "Biswarup",
        "Operator": "Equal (eq)",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC02_Customer_LastName",
        "Description": "Validate Customer Last Name",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "Last Name",
        "Value": "Roy",
        "Operator": "Equal (eq)",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC03_Customer_Email",
        "Description": "Validate Customer Email",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "Email",
        "Value": "Biswarup90roy@gmail.com",
        "Operator": "Equal (eq)",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC04_Customer_Phone",
        "Description": "Validate Customer Phone",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "Phone",
        "Value": "8145031601|9787264649",
        "Operator": "Equal (eq)|Or",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC05_Customer_CustomerNo",
        "Description": "Validate Customer Number",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "Customer No",
        "Value": "CKXM0016",
        "Operator": "Equal (eq)",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC06_Customer_City",
        "Description": "Validate Customer City",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "City",
        "Value": "Ghatal",
        "Operator": "Equal (eq)",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC07_Customer_State",
        "Description": "Validate Customer State",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "State",
        "Value": "WB",
        "Operator": "Equal (eq)",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC08_Customer_Date",
        "Description": "Validate Customer Date",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "Date",
        "Value": "12-05-2026|19-05-2026",
        "Operator": "Date",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC09_Customer_InvalidEmail",
        "Description": "Validate Invalid Customer Email",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "Email",
        "Value": "invalid@test.com",
        "Operator": "Equal (eq)",
        "ExpectedResult": "No records found displayed"
    },
    {
        "TestID": "TC10_Customer_InvalidPhone",
        "Description": "Validate Invalid Customer Phone",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "Phone",
        "Value": "9999999999",
        "Operator": "Equal (eq)",
        "ExpectedResult": "No records found displayed"
    },
    {
        "TestID": "TC11_Customer_InvalidCustomerNo",
        "Description": "Validate Invalid Customer Number",
        "persona": "tenant",
        "Entity": "Customer",
        "Criteria": "Customer No",
        "Value": "CKXM99999",
        "Operator": "Equal (eq)",
        "ExpectedResult": "No records found displayed"
    },
    {
        "TestID": "TC12_Order_City",
        "Description": "Validate Order City",
        "persona": "tenant",
        "Entity": "Order",
        "Criteria": "City",
        "Value": "Ghatal",
        "Operator": "Equal (eq)",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC13_Order_Date",
        "Description": "Validate Order Date",
        "persona": "tenant",
        "Entity": "Order",
        "Criteria": "Date",
        "Value": "01-01-2026|08-06-2026",
        "Operator": "Date",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC14_Order_OrderAmount",
        "Description": "Validate Order Amount",
        "persona": "tenant",
        "Entity": "Order",
        "Criteria": "Order Amount",
        "Value": "1|100",
        "Operator": "Range",
        "ExpectedResult": "Matching records displayed"
    },
    {
        "TestID": "TC15_Order_InvalidCity",
        "Description": "Validate Invalid Order City",
        "persona": "tenant",
        "Entity": "Order",
        "Criteria": "City",
        "Value": "InvalidCity123",
        "Operator": "Equal (eq)",
        "ExpectedResult": "No records found displayed"
    },
    {
        "TestID": "TC16_Order_InvalidOrderAmount",
        "Description": "Validate Invalid Order Amount",
        "persona": "tenant",
        "Entity": "Order",
        "Criteria": "Order Amount",
        "Value": "999999|9999999",
        "Operator": "Range",
        "ExpectedResult": "No records found displayed"
    }
];

const newRows = [
    // ── Bulk Promotion List Screen: Positives (BP-L-001 to BP-L-011) ──
    { "TestID": "BP-L-001", "Description": "Open Bulk Promotion page", "ExpectedResult": "Page loads successfully" },
    { "TestID": "BP-L-002", "Description": "Verify dashboard cards display", "ExpectedResult": "Total Promotions, Approved, Pending Approval, Total Impacted displayed" },
    { "TestID": "BP-L-003", "Description": "Search existing promotion", "ExpectedResult": "Matching records displayed" },
    { "TestID": "BP-L-004", "Description": "Filter Today promotions", "ExpectedResult": "Only today's promotions displayed" },
    { "TestID": "BP-L-005", "Description": "Filter 7 Days promotions", "ExpectedResult": "Last 7 days records displayed" },
    { "TestID": "BP-L-006", "Description": "Filter 30 Days promotions", "ExpectedResult": "Last 30 days records displayed" },
    { "TestID": "BP-L-007", "Description": "Custom date filter", "ExpectedResult": "Records within selected range displayed" },
    { "TestID": "BP-L-008", "Description": "Click Create button", "ExpectedResult": "Create Bulk Promotion page opens" },
    { "TestID": "BP-L-009", "Description": "Pagination Next button", "ExpectedResult": "Navigates to next page" },
    { "TestID": "BP-L-010", "Description": "Refresh icon click", "ExpectedResult": "Data reloads successfully" },
    { "TestID": "BP-L-011", "Description": "Open promotion details", "ExpectedResult": "View Details page opens" },

    // ── Bulk Promotion List Screen: Negatives (BP-L-101 to BP-L-107) ──
    { "TestID": "BP-L-101", "Description": "Search random invalid text", "ExpectedResult": "\"No Data Found\" displayed" },
    { "TestID": "BP-L-102", "Description": "Search with special characters", "ExpectedResult": "System handles gracefully" },
    { "TestID": "BP-L-103", "Description": "Search using SQL Injection string", "ExpectedResult": "No crash or unauthorized data" },
    { "TestID": "BP-L-104", "Description": "Apply filter with no matching records", "ExpectedResult": "Empty state displayed" },
    { "TestID": "BP-L-105", "Description": "Double click Create rapidly", "ExpectedResult": "Single page opens" },
    { "TestID": "BP-L-106", "Description": "Refresh during loading", "ExpectedResult": "No application crash" },
    { "TestID": "BP-L-107", "Description": "Navigate to invalid page number", "ExpectedResult": "Validation shown" },

    // ── Create Bulk Promotion Screen: Positives (BP-C-001 to BP-C-009) ──
    { "TestID": "BP-C-001", "Description": "Select Lead Customer", "ExpectedResult": "Dropdown selection successful" },
    { "TestID": "BP-C-002", "Description": "Select Search Entity = Name", "ExpectedResult": "Entity selected" },
    { "TestID": "BP-C-003", "Description": "Enter valid customer name", "ExpectedResult": "Accepted" },
    { "TestID": "BP-C-004", "Description": "Add multiple conditions using + button", "ExpectedResult": "New row added" },
    { "TestID": "BP-C-005", "Description": "Use OR condition", "ExpectedResult": "Logic applied correctly" },
    { "TestID": "BP-C-006", "Description": "Use Equal operator", "ExpectedResult": "Matching customers fetched" },
    { "TestID": "BP-C-007", "Description": "Click View Impacted Customer", "ExpectedResult": "Customer list generated" },
    { "TestID": "BP-C-008", "Description": "Download customer list", "ExpectedResult": "File downloaded" },
    { "TestID": "BP-C-009", "Description": "Remove filter row", "ExpectedResult": "Row removed successfully" },

    // ── Create Bulk Promotion Screen: Negatives (BP-C-101 to BP-C-107) ──
    { "TestID": "BP-C-101", "Description": "Leave customer type blank", "ExpectedResult": "Validation displayed" },
    { "TestID": "BP-C-102", "Description": "Leave search entity blank", "ExpectedResult": "Validation displayed" },
    { "TestID": "BP-C-103", "Description": "Enter invalid customer name", "ExpectedResult": "No matching records" },
    { "TestID": "BP-C-104", "Description": "Enter only spaces", "ExpectedResult": "Validation displayed" },
    { "TestID": "BP-C-105", "Description": "Add 20+ filter rows", "ExpectedResult": "System handles properly" },
    { "TestID": "BP-C-106", "Description": "Remove all rows", "ExpectedResult": "Minimum row validation" },
    { "TestID": "BP-C-107", "Description": "Click View Impacted Customer without criteria", "ExpectedResult": "Validation shown" },

    // ── Promotional Configuration: Positives (BP-PC-001 to BP-PC-010) ──
    { "TestID": "BP-PC-001", "Description": "Select Promotion Type", "ExpectedResult": "Selected successfully" },
    { "TestID": "BP-PC-002", "Description": "Select Notification Type SMS", "ExpectedResult": "Accepted" },
    { "TestID": "BP-PC-003", "Description": "Select Notification Type Email", "ExpectedResult": "Accepted" },
    { "TestID": "BP-PC-004", "Description": "Select Template", "ExpectedResult": "Template loaded" },
    { "TestID": "BP-PC-005", "Description": "Enter promotion amount", "ExpectedResult": "Accepted" },
    { "TestID": "BP-PC-006", "Description": "Enter description", "ExpectedResult": "Saved successfully" },
    { "TestID": "BP-PC-007", "Description": "Select future date", "ExpectedResult": "Accepted" },
    { "TestID": "BP-PC-008", "Description": "Select valid time", "ExpectedResult": "Accepted" },
    { "TestID": "BP-PC-009", "Description": "Submit valid promotion", "ExpectedResult": "Promotion created" },
    { "TestID": "BP-PC-010", "Description": "Verify impacted value calculation", "ExpectedResult": "Correct calculation shown" },

    // ── Promotional Configuration: Negatives (BP-PC-101 to BP-PC-113) ──
    { "TestID": "BP-PC-101", "Description": "Promotion Type not selected", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-102", "Description": "Notification Type not selected", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-103", "Description": "Template not selected", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-104", "Description": "Amount field empty", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-105", "Description": "Amount = 0", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-106", "Description": "Amount negative value", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-107", "Description": "Amount with alphabets", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-108", "Description": "Amount with special characters", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-109", "Description": "Description exceeds max length", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-110", "Description": "Schedule date in past", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-111", "Description": "Invalid time format", "ExpectedResult": "Validation shown" },
    { "TestID": "BP-PC-112", "Description": "Submit without impacted customers", "ExpectedResult": "Submission blocked" },
    { "TestID": "BP-PC-113", "Description": "Submit with mandatory fields blank", "ExpectedResult": "Validation shown" },

    // ── Template Validation: Positives (BP-T-001 to BP-T-005) ──
    { "TestID": "BP-T-001", "Description": "Load selected template", "ExpectedResult": "Content displayed" },
    { "TestID": "BP-T-002", "Description": "Dynamic placeholders render", "ExpectedResult": "Placeholders visible" },
    { "TestID": "BP-T-003", "Description": "SMS template preview", "ExpectedResult": "Preview displayed" },
    { "TestID": "BP-T-004", "Description": "Email template preview", "ExpectedResult": "Preview displayed" },
    { "TestID": "BP-T-005", "Description": "Template download", "ExpectedResult": "Download successful" },

    // ── Template Validation: Negatives (BP-T-101 to BP-T-104) ──
    { "TestID": "BP-T-101", "Description": "Template deleted from backend", "ExpectedResult": "Error message displayed" },
    { "TestID": "BP-T-102", "Description": "Corrupted template", "ExpectedResult": "Graceful handling" },
    { "TestID": "BP-T-103", "Description": "Missing placeholders", "ExpectedResult": "Validation displayed" },
    { "TestID": "BP-T-104", "Description": "Empty template content", "ExpectedResult": "Submission blocked" },

    // ── View Bulk Promotion Screen: Positives (BP-V-001 to BP-V-006) ──
    { "TestID": "BP-V-001", "Description": "Open promotion details", "ExpectedResult": "Data displayed" },
    { "TestID": "BP-V-002", "Description": "Verify impacted customer count", "ExpectedResult": "Matches created promotion" },
    { "TestID": "BP-V-003", "Description": "Download impacted customer list", "ExpectedResult": "File downloaded" },
    { "TestID": "BP-V-004", "Description": "Verify promotion amount", "ExpectedResult": "Correct value shown" },
    { "TestID": "BP-V-005", "Description": "Verify notification type", "ExpectedResult": "Correct value shown" },
    { "TestID": "BP-V-006", "Description": "Verify scheduled date/time", "ExpectedResult": "Correct value shown" },

    // ── View Bulk Promotion Screen: Negatives (BP-V-101 to BP-V-104) ──
    { "TestID": "BP-V-101", "Description": "Open deleted promotion", "ExpectedResult": "Error shown" },
    { "TestID": "BP-V-102", "Description": "Invalid promotion ID", "ExpectedResult": "Not found page" },
    { "TestID": "BP-V-103", "Description": "Download unavailable file", "ExpectedResult": "Error message shown" },
    { "TestID": "BP-V-104", "Description": "Access unauthorized promotion", "ExpectedResult": "Access denied" }
];

// Combine preserved and manual rows
const combinedRows = [
    ...preservedRows,
    ...newRows.map(r => ({
        "TestID": r.TestID,
        "Description": r.Description,
        "persona": "tenant",
        "Entity": "",
        "Criteria": "",
        "Value": "",
        "Operator": "",
        "ExpectedResult": r.ExpectedResult
    }))
];

const headers = [
    "TestID",
    "Description",
    "persona",
    "Entity",
    "Criteria",
    "Value",
    "Operator",
    "ExpectedResult"
];

const wsData = [
    headers,
    ...combinedRows.map((r) => headers.map((h) => r[h] || "")),
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
    console.log(`Successfully updated ${combinedRows.length} rows in '${SHEET_NAME}' sheet in ${FILE}`);
} catch (err) {
    console.error("Failed to update testData.xlsx:", err.message);
    process.exit(1);
}
