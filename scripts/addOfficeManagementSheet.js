/**
 * Creates (or replaces) the OfficeManagement sheet in testData.xlsx — 76 test cases.
 * Run once: node scripts/addOfficeManagementSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "OfficeManagement";

const rows = [
    // ── Phase 1: Office Create — Step 1: Office (5 positive) ──────────────────
    { "Test Case ID": "TC_OM_001", Description: "Verify user can create an Office successfully with all mandatory fields populated with valid data.", persona: "tenant", Type: "Positive", ExpectedMessage: "Partner details submitted successfully!", Issue: "" },
    { "Test Case ID": "TC_OM_002", Description: "Verify office type dropdown displays all available office types and allows selection.", persona: "tenant", Type: "Positive", ExpectedMessage: "Dropdown has options", Issue: "" },
    { "Test Case ID": "TC_OM_003", Description: "Verify user can add multiple valid email addresses using the Add New button.", persona: "tenant", Type: "Positive", ExpectedMessage: "Email inputs/tags visible", Issue: "" },
    { "Test Case ID": "TC_OM_004", Description: "Verify Google address selection auto-populates City, State, Country, and Zip Code fields correctly.", persona: "tenant", Type: "Positive", ExpectedMessage: "Address fields auto-populated", Issue: "" },
    { "Test Case ID": "TC_OM_005", Description: "Verify clicking Next navigates to the Organization step when all required fields are valid.", persona: "tenant", Type: "Positive", ExpectedMessage: "Step 2 Organization visible", Issue: "" },
    // ── Phase 1: Office Create — Step 1: Office (5 negative) ──────────────────
    { "Test Case ID": "TC_OM_006", Description: "Verify validation error is displayed when Email field contains an invalid email format.", persona: "tenant", Type: "Negative", ExpectedMessage: "Email validation error", Issue: "" },
    { "Test Case ID": "TC_OM_007", Description: "Verify validation error is displayed when Phone field contains invalid or insufficient digits.", persona: "tenant", Type: "Negative", ExpectedMessage: "Phone validation error", Issue: "" },
    { "Test Case ID": "TC_OM_008", Description: "Verify user cannot proceed to the next step when mandatory fields are left blank.", persona: "tenant", Type: "Negative", ExpectedMessage: "Mandatory field validation shown", Issue: "" },
    { "Test Case ID": "TC_OM_009", Description: "Verify duplicate email address addition is prevented and appropriate error message is shown.", persona: "tenant", Type: "Negative", ExpectedMessage: "Duplicate email rejected", Issue: "" },
    { "Test Case ID": "TC_OM_010", Description: "Verify system prevents submission when an invalid or unsupported office type value is selected through manipulation.", persona: "tenant", Type: "Negative", ExpectedMessage: "Office Type required validation", Issue: "" },
    // ── Phase 2: Office Create — Step 2: Organization (4 positive) ───────────
    { "Test Case ID": "TC_OM_011", Description: "Verify user can proceed to the next step with valid Organization Name, Logo, Registration No, GST/License No, and FSSAI No.", persona: "tenant", Type: "Positive", ExpectedMessage: "Step 3 Authentication visible", Issue: "" },
    { "Test Case ID": "TC_OM_012", Description: "Verify a valid logo file (PNG/JPG) uploads successfully and preview is displayed.", persona: "tenant", Type: "Positive", ExpectedMessage: "Logo uploaded or preview visible", Issue: "" },
    { "Test Case ID": "TC_OM_013", Description: "Verify the Own Company checkbox can be selected and retained after clicking Next.", persona: "tenant", Type: "Positive", ExpectedMessage: "Checkbox state changes", Issue: "" },
    { "Test Case ID": "TC_OM_014", Description: "Verify the Back button navigates to the previous onboarding step without data loss.", persona: "tenant", Type: "Positive", ExpectedMessage: "Step 1 data retained after Back", Issue: "" },
    // ── Phase 2: Office Create — Step 2: Organization (4 negative) ───────────
    { "Test Case ID": "TC_OM_015", Description: "Verify validation error is displayed when Organization Name is left blank and user clicks Next.", persona: "tenant", Type: "Negative", ExpectedMessage: "Organisation name required", Issue: "" },
    { "Test Case ID": "TC_OM_016", Description: "Verify system prevents upload of unsupported file formats (e.g., .exe, .zip) in the Logo field.", persona: "tenant", Type: "Negative", ExpectedMessage: "Unsupported file type error", Issue: "" },
    { "Test Case ID": "TC_OM_017", Description: "Verify validation error is displayed when Registration No, GST/License No, or FSSAI No contains invalid characters.", persona: "tenant", Type: "Negative", ExpectedMessage: "Registration/GST/FSSAI validation error", Issue: "" },
    { "Test Case ID": "TC_OM_018", Description: "Verify user cannot proceed when mandatory fields or logo upload are missing.", persona: "tenant", Type: "Negative", ExpectedMessage: "Mandatory field validation shown", Issue: "" },
    // ── Phase 3: Office Create — Step 3: Authentication (4 positive) ─────────
    { "Test Case ID": "TC_OM_019", Description: "Verify user can proceed to the next step with valid Username, Email, Phone Number, and Password.", persona: "tenant", Type: "Positive", ExpectedMessage: "Step 4 Agreement visible", Issue: "" },
    { "Test Case ID": "TC_OM_020", Description: "Verify password visibility toggle correctly shows and hides the entered password.", persona: "tenant", Type: "Positive", ExpectedMessage: "Password input type changes", Issue: "" },
    { "Test Case ID": "TC_OM_021", Description: "Verify country code dropdown allows selecting a valid country code and updates the phone field accordingly.", persona: "tenant", Type: "Positive", ExpectedMessage: "Country code selectable", Issue: "" },
    { "Test Case ID": "TC_OM_022", Description: "Verify clicking Back navigates to the Organization step while retaining previously entered data.", persona: "tenant", Type: "Positive", ExpectedMessage: "Step 2 data retained after Back", Issue: "" },
    // ── Phase 3: Office Create — Step 3: Authentication (4 negative) ─────────
    { "Test Case ID": "TC_OM_023", Description: "Verify validation error is displayed when Username is left blank and user clicks Next.", persona: "tenant", Type: "Negative", ExpectedMessage: "Username required validation", Issue: "" },
    { "Test Case ID": "TC_OM_024", Description: "Verify validation error is displayed when an invalid email format is entered (e.g., abc@com).", persona: "tenant", Type: "Negative", ExpectedMessage: "Email format validation error", Issue: "" },
    { "Test Case ID": "TC_OM_025", Description: "Verify validation error is displayed when Phone Number contains alphabetic or special characters.", persona: "tenant", Type: "Negative", ExpectedMessage: "Phone validation error", Issue: "" },
    { "Test Case ID": "TC_OM_026", Description: "Verify user cannot proceed when Password does not meet the minimum security requirements or is left empty.", persona: "tenant", Type: "Negative", ExpectedMessage: "Password strength validation error", Issue: "" },
    // ── Phase 4: Office Create — Step 4: Agreement (6 positive) ──────────────
    { "Test Case ID": "TC_OM_027", Description: "Verify user can upload a valid agreement document and proceed to the next step successfully.", persona: "tenant", Type: "Positive", ExpectedMessage: "Agreement URL generated", Issue: "" },
    { "Test Case ID": "TC_OM_028", Description: "Verify user can select a valid Catalog Option and corresponding Market from the dropdowns.", persona: "tenant", Type: "Positive", ExpectedMessage: "Catalog and Market selected", Issue: "" },
    { "Test Case ID": "TC_OM_029", Description: "Verify Select All Market checkbox selects all available markets correctly.", persona: "tenant", Type: "Positive", ExpectedMessage: "All markets selected", Issue: "" },
    { "Test Case ID": "TC_OM_030", Description: "Verify user can select a valid Mode of Sale and save the selection.", persona: "tenant", Type: "Positive", ExpectedMessage: "Mode of Sale selected", Issue: "" },
    { "Test Case ID": "TC_OM_031", Description: "Verify Agreement Start Date and End Date can be selected using the date picker.", persona: "tenant", Type: "Positive", ExpectedMessage: "Start and End dates set", Issue: "" },
    { "Test Case ID": "TC_OM_032", Description: "Verify user can proceed to the Done step when all mandatory fields are completed with valid data.", persona: "tenant", Type: "Positive", ExpectedMessage: "Step 5 Done indicator visible", Issue: "" },
    // ── Phase 4: Office Create — Step 4: Agreement (6 negative) ──────────────
    { "Test Case ID": "TC_OM_033", Description: "Verify validation error is displayed when Agreement document is not uploaded and user clicks Next.", persona: "tenant", Type: "Negative", ExpectedMessage: "Agreement file required validation", Issue: "" },
    { "Test Case ID": "TC_OM_034", Description: "Verify system rejects unsupported agreement file formats (e.g., .exe, .bat, .zip).", persona: "tenant", Type: "Negative", ExpectedMessage: "Unsupported file type error", Issue: "" },
    { "Test Case ID": "TC_OM_035", Description: "Verify validation error is displayed when Catalog Option is not selected.", persona: "tenant", Type: "Negative", ExpectedMessage: "Catalog required validation", Issue: "" },
    { "Test Case ID": "TC_OM_036", Description: "Verify validation error is displayed when Market is not selected while Select All Market is unchecked.", persona: "tenant", Type: "Negative", ExpectedMessage: "Market required validation", Issue: "" },
    { "Test Case ID": "TC_OM_037", Description: "Verify system prevents proceeding when Agreement End Date is earlier than Agreement Start Date.", persona: "tenant", Type: "Negative", ExpectedMessage: "End date before start date validation", Issue: "" },
    { "Test Case ID": "TC_OM_038", Description: "Verify user cannot proceed when any mandatory field marked with (*) is left blank.", persona: "tenant", Type: "Negative", ExpectedMessage: "Mandatory field validation shown", Issue: "" },
    // ── Phase 5: Office Create — Step 5: Done (2 positive) ────────────────────
    { "Test Case ID": "TC_OM_039", Description: "Verify success message \"Partner details submitted successfully!\" is displayed after completing all onboarding steps with valid data.", persona: "tenant", Type: "Positive", ExpectedMessage: "Partner details submitted successfully!", Issue: "" },
    { "Test Case ID": "TC_OM_040", Description: "Verify clicking the Done button redirects the user to the Office Management list page successfully.", persona: "tenant", Type: "Positive", ExpectedMessage: "Office Registry heading visible", Issue: "" },
    // ── Phase 5: Office Create — Step 5: Done (2 negative) ────────────────────
    { "Test Case ID": "TC_OM_041", Description: "Verify the success screen is not displayed if any previous onboarding step contains invalid or incomplete mandatory data.", persona: "tenant", Type: "Negative", ExpectedMessage: "Success message not shown", Issue: "" },
    { "Test Case ID": "TC_OM_042", Description: "Verify clicking the Done button when the backend submission fails displays an appropriate error message and prevents redirection.", persona: "tenant", Type: "Negative", ExpectedMessage: "Error shown or wizard not advanced", Issue: "" },
    // ── Phase 6: Office Management Listing Screen (5 positive) ────────────────
    { "Test Case ID": "TC_OM_043", Description: "Verify Office Registry page loads successfully and displays all office records with correct details.", persona: "tenant", Type: "Positive", ExpectedMessage: "Office Registry heading visible", Issue: "" },
    { "Test Case ID": "TC_OM_044", Description: "Verify user can search an existing office using the search box and matching results are displayed.", persona: "tenant", Type: "Positive", ExpectedMessage: "Search result visible in table", Issue: "" },
    { "Test Case ID": "TC_OM_045", Description: "Verify clicking the View icon opens the selected office details page successfully.", persona: "tenant", Type: "Positive", ExpectedMessage: "View page loaded", Issue: "" },
    { "Test Case ID": "TC_OM_046", Description: "Verify clicking the Edit icon opens the selected office record in edit mode with pre-filled data.", persona: "tenant", Type: "Positive", ExpectedMessage: "Edit URL shown", Issue: "" },
    { "Test Case ID": "TC_OM_047", Description: "Verify clicking Create Office navigates the user to the Office Onboarding/Create Office page.", persona: "tenant", Type: "Positive", ExpectedMessage: "Step 1 Office indicator visible", Issue: "" },
    // ── Phase 6: Office Management Listing Screen (5 negative) ────────────────
    { "Test Case ID": "TC_OM_048", Description: "Verify \"No records found\" message is displayed when searching with a non-existing office name.", persona: "tenant", Type: "Negative", ExpectedMessage: "No Records Found message visible", Issue: "" },
    { "Test Case ID": "TC_OM_049", Description: "Verify special characters or invalid input in the search field do not break the search functionality.", persona: "tenant", Type: "Negative", ExpectedMessage: "Page remains stable", Issue: "" },
    { "Test Case ID": "TC_OM_050", Description: "Verify user without view permission cannot access office details through the View icon.", persona: "tenant", Type: "Negative", ExpectedMessage: "Listing accessible or icons hidden", Issue: "" },
    { "Test Case ID": "TC_OM_051", Description: "Verify user without edit permission cannot modify office details through the Edit icon.", persona: "tenant", Type: "Negative", ExpectedMessage: "Listing accessible or edit icons hidden", Issue: "" },
    { "Test Case ID": "TC_OM_052", Description: "Verify deleting an office that is linked to active records displays an appropriate error message and prevents deletion.", persona: "tenant", Type: "Negative", ExpectedMessage: "Error toast or record retained", Issue: "" },
    // ── Phase 7: View Office Screen (5 positive) ──────────────────────────────
    { "Test Case ID": "TC_OM_053", Description: "Verify View Office page loads successfully and displays all office details correctly for a valid office record.", persona: "tenant", Type: "Positive", ExpectedMessage: "View page heading visible", Issue: "" },
    { "Test Case ID": "TC_OM_054", Description: "Verify Office Details, Organization Details, and Authentication Details sections display accurate data matching the created office.", persona: "tenant", Type: "Positive", ExpectedMessage: "All 3 detail sections visible", Issue: "" },
    { "Test Case ID": "TC_OM_055", Description: "Verify logo URL is displayed correctly and opens/downloads the associated logo when accessed.", persona: "tenant", Type: "Positive", ExpectedMessage: "Logo visible or URL accessible", Issue: "" },
    { "Test Case ID": "TC_OM_056", Description: "Verify the Office Type badge (e.g., Branch Office) is displayed correctly on the page.", persona: "tenant", Type: "Positive", ExpectedMessage: "Office type badge visible", Issue: "" },
    { "Test Case ID": "TC_OM_057", Description: "Verify clicking the Back button returns the user to the Office Registry page successfully.", persona: "tenant", Type: "Positive", ExpectedMessage: "Office Registry heading visible", Issue: "" },
    // ── Phase 7: View Office Screen (5 negative) ──────────────────────────────
    { "Test Case ID": "TC_OM_058", Description: "Verify an appropriate error message is displayed when attempting to view a non-existent office record.", persona: "tenant", Type: "Negative", ExpectedMessage: "Error or redirect shown", Issue: "" },
    { "Test Case ID": "TC_OM_059", Description: "Verify the page handles missing organization details gracefully without UI breakage.", persona: "tenant", Type: "Negative", ExpectedMessage: "Page stable with no crash", Issue: "" },
    { "Test Case ID": "TC_OM_060", Description: "Verify invalid or broken logo URLs do not crash the page and display a fallback message/image.", persona: "tenant", Type: "Negative", ExpectedMessage: "Page stable or fallback shown", Issue: "" },
    { "Test Case ID": "TC_OM_061", Description: "Verify unauthorized users cannot access the View Office page directly via URL manipulation.", persona: "tenant", Type: "Negative", ExpectedMessage: "Redirect or access denied", Issue: "" },
    { "Test Case ID": "TC_OM_062", Description: "Verify null or missing authentication fields are displayed safely without exposing system errors or sensitive data.", persona: "tenant", Type: "Negative", ExpectedMessage: "Page stable no system errors", Issue: "" },
    // ── Phase 8: Edit Office Screen (5 positive) ──────────────────────────────
    { "Test Case ID": "TC_OM_063", Description: "Verify user can successfully update office details with valid data in all mandatory fields and save changes.", persona: "tenant", Type: "Positive", ExpectedMessage: "Office updated successfully", Issue: "" },
    { "Test Case ID": "TC_OM_064", Description: "Verify user can modify Office Type and the updated value is reflected after saving.", persona: "tenant", Type: "Positive", ExpectedMessage: "Updated office type reflected", Issue: "" },
    { "Test Case ID": "TC_OM_065", Description: "Verify user can update Email, Phone, and Address information successfully.", persona: "tenant", Type: "Positive", ExpectedMessage: "Updated email/phone/address reflected", Issue: "" },
    { "Test Case ID": "TC_OM_066", Description: "Verify user can change Security Question and Security Answer and save the updated values.", persona: "tenant", Type: "Positive", ExpectedMessage: "Security fields updated", Issue: "" },
    { "Test Case ID": "TC_OM_067", Description: "Verify clicking Update Office displays a success message and persists the updated data.", persona: "tenant", Type: "Positive", ExpectedMessage: "Update success toast visible and data persists", Issue: "" },
    // ── Phase 8: Edit Office Screen (5 negative) ──────────────────────────────
    { "Test Case ID": "TC_OM_068", Description: "Verify validation error is displayed when mandatory fields (Office Name, Email, Phone, etc.) are left blank and Update Office is clicked.", persona: "tenant", Type: "Negative", ExpectedMessage: "Mandatory field validation shown", Issue: "" },
    { "Test Case ID": "TC_OM_069", Description: "Verify validation error is displayed when an invalid email format is entered in the Email field.", persona: "tenant", Type: "Negative", ExpectedMessage: "Email format validation error", Issue: "" },
    { "Test Case ID": "TC_OM_070", Description: "Verify validation error is displayed when Phone Number contains invalid characters or exceeds allowed length.", persona: "tenant", Type: "Negative", ExpectedMessage: "Phone validation error", Issue: "" },
    { "Test Case ID": "TC_OM_071", Description: "Verify system prevents saving when Registration No, GST No, or FSSAI No contains invalid data formats.", persona: "tenant", Type: "Negative", ExpectedMessage: "Registration/GST/FSSAI validation error", Issue: "" },
    { "Test Case ID": "TC_OM_072", Description: "Verify unauthorized users cannot update office details and receive an appropriate access denied message.", persona: "tenant", Type: "Negative", ExpectedMessage: "Access denied or not editable", Issue: "" },
    // ── Phase 9: Delete Office Popup (2 positive — Cancel FIRST, then Delete) ─
    { "Test Case ID": "TC_OM_073", Description: "Verify clicking Cancel closes the delete confirmation popup and retains the office record in the registry.", persona: "tenant", Type: "Positive", ExpectedMessage: "Office record retained in listing", Issue: "" },
    { "Test Case ID": "TC_OM_074", Description: "Verify clicking Delete successfully removes the selected office and displays a success message.", persona: "tenant", Type: "Positive", ExpectedMessage: "Office removed from listing", Issue: "" },
    // ── Phase 9: Delete Office Popup (2 negative) ─────────────────────────────
    { "Test Case ID": "TC_OM_075", Description: "Verify office is not deleted when the delete API returns an error and an appropriate error message is displayed.", persona: "tenant", Type: "Negative", ExpectedMessage: "Error toast shown and record retained", Issue: "" },
    { "Test Case ID": "TC_OM_076", Description: "Verify unauthorized users cannot delete an office and receive an access denied message when clicking Delete.", persona: "tenant", Type: "Negative", ExpectedMessage: "Access denied message shown", Issue: "" },
];

const headers = ["Test Case ID", "Description", "persona", "Type", "ExpectedMessage", "Issue"];

const wsData = [
    headers,
    ...rows.map((r) => headers.map((h) => r[h] || "")),
];

const wb = XLSX.readFile(FILE);
const ws = XLSX.utils.aoa_to_sheet(wsData);

if (wb.SheetNames.includes(SHEET_NAME)) {
    const idx = wb.SheetNames.indexOf(SHEET_NAME);
    wb.SheetNames.splice(idx, 1);
    delete wb.Sheets[SHEET_NAME];
}
XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
XLSX.writeFile(wb, FILE);
console.log(`Written ${rows.length} rows to '${SHEET_NAME}' sheet in ${FILE}`);
