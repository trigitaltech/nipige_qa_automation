/**
 * Adds two sheets to testData.xlsx:
 *   1. "PaymentHistory"              — 50 test-data rows (TC_PH_001–TC_PH_050)
 *   2. "Payment History Regression"  — suite sheet (TestName / Run / Mode)
 *
 * Usage:  node scripts/addPaymentHistorySheets.js
 */

const path = require("path");
const XLSX = require("xlsx");

const EXCEL_PATH = path.resolve(
    __dirname,
    "../src/resources/data/testData.xlsx",
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. Test-data rows (PaymentHistory sheet)
// ─────────────────────────────────────────────────────────────────────────────
const testDataRows = [
    // POSITIVE
    { TestID: "TC_PH_001", Description: "Verify Payment History page loads successfully",                        TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Page heading visible",            Run: "YES" },
    { TestID: "TC_PH_002", Description: "Verify Time Period dropdown displays all available options",            TimePeriod: "All",            Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "5 options visible",               Run: "YES" },
    { TestID: "TC_PH_003", Description: "Verify user can select Last 7 Days filter",                            TimePeriod: "Last 7 days",    Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_004", Description: "Verify user can select Last 15 Days filter",                           TimePeriod: "Last 15 days",   Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_005", Description: "Verify user can select Last 30 Days filter",                           TimePeriod: "Last 30 days",   Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_006", Description: "Verify user can select Last 3 Months filter",                          TimePeriod: "Last 3 Months",  Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_007", Description: "Verify user can select Last 6 Months filter",                          TimePeriod: "Last 6 Months",  Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_008", Description: "Verify Provider dropdown displays all providers",                       TimePeriod: "",               Provider: "All",                 PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "5 provider options visible",      Run: "YES" },
    { TestID: "TC_PH_009", Description: "Verify user can select Branch Office provider",                         TimePeriod: "",               Provider: "Branch Office",       PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_010", Description: "Verify user can select Fresh Market provider",                          TimePeriod: "",               Provider: "Fresh Market",        PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_011", Description: "Verify user can select Fresh Town Market provider",                     TimePeriod: "",               Provider: "Fresh Town Market",   PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_012", Description: "Verify user can select Green Market provider",                          TimePeriod: "",               Provider: "Green Market",        PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_013", Description: "Verify Payment Status dropdown displays all status values",             TimePeriod: "",               Provider: "",                    PaymentStatus: "All",       TransactionID: "",                    ExpectedResult: "5 status options visible",        Run: "YES" },
    { TestID: "TC_PH_014", Description: "Verify user can select Pending status",                                 TimePeriod: "",               Provider: "",                    PaymentStatus: "PENDING",   TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_015", Description: "Verify user can select Refunded status",                                TimePeriod: "",               Provider: "",                    PaymentStatus: "REFUNDED",  TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_016", Description: "Verify user can select Paid status",                                    TimePeriod: "",               Provider: "",                    PaymentStatus: "PAID",      TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_017", Description: "Verify user can select Cancelled status",                               TimePeriod: "",               Provider: "",                    PaymentStatus: "CANCELLED", TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_018", Description: "Verify user can select Failed status",                                  TimePeriod: "",               Provider: "",                    PaymentStatus: "FAILED",    TransactionID: "",                    ExpectedResult: "Filter applied, page stable",     Run: "YES" },
    { TestID: "TC_PH_019", Description: "Verify Search works using valid Transaction ID",                        TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "ORD-",                ExpectedResult: "Page stable, results shown",      Run: "YES" },
    { TestID: "TC_PH_020", Description: "Verify Search returns matching transaction details",                    TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "first-row-dynamic",   ExpectedResult: "Matching row shown",              Run: "YES" },
    { TestID: "TC_PH_021", Description: "Verify Refresh button reloads latest data",                             TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Page reloads, table loaded",      Run: "YES" },
    { TestID: "TC_PH_022", Description: "Verify KPI cards display values",                                       TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "All 3 KPI cards visible",         Run: "YES" },
    { TestID: "TC_PH_023", Description: "Verify Visible Transactions count is displayed",                        TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Non-empty numeric value",         Run: "YES" },
    { TestID: "TC_PH_024", Description: "Verify Visible Amount is displayed",                                    TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Non-empty currency value",        Run: "YES" },
    { TestID: "TC_PH_025", Description: "Verify Paid Transactions count is displayed",                           TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Non-empty numeric value",         Run: "YES" },
    { TestID: "TC_PH_026", Description: "Verify table loads transaction records",                                 TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Table with column headers shown", Run: "YES" },
    { TestID: "TC_PH_027", Description: "Verify Transaction ID column displays values",                          TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Column header & values present",  Run: "YES" },
    { TestID: "TC_PH_028", Description: "Verify Customer column displays values",                                TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Column header & values present",  Run: "YES" },
    { TestID: "TC_PH_029", Description: "Verify Payment Type column displays values",                            TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Column header & values present",  Run: "YES" },
    { TestID: "TC_PH_030", Description: "Verify Amount column displays values",                                  TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Column header & values present",  Run: "YES" },
    { TestID: "TC_PH_031", Description: "Verify Payment Status column displays values",                          TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Column header & values present",  Run: "YES" },
    { TestID: "TC_PH_032", Description: "Verify Date column displays values",                                    TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Column header & values present",  Run: "YES" },
    { TestID: "TC_PH_033", Description: "Verify filtered records update after Time Period selection",             TimePeriod: "Last 30 days",   Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Table refreshes after filter",    Run: "YES" },
    { TestID: "TC_PH_034", Description: "Verify filtered records update after Provider selection",               TimePeriod: "",               Provider: "All Providers",       PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Table refreshes after filter",    Run: "YES" },
    { TestID: "TC_PH_035", Description: "Verify filtered records update after Payment Status selection",         TimePeriod: "",               Provider: "",                    PaymentStatus: "PAID",      TransactionID: "",                    ExpectedResult: "Table refreshes after filter",    Run: "YES" },
    // NEGATIVE
    { TestID: "TC_PH_036", Description: "Verify Search with invalid Transaction ID shows no records found",      TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "INVALID-TXN-XYZ999999", ExpectedResult: "Empty state / no-results msg",  Run: "YES" },
    { TestID: "TC_PH_037", Description: "Verify Search with special characters is handled properly",             TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "!@#$%^&*()",          ExpectedResult: "Page remains stable",             Run: "YES" },
    { TestID: "TC_PH_038", Description: "Verify Search with blank value does not break the page",                TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "   ",                 ExpectedResult: "Page remains stable",             Run: "YES" },
    { TestID: "TC_PH_039", Description: "Verify page handles API failure gracefully",                            TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "No crash, graceful degradation",  Run: "YES" },
    { TestID: "TC_PH_040", Description: "Verify KPI cards show zero/default values when no data exists",         TimePeriod: "Last 7 days",    Provider: "Branch Office",       PaymentStatus: "FAILED",    TransactionID: "",                    ExpectedResult: "KPI cards visible, page stable",  Run: "YES" },
    { TestID: "TC_PH_041", Description: "Verify table handles empty dataset correctly",                          TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "EMPTY-DATASET-TEST-99999", ExpectedResult: "Page stable",               Run: "YES" },
    { TestID: "TC_PH_042", Description: "Verify Provider filter handles no matching records",                    TimePeriod: "",               Provider: "Green Market",        PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Page stable, empty or few rows",  Run: "YES" },
    { TestID: "TC_PH_043", Description: "Verify Payment Status filter handles no matching records",              TimePeriod: "",               Provider: "",                    PaymentStatus: "REFUNDED",  TransactionID: "",                    ExpectedResult: "Page stable, empty or few rows",  Run: "YES" },
    { TestID: "TC_PH_044", Description: "Verify Time Period filter handles no data scenario",                    TimePeriod: "Last 7 days",    Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Page stable",                     Run: "YES" },
    { TestID: "TC_PH_045", Description: "Verify rapid clicks on Refresh do not crash the application",           TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Page reloads, no crash",          Run: "YES" },
    { TestID: "TC_PH_046", Description: "Verify unauthorized user cannot access Payment History page",           TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Redirect to login page",          Run: "YES" },
    { TestID: "TC_PH_047", Description: "Verify application remains responsive with large datasets",             TimePeriod: "Last 6 Months",  Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Page stable, KPIs visible",       Run: "YES" },
    { TestID: "TC_PH_048", Description: "Verify dropdown selections persist correctly after refresh",            TimePeriod: "Last 30 days",   Provider: "",                    PaymentStatus: "",          TransactionID: "",                    ExpectedResult: "Filters present after reload",    Run: "YES" },
    { TestID: "TC_PH_049", Description: "Verify search field rejects excessively long input values",             TimePeriod: "",               Provider: "",                    PaymentStatus: "",          TransactionID: "A×500",               ExpectedResult: "Page stable, no crash",           Run: "YES" },
    { TestID: "TC_PH_050", Description: "Verify application handles network timeout gracefully",                  TimePeriod: "Last 3 Months",  Provider: "All Providers",       PaymentStatus: "PENDING",   TransactionID: "",                    ExpectedResult: "Graceful handling, no crash",     Run: "YES" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. Suite sheet rows (Payment History Regression)
// ─────────────────────────────────────────────────────────────────────────────
const suiteRows = [
    { TestName: "PaymentHistoryTest", Run: "YES", Mode: "serial" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. Write to workbook
// ─────────────────────────────────────────────────────────────────────────────
try {
    const wb = XLSX.readFile(EXCEL_PATH);

    // Remove old sheets if they already exist (idempotent)
    ["PaymentHistory", "Payment History Regression"].forEach((name) => {
        if (wb.SheetNames.includes(name)) {
            const idx = wb.SheetNames.indexOf(name);
            wb.SheetNames.splice(idx, 1);
            delete wb.Sheets[name];
            console.log(`Removed existing sheet: "${name}"`);
        }
    });

    // Add PaymentHistory data sheet
    const dataSheet = XLSX.utils.json_to_sheet(testDataRows);
    XLSX.utils.book_append_sheet(wb, dataSheet, "PaymentHistory");
    console.log(`Added sheet "PaymentHistory" with ${testDataRows.length} rows`);

    // Add regression/suite sheet
    const suiteSheet = XLSX.utils.json_to_sheet(suiteRows);
    XLSX.utils.book_append_sheet(wb, suiteSheet, "Payment History Regression");
    console.log(`Added sheet "Payment History Regression" with ${suiteRows.length} row(s)`);

    XLSX.writeFile(wb, EXCEL_PATH);
    console.log(`\ntestData.xlsx updated successfully at:\n  ${EXCEL_PATH}`);
} catch (err) {
    console.error("Failed to update testData.xlsx:", err.message);
    process.exit(1);
}
