/**
 * Updates (or replaces) the "DeliverySetupTest" sheet in testData.xlsx — 68 test cases.
 * Run once: node scripts/addDeliverySetupTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "DeliverySetupTest";

const rows = [
    // ── Delivery Setup Listing Screen: Positive ──
    {
        "TestID": "TC_DS_01",
        "Issue": "12001",
        "Description": "Verify Delivery Setup page loads successfully",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Dashboard cards, search box, mode filter, table, and Create Delivery Setup button are displayed correctly"
    },
    {
        "TestID": "TC_DS_02",
        "Issue": "12002",
        "Description": "Verify delivery setup records are displayed in the grid",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Charge ID, City, Area Code, Dates, DWF, Rank, Transport Mode, and Actions are displayed correctly"
    },
    {
        "TestID": "TC_DS_03",
        "Issue": "12003",
        "Description": "Verify Search by City functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching records are displayed based on entered city name"
    },
    {
        "TestID": "TC_DS_04",
        "Issue": "12004",
        "Description": "Verify Search by Area Code functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching records are displayed based on entered area code"
    },
    {
        "TestID": "TC_DS_05",
        "Issue": "12005",
        "Description": "Verify Transport Mode filter functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only records matching the selected transport mode are displayed"
    },
    {
        "TestID": "TC_DS_06",
        "Issue": "12006",
        "Description": "Verify Create Delivery Setup button navigation",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected to Create Delivery Setup screen"
    },
    {
        "TestID": "TC_DS_07",
        "Issue": "12007",
        "Description": "Verify View, Edit, and Delete action buttons",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "View opens details page, Edit opens edit page, Delete removes record after confirmation"
    },
    {
        "TestID": "TC_DS_08",
        "Issue": "12008",
        "Description": "Verify dashboard summary cards data",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Total Setups, Active Setups, Transport Modes, and Avg Default Charge display correct values from backend"
    },

    // ── Delivery Setup Listing Screen: Negative ──
    {
        "TestID": "TC_DS_09",
        "Issue": "12009",
        "Description": "Search with non-existing city name",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"No Records Found\" message is displayed"
    },
    {
        "TestID": "TC_DS_10",
        "Issue": "12010",
        "Description": "Search with invalid area code",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "No matching records are displayed and system remains stable"
    },
    {
        "TestID": "TC_DS_11",
        "Issue": "12011",
        "Description": "Apply transport mode filter with no matching data",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty state is displayed without UI issues"
    },
    {
        "TestID": "TC_DS_12",
        "Issue": "12012",
        "Description": "Backend returns empty delivery setup list",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty table state is displayed properly"
    },
    {
        "TestID": "TC_DS_13",
        "Issue": "12013",
        "Description": "API failure while loading delivery setups",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message is displayed and page does not crash"
    },
    {
        "TestID": "TC_DS_14",
        "Issue": "12014",
        "Description": "Delete operation fails due to server error",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message displayed and record remains unchanged"
    },
    {
        "TestID": "TC_DS_15",
        "Issue": "12015",
        "Description": "User without permission accesses Delivery Setup page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access denied message or redirection occurs"
    },
    {
        "TestID": "TC_DS_16",
        "Issue": "12016",
        "Description": "Session expires while using the page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected to Login page and prompted to authenticate again"
    },

    // ── View Delivery Setup Screen: Positive ──
    {
        "TestID": "TC_DS_17",
        "Issue": "12017",
        "Description": "Verify View Delivery Setup page loads successfully with a valid Delivery Setup record",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All sections (Location Details, Charge Details, Distance Tiers) are displayed correctly"
    },
    {
        "TestID": "TC_DS_18",
        "Issue": "12018",
        "Description": "Verify all Location Details data is displayed correctly",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "State, City, Area, Transport Mode, Start Date, End Date, Category, and Rank match backend data"
    },
    {
        "TestID": "TC_DS_19",
        "Issue": "12019",
        "Description": "Verify Charge Details information",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Default Charge (DWF) and Delivery Owner values are displayed correctly"
    },
    {
        "TestID": "TC_DS_20",
        "Issue": "12020",
        "Description": "Verify Distance Tier information",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Tier Name, Start KM, End KM, Start KG, End KG, Customer Cost, Delivery Cost, and Time are displayed correctly"
    },
    {
        "TestID": "TC_DS_21",
        "Issue": "12021",
        "Description": "Verify Back button functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected back to the Delivery Setup Listing page"
    },
    {
        "TestID": "TC_DS_22",
        "Issue": "12022",
        "Description": "Verify data consistency across screens",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Values shown on View screen match values from Listing/Edit screens and API response"
    },

    // ── View Delivery Setup Screen: Negative ──
    {
        "TestID": "TC_DS_23",
        "Issue": "12023",
        "Description": "Open View page using an invalid Delivery Setup ID",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"Record Not Found\" message is displayed and page remains stable"
    },
    {
        "TestID": "TC_DS_24",
        "Issue": "12024",
        "Description": "API returns failure while loading setup details",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Appropriate error message is displayed without UI crash"
    },
    {
        "TestID": "TC_DS_25",
        "Issue": "12025",
        "Description": "Mandatory data missing from API response (e.g., City, Transport Mode, DWF)",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Application handles missing data gracefully with placeholders or empty values"
    },
    {
        "TestID": "TC_DS_26",
        "Issue": "12026",
        "Description": "Delivery Setup record has no Distance Tier data",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty state message is displayed in Distance Tiers section"
    },
    {
        "TestID": "TC_DS_27",
        "Issue": "12027",
        "Description": "Unauthorized user attempts to access View screen directly via URL",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access denied message or redirection occurs"
    },
    {
        "TestID": "TC_DS_28",
        "Issue": "12028",
        "Description": "User session expires while viewing the page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User is redirected to Login page and prompted to log in again"
    },

    // ── Edit Delivery Setup Screen: Positive ──
    {
        "TestID": "TC_DS_29",
        "Issue": "12029",
        "Description": "Verify successful update with valid data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delivery setup is updated successfully."
    },
    {
        "TestID": "TC_DS_30",
        "Issue": "12030",
        "Description": "Verify successful update when \"Applied for all states\" and \"Applied for all cities\" are selected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delivery setup is updated successfully for all states and cities."
    },
    {
        "TestID": "TC_DS_31",
        "Issue": "12031",
        "Description": "Verify successful addition of a valid distance tier.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Distance tier is added to setup successfully."
    },
    {
        "TestID": "TC_DS_32",
        "Issue": "12032",
        "Description": "Verify multiple distance tiers can be added.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Multiple distance tiers are added successfully."
    },
    {
        "TestID": "TC_DS_33",
        "Issue": "12033",
        "Description": "Verify Transport Mode and Rank selections are saved successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Transport Mode and Rank are saved correctly."
    },
    {
        "TestID": "TC_DS_34",
        "Issue": "12034",
        "Description": "Verify successful update when Start Date is before End Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delivery setup is updated successfully."
    },

    // ── Edit Delivery Setup Screen: Negative ──
    {
        "TestID": "TC_DS_35",
        "Issue": "12035",
        "Description": "Verify validation when Area Code is empty.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows Area Code is required."
    },
    {
        "TestID": "TC_DS_36",
        "Issue": "12036",
        "Description": "Verify validation when End Date is earlier than Start Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears indicating invalid date range."
    },
    {
        "TestID": "TC_DS_37",
        "Issue": "12037",
        "Description": "Verify validation when Customer Cost contains alphabetic characters.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error on Customer Cost."
    },
    {
        "TestID": "TC_DS_38",
        "Issue": "12038",
        "Description": "Verify validation when Start Range KM is greater than End Range KM.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows range is invalid."
    },
    {
        "TestID": "TC_DS_39",
        "Issue": "12039",
        "Description": "Verify validation when Start Range KG is greater than End Range KG.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows range is invalid."
    },
    {
        "TestID": "TC_DS_40",
        "Issue": "12040",
        "Description": "Verify validation when mandatory fields are left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows mandatory fields are required."
    },

    // ── Delete Delivery Setup Screen: Positive ──
    {
        "TestID": "TC_DS_41",
        "Issue": "12041",
        "Description": "Open Delivery Setup page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Page loads successfully with summary cards, search bar, filter dropdown, and setup grid displayed"
    },
    {
        "TestID": "TC_DS_42",
        "Issue": "12042",
        "Description": "Search using a valid City name or Area Code",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching delivery setup record(s) displayed"
    },
    {
        "TestID": "TC_DS_43",
        "Issue": "12043",
        "Description": "Filter records using a valid Transport Mode from \"All Modes\" dropdown",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only records matching the selected transport mode are displayed"
    },
    {
        "TestID": "TC_DS_44",
        "Issue": "12044",
        "Description": "Click View (Eye) icon for an existing setup",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Setup details page/modal opens successfully"
    },
    {
        "TestID": "TC_DS_45",
        "Issue": "12045",
        "Description": "Click Edit (Pencil) icon and update valid data",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delivery setup updated successfully and reflected in the grid"
    },
    {
        "TestID": "TC_DS_46",
        "Issue": "12046",
        "Description": "Click Delete icon → Click \"Yes, delete it!\"",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Setup deleted successfully and record removed from the grid"
    },

    // ── Delete Delivery Setup Screen: Negative ──
    {
        "TestID": "TC_DS_47",
        "Issue": "12047",
        "Description": "Search using invalid/non-existing City or Area Code",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "No records found message displayed"
    },
    {
        "TestID": "TC_DS_48",
        "Issue": "12048",
        "Description": "Enter special characters only in Search field (e.g., @#$%^&)",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "No matching records returned; application remains stable"
    },
    {
        "TestID": "TC_DS_49",
        "Issue": "12049",
        "Description": "Apply a Transport Mode filter with no matching records",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty state or \"No Data Found\" message displayed"
    },
    {
        "TestID": "TC_DS_50",
        "Issue": "12050",
        "Description": "Click Delete icon → Click Cancel",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delete operation is cancelled and record remains unchanged"
    },
    {
        "TestID": "TC_DS_51",
        "Issue": "12051",
        "Description": "Attempt to access View page for a deleted/non-existing setup via URL manipulation",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Appropriate error message or access denied page displayed"
    },
    {
        "TestID": "TC_DS_52",
        "Issue": "12052",
        "Description": "Double-click \"Yes, delete it!\" rapidly during deletion",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only one delete request processed; no duplicate actions or system error"
    },

    // ── Create Delivery Setup Screen: Positive ──
    {
        "TestID": "TC_DS_53",
        "Issue": "12053",
        "Description": "Verify user can create a Delivery Setup by entering all valid mandatory fields and clicking Save Setup.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delivery Setup is saved successfully and user returns to list."
    },
    {
        "TestID": "TC_DS_54",
        "Issue": "12054",
        "Description": "Verify user can select specific State, City, Source State, and Source City successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Selected location values are stored correctly."
    },
    {
        "TestID": "TC_DS_55",
        "Issue": "12055",
        "Description": "Verify user can enable Applied for all states/cities and the corresponding fields are auto-populated or disabled.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Applied for all settings are enabled and validated correctly."
    },
    {
        "TestID": "TC_DS_56",
        "Issue": "12056",
        "Description": "Verify user can add valid Distance Tier details (Distance Range, Weight Range, Cost, Expected Delivery Time) and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Distance Tier is added and saved successfully."
    },
    {
        "TestID": "TC_DS_57",
        "Issue": "12057",
        "Description": "Verify user can create multiple Distance Tiers using the \"+\" button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Multiple Distance Tier forms are added correctly."
    },
    {
        "TestID": "TC_DS_58",
        "Issue": "12058",
        "Description": "Verify Start Date and End Date accept valid future dates and save successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Future dates are accepted and saved successfully."
    },
    {
        "TestID": "TC_DS_59",
        "Issue": "12059",
        "Description": "Verify Delivery by me checkbox can be selected/deselected successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Checkbox state is saved successfully."
    },
    {
        "TestID": "TC_DS_60",
        "Issue": "12060",
        "Description": "Verify Category, Transport Mode, and Rank dropdowns display available options and allow valid selection.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All selections are made and saved successfully."
    },

    // ── Create Delivery Setup Screen: Negative ──
    {
        "TestID": "TC_DS_61",
        "Issue": "12061",
        "Description": "Verify validation message appears when user clicks Save Setup without selecting Category.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows Category is required and save is blocked."
    },
    {
        "TestID": "TC_DS_62",
        "Issue": "12062",
        "Description": "Verify validation message appears when Start Date is greater than End Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows Start Date must be before End Date."
    },
    {
        "TestID": "TC_DS_63",
        "Issue": "12063",
        "Description": "Verify validation message appears when mandatory fields (State, City, Category, Transport Mode, Rank) are left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displays all blank required fields."
    },
    {
        "TestID": "TC_DS_64",
        "Issue": "12064",
        "Description": "Verify system does not allow saving when Distance Tier Name is empty.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displays and save is blocked."
    },
    {
        "TestID": "TC_DS_65",
        "Issue": "12065",
        "Description": "Verify system displays validation when Start Range (KM) is greater than End Range (KM).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displays on Start Range KM."
    },
    {
        "TestID": "TC_DS_66",
        "Issue": "12066",
        "Description": "Verify system displays validation when Start Range (KG) is greater than End Range (KG).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displays on Start Range KG."
    },
    {
        "TestID": "TC_DS_67",
        "Issue": "12067",
        "Description": "Verify system does not accept negative values in Delivery Cost, Customer Cost, Distance Range, or Weight Range fields.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displays on negative values."
    },
    {
        "TestID": "TC_DS_68",
        "Issue": "12068",
        "Description": "Verify system prevents saving when non-numeric values (letters/special characters) are entered into numeric fields such as KM, KG, Cost, or Time (Days).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displays on non-numeric inputs."
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
