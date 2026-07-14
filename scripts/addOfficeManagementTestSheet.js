/**
 * Updates (or replaces) the "OfficeManagement" sheet in testData.xlsx — 76 test cases.
 * Run once: node scripts/addOfficeManagementTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "OfficeManagement";

const rows = [
    // ── Office Create screen (Office) ──
    {
        "TestID": "TC_OM_001",
        "Issue": "16001",
        "Description": "Verify user can create an Office successfully with all mandatory fields populated with valid data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User can complete all onboarding steps and save successfully."
    },
    {
        "TestID": "TC_OM_002",
        "Issue": "16002",
        "Description": "Verify office type dropdown displays all available office types and allows selection.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Office type dropdown renders Head Office, Regional Office, Branch Office options."
    },
    {
        "TestID": "TC_OM_003",
        "Issue": "16003",
        "Description": "Verify user can add multiple valid email addresses using the Add New button.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Multiple emails are successfully added to the listing list."
    },
    {
        "TestID": "TC_OM_004",
        "Issue": "16004",
        "Description": "Verify Google address selection auto-populates City, State, Country, and Zip Code fields correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Address components are auto-populated automatically."
    },
    {
        "TestID": "TC_OM_005",
        "Issue": "16005",
        "Description": "Verify clicking Next navigates to the Organization step when all required fields are valid.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User advances to the next onboarding step."
    },
    {
        "TestID": "TC_OM_006",
        "Issue": "16006",
        "Description": "Verify validation error is displayed when Email field contains an invalid email format.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows email format is invalid."
    },
    {
        "TestID": "TC_OM_007",
        "Issue": "16007",
        "Description": "Verify validation error is displayed when Phone field contains invalid or insufficient digits.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows phone number is invalid."
    },
    {
        "TestID": "TC_OM_008",
        "Issue": "16008",
        "Description": "Verify user cannot proceed to the next step when mandatory fields are left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigation is blocked and required fields validation highlights appear."
    },
    {
        "TestID": "TC_OM_009",
        "Issue": "16009",
        "Description": "Verify duplicate email address addition is prevented and appropriate error message is shown.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Duplicate email error is displayed."
    },
    {
        "TestID": "TC_OM_010",
        "Issue": "16010",
        "Description": "Verify system prevents submission when an invalid or unsupported office type value is selected through manipulation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message prevents saving invalid office type."
    },

    // ── Office Create screen (Organization) ──
    {
        "TestID": "TC_OM_011",
        "Issue": "16011",
        "Description": "Verify user can proceed to the next step with valid Organization Name, Logo, Registration No, GST/License No, and FSSAI No.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Organization step details are saved successfully."
    },
    {
        "TestID": "TC_OM_012",
        "Issue": "16012",
        "Description": "Verify a valid logo file (PNG/JPG) uploads successfully and preview is displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Logo upload preview renders correctly in the container."
    },
    {
        "TestID": "TC_OM_013",
        "Issue": "16013",
        "Description": "Verify the Own Company checkbox can be selected and retained after clicking Next.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Checkbox remains selected on returning back to step."
    },
    {
        "TestID": "TC_OM_014",
        "Issue": "16014",
        "Description": "Verify the Back button navigates to the previous onboarding step without data loss.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirects back to Step 1 preserving office fields."
    },
    {
        "TestID": "TC_OM_015",
        "Issue": "16015",
        "Description": "Verify validation error is displayed when Organization Name is left blank and user clicks Next.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation shows Name is required."
    },
    {
        "TestID": "TC_OM_016",
        "Issue": "16016",
        "Description": "Verify system prevents upload of unsupported file formats (e.g., .exe, .zip) in the Logo field.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message indicates file format is unsupported."
    },
    {
        "TestID": "TC_OM_017",
        "Issue": "16017",
        "Description": "Verify validation error is displayed when Registration No, GST/License No, or FSSAI No contains invalid characters.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error message shows invalid character formats."
    },
    {
        "TestID": "TC_OM_018",
        "Issue": "16018",
        "Description": "Verify user cannot proceed when mandatory fields or logo upload are missing.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigation is blocked."
    },

    // ── Office Create screen (Authentication) ──
    {
        "TestID": "TC_OM_019",
        "Issue": "16019",
        "Description": "Verify user can proceed to the next step with valid Username, Email, Phone Number, and Password.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User successfully advances to Step 4."
    },
    {
        "TestID": "TC_OM_020",
        "Issue": "16020",
        "Description": "Verify password visibility toggle correctly shows and hides the entered password.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Password text toggles between bullets and clear text."
    },
    {
        "TestID": "TC_OM_021",
        "Issue": "16021",
        "Description": "Verify country code dropdown allows selecting a valid country code and updates the phone field accordingly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Country code updates correctly."
    },
    {
        "TestID": "TC_OM_022",
        "Issue": "16022",
        "Description": "Verify clicking Back navigates to the Organization step while retaining previously entered data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirects back to Step 2 preserving details."
    },
    {
        "TestID": "TC_OM_023",
        "Issue": "16023",
        "Description": "Verify validation error is displayed when Username is left blank and user clicks Next.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation shows Username is required."
    },
    {
        "TestID": "TC_OM_024",
        "Issue": "16024",
        "Description": "Verify validation error is displayed when an invalid email format is entered (e.g., abc@com).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation shows email format is invalid."
    },
    {
        "TestID": "TC_OM_025",
        "Issue": "16025",
        "Description": "Verify validation error is displayed when Phone Number contains alphabetic or special characters.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation shows phone must be numeric."
    },
    {
        "TestID": "TC_OM_026",
        "Issue": "16026",
        "Description": "Verify user cannot proceed when Password does not meet the minimum security requirements or is left empty.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message appears and navigation is blocked."
    },

    // ── Office Create screen (Agreement) ──
    {
        "TestID": "TC_OM_027",
        "Issue": "16027",
        "Description": "Verify user can upload a valid agreement document and proceed to the next step successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Agreement file uploads successfully."
    },
    {
        "TestID": "TC_OM_028",
        "Issue": "16028",
        "Description": "Verify user can select a valid Catalog Option and corresponding Market from the dropdowns.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Catalog option and Market selected successfully."
    },
    {
        "TestID": "TC_OM_029",
        "Issue": "16029",
        "Description": "Verify Select All Market checkbox selects all available markets correctly.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All market checkboxes or chips are selected."
    },
    {
        "TestID": "TC_OM_030",
        "Issue": "16030",
        "Description": "Verify user can select a valid Mode of Sale and save the selection.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Mode of sale selected successfully."
    },
    {
        "TestID": "TC_OM_031",
        "Issue": "16031",
        "Description": "Verify Agreement Start Date and End Date can be selected using the date picker.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Start and End dates populated successfully."
    },
    {
        "TestID": "TC_OM_032",
        "Issue": "16032",
        "Description": "Verify user can proceed to the Done step when all mandatory fields are completed with valid data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User successfully advances to Step 5."
    },
    {
        "TestID": "TC_OM_033",
        "Issue": "16033",
        "Description": "Verify validation error is displayed when Agreement document is not uploaded and user clicks Next.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation shows Agreement is required."
    },
    {
        "TestID": "TC_OM_034",
        "Issue": "16034",
        "Description": "Verify system rejects unsupported agreement file formats (e.g., .exe, .bat, .zip).",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Upload error is displayed."
    },
    {
        "TestID": "TC_OM_035",
        "Issue": "16035",
        "Description": "Verify validation error is displayed when Catalog Option is not selected.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears on Catalog selection."
    },
    {
        "TestID": "TC_OM_036",
        "Issue": "16036",
        "Description": "Verify validation error is displayed when Market is not selected while Select All Market is unchecked.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error appears on Market dropdown."
    },
    {
        "TestID": "TC_OM_037",
        "Issue": "16037",
        "Description": "Verify system prevents proceeding when Agreement End Date is earlier than Agreement Start Date.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error is shown on end date."
    },
    {
        "TestID": "TC_OM_038",
        "Issue": "16038",
        "Description": "Verify user cannot proceed when any mandatory field marked with (*) is left blank.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Required validation prevents navigation."
    },

    // ── Office Create screen (Done) ──
    {
        "TestID": "TC_OM_039",
        "Issue": "16039",
        "Description": "Verify success message \"Partner details submitted successfully!\" is displayed after completing all onboarding steps with valid data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Success page loads with congratulations/confirmation text."
    },
    {
        "TestID": "TC_OM_040",
        "Issue": "16040",
        "Description": "Verify clicking the Done button redirects the user to the Office Management list page successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "User navigates to the list view."
    },
    {
        "TestID": "TC_OM_041",
        "Issue": "16041",
        "Description": "Verify the success screen is not displayed if any previous onboarding step contains invalid or incomplete mandatory data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Done screen is unreachable."
    },
    {
        "TestID": "TC_OM_042",
        "Issue": "16042",
        "Description": "Verify clicking the Done button when the backend submission fails displays an appropriate error message and prevents redirection.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Error toast is displayed and redirection is blocked."
    },

    // ── Office Management Listing Screen ──
    {
        "TestID": "TC_OM_043",
        "Issue": "16043",
        "Description": "Verify Office Registry page loads successfully and displays all office records with correct details.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Office Registry page loads with table grid."
    },
    {
        "TestID": "TC_OM_044",
        "Issue": "16044",
        "Description": "Verify user can search an existing office using the search box and matching results are displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Matching office record displays in grid."
    },
    {
        "TestID": "TC_OM_045",
        "Issue": "16045",
        "Description": "Verify clicking the View icon opens the selected office details page successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "View details modal/page is loaded."
    },
    {
        "TestID": "TC_OM_046",
        "Issue": "16046",
        "Description": "Verify clicking the Edit icon opens the selected office record in edit mode with pre-filled data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Edit screen is pre-populated."
    },
    {
        "TestID": "TC_OM_047",
        "Issue": "16047",
        "Description": "Verify clicking Create Office navigates the user to the Office Onboarding/Create Office page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Navigates to Create Office onboarding steps."
    },
    {
        "TestID": "TC_OM_048",
        "Issue": "16048",
        "Description": "Verify \"No records found\" message is displayed when searching with a non-existing office name.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "\"No Records Found\" message is shown in grid."
    },
    {
        "TestID": "TC_OM_049",
        "Issue": "16049",
        "Description": "Verify special characters or invalid input in the search field do not break the search functionality.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Search processes input safely without crashing."
    },
    {
        "TestID": "TC_OM_050",
        "Issue": "16050",
        "Description": "Verify user without view permission cannot access office details through the View icon.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "View button is hidden or access is denied."
    },
    {
        "TestID": "TC_OM_051",
        "Issue": "16051",
        "Description": "Verify user without edit permission cannot modify office details through the Edit icon.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Edit button is hidden or access is denied."
    },
    {
        "TestID": "TC_OM_052",
        "Issue": "16052",
        "Description": "Verify deleting an office that is linked to active records displays an appropriate error message and prevents deletion.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Linked office deletion blocked with clear validation toast."
    },

    // ── View Office Screen ──
    {
        "TestID": "TC_OM_053",
        "Issue": "16053",
        "Description": "Verify View Office page loads successfully and displays all office details correctly for a valid office record.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "View details page loads with values."
    },
    {
        "TestID": "TC_OM_054",
        "Issue": "16054",
        "Description": "Verify Office Details, Organization Details, and Authentication Details sections display accurate data matching the created office.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "All details match the database values accurately."
    },
    {
        "TestID": "TC_OM_055",
        "Issue": "16055",
        "Description": "Verify logo URL is displayed correctly and opens/downloads the associated logo when accessed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Clicking opens/downloads logo successfully."
    },
    {
        "TestID": "TC_OM_056",
        "Issue": "16056",
        "Description": "Verify the Office Type badge (e.g., Branch Office) is displayed correctly on the page.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Office type badge renders correctly."
    },
    {
        "TestID": "TC_OM_057",
        "Issue": "16057",
        "Description": "Verify clicking the Back button returns the user to the Office Registry page successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirects back to registry list."
    },
    {
        "TestID": "TC_OM_058",
        "Issue": "16058",
        "Description": "Verify an appropriate error message is displayed when attempting to view a non-existent office record.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Record not found is displayed."
    },
    {
        "TestID": "TC_OM_059",
        "Issue": "16059",
        "Description": "Verify the page handles missing organization details gracefully without UI breakage.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Page displays fallback fields correctly."
    },
    {
        "TestID": "TC_OM_060",
        "Issue": "16060",
        "Description": "Verify invalid or broken logo URLs do not crash the page and display a fallback message/image.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Placeholder image is shown."
    },
    {
        "TestID": "TC_OM_061",
        "Issue": "16061",
        "Description": "Verify unauthorized users cannot access the View Office page directly via URL manipulation.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirection or access denied displays."
    },
    {
        "TestID": "TC_OM_062",
        "Issue": "16062",
        "Description": "Verify null or missing authentication fields are displayed safely without exposing system errors or sensitive data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Missing authentication fields load empty labels."
    },

    // ── Edit Office Screen ──
    {
        "TestID": "TC_OM_063",
        "Issue": "16063",
        "Description": "Verify user can successfully update office details with valid data in all mandatory fields and save changes.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Office details are saved successfully."
    },
    {
        "TestID": "TC_OM_064",
        "Issue": "16064",
        "Description": "Verify user can modify Office Type and the updated value is reflected after saving.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Office type is updated in grid."
    },
    {
        "TestID": "TC_OM_065",
        "Issue": "16065",
        "Description": "Verify user can update Email, Phone, and Address information successfully.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Contact details updated."
    },
    {
        "TestID": "TC_OM_066",
        "Issue": "16066",
        "Description": "Verify user can change Security Question and Security Answer and save the updated values.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Security question details saved."
    },
    {
        "TestID": "TC_OM_067",
        "Issue": "16067",
        "Description": "Verify clicking Update Office displays a success message and persists the updated data.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Success toast notification is displayed."
    },
    {
        "TestID": "TC_OM_068",
        "Issue": "16068",
        "Description": "Verify validation error is displayed when mandatory fields (Office Name, Email, Phone, etc.) are left blank and Update Office is clicked.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows mandatory fields are required."
    },
    {
        "TestID": "TC_OM_069",
        "Issue": "16069",
        "Description": "Verify validation error is displayed when an invalid email format is entered in the Email field.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message shows invalid email."
    },
    {
        "TestID": "TC_OM_070",
        "Issue": "16070",
        "Description": "Verify validation error is displayed when Phone Number contains invalid characters or exceeds allowed length.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation error displays on phone field."
    },
    {
        "TestID": "TC_OM_071",
        "Issue": "16071",
        "Description": "Verify system prevents saving when Registration No, GST No, or FSSAI No contains invalid data formats.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Validation message is displayed."
    },
    {
        "TestID": "TC_OM_072",
        "Issue": "16072",
        "Description": "Verify unauthorized users cannot update office details and receive an appropriate access denied message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Redirection or access denied toast displays."
    },

    // ── Delete Office Popup ──
    {
        "TestID": "TC_OM_073",
        "Issue": "16073",
        "Description": "Verify clicking Delete successfully removes the selected office and displays a success message.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Office deleted successfully and removed from table."
    },
    {
        "TestID": "TC_OM_074",
        "Issue": "16074",
        "Description": "Verify clicking Cancel closes the delete confirmation popup and retains the office record in the registry.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Popup closes and row is retained."
    },
    {
        "TestID": "TC_OM_075",
        "Issue": "16075",
        "Description": "Verify office is not deleted when the delete API returns an error and an appropriate error message is displayed.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delete failed error message toast is shown."
    },
    {
        "TestID": "TC_OM_076",
        "Issue": "16076",
        "Description": "Verify unauthorized users cannot delete an office and receive an access denied message when clicking Delete.",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Delete button is hidden or delete is blocked with access denied toast."
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
