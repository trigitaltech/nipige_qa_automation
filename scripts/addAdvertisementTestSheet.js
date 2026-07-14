/**
 * Updates (or replaces) the "AdvertisementTest" sheet in testData.xlsx — 78 test cases.
 * Run once: node scripts/addAdvertisementTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "AdvertisementTest";

const rows = [
    // ── Advertisement Listing Screen ──
    {
        "TestID": "TC_ADV_01",
        "Issue": "13001",
        "Description": "Load Advertisement page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Advertisement page loads successfully with all filters and grid elements."
    },
    {
        "TestID": "TC_ADV_02",
        "Issue": "13002",
        "Description": "Verify all columns display correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All relevant advertisement data columns and action buttons render correctly."
    },
    {
        "TestID": "TC_ADV_03",
        "Issue": "13003",
        "Description": "Search advertisement by keyword.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching records displayed."
    },
    {
        "TestID": "TC_ADV_04",
        "Issue": "13004",
        "Description": "Filter by Advertisement Type.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Correct advertisements matching filtered type are displayed."
    },
    {
        "TestID": "TC_ADV_05",
        "Issue": "13005",
        "Description": "Click View icon.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "View Advertisement page opens successfully."
    },
    {
        "TestID": "TC_ADV_06",
        "Issue": "13006",
        "Description": "Click Edit icon.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Edit page opens with populated data."
    },
    {
        "TestID": "TC_ADV_07",
        "Issue": "13007",
        "Description": "Click Active toggle ON/OFF.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Status updated successfully."
    },
    {
        "TestID": "TC_ADV_08",
        "Issue": "13008",
        "Description": "Pagination Next button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Next page of advertisement records loads."
    },
    {
        "TestID": "TC_ADV_09",
        "Issue": "13009",
        "Description": "Refresh button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Latest records displayed."
    },
    {
        "TestID": "TC_ADV_10",
        "Issue": "13010",
        "Description": "Create Advertisement button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Create Advertisement page opens."
    },
    {
        "TestID": "TC_ADV_11",
        "Issue": "13011",
        "Description": "Search with invalid keyword.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "No records found message displayed."
    },
    {
        "TestID": "TC_ADV_12",
        "Issue": "13012",
        "Description": "Apply filter with no matching data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Empty result displayed."
    },
    {
        "TestID": "TC_ADV_13",
        "Issue": "13013",
        "Description": "Toggle status without permission.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access denied message."
    },
    {
        "TestID": "TC_ADV_14",
        "Issue": "13014",
        "Description": "Open deleted advertisement URL.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Advertisement not found."
    },
    {
        "TestID": "TC_ADV_15",
        "Issue": "13015",
        "Description": "Access page with expired session.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirect to login."
    },

    // ── Create Advertisement - Basic Info & Target ──
    {
        "TestID": "TC_ADV_16",
        "Issue": "13016",
        "Description": "Select Banner Type.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Type selected successfully."
    },
    {
        "TestID": "TC_ADV_17",
        "Issue": "13017",
        "Description": "Select Placement.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Placement selected successfully."
    },
    {
        "TestID": "TC_ADV_18",
        "Issue": "13018",
        "Description": "Select Visibility.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Visibility updated."
    },
    {
        "TestID": "TC_ADV_19",
        "Issue": "13019",
        "Description": "Enter valid Start Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Start date accepted."
    },
    {
        "TestID": "TC_ADV_20",
        "Issue": "13020",
        "Description": "Enter valid End Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "End date accepted."
    },
    {
        "TestID": "TC_ADV_21",
        "Issue": "13021",
        "Description": "Enable Advance Settings.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Additional fields displayed."
    },
    {
        "TestID": "TC_ADV_22",
        "Issue": "13022",
        "Description": "Select Target Location.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Location saved."
    },
    {
        "TestID": "TC_ADV_23",
        "Issue": "13023",
        "Description": "Enable Age Range.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Age fields enabled."
    },
    {
        "TestID": "TC_ADV_24",
        "Issue": "13024",
        "Description": "Enter valid Min Age.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Accepted."
    },
    {
        "TestID": "TC_ADV_25",
        "Issue": "13025",
        "Description": "Enter valid Max Age.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Accepted."
    },
    {
        "TestID": "TC_ADV_26",
        "Issue": "13026",
        "Description": "Leave Type blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shown."
    },
    {
        "TestID": "TC_ADV_27",
        "Issue": "13027",
        "Description": "Leave Placement blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shown."
    },
    {
        "TestID": "TC_ADV_28",
        "Issue": "13028",
        "Description": "Start Date > End Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_29",
        "Issue": "13029",
        "Description": "End Date before current date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_30",
        "Issue": "13030",
        "Description": "Min Age > Max Age.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_31",
        "Issue": "13031",
        "Description": "Min Age negative value.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_32",
        "Issue": "13032",
        "Description": "Enter alphabetic age value.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_33",
        "Issue": "13033",
        "Description": "Upload unsupported file type.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Upload blocked."
    },

    // ── Banner Details Screen ──
    {
        "TestID": "TC_ADV_34",
        "Issue": "13034",
        "Description": "Upload valid banner image.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Upload successful."
    },
    {
        "TestID": "TC_ADV_35",
        "Issue": "13035",
        "Description": "Select language.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Language selected."
    },
    {
        "TestID": "TC_ADV_36",
        "Issue": "13036",
        "Description": "Enter banner content.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Content saved."
    },
    {
        "TestID": "TC_ADV_37",
        "Issue": "13037",
        "Description": "Select Left text position.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Position applied."
    },
    {
        "TestID": "TC_ADV_38",
        "Issue": "13038",
        "Description": "Select Center text position.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Position applied."
    },
    {
        "TestID": "TC_ADV_39",
        "Issue": "13039",
        "Description": "Select Right text position.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Position applied."
    },
    {
        "TestID": "TC_ADV_40",
        "Issue": "13040",
        "Description": "Select Navigation URL.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "URL field displayed."
    },
    {
        "TestID": "TC_ADV_41",
        "Issue": "13041",
        "Description": "Upload unsupported image format",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_42",
        "Issue": "13042",
        "Description": "Upload image larger than allowed size.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_43",
        "Issue": "13043",
        "Description": "Leave content blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message."
    },
    {
        "TestID": "TC_ADV_44",
        "Issue": "13044",
        "Description": "Enter script tag in content.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "XSS prevented."
    },
    {
        "TestID": "TC_ADV_45",
        "Issue": "13045",
        "Description": "Enter invalid URL.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_46",
        "Issue": "13046",
        "Description": "Enter URL with unsupported protocol.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_47",
        "Issue": "13047",
        "Description": "Create Advertisement without image.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },
    {
        "TestID": "TC_ADV_48",
        "Issue": "13048",
        "Description": "Create Advertisement with mandatory fields missing.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error."
    },

    // ── View Advertisement Screen ──
    {
        "TestID": "TC_ADV_49",
        "Issue": "13049",
        "Description": "Open View page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Advertisement details displayed."
    },
    {
        "TestID": "TC_ADV_50",
        "Issue": "13050",
        "Description": "Verify Basic Details section.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Correct data shown."
    },
    {
        "TestID": "TC_ADV_51",
        "Issue": "13051",
        "Description": "Verify Media image.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Correct image displayed."
    },
    {
        "TestID": "TC_ADV_52",
        "Issue": "13052",
        "Description": "Verify Address & Target section.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Correct targeting data displayed."
    },
    {
        "TestID": "TC_ADV_53",
        "Issue": "13053",
        "Description": "Click Back button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Return to listing page."
    },
    {
        "TestID": "TC_ADV_54",
        "Issue": "13054",
        "Description": "Open invalid Advertisement ID.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Record not found."
    },
    {
        "TestID": "TC_ADV_55",
        "Issue": "13055",
        "Description": "Open deleted Advertisement.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Record not available."
    },
    {
        "TestID": "TC_ADV_56",
        "Issue": "13056",
        "Description": "User without permission opens page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access denied."
    },
    {
        "TestID": "TC_ADV_57",
        "Issue": "13057",
        "Description": "Broken image URL.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Placeholder image displayed."
    },
    {
        "TestID": "TC_ADV_58",
        "Issue": "13058",
        "Description": "Session expired while viewing.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirect to login."
    },

    // ── Edit Advertisement Screen ──
    {
        "TestID": "TC_ADV_59",
        "Issue": "13059",
        "Description": "Open Edit Advertisement page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Existing advertisement details loaded."
    },
    {
        "TestID": "TC_ADV_60",
        "Issue": "13060",
        "Description": "Update Visibility and save.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Changes saved successfully."
    },
    {
        "TestID": "TC_ADV_61",
        "Issue": "13061",
        "Description": "Update Start Date and End Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Valid dates accepted."
    },
    {
        "TestID": "TC_ADV_62",
        "Issue": "13062",
        "Description": "Upload valid banner icon/image.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Image uploaded successfully."
    },
    {
        "TestID": "TC_ADV_63",
        "Issue": "13063",
        "Description": "Click Continue button with valid data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigate to Banner Details step."
    },
    {
        "TestID": "TC_ADV_64",
        "Issue": "13064",
        "Description": "Leave mandatory Type field blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error displayed."
    },
    {
        "TestID": "TC_ADV_65",
        "Issue": "13065",
        "Description": "Leave Placement field blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error displayed."
    },
    {
        "TestID": "TC_ADV_66",
        "Issue": "13066",
        "Description": "End Date earlier than Start Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User cannot proceed."
    },
    {
        "TestID": "TC_ADV_67",
        "Issue": "13067",
        "Description": "Upload unsupported file format (.exe/.zip).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Upload rejected."
    },
    {
        "TestID": "TC_ADV_68",
        "Issue": "13068",
        "Description": "Enter Age Range Min greater than Max.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message displayed."
    },

    // ── Delete Advertisement Popup ──
    {
        "TestID": "TC_ADV_69",
        "Issue": "13069",
        "Description": "Open Delete popup.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Confirmation popup displayed."
    },
    {
        "TestID": "TC_ADV_70",
        "Issue": "13070",
        "Description": "Click \"Yes, delete it\"",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Advertisement deleted successfully."
    },
    {
        "TestID": "TC_ADV_71",
        "Issue": "13071",
        "Description": "Verify success message after deletion.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Success notification displayed."
    },
    {
        "TestID": "TC_ADV_72",
        "Issue": "13072",
        "Description": "Click Cancel button",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Popup closes."
    },
    {
        "TestID": "TC_ADV_73",
        "Issue": "13073",
        "Description": "Verify deleted advertisement removed from list.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Record no longer visible."
    },
    {
        "TestID": "TC_ADV_74",
        "Issue": "13074",
        "Description": "Click outside popup",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Popup behaves according to design (close/stay open)."
    },
    {
        "TestID": "TC_ADV_75",
        "Issue": "13075",
        "Description": "Double-click \"Yes, delete it\"",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Only one delete request processed."
    },
    {
        "TestID": "TC_ADV_76",
        "Issue": "13076",
        "Description": "Delete advertisement already deleted by another user.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Proper error message displayed."
    },
    {
        "TestID": "TC_ADV_77",
        "Issue": "13077",
        "Description": "Delete without permission.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Access denied message shown."
    },
    {
        "TestID": "TC_ADV_78",
        "Issue": "13078",
        "Description": "Network/API failure during delete",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message displayed and record remains."
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
