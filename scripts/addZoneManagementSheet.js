/**
 * Adds (or replaces) the ZoneManagementTest sheet in testData.xlsx.
 * Run once: node scripts/addZoneManagementSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");

// Column headers match the pattern used across the project:
// TestID | Description | persona | Type | ZoneName | ZoneCode | Description | City | State | Status | ZipCode | ExpectedMessage | Issue

const rows = [
  // ── Page Load ──────────────────────────────────────────────────────────────
  { TestID:"TC01_PageLoadSuccess",         Description:"Verify Zone Management page loads successfully with zone list and configuration panel displayed.", persona:"tenant", Type:"Positive", ExpectedMessage:"Zone list visible",          Issue:"" },
  { TestID:"TC02_PageLoadAPIFailure",      Description:"Verify system handles page load failure gracefully when API response is unavailable.",              persona:"tenant", Type:"Negative", ExpectedMessage:"Graceful error or empty state", Issue:"" },
  // ── Search ────────────────────────────────────────────────────────────────
  { TestID:"TC03_SearchExistingZone",      Description:"Verify user can search an existing zone using the Search Zones field.",                            persona:"tenant", Type:"Positive", ZoneName:"QA_SEARCH_ZONE",    ZoneCode:"",       ExpectedMessage:"Zone found in list",       Issue:"" },
  { TestID:"TC04_SearchNonExistingZone",   Description:"Verify search with non-existing zone name returns no matching results.",                           persona:"tenant", Type:"Negative", ZoneName:"ZONE_NONEXISTENT_XYZ_99999", ZoneCode:"", ExpectedMessage:"No results message",   Issue:"" },
  // ── Zone Selection ────────────────────────────────────────────────────────
  { TestID:"TC05_SelectZoneLoadsDetails",  Description:"Verify selecting a zone from the left panel loads its details correctly.",                         persona:"tenant", Type:"Positive", ExpectedMessage:"Detail panel loaded",         Issue:"" },
  { TestID:"TC06_SelectInvalidZone",       Description:"Verify system prevents loading invalid zone records.",                                             persona:"tenant", Type:"Negative", ZoneName:"INVALID_ZONE_!!!", ZoneCode:"",       ExpectedMessage:"No results message",       Issue:"" },
  // ── Update / Edit Access ──────────────────────────────────────────────────
  { TestID:"TC07_ClickUpdateEntersEditMode", Description:"Verify user can click Update button and enter edit mode.",                                       persona:"tenant", Type:"Positive", ExpectedMessage:"Zone name input editable",    Issue:"" },
  { TestID:"TC08_UpdateButtonDisabledNoPermission", Description:"Verify Update button is disabled for users without edit permission.",                     persona:"tenant", Type:"Negative", ExpectedMessage:"Update button absent or disabled", Issue:"" },
  // ── Zone Name ─────────────────────────────────────────────────────────────
  { TestID:"TC09_ZoneNameValidAlphanumeric", Description:"Verify Zone Name accepts valid alphanumeric values.",                                            persona:"tenant", Type:"Positive", ZoneName:"QA_Zone_ValidName", ZoneCode:"",      ExpectedMessage:"Zone created",             Issue:"" },
  { TestID:"TC10_ZoneNameBlankBlocked",    Description:"Verify Zone Name cannot be saved when left blank.",                                               persona:"tenant", Type:"Negative", ZoneName:"",                 ZoneCode:"",       ExpectedMessage:"Validation error",         Issue:"" },
  // ── Zone Code ─────────────────────────────────────────────────────────────
  { TestID:"TC11_ZoneCodeValidUnique",     Description:"Verify Zone Code accepts valid unique code values.",                                               persona:"tenant", Type:"Positive", ZoneName:"",                 ZoneCode:"",       ExpectedMessage:"Zone created",             Issue:"" },
  { TestID:"TC12_ZoneCodeDuplicateRejected", Description:"Verify duplicate Zone Code is rejected during save operation.",                                 persona:"tenant", Type:"Negative", ZoneName:"",                 ZoneCode:"",       ExpectedMessage:"Duplicate code error",     Issue:"" },
  // ── Description ──────────────────────────────────────────────────────────
  { TestID:"TC13_DescriptionValidText",    Description:"Verify Description field accepts valid text input.",                                               persona:"tenant", Type:"Positive", ExpectedMessage:"Value accepted",             Issue:"" },
  { TestID:"TC14_DescriptionScriptBlocked", Description:"Verify Description field blocks unsupported special characters or scripts.",                     persona:"tenant", Type:"Negative", ExpectedMessage:"Script not executed",        Issue:"" },
  // ── City ──────────────────────────────────────────────────────────────────
  { TestID:"TC15_CityValidName",           Description:"Verify City field accepts valid city names.",                                                      persona:"tenant", Type:"Positive", City:"Mumbai",              ExpectedMessage:"Value accepted",             Issue:"" },
  { TestID:"TC16_CityEmptyBlocked",        Description:"Verify City field validation triggers when left empty.",                                           persona:"tenant", Type:"Negative", City:"",                    ExpectedMessage:"Validation error",           Issue:"" },
  // ── State ─────────────────────────────────────────────────────────────────
  { TestID:"TC17_StateValidName",          Description:"Verify State field accepts valid state names.",                                                    persona:"tenant", Type:"Positive", State:"Maharashtra",        ExpectedMessage:"Value accepted",             Issue:"" },
  { TestID:"TC18_StateEmptyBlocked",       Description:"Verify State field validation triggers when left empty.",                                          persona:"tenant", Type:"Negative", State:"",                   ExpectedMessage:"Validation error",           Issue:"" },
  // ── Status ────────────────────────────────────────────────────────────────
  { TestID:"TC19_StatusActiveSelection",   Description:"Verify Status dropdown allows selecting Active status.",                                           persona:"tenant", Type:"Positive", Status:"Active",            ExpectedMessage:"Zone created",               Issue:"" },
  { TestID:"TC20_StatusInvalidRejected",   Description:"Verify invalid status values cannot be submitted through UI manipulation.",                        persona:"tenant", Type:"Negative", Status:"INVALID_STATUS_99", ExpectedMessage:"Invalid value rejected",     Issue:"" },
  // ── Step 1 Navigation ────────────────────────────────────────────────────
  { TestID:"TC21_NextStep1NavigatesCoverage", Description:"Verify clicking Next from Zone Details navigates to Coverage Area tab.",                       persona:"tenant", Type:"Positive", ExpectedMessage:"ZIP code input visible",      Issue:"" },
  { TestID:"TC22_NextStep1BlockedIncomplete", Description:"Verify navigation is blocked when mandatory Zone Details fields are incomplete.",               persona:"tenant", Type:"Negative", ExpectedMessage:"Validation error shown",     Issue:"" },
  // ── ZIP Code ──────────────────────────────────────────────────────────────
  { TestID:"TC23_ZIPCodeValidAdded",       Description:"Verify user can add a valid ZIP Code in Coverage Area.",                                           persona:"tenant", Type:"Positive", ZipCode:"500085",           ExpectedMessage:"ZIP tag visible",            Issue:"" },
  { TestID:"TC24_ZIPCodeInvalidRejected",  Description:"Verify system rejects invalid ZIP Code formats.",                                                  persona:"tenant", Type:"Negative", ZipCode:"ABCDE",            ExpectedMessage:"Validation error",           Issue:"" },
  // ── Add ZIP ───────────────────────────────────────────────────────────────
  { TestID:"TC25_AddZIPSuccess",           Description:"Verify Add button successfully adds ZIP Code to coverage list.",                                   persona:"tenant", Type:"Positive", ZipCode:"500085",           ExpectedMessage:"ZIP tag visible",            Issue:"" },
  { TestID:"TC26_DuplicateZIPRejected",    Description:"Verify duplicate ZIP Codes cannot be added to the same zone.",                                    persona:"tenant", Type:"Negative", ZipCode:"500085",           ExpectedMessage:"Duplicate ZIP error",        Issue:"" },
  // ── Map Polygon ──────────────────────────────────────────────────────────
  { TestID:"TC27_PolygonDrawnSuccess",     Description:"Verify geographic polygon can be drawn successfully on the map.",                                  persona:"tenant", Type:"Positive", ExpectedMessage:"Map container visible",       Issue:"Requires map canvas interaction" },
  { TestID:"TC28_SaveBlockedNoPolygon",    Description:"Verify system prevents saving Coverage Area without polygon coordinates.",                         persona:"tenant", Type:"Negative", ExpectedMessage:"Step 2 blocked",             Issue:"" },
  // ── Coverage Summary ─────────────────────────────────────────────────────
  { TestID:"TC29_CoverageSummaryAfterZIP", Description:"Verify Coverage Summary updates after ZIP Code and polygon are added.",                           persona:"tenant", Type:"Positive", ZipCode:"500085",           ExpectedMessage:"Coverage Summary visible",   Issue:"" },
  { TestID:"TC30_CoverageSummaryAbsent",   Description:"Verify Coverage Summary is not generated when required coverage data is missing.",                persona:"tenant", Type:"Negative", ExpectedMessage:"Coverage Summary not shown", Issue:"" },
  // ── Step 2 Navigation ────────────────────────────────────────────────────
  { TestID:"TC31_NextStep2OpensSlotConfig", Description:"Verify clicking Next from Coverage Area opens Slot Configuration tab.",                          persona:"tenant", Type:"Positive", ExpectedMessage:"Slot toggle visible",        Issue:"" },
  { TestID:"TC32_NextStep2BlockedIncomplete", Description:"Verify user cannot proceed if Coverage Area data is incomplete.",                              persona:"tenant", Type:"Negative", ExpectedMessage:"Step 3 not visible",         Issue:"" },
  // ── Slot Toggle ──────────────────────────────────────────────────────────
  { TestID:"TC33_SlotBookingToggleEnabled", Description:"Verify Enable Slot Booking toggle can be enabled successfully.",                                  persona:"tenant", Type:"Positive", ExpectedMessage:"Toggle ON",                  Issue:"" },
  { TestID:"TC34_SlotBookingDisabledPrevents", Description:"Verify disabled slot booking prevents slot scheduling actions.",                              persona:"tenant", Type:"Negative", ExpectedMessage:"Time inputs not interactive", Issue:"" },
  // ── Operating Hours ──────────────────────────────────────────────────────
  { TestID:"TC35_OperatingHoursConfigured", Description:"Verify operating hours can be configured for Monday through Saturday.",                          persona:"tenant", Type:"Positive", ExpectedMessage:"Zone saved with slots",      Issue:"" },
  { TestID:"TC36_EndTimeBeforeStartRejected", Description:"Verify system rejects End Time earlier than Start Time.",                                      persona:"tenant", Type:"Negative", ExpectedMessage:"Validation error",           Issue:"" },
  // ── Default Capacity ─────────────────────────────────────────────────────
  { TestID:"TC37_CapacityValidNumeric",    Description:"Verify Default Capacity per Slot accepts valid numeric values.",                                   persona:"tenant", Type:"Positive", DefaultCapacity:"5",        ExpectedMessage:"Value accepted",             Issue:"" },
  { TestID:"TC38_CapacityZeroRejected",    Description:"Verify system rejects zero, negative, or non-numeric capacity values.",                           persona:"tenant", Type:"Negative", DefaultCapacity:"0",        ExpectedMessage:"Validation error",           Issue:"" },
  // ── Advance Booking Window ────────────────────────────────────────────────
  { TestID:"TC39_AdvanceBookingValid",     Description:"Verify Advance Booking Window accepts valid positive day values.",                                 persona:"tenant", Type:"Positive", AdvanceBookingDays:"7",     ExpectedMessage:"Value accepted",             Issue:"" },
  { TestID:"TC40_AdvanceBookingNegative",  Description:"Verify system rejects negative or excessively large booking window values.",                      persona:"tenant", Type:"Negative", AdvanceBookingDays:"-1",    ExpectedMessage:"Validation error",           Issue:"" },
  // ── Update Zone ──────────────────────────────────────────────────────────
  { TestID:"TC41_UpdateZoneSaved",         Description:"Verify updated zone details are saved successfully after clicking Update.",                        persona:"tenant", Type:"Positive", ExpectedMessage:"Zone updated",               Issue:"" },
  { TestID:"TC42_UpdateMissingFieldBlocked", Description:"Verify save operation fails when mandatory fields are missing during update.",                  persona:"tenant", Type:"Negative", ExpectedMessage:"Validation error",           Issue:"" },
  // ── Delete Zone ──────────────────────────────────────────────────────────
  { TestID:"TC43_DeleteZoneConfirmed",     Description:"Verify Delete button removes selected zone after confirmation.",                                   persona:"tenant", Type:"Positive", ExpectedMessage:"Zone absent from list",      Issue:"" },
  { TestID:"TC44_DeleteZoneCancelled",     Description:"Verify zone is not deleted when user cancels the delete confirmation.",                            persona:"tenant", Type:"Negative", ExpectedMessage:"Zone still in list",         Issue:"" },
  { TestID:"TC45_DeletedZoneAbsentSearch", Description:"Verify deleted zone no longer appears in search results.",                                        persona:"tenant", Type:"Positive", ExpectedMessage:"No results after deletion",  Issue:"" },
  { TestID:"TC46_DeleteBlockedActiveDependency", Description:"Verify system prevents deletion of zones linked with active dependencies.",                persona:"tenant", Type:"Negative", ExpectedMessage:"Dependency guard triggered", Issue:"" },
];

const wb = XLSX.readFile(FILE);
const wsData = [
  // Header row — must match the keys in rows above
  ["TestID","Description","persona","Type","ZoneName","ZoneCode","City","State","Status","ZipCode","DefaultCapacity","AdvanceBookingDays","ExpectedMessage","Issue"],
  ...rows.map(r => [
    r.TestID        || "",
    r.Description   || "",
    r.persona       || "tenant",
    r.Type          || "",
    r.ZoneName      !== undefined ? r.ZoneName      : "",
    r.ZoneCode      !== undefined ? r.ZoneCode      : "",
    r.City          !== undefined ? r.City          : "",
    r.State         !== undefined ? r.State         : "",
    r.Status        !== undefined ? r.Status        : "",
    r.ZipCode       !== undefined ? r.ZipCode       : "",
    r.DefaultCapacity !== undefined ? r.DefaultCapacity : "",
    r.AdvanceBookingDays !== undefined ? r.AdvanceBookingDays : "",
    r.ExpectedMessage|| "",
    r.Issue         || "",
  ]),
];

const ws = XLSX.utils.aoa_to_sheet(wsData);
// Remove old sheet if it exists, then add fresh
if (wb.SheetNames.includes("ZoneManagementTest")) {
  const idx = wb.SheetNames.indexOf("ZoneManagementTest");
  wb.SheetNames.splice(idx, 1);
  delete wb.Sheets["ZoneManagementTest"];
}
XLSX.utils.book_append_sheet(wb, ws, "ZoneManagementTest");
XLSX.writeFile(wb, FILE);
console.log(`Written ${rows.length} rows to ZoneManagementTest sheet in ${FILE}`);
