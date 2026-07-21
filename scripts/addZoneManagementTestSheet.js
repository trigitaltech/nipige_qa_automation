/**
 * Updates (or replaces) the "ZoneManagementTest" sheet in testData.xlsx — 46 test cases.
 * Run once: node scripts/addZoneManagementTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "ZoneManagementTest";

const rows = [
    {
        "TestID": "TC01_PageLoadSuccess",
        "Issue": "19001",
        "Description": "Verify Zone Management page loads successfully with zone list and configuration panel displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Search Zones field must be visible.",
        "ExpectedMessage": "Search Zones field must be visible."
    },
    {
        "TestID": "TC02_PageLoadAPIFailure",
        "Issue": "19002",
        "Description": "Verify system handles page load failure gracefully when API response is unavailable.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "API requests error is caught gracefully.",
        "ExpectedMessage": "API requests error is caught gracefully."
    },
    {
        "TestID": "TC03_SearchExistingZone",
        "Issue": "19003",
        "Description": "Verify user can search an existing zone using the Search Zones field.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching zone is found and displayed in listing."
    },
    {
        "TestID": "TC04_SearchNonExistingZone",
        "Issue": "19004",
        "Description": "Verify search with non-existing zone name returns no matching results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "No zone results message or empty list is displayed."
    },
    {
        "TestID": "TC05_SelectZoneLoadsDetails",
        "Issue": "19005",
        "Description": "Verify selecting a zone from the left panel loads its details correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Zone Details panel loads with values matching the selected zone."
    },
    {
        "TestID": "TC06_SelectInvalidZone",
        "Issue": "19006",
        "Description": "Verify system prevents loading invalid zone records.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "No zone is loaded and system remains stable."
    },
    {
        "TestID": "TC07_ClickUpdateEntersEditMode",
        "Issue": "19007",
        "Description": "Verify user can click Update button and enter edit mode.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Save button is visible.",
        "ExpectedMessage": "Save button is visible."
    },
    {
        "TestID": "TC08_UpdateButtonDisabledNoPermission",
        "Issue": "19008",
        "Description": "Verify Update button is disabled for users without edit permission.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Update button is disabled or hidden.",
        "ExpectedMessage": "Update button is disabled or hidden."
    },
    {
        "TestID": "TC09_ZoneNameValidAlphanumeric",
        "Issue": "19009",
        "Description": "Verify Zone Name accepts valid alphanumeric values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Alphanumeric zone name is saved successfully."
    },
    {
        "TestID": "TC10_ZoneNameBlankBlocked",
        "Issue": "19010",
        "Description": "Verify Zone Name cannot be saved when left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows Name is required."
    },
    {
        "TestID": "TC11_ZoneCodeValidUnique",
        "Issue": "19011",
        "Description": "Verify Zone Code accepts valid unique code values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Unique zone code is accepted."
    },
    {
        "TestID": "TC12_ZoneCodeDuplicateRejected",
        "Issue": "19012",
        "Description": "Verify duplicate Zone Code is rejected during save operation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate zone code error displays and save is blocked."
    },
    {
        "TestID": "TC13_DescriptionValidText",
        "Issue": "19013",
        "Description": "Verify Description field accepts valid text input.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Valid description text 123",
        "ExpectedMessage": "Valid description text 123"
    },
    {
        "TestID": "TC14_DescriptionScriptBlocked",
        "Issue": "19014",
        "Description": "Verify Description field blocks unsupported special characters or scripts.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Alert check passes (no XSS executing)",
        "ExpectedMessage": "Alert check passes (no XSS executing)"
    },
    {
        "TestID": "TC15_CityValidName",
        "Issue": "19015",
        "Description": "Verify City field accepts valid city names.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Mumbai",
        "ExpectedMessage": "Mumbai",
        "City": "Mumbai"
    },
    {
        "TestID": "TC16_CityEmptyBlocked",
        "Issue": "19016",
        "Description": "Verify City field validation triggers when left empty.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows City is required."
    },
    {
        "TestID": "TC17_StateValidName",
        "Issue": "19017",
        "Description": "Verify State field accepts valid state names.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Maharashtra",
        "ExpectedMessage": "Maharashtra",
        "State": "Maharashtra"
    },
    {
        "TestID": "TC18_StateEmptyBlocked",
        "Issue": "19018",
        "Description": "Verify State field validation triggers when left empty.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows State is required."
    },
    {
        "TestID": "TC19_StatusActiveSelection",
        "Issue": "19019",
        "Description": "Verify Status dropdown allows selecting Active status.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Active status selected successfully."
    },
    {
        "TestID": "TC20_StatusInvalidRejected",
        "Issue": "19020",
        "Description": "Verify invalid status values cannot be submitted through UI manipulation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Save fails on invalid status submission."
    },
    {
        "TestID": "TC21_NextStep1NavigatesCoverage",
        "Issue": "19021",
        "Description": "Verify clicking Next from Zone Details navigates to Coverage Area tab.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigates to Step 2 Coverage Area tab."
    },
    {
        "TestID": "TC22_NextStep1BlockedIncomplete",
        "Issue": "19022",
        "Description": "Verify navigation is blocked when mandatory Zone Details fields are incomplete.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Required field highlights appear and user remains on Step 1."
    },
    {
        "TestID": "TC23_ZIPCodeValidAdded",
        "Issue": "19023",
        "Description": "Verify user can add a valid ZIP Code in Coverage Area.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "ZIP code is accepted and listed.",
        "ZipCode": "400001"
    },
    {
        "TestID": "TC24_ZIPCodeInvalidRejected",
        "Issue": "19024",
        "Description": "Verify system rejects invalid ZIP Code formats.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows ZIP format is invalid."
    },
    {
        "TestID": "TC25_AddZIPSuccess",
        "Issue": "19025",
        "Description": "Verify Add button successfully adds ZIP Code to coverage list.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "ZIP code is added to grid list."
    },
    {
        "TestID": "TC26_DuplicateZIPRejected",
        "Issue": "19026",
        "Description": "Verify duplicate ZIP Codes cannot be added to the same zone.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Warning indicates duplicate ZIP code."
    },
    {
        "TestID": "TC27_PolygonDrawnSuccess",
        "Issue": "19027",
        "Description": "Verify geographic polygon can be drawn successfully on the map.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Polygon coordinates are captured successfully."
    },
    {
        "TestID": "TC28_SaveBlockedNoPolygon",
        "Issue": "19028",
        "Description": "Verify system prevents saving Coverage Area without polygon coordinates.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation warning prevents navigating to Step 3."
    },
    {
        "TestID": "TC29_CoverageSummaryAfterZIP",
        "Issue": "19029",
        "Description": "Verify Coverage Summary updates after ZIP Code and polygon are added.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Summary info renders correctly."
    },
    {
        "TestID": "TC30_CoverageSummaryAbsent",
        "Issue": "19030",
        "Description": "Verify Coverage Summary is not generated when required coverage data is missing.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Summary panel remains blank or shows no data."
    },
    {
        "TestID": "TC31_NextStep2OpensSlotConfig",
        "Issue": "19031",
        "Description": "Verify clicking Next from Coverage Area opens Slot Configuration tab.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigates to Step 3 Slot Configuration."
    },
    {
        "TestID": "TC32_NextStep2BlockedIncomplete",
        "Issue": "19032",
        "Description": "Verify user cannot proceed if Coverage Area data is incomplete.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Save/Next blocked and highlights coverage fields."
    },
    {
        "TestID": "TC33_SlotBookingToggleEnabled",
        "Issue": "19033",
        "Description": "Verify Enable Slot Booking toggle can be enabled successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Slot booking schedule configuration options are displayed."
    },
    {
        "TestID": "TC34_SlotBookingDisabledPrevents",
        "Issue": "19034",
        "Description": "Verify disabled slot booking prevents slot scheduling actions.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Slot timing forms are hidden or read-only."
    },
    {
        "TestID": "TC35_OperatingHoursConfigured",
        "Issue": "19035",
        "Description": "Verify operating hours can be configured for Monday through Saturday.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Operating hours schedules saved correctly."
    },
    {
        "TestID": "TC36_EndTimeBeforeStartRejected",
        "Issue": "19036",
        "Description": "Verify system rejects End Time earlier than Start Time.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows End Time must be later than Start Time."
    },
    {
        "TestID": "TC37_CapacityValidNumeric",
        "Issue": "19037",
        "Description": "Verify Default Capacity per Slot accepts valid numeric values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Default capacity is updated.",
        "DefaultCapacity": "5"
    },
    {
        "TestID": "TC38_CapacityZeroRejected",
        "Issue": "19038",
        "Description": "Verify system rejects zero, negative, or non-numeric capacity values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error shows capacity must be positive numeric."
    },
    {
        "TestID": "TC39_AdvanceBookingValid",
        "Issue": "19039",
        "Description": "Verify Advance Booking Window accepts valid positive day values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Booking window updated.",
        "AdvanceBookingDays": "21"
    },
    {
        "TestID": "TC40_AdvanceBookingNegative",
        "Issue": "19040",
        "Description": "Verify system rejects negative or excessively large booking window values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error displays on booking window field."
    },
    {
        "TestID": "TC41_UpdateZoneSaved",
        "Issue": "19041",
        "Description": "Verify updated zone details are saved successfully after clicking Update.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Success toast is displayed and changes persist."
    },
    {
        "TestID": "TC42_UpdateMissingFieldBlocked",
        "Issue": "19042",
        "Description": "Verify save operation fails when mandatory fields are missing during update.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error displays and update is blocked."
    },
    {
        "TestID": "TC43_DeleteZoneConfirmed",
        "Issue": "19043",
        "Description": "Verify Delete button removes selected zone after confirmation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Zone is deleted successfully."
    },
    {
        "TestID": "TC44_DeleteZoneCancelled",
        "Issue": "19044",
        "Description": "Verify zone is not deleted when user cancels the delete confirmation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Confirmation closes and zone is retained."
    },
    {
        "TestID": "TC45_DeletedZoneAbsentSearch",
        "Issue": "19045",
        "Description": "Verify deleted zone no longer appears in search results.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Search returns no matching results."
    },
    {
        "TestID": "TC46_DeleteBlockedActiveDependency",
        "Issue": "19046",
        "Description": "Verify system prevents deletion of zones linked with active dependencies.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation blocks deletion with dependency toast warning."
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
    "City",
    "State",
    "ZipCode",
    "DefaultCapacity",
    "AdvanceBookingDays",
    "ExpectedMessage"
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
