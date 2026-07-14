/**
 * Updates (or replaces) the "UserManagement" sheet in testData.xlsx — 9 automation + 72 manual test cases = 81 rows.
 * Run once: node scripts/addUserManagementSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "UserManagement";

const preservedRows = [
    {
        "TestID": "TC01_PageLoad",
        "Issue": "7001",
        "Description": "Verify User Management page load",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant",
        "UserPassword": " "
    },
    {
        "TestID": "TC02_SearchUserPositive",
        "Issue": "7002",
        "Description": "Verify search by valid user name",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant",
        "SearchText": "Hari K"
    },
    {
        "TestID": "TC03_SearchUserByEmail",
        "Issue": "7003",
        "Description": "Verify search by valid email",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant",
        "SearchText": "asit@yopmail.com"
    },
    {
        "TestID": "TC04_SearchUserNegative",
        "Issue": "7004",
        "Description": "Verify search by invalid value",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant",
        "SearchText": "xyz123test"
    },
    {
        "TestID": "TC06_VerifyTabs",
        "Issue": "7006",
        "Description": "Verify all user tabs",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant"
    },
    {
        "TestID": "TC07_ViewUserDetails",
        "Issue": "7007",
        "Description": "Verify view user details",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant",
        "SearchText": "Don Samanta"
    },
    {
        "TestID": "TC08_EditUser",
        "Issue": "7008",
        "Description": "Verify edit user details",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant",
        "SearchText": "Anik bhai",
        "UpdatedName": "Don"
    },
    {
        "TestID": "TC09_DeleteUser",
        "Issue": "7009",
        "Description": "Verify delete user",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant",
        "SearchText": "Gopal yu"
    },
    {
        "TestID": "TC10_CreateUser",
        "Issue": "7010",
        "Description": "Verify create user",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant",
        "FullName": "Doli Sing",
        "Email": "dilinsing781@yopmail.com",
        "Phone": "9999183910",
        "DOB": "34830",
        "Gender": "Male",
        "Address": "Khirpai, West Bengal 721232, India",
        "Category": "DELIVERY_AGENT",
        "Role": "Agent_calonex",
        "Experience": "4",
        "UserLogin": "Sing Dolin",
        "UserPassword": "Welcome@123",
        "ConfirmPassword": "Welcome@123",
        "IDType": "Aadhaar Card",
        "AddressType": "Aadhaar Card",
        "IDNumber": "RANDOM",
        "AddressNumber": "RANDOM",
        "IDFrontPhoto": "https://d3etdz0uek6d8j.cloudfront.net/payment_gatway_logos/pvc-aadhaar-card-500x500.jpg",
        "IDBackPhoto": "https://d3etdz0uek6d8j.cloudfront.net/payment_gatway_logos/20250404112835_Aadhaar-card-generated-using-AI.jpg",
        "AddressFrontPhoto": "https://d3etdz0uek6d8j.cloudfront.net/payment_gatway_logos/pvc-aadhaar-card-500x500.jpg",
        "AddressBackPhoto": "https://d3etdz0uek6d8j.cloudfront.net/payment_gatway_logos/20250404112835_Aadhaar-card-generated-using-AI.jpg",
        "ExpectedResult": "Created"
    }
];

const newRows = [
    // ── User Management Screen (UM_L_01 to UM_L_12) ──
    { "TestID": "UM_L_01", "Description": "Verify User Management page loads successfully with user records, status tabs, search box, and action buttons.", "ExpectedResult": "User Management page loaded successfully." },
    { "TestID": "UM_L_02", "Description": "Verify user can search an existing user by Name, Email, or Phone number and view matching results.", "ExpectedResult": "Search returns matched records." },
    { "TestID": "UM_L_03", "Description": "Verify clicking the Pending Approval, Approved, or Rejected tabs displays only users with the selected status.", "ExpectedResult": "Grid displays filtered records successfully." },
    { "TestID": "UM_L_04", "Description": "Verify clicking the View icon opens the selected user's details page successfully.", "ExpectedResult": "View profile screen loads." },
    { "TestID": "UM_L_05", "Description": "Verify clicking the Edit icon opens the selected user's edit page with pre-populated information.", "ExpectedResult": "Edit page loaded successfully with pre-filled inputs." },
    { "TestID": "UM_L_06", "Description": "Verify pagination navigates correctly between pages and displays the corresponding user records.", "ExpectedResult": "Pagination switches rows cleanly." },
    { "TestID": "UM_L_NEG_01", "Description": "Verify searching with a non-existing user name or email displays a 'No Records Found' message.", "ExpectedResult": "Empty state displays." },
    { "TestID": "UM_L_NEG_02", "Description": "Verify search field handles special characters and SQL injection-like inputs without application failure.", "ExpectedResult": "Special search inputs handled safely." },
    { "TestID": "UM_L_NEG_03", "Description": "Verify user list displays an appropriate error message when API/data retrieval fails.", "ExpectedResult": "Connection error toaster visible." },
    { "TestID": "UM_L_NEG_04", "Description": "Verify users without proper permissions cannot access the Edit functionality.", "ExpectedResult": "Action disabled or blocked with error." },
    { "TestID": "UM_L_NEG_05", "Description": "Verify clicking the Delete icon for a protected or linked user displays a proper validation/error message.", "ExpectedResult": "Warning prompts on protected user." },
    { "TestID": "UM_L_NEG_06", "Description": "Verify rapid multiple clicks on View, Edit, or Delete actions do not trigger duplicate requests or UI issues.", "ExpectedResult": "Only first click processed." },

    // ── View User Screen (UM_V_01 to UM_V_12) ──
    { "TestID": "UM_V_01", "Description": "Verify the View User page loads successfully with all user details displayed correctly.", "ExpectedResult": "Details panel loads completely." },
    { "TestID": "UM_V_02", "Description": "Verify the Back button navigates the user back to the User Management listing page.", "ExpectedResult": "Redirects back to list." },
    { "TestID": "UM_V_03", "Description": "Verify clicking the KYC Details button opens the corresponding KYC information screen successfully.", "ExpectedResult": "KYC screen opens." },
    { "TestID": "UM_V_04", "Description": "Verify User Information section displays the correct Name, Email, Phone, and Status values.", "ExpectedResult": "Profile fields display correct data." },
    { "TestID": "UM_V_05", "Description": "Verify Agent Profile section displays the correct Skills, Service Zones, Availability, and Profile Status details.", "ExpectedResult": "Agent attributes load successfully." },
    { "TestID": "UM_V_06", "Description": "Verify clicking the View document link opens or downloads the associated certification document successfully.", "ExpectedResult": "Document opened/downloaded successfully." },
    { "TestID": "UM_V_NEG_01", "Description": "Verify an appropriate error message is displayed when user details fail to load due to API/network failure.", "ExpectedResult": "Details load failure error toaster." },
    { "TestID": "UM_V_NEG_02", "Description": "Verify the page handles missing user profile data without UI breakage or application crash.", "ExpectedResult": "UI handles missing variables gracefully." },
    { "TestID": "UM_V_NEG_03", "Description": "Verify clicking KYC Details displays an appropriate message when no KYC record exists.", "ExpectedResult": "KYC missing message displays." },
    { "TestID": "UM_V_NEG_04", "Description": "Verify clicking View document for a missing or deleted certification file displays an appropriate error message.", "ExpectedResult": "File unavailable warning toaster." },
    { "TestID": "UM_V_NEG_05", "Description": "Verify unauthorized users cannot access the View User page directly via URL manipulation.", "ExpectedResult": "Unauthorized access blocked." },
    { "TestID": "UM_V_NEG_06", "Description": "Verify the page handles invalid or corrupted certification data without displaying incorrect information.", "ExpectedResult": "Broken file fallback placeholder." },

    // ── Edit User Screen (UM_E_01 to UM_E_12) ──
    { "TestID": "UM_E_01", "Description": "Verify user can successfully update profile information with valid data and click Update.", "ExpectedResult": "Profile updated success message." },
    { "TestID": "UM_E_02", "Description": "Verify changes made to personal details (Name, Phone, Gender, DOB, etc.) are saved successfully.", "ExpectedResult": "Details saved and persist." },
    { "TestID": "UM_E_03", "Description": "Verify user can upload a valid profile photo and update the profile successfully.", "ExpectedResult": "Photo uploaded and saved." },
    { "TestID": "UM_E_04", "Description": "Verify user can update address details (City, State, Country, Zipcode) and save changes.", "ExpectedResult": "Address updated successfully." },
    { "TestID": "UM_E_05", "Description": "Verify user can update Category and Access Level fields successfully.", "ExpectedResult": "Fields updated." },
    { "TestID": "UM_E_06", "Description": "Verify clicking KYC Details opens the corresponding KYC information screen successfully.", "ExpectedResult": "KYC screen opened successfully." },
    { "TestID": "UM_E_NEG_01", "Description": "Verify system displays validation errors when mandatory fields are left blank and Update is clicked.", "ExpectedResult": "Mandatory fields validations display." },
    { "TestID": "UM_E_NEG_02", "Description": "Verify system rejects invalid email formats and prevents profile updates.", "ExpectedResult": "Invalid email validation warning." },
    { "TestID": "UM_E_NEG_03", "Description": "Verify system rejects invalid phone numbers (alphabetic characters, special characters, or incorrect length).", "ExpectedResult": "Phone validation error display." },
    { "TestID": "UM_E_NEG_04", "Description": "Verify system prevents uploading unsupported profile photo file formats.", "ExpectedResult": "Format not supported error display." },
    { "TestID": "UM_E_NEG_05", "Description": "Verify system rejects future dates in the DOB field and displays an appropriate validation message.", "ExpectedResult": "Future date rejected warning." },
    { "TestID": "UM_E_NEG_06", "Description": "Verify an appropriate error message is displayed when profile update fails due to API/network failure.", "ExpectedResult": "API failure toaster warning." },

    // ── Delete User Screen (UM_D_01 to UM_D_08) ──
    { "TestID": "UM_D_01", "Description": "Verify clicking Delete successfully removes the selected user and updates the user list.", "ExpectedResult": "Deleted successfully toaster." },
    { "TestID": "UM_D_02", "Description": "Verify clicking Cancel closes the delete confirmation popup without deleting the user.", "ExpectedResult": "Popup closes; user is retained." },
    { "TestID": "UM_D_03", "Description": "Verify clicking the X (Close) icon dismisses the popup and retains the user record.", "ExpectedResult": "Popup closes safely." },
    { "TestID": "UM_D_04", "Description": "Verify the delete confirmation popup is displayed with all required controls.", "ExpectedResult": "Popup elements load successfully." },
    { "TestID": "UM_D_NEG_01", "Description": "Verify an appropriate error message is displayed when user deletion fails due to API/network failure.", "ExpectedResult": "Delete API failure toaster." },
    { "TestID": "UM_D_NEG_02", "Description": "Verify a user without delete permissions cannot delete a user and receives an authorization error.", "ExpectedResult": "Access denied warning display." },
    { "TestID": "UM_D_NEG_03", "Description": "Verify multiple rapid clicks on the Delete button do not trigger duplicate delete requests.", "ExpectedResult": "Only first request processes." },
    { "TestID": "UM_D_NEG_04", "Description": "Verify attempting to delete a user linked to active assignments/orders prevents deletion.", "ExpectedResult": "Blocked delete error display." },

    // ── Create User Screen: Basic Info (UM_C1_01 to UM_C1_08) ──
    { "TestID": "UM_C1_01", "Description": "Verify user can enter valid Personal Details and click Save & Continue to proceed to the next step.", "ExpectedResult": "Wizard step advances successfully." },
    { "TestID": "UM_C1_02", "Description": "Verify user can upload a valid profile photo (JPG/PNG within 5 MB limit) successfully.", "ExpectedResult": "Profile image uploaded." },
    { "TestID": "UM_C1_03", "Description": "Verify Agent Preview section updates correctly when Full Name and Email are entered.", "ExpectedResult": "Agent preview dynamically updates." },
    { "TestID": "UM_C1_04", "Description": "Verify all entered data is retained when navigating between wizard steps.", "ExpectedResult": "Data persists on step toggles." },
    { "TestID": "UM_C1_NEG_01", "Description": "Verify validation errors are displayed when mandatory fields are left blank and Save & Continue is clicked.", "ExpectedResult": "Validation warnings prompt blank fields." },
    { "TestID": "UM_C1_NEG_02", "Description": "Verify system rejects invalid email formats and prevents progression to the next step.", "ExpectedResult": "Invalid email validation warning." },
    { "TestID": "UM_C1_NEG_03", "Description": "Verify system rejects profile photo uploads exceeding the 5 MB size limit or unsupported file formats.", "ExpectedResult": "Oversized/format blocked error displays." },
    { "TestID": "UM_C1_NEG_04", "Description": "Verify system prevents saving when an invalid phone number format or unsupported country code is entered.", "ExpectedResult": "Phone format validation triggers." },

    // ── Create User Screen: Service & Skills (UM_C2_01 to UM_C2_10) ──
    { "TestID": "UM_C2_01", "Description": "Verify user can select a valid Category and corresponding Role and proceed successfully.", "ExpectedResult": "Category and Role dropdown selections complete." },
    { "TestID": "UM_C2_02", "Description": "Verify user can select one or more Skills and the selected skills are saved correctly.", "ExpectedResult": "Skills chips visible in selector." },
    { "TestID": "UM_C2_03", "Description": "Verify user can add valid Certification details and upload a supported certificate document successfully.", "ExpectedResult": "Certificate doc uploads successfully." },
    { "TestID": "UM_C2_04", "Description": "Verify user can enter valid Account Access details and click Save & Continue.", "ExpectedResult": "Access logins entries accepted." },
    { "TestID": "UM_C2_05", "Description": "Verify Agent Preview, Summary, and Profile Completeness sections update correctly based on entered information.", "ExpectedResult": "Completeness metric updates correctly." },
    { "TestID": "UM_C2_NEG_01", "Description": "Verify system displays a validation error when Category or Role is not selected and Save & Continue is clicked.", "ExpectedResult": "Dropdown warnings display successfully." },
    { "TestID": "UM_C2_NEG_02", "Description": "Verify system prevents proceeding when Password and Confirm Password do not match.", "ExpectedResult": "Password mismatch warning display." },
    { "TestID": "UM_C2_NEG_03", "Description": "Verify system rejects weak passwords that do not meet the required password policy.", "ExpectedResult": "Weak password warning display." },
    { "TestID": "UM_C2_NEG_04", "Description": "Verify system rejects unsupported certificate file formats or files exceeding the allowed size limit.", "ExpectedResult": "File size block warning displays." },
    { "TestID": "UM_C2_NEG_05", "Description": "Verify system displays a validation error when a duplicate Username is entered.", "ExpectedResult": "Duplicate username validation warning." },

    // ── Create User Screen: Service Area (UM_C3_01 to UM_C3_10) ──
    { "TestID": "UM_C3_01", "Description": "Verify user can select one or more Service Zones and proceed successfully by clicking Save & Continue.", "ExpectedResult": "Service zones selected." },
    { "TestID": "UM_C3_02", "Description": "Verify user can select available working days and preferred time slots, and the selections are saved correctly.", "ExpectedResult": "Schedule config saved correctly." },
    { "TestID": "UM_C3_03", "Description": "Verify user can enter valid values for Max Daily Jobs and Service Radius (km) and save successfully.", "ExpectedResult": "Job counts entries accepted." },
    { "TestID": "UM_C3_04", "Description": "Verify clicking Auto-fill Zones populates service zones based on the user's address.", "ExpectedResult": "Zones populate matching user address." },
    { "TestID": "UM_C3_05", "Description": "Verify enabling/disabling the Auto-Assign Jobs toggle is saved correctly after proceeding to the next step.", "ExpectedResult": "Auto-assign toggle state saved." },
    { "TestID": "UM_C3_NEG_01", "Description": "Verify system displays a validation error when no Service Zone is selected and Save & Continue is clicked.", "ExpectedResult": "Service zone required validation." },
    { "TestID": "UM_C3_NEG_02", "Description": "Verify system prevents saving when Max Daily Jobs contains non-numeric or negative values.", "ExpectedResult": "Max jobs numeric validation error display." },
    { "TestID": "UM_C3_NEG_03", "Description": "Verify system prevents saving when Service Radius contains invalid, negative, or non-numeric values.", "ExpectedResult": "Service radius numeric validation display." },
    { "TestID": "UM_C3_NEG_04", "Description": "Verify system handles the scenario where Auto-fill Zones returns no matching zones for the entered address.", "ExpectedResult": "No zones found warning displays gracefully." },
    { "TestID": "UM_C3_NEG_05", "Description": "Verify user cannot proceed if no working days are selected when working schedule is mandatory.", "ExpectedResult": "Select working days warning display." }
];

// Combine preserved and manual rows
const combinedRows = [
    ...preservedRows,
    ...newRows.map(r => ({
        "TestID": r.TestID,
        "Issue": String(Date.now() % 100000 + Math.floor(Math.random() * 1000)),
        "Description": r.Description,
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "Tenant",
        "ExpectedResult": r.ExpectedResult
    }))
];

const headers = [
    "TestID",
    "Issue",
    "Description",
    "UserName",
    "Password",
    "persona",
    "UserPassword",
    "SearchText",
    "UpdatedName",
    "FullName",
    "Email",
    "Phone",
    "DOB",
    "Gender",
    "Address",
    "Category",
    "Role",
    "Experience",
    "UserLogin",
    "ConfirmPassword",
    "IDType",
    "AddressType",
    "IDNumber",
    "AddressNumber",
    "IDFrontPhoto",
    "IDBackPhoto",
    "AddressFrontPhoto",
    "AddressBackPhoto",
    "ExpectedResult"
];

const wsData = [
    headers,
    ...combinedRows.map((r) => headers.map((h) => r[h] === undefined ? "" : r[h])),
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
