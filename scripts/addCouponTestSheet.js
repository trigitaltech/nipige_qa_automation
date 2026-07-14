/**
 * Updates (or replaces) the "CouponTest" sheet in testData.xlsx — 36 test cases.
 * Run once: node scripts/addCouponTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "CouponTest";

const rows = [
    // ── Listing Screen Positive Test Cases ───────────────────────────────────
    {
        "TestID": "TC_LIST_01",
        "Issue": "5001",
        "Description": "Verify Coupons & Promotions page loads successfully",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dashboard cards, search bar, filters, coupon table, and Create Coupon button are displayed correctly"
    },
    {
        "TestID": "TC_LIST_02",
        "Issue": "5002",
        "Description": "Verify coupon records are displayed in the grid",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Coupon code, applicable on, value, dates, status, and action icons are shown correctly"
    },
    {
        "TestID": "TC_LIST_03",
        "Issue": "5003",
        "Description": "Verify Search by Coupon Code functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching coupon records are displayed based on entered coupon code"
    },
    {
        "TestID": "TC_LIST_04",
        "Issue": "5004",
        "Description": "Verify Status Filter functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only coupons matching the selected status are displayed"
    },
    {
        "TestID": "TC_LIST_05",
        "Issue": "5005",
        "Description": "Verify Period Filter functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Coupons within the selected period are displayed correctly"
    },
    {
        "TestID": "TC_LIST_06",
        "Issue": "5006",
        "Description": "Verify Create Coupon button navigation",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected to the Create Coupon screen"
    },
    {
        "TestID": "TC_LIST_07",
        "Issue": "5007",
        "Description": "Verify View/Edit/Delete action buttons",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Each action opens the correct page or performs the expected operation"
    },
    {
        "TestID": "TC_LIST_08",
        "Issue": "5008",
        "Description": "Verify dashboard summary cards data",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Coupons, Approved, Pending, and Total Value match backend data"
    },

    // ── Listing Screen Negative Test Cases ───────────────────────────────────
    {
        "TestID": "TC_LIST_09",
        "Issue": "5009",
        "Description": "Search using a non-existing coupon code",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"No Records Found\" message is displayed"
    },
    {
        "TestID": "TC_LIST_10",
        "Issue": "5010",
        "Description": "Apply filter combination with no matching records",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty state is displayed without UI issues"
    },
    {
        "TestID": "TC_LIST_11",
        "Issue": "5011",
        "Description": "Backend returns empty coupon list",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Table displays empty state and page remains functional"
    },
    {
        "TestID": "TC_LIST_12",
        "Issue": "5012",
        "Description": "API failure while loading coupon list",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Appropriate error message is displayed and page does not crash"
    },
    {
        "TestID": "TC_LIST_13",
        "Issue": "5013",
        "Description": "User without coupon permissions accesses page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access denied message or redirection occurs"
    },
    {
        "TestID": "TC_LIST_14",
        "Issue": "5014",
        "Description": "Delete coupon API fails",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message displayed and coupon remains in the list"
    },
    {
        "TestID": "TC_LIST_15",
        "Issue": "5015",
        "Description": "Session expires while on listing page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected to Login screen"
    },
    {
        "TestID": "TC_LIST_16",
        "Issue": "5016",
        "Description": "Invalid or corrupted coupon data returned from API",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "System handles invalid data gracefully without breaking UI"
    },

    // ── Coupon View Screen Positive Test Cases ───────────────────────────────
    {
        "TestID": "TC_VIEW_01",
        "Issue": "5017",
        "Description": "Verify Coupon View screen loads successfully with valid coupon ID",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Coupon details, value summary, options, status, and buttons are displayed correctly"
    },
    {
        "TestID": "TC_VIEW_02",
        "Issue": "5018",
        "Description": "Verify all coupon information matches backend data",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Coupon code, dates, reward value, order value, limits, and options match API/database values"
    },
    {
        "TestID": "TC_VIEW_03",
        "Issue": "5019",
        "Description": "Verify Edit button functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected to the Edit Coupon screen with correct coupon data populated"
    },
    {
        "TestID": "TC_VIEW_04",
        "Issue": "5020",
        "Description": "Verify Back button functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is navigated back to the Coupon Listing page successfully"
    },
    {
        "TestID": "TC_VIEW_05",
        "Issue": "5021",
        "Description": "Verify screen rendering for approved coupon",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Approved badge, reward values, dates, and all sections are displayed correctly without UI issues"
    },

    // ── Coupon View Screen Negative Test Cases ───────────────────────────────
    {
        "TestID": "TC_VIEW_06",
        "Issue": "5022",
        "Description": "Open Coupon View page with invalid coupon ID",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"Coupon Not Found\" message is displayed and screen does not crash"
    },
    {
        "TestID": "TC_VIEW_07",
        "Issue": "5023",
        "Description": "API returns 500/Internal Server Error while loading coupon details",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Proper error message is displayed and user remains on a stable page"
    },
    {
        "TestID": "TC_VIEW_08",
        "Issue": "5024",
        "Description": "User without View Coupon permission accesses the page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access Denied message or redirection to an authorized page"
    },
    {
        "TestID": "TC_VIEW_09",
        "Issue": "5025",
        "Description": "Required coupon fields (Reward Value, Dates, Coupon Code) are missing from API response",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Application handles missing data gracefully without UI breaking"
    },
    {
        "TestID": "TC_VIEW_10",
        "Issue": "5026",
        "Description": "User session expires while viewing the coupon",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected to Login page and prompted to re-authenticate"
    },

    // ── Create Coupon Screen Positive Test Cases ─────────────────────────────
    {
        "TestID": "TC_CREATE_01",
        "Issue": "5027",
        "Description": "Valid coupon code, title, dates, reward value, min order value, terms",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Coupon is created successfully and success message is displayed"
    },
    {
        "TestID": "TC_CREATE_02",
        "Issue": "5028",
        "Description": "Fill all fields including frequency, quantity limits, order limits, toggles ON",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Coupon is saved successfully and all values are stored correctly"
    },
    {
        "TestID": "TC_CREATE_03",
        "Issue": "5029",
        "Description": "Multi-Discount, Promote, Auto Apply",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Selected settings are saved and reflected in coupon details"
    },
    {
        "TestID": "TC_CREATE_04",
        "Issue": "5030",
        "Description": "Start Date = Today, End Date = Future Date",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Coupon is created successfully"
    },
    {
        "TestID": "TC_CREATE_05",
        "Issue": "5031",
        "Description": "Enter valid positive numbers in reward value, max reward, quantity, frequency fields",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Form accepts values and saves successfully"
    },

    // ── Create Coupon Screen Negative Test Cases ─────────────────────────────
    {
        "TestID": "TC_CREATE_06",
        "Issue": "5032",
        "Description": "Leave required fields blank and click Save Coupon",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Required field validation messages are displayed and coupon is not created"
    },
    {
        "TestID": "TC_CREATE_07",
        "Issue": "5033",
        "Description": "Use an existing coupon code",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message displayed indicating coupon code already exists"
    },
    {
        "TestID": "TC_CREATE_08",
        "Issue": "5034",
        "Description": "Start Date = 12/31/2026, End Date = 12/01/2026",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error displayed and save is blocked"
    },
    {
        "TestID": "TC_CREATE_09",
        "Issue": "5035",
        "Description": "Negative reward value, negative quantity, text in numeric fields",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error displayed and save is blocked"
    },
    {
        "TestID": "TC_CREATE_10",
        "Issue": "5036",
        "Description": "Leave Terms & Conditions empty and click Save",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displayed and coupon is not created"
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
