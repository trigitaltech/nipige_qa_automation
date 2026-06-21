const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "Tenant super admin";

const testCases = [
  // Tenant List Screen - Positive
  { id: "TC_LIST_01", type: "Positive", name: "Verify Tenant List page loads successfully with all tenant records displayed." },
  { id: "TC_LIST_02", type: "Positive", name: "Verify search by ID returns the correct tenant record." },
  { id: "TC_LIST_03", type: "Positive", name: "Verify search by User Name returns matching tenant records." },
  { id: "TC_LIST_04", type: "Positive", name: "Verify search by Email returns the correct tenant record." },
  { id: "TC_LIST_05", type: "Positive", name: "Verify clicking the View icon opens Tenant Details successfully." },
  { id: "TC_LIST_06", type: "Positive", name: "Verify clicking the Edit icon opens the Edit Tenant page with pre-filled data." },
  { id: "TC_LIST_07", type: "Positive", name: "Verify Active tenants display the Active status badge correctly." },
  { id: "TC_LIST_08", type: "Positive", name: "Verify Draft tenants display the Draft status badge correctly." },
  { id: "TC_LIST_09", type: "Positive", name: "Verify clicking Create Tenant navigates to the Tenant Creation page." },
  { id: "TC_LIST_10", type: "Positive", name: "Verify pagination Next button loads the next page of tenant records successfully." },

  // Tenant List Screen - Negative
  { id: "TC_LIST_NEG_01", type: "Negative", name: "Verify searching with a non-existing ID displays 'No Records Found' message." },
  { id: "TC_LIST_NEG_02", type: "Negative", name: "Verify searching with an invalid email format does not return unrelated records." },
  { id: "TC_LIST_NEG_03", type: "Negative", name: "Verify search field does not accept only blank spaces as valid input." },
  { id: "TC_LIST_NEG_04", type: "Negative", name: "Verify special characters entered in the search field do not crash the application." },
  { id: "TC_LIST_NEG_05", type: "Negative", name: "Verify SQL injection strings entered in the search field are handled securely." },
  { id: "TC_LIST_NEG_06", type: "Negative", name: "Verify clicking Next on the last page does not navigate beyond available pages." },
  { id: "TC_LIST_NEG_07", type: "Negative", name: "Verify clicking Previous on the first page does not navigate to an invalid page." },
  { id: "TC_LIST_NEG_08", type: "Negative", name: "Verify Tenant List page handles empty tenant data without UI breakage." },
  { id: "TC_LIST_NEG_09", type: "Negative", name: "Verify clicking View/Edit for a deleted tenant displays an appropriate error message." },
  { id: "TC_LIST_NEG_10", type: "Negative", name: "Verify refresh action during network interruption does not display duplicate or corrupted tenant data." },

  // Tenant View Screen - Positive
  { id: "TC_VIEW_01", type: "Positive", name: "Verify Tenant View page loads successfully with all tenant details displayed." },
  { id: "TC_VIEW_02", type: "Positive", name: "Verify tenant logo/image is displayed correctly." },
  { id: "TC_VIEW_03", type: "Positive", name: "Verify tenant name is displayed accurately." },
  { id: "TC_VIEW_04", type: "Positive", name: "Verify tenant email is displayed correctly." },
  { id: "TC_VIEW_05", type: "Positive", name: "Verify tenant phone number is displayed correctly." },
  { id: "TC_VIEW_06", type: "Positive", name: "Verify Country field displays the correct country value." },
  { id: "TC_VIEW_07", type: "Positive", name: "Verify State field displays the correct state value." },
  { id: "TC_VIEW_08", type: "Positive", name: "Verify City field displays the correct city value." },
  { id: "TC_VIEW_09", type: "Positive", name: "Verify Zipcode field displays the correct postal code." },
  { id: "TC_VIEW_10", type: "Positive", name: "Verify User Name field displays the correct tenant username." },
  { id: "TC_VIEW_11", type: "Positive", name: "Verify Category field displays the correct tenant category." },
  { id: "TC_VIEW_12", type: "Positive", name: "Verify clicking the Back button navigates to the Tenant List page successfully." },

  // Tenant View Screen - Negative
  { id: "TC_VIEW_NEG_01", type: "Negative", name: "Verify page displays a proper message when tenant details are unavailable." },
  { id: "TC_VIEW_NEG_02", type: "Negative", name: "Verify missing tenant logo displays a default placeholder image." },
  { id: "TC_VIEW_NEG_03", type: "Negative", name: "Verify invalid or deleted tenant ID does not load the View Tenant page." },
  { id: "TC_VIEW_NEG_04", type: "Negative", name: "Verify page handles null email values without UI breakage." },
  { id: "TC_VIEW_NEG_05", type: "Negative", name: "Verify page handles null phone number values without UI breakage." },
  { id: "TC_VIEW_NEG_06", type: "Negative", name: "Verify page handles missing address information gracefully." },
  { id: "TC_VIEW_NEG_07", type: "Negative", name: "Verify invalid zipcode data is displayed correctly without application failure." },
  { id: "TC_VIEW_NEG_08", type: "Negative", name: "Verify excessively long tenant names do not break the page layout." },
  { id: "TC_VIEW_NEG_09", type: "Negative", name: "Verify special characters in address fields are displayed correctly." },
  { id: "TC_VIEW_NEG_10", type: "Negative", name: "Verify KYC Details button is disabled or shows an error when KYC data is unavailable." },
  { id: "TC_VIEW_NEG_11", type: "Negative", name: "Verify unauthorized users cannot access the Tenant View page directly via URL." },
  { id: "TC_VIEW_NEG_12", type: "Negative", name: "Verify page handles network/API failure during data loading without crashing." },

  // Edit Tenant Screen - Positive
  { id: "TC_EDIT_01", type: "Positive", name: "Verify user can successfully update tenant details with valid data in all fields." },
  { id: "TC_EDIT_02", type: "Positive", name: "Verify Company Name field accepts valid alphanumeric values and updates successfully." },
  { id: "TC_EDIT_03", type: "Positive", name: "Verify user can upload a valid company logo image (JPG/PNG) and save changes." },
  { id: "TC_EDIT_04", type: "Positive", name: "Verify Google Address search populates Country, State, City, and Zipcode correctly." },
  { id: "TC_EDIT_05", type: "Positive", name: "Verify Country field updates successfully with a valid country value." },
  { id: "TC_EDIT_06", type: "Positive", name: "Verify State field updates successfully with a valid state value." },
  { id: "TC_EDIT_07", type: "Positive", name: "Verify City field updates successfully with a valid city value." },
  { id: "TC_EDIT_08", type: "Positive", name: "Verify Zipcode field accepts a valid postal code and saves successfully." },
  { id: "TC_EDIT_09", type: "Positive", name: "Verify Street 1 and Street 2 fields accept valid address information." },
  { id: "TC_EDIT_10", type: "Positive", name: "Verify Email field accepts a valid email address and updates successfully." },
  { id: "TC_EDIT_11", type: "Positive", name: "Verify Phone Number field accepts a valid international phone number and updates successfully." },
  { id: "TC_EDIT_12", type: "Positive", name: "Verify User Name field accepts valid input and updates successfully." },
  { id: "TC_EDIT_13", type: "Positive", name: "Verify Password field accepts a valid password meeting system requirements." },
  { id: "TC_EDIT_14", type: "Positive", name: "Verify KYC Details button opens the tenant KYC information page successfully." },
  { id: "TC_EDIT_15", type: "Positive", name: "Verify clicking Update saves all modified tenant details and displays a success message." },

  // Edit Tenant Screen - Negative
  { id: "TC_EDIT_NEG_01", type: "Negative", name: "Verify update fails when Company Name is left blank." },
  { id: "TC_EDIT_NEG_02", type: "Negative", name: "Verify Company Name field does not accept only spaces." },
  { id: "TC_EDIT_NEG_03", type: "Negative", name: "Verify upload of unsupported logo file formats (.exe, .txt, .zip) is rejected." },
  { id: "TC_EDIT_NEG_04", type: "Negative", name: "Verify oversized logo files are not uploaded and an error message is displayed." },
  { id: "TC_EDIT_NEG_05", type: "Negative", name: "Verify update fails when Email field contains an invalid email format." },
  { id: "TC_EDIT_NEG_06", type: "Negative", name: "Verify duplicate email address cannot be used if uniqueness is enforced." },
  { id: "TC_EDIT_NEG_07", type: "Negative", name: "Verify Phone Number field rejects alphabetic characters." },
  { id: "TC_EDIT_NEG_08", type: "Negative", name: "Verify Phone Number field rejects special characters other than allowed symbols." },
  { id: "TC_EDIT_NEG_09", type: "Negative", name: "Verify update fails when Phone Number exceeds the maximum allowed length." },
  { id: "TC_EDIT_NEG_10", type: "Negative", name: "Verify Zipcode field rejects invalid formats or non-numeric values if numeric-only." },
  { id: "TC_EDIT_NEG_11", type: "Negative", name: "Verify Password field rejects values that do not meet password policy requirements." },
  { id: "TC_EDIT_NEG_12", type: "Negative", name: "Verify SQL Injection strings entered in text fields are handled securely." },
  { id: "TC_EDIT_NEG_13", type: "Negative", name: "Verify Cross-Site Scripting (XSS) scripts entered in input fields are sanitized." },
  { id: "TC_EDIT_NEG_14", type: "Negative", name: "Verify clicking Update with mandatory fields missing displays validation messages." },
  { id: "TC_EDIT_NEG_15", type: "Negative", name: "Verify application handles network/API failure during update without data corruption." },

  // Create Tenant Screen(Basic Info) - Positive
  { id: "TC_CREATE_BASIC_01", type: "Positive", name: "Verify user can enter a valid Company Name and proceed to the Authentication step." },
  { id: "TC_CREATE_BASIC_02", type: "Positive", name: "Verify user can enter valid First Name and Last Name values successfully." },
  { id: "TC_CREATE_BASIC_03", type: "Positive", name: "Verify user can upload a valid company logo image (JPG/PNG) successfully." },
  { id: "TC_CREATE_BASIC_04", type: "Positive", name: "Verify uploaded logo preview is displayed correctly in the Company Logo section." },
  { id: "TC_CREATE_BASIC_05", type: "Positive", name: "Verify Google Address search populates Country, State, City, Zipcode, and Coordinates correctly." },
  { id: "TC_CREATE_BASIC_06", type: "Positive", name: "Verify Country field accepts and displays a valid country value." },
  { id: "TC_CREATE_BASIC_07", type: "Positive", name: "Verify State field accepts and displays a valid state value." },
  { id: "TC_CREATE_BASIC_08", type: "Positive", name: "Verify City field accepts and displays a valid city value." },
  { id: "TC_CREATE_BASIC_09", type: "Positive", name: "Verify Zipcode field accepts a valid postal code." },
  { id: "TC_CREATE_BASIC_10", type: "Positive", name: "Verify Street 1 field accepts a valid address value." },
  { id: "TC_CREATE_BASIC_11", type: "Positive", name: "Verify Street 2 field accepts an optional address value." },
  { id: "TC_CREATE_BASIC_12", type: "Positive", name: "Verify Resolved Coordinates are populated correctly after selecting an address." },
  { id: "TC_CREATE_BASIC_13", type: "Positive", name: "Verify clicking Continue to Authentication navigates to the Authentication step when all required fields are valid." },
  { id: "TC_CREATE_BASIC_14", type: "Positive", name: "Verify clicking Cancel navigates back without application errors." },
  { id: "TC_CREATE_BASIC_15", type: "Positive", name: "Verify all entered data is retained when moving from Basic Info to Authentication step." },

  // Create Tenant Screen(Basic Info) - Negative
  { id: "TC_CREATE_BASIC_NEG_01", type: "Negative", name: "Verify user cannot proceed when Company Name is left blank." },
  { id: "TC_CREATE_BASIC_NEG_02", type: "Negative", name: "Verify user cannot proceed when First Name is left blank." },
  { id: "TC_CREATE_BASIC_NEG_03", type: "Negative", name: "Verify user cannot proceed when Last Name is left blank." },
  { id: "TC_CREATE_BASIC_NEG_04", type: "Negative", name: "Verify Company Name field does not accept only blank spaces." },
  { id: "TC_CREATE_BASIC_NEG_05", type: "Negative", name: "Verify First Name field rejects numeric-only values." },
  { id: "TC_CREATE_BASIC_NEG_06", type: "Negative", name: "Verify Last Name field rejects special characters if validation is enforced." },
  { id: "TC_CREATE_BASIC_NEG_07", type: "Negative", name: "Verify upload of unsupported file types (.exe, .txt, .zip) is rejected." },
  { id: "TC_CREATE_BASIC_NEG_08", type: "Negative", name: "Verify oversized logo files are not uploaded and an error message is displayed." },
  { id: "TC_CREATE_BASIC_NEG_09", type: "Negative", name: "Verify corrupted image files cannot be uploaded." },
  { id: "TC_CREATE_BASIC_NEG_10", type: "Negative", name: "Verify invalid or non-existent address entered in Google Search does not populate address fields incorrectly." },
  { id: "TC_CREATE_BASIC_NEG_11", type: "Negative", name: "Verify Zipcode field rejects alphabetic characters if numeric-only validation exists." },
  { id: "TC_CREATE_BASIC_NEG_12", type: "Negative", name: "Verify SQL Injection strings entered in text fields are handled securely." },
  { id: "TC_CREATE_BASIC_NEG_13", type: "Negative", name: "Verify XSS scripts entered in input fields are sanitized and not executed." },
  { id: "TC_CREATE_BASIC_NEG_14", type: "Negative", name: "Verify clicking Continue to Authentication with mandatory fields missing displays validation messages." },
  { id: "TC_CREATE_BASIC_NEG_15", type: "Negative", name: "Verify application handles network/API failure during address lookup without crashing." },

  // Create Tenant Screen(Authentication) - Positive
  { id: "TC_CREATE_AUTH_01", type: "Positive", name: "Verify user can enter a valid Email, Phone Number, and Username and proceed to the Business Plan step." },
  { id: "TC_CREATE_AUTH_02", type: "Positive", name: "Verify a valid email address format is accepted successfully." },
  { id: "TC_CREATE_AUTH_03", type: "Positive", name: "Verify a valid phone number with the selected country code is accepted." },
  { id: "TC_CREATE_AUTH_04", type: "Positive", name: "Verify a unique username is accepted and saved successfully." },
  { id: "TC_CREATE_AUTH_05", type: "Positive", name: "Verify clicking Continue to Business Plan navigates to the next step when all required fields are valid." },
  { id: "TC_CREATE_AUTH_06", type: "Positive", name: "Verify clicking Go back to Basic Info navigates to the Basic Info step while retaining entered Authentication data." },

  // Create Tenant Screen(Authentication) - Negative
  { id: "TC_CREATE_AUTH_NEG_01", type: "Negative", name: "Verify user cannot proceed when the Email field is left blank." },
  { id: "TC_CREATE_AUTH_NEG_02", type: "Negative", name: "Verify user cannot proceed when the Phone Number field is left blank." },
  { id: "TC_CREATE_AUTH_NEG_03", type: "Negative", name: "Verify user cannot proceed when the Username field is left blank." },
  { id: "TC_CREATE_AUTH_NEG_04", type: "Negative", name: "Verify invalid email formats (e.g., user@, test.com) are rejected with a validation message." },
  { id: "TC_CREATE_AUTH_NEG_05", type: "Negative", name: "Verify phone number field rejects alphabetic and special characters." },
  { id: "TC_CREATE_AUTH_NEG_06", type: "Negative", name: "Verify duplicate/existing username is not accepted and displays an appropriate error message." },

  // Create Tenant Screen(Business Plan) - Positive
  { id: "TC_CREATE_PLAN_01", type: "Positive", name: "Verify user can select a valid Business Plan and the selection is displayed correctly." },
  { id: "TC_CREATE_PLAN_02", type: "Positive", name: "Verify user can upload a valid Agreement file (PDF/DOC) successfully." },
  { id: "TC_CREATE_PLAN_03", type: "Positive", name: "Verify user can select a valid From Date using the date picker." },
  { id: "TC_CREATE_PLAN_04", type: "Positive", name: "Verify user can select a valid To Date greater than the From Date." },
  { id: "TC_CREATE_PLAN_05", type: "Positive", name: "Verify user can select one or more Domains from the Domain dropdown." },
  { id: "TC_CREATE_PLAN_06", type: "Positive", name: "Verify user can enable the Select Market checkbox and save successfully." },
  { id: "TC_CREATE_PLAN_07", type: "Positive", name: "Verify user can enable the Enable Manufacturer checkbox and save successfully." },
  { id: "TC_CREATE_PLAN_08", type: "Positive", name: "Verify user can select a valid Payment Gateway (COD/CASHFREE/PAYTM)." },
  { id: "TC_CREATE_PLAN_09", type: "Positive", name: "Verify user can select multiple required fields and successfully create a tenant." },
  { id: "TC_CREATE_PLAN_10", type: "Positive", name: "Verify clicking Create Tenant with all mandatory fields completed creates the tenant successfully." },

  // Create Tenant Screen(Business Plan) - Negative
  { id: "TC_CREATE_PLAN_NEG_01", type: "Negative", name: "Verify tenant creation is blocked when no Business Plan is selected." },
  { id: "TC_CREATE_PLAN_NEG_02", type: "Negative", name: "Verify tenant creation is blocked when the Agreement file is not uploaded." },
  { id: "TC_CREATE_PLAN_NEG_03", type: "Negative", name: "Verify tenant creation is blocked when the From Date field is left empty." },
  { id: "TC_CREATE_PLAN_NEG_04", type: "Negative", name: "Verify tenant creation is blocked when the To Date field is left empty." },
  { id: "TC_CREATE_PLAN_NEG_05", type: "Negative", name: "Verify validation is displayed when To Date is earlier than From Date." },
  { id: "TC_CREATE_PLAN_NEG_06", type: "Negative", name: "Verify tenant creation is blocked when no Domain is selected." },
  { id: "TC_CREATE_PLAN_NEG_07", type: "Negative", name: "Verify tenant creation is blocked when no Payment Gateway is selected." },
  { id: "TC_CREATE_PLAN_NEG_08", type: "Negative", name: "Verify invalid file formats (.exe, .bat, .zip) are rejected during Agreement file upload." },
  { id: "TC_CREATE_PLAN_NEG_09", type: "Negative", name: "Verify oversized Agreement files exceeding the allowed limit are rejected." },
  { id: "TC_CREATE_PLAN_NEG_10", type: "Negative", name: "Verify clicking Create Tenant with multiple mandatory fields empty displays all required validation messages." },

  // Create Tenant confirmation popup Screen - Positive
  { id: "TC_CONFIRM_01", type: "Positive", name: "Verify clicking CREATE on the confirmation popup successfully creates the tenant and redirects to the success page/list." },
  { id: "TC_CONFIRM_02", type: "Positive", name: "Verify the confirmation popup is displayed after clicking Create Tenant with all mandatory fields completed." },
  { id: "TC_CONFIRM_03", type: "Positive", name: "Verify the selected Business Plan, Domain, Market, and Payment Gateway are retained correctly in the creation request." },
  { id: "TC_CONFIRM_04", type: "Positive", name: "Verify clicking DISCARD closes the confirmation popup and no tenant record is created." },

  // Create Tenant confirmation popup Screen - Negative
  { id: "TC_CONFIRM_NEG_01", type: "Negative", name: "Verify tenant creation is not performed when the user clicks DISCARD on the confirmation popup." },
  { id: "TC_CONFIRM_NEG_02", type: "Negative", name: "Verify clicking CREATE fails with an appropriate error message if the backend API returns an error response." },
  { id: "TC_CONFIRM_NEG_03", type: "Negative", name: "Verify duplicate tenant creation is prevented when the CREATE button is clicked multiple times rapidly." },
  { id: "TC_CONFIRM_NEG_04", type: "Negative", name: "Verify the confirmation popup is not displayed if any mandatory Business Plan fields are missing before submission." },

  // Create Tenant Success popup Screen - Positive
  { id: "TC_SUCCESS_01", type: "Positive", name: "Verify the success popup is displayed with the message 'Tenant created successfully' after successful tenant creation." },
  { id: "TC_SUCCESS_02", type: "Positive", name: "Verify clicking the OK button on the success popup closes the popup and redirects to the Tenant List page." },
  { id: "TC_SUCCESS_03", type: "Positive", name: "Verify the newly created tenant appears in the Tenant List with the correct details after clicking OK." },
  { id: "TC_SUCCESS_04", type: "Positive", name: "Verify only one success popup is displayed even if the Create Tenant button was clicked multiple times before completion." },

  // Create Tenant Success popup Screen - Negative
  { id: "TC_SUCCESS_NEG_01", type: "Negative", name: "Verify the success popup is not displayed when tenant creation fails due to a backend/API error." },
  { id: "TC_SUCCESS_NEG_02", type: "Negative", name: "Verify the success popup is not displayed if mandatory fields were bypassed and invalid data is submitted." },
  { id: "TC_SUCCESS_NEG_03", type: "Negative", name: "Verify clicking outside the success popup does not close it if the popup is configured as a mandatory acknowledgment dialog." },
  { id: "TC_SUCCESS_NEG_04", type: "Negative", name: "Verify duplicate tenant records are not created when the user refreshes the page immediately after the success popup appears." },

  // Create Tenant Screen(Theme) - Positive
  { id: "TC_THEME_01", type: "Positive", name: "Verify user can enter a valid unique Sub-domain and proceed to the KYC step successfully." },
  { id: "TC_THEME_02", type: "Positive", name: "Verify user can select a valid Brand Color using the color picker and the selected color is saved." },
  { id: "TC_THEME_03", type: "Positive", name: "Verify user can select a valid Primary Dark color and the value is stored correctly." },
  { id: "TC_THEME_04", type: "Positive", name: "Verify user can select a valid Primary Light color and the value is stored correctly." },
  { id: "TC_THEME_05", type: "Positive", name: "Verify user can enter a valid Font Color (Hex Code) and proceed successfully." },
  { id: "TC_THEME_06", type: "Positive", name: "Verify user can select a font family (e.g., Verdana, Arial, Helvetica) from the dropdown." },
  { id: "TC_THEME_07", type: "Positive", name: "Verify clicking Continue to KYC with all mandatory Theme fields completed navigates to the KYC screen." },
  { id: "TC_THEME_08", type: "Positive", name: "Verify clicking Draft & Quit saves the tenant as a draft and exits the wizard." },
  { id: "TC_THEME_09", type: "Positive", name: "Verify previously entered Theme data is retained when navigating back and returning to the Theme screen." },

  // Create Tenant Screen(Theme) - Negative
  { id: "TC_THEME_NEG_01", type: "Negative", name: "Verify validation is displayed when the Sub-domain field is left blank." },
  { id: "TC_THEME_NEG_02", type: "Negative", name: "Verify user cannot proceed when an already existing Sub-domain is entered." },
  { id: "TC_THEME_NEG_03", type: "Negative", name: "Verify validation is displayed when an invalid Sub-domain format is entered (special characters/spaces)." },
  { id: "TC_THEME_NEG_04", type: "Negative", name: "Verify user cannot proceed when the Brand Color field is empty." },
  { id: "TC_THEME_NEG_05", type: "Negative", name: "Verify user cannot proceed when the Primary Dark color field is empty." },
  { id: "TC_THEME_NEG_06", type: "Negative", name: "Verify user cannot proceed when the Font Family is not selected." },
  { id: "TC_THEME_NEG_07", type: "Negative", name: "Verify validation is displayed when an invalid Font Color value (e.g., #ZZZZZZ) is entered." },
  { id: "TC_THEME_NEG_08", type: "Negative", name: "Verify clicking Continue to KYC with one or more mandatory Theme fields missing prevents navigation and displays error messages." },

  // Create Tenant Screen(KYC) - Positive
  { id: "TC_KYC_01", type: "Positive", name: "Verify user can select a valid ID Proof document type and proceed successfully." },
  { id: "TC_KYC_02", type: "Positive", name: "Verify user can enter a valid ID Number and the value is accepted." },
  { id: "TC_KYC_03", type: "Positive", name: "Verify user can upload a valid Front Side image for ID Proof successfully." },
  { id: "TC_KYC_04", type: "Positive", name: "Verify user can upload a valid Back Side image for ID Proof successfully." },
  { id: "TC_KYC_05", type: "Positive", name: "Verify user can select a valid Address Proof document type successfully." },
  { id: "TC_KYC_06", type: "Positive", name: "Verify user can enter a valid Address Number and the value is accepted." },
  { id: "TC_KYC_07", type: "Positive", name: "Verify user can upload valid Front Side and Back Side images for Address Proof successfully." },
  { id: "TC_KYC_08", type: "Positive", name: "Verify clicking Draft & Approve Later saves the KYC details in draft status successfully." },
  { id: "TC_KYC_09", type: "Positive", name: "Verify clicking Approve & Send Verification Mail with all mandatory fields completed submits KYC successfully." },
  { id: "TC_KYC_10", type: "Positive", name: "Verify a verification email is sent successfully after clicking Approve & Send Verification Mail." },

  // Create Tenant Screen(KYC) - Negative
  { id: "TC_KYC_NEG_01", type: "Negative", name: "Verify validation is displayed when ID Proof Document Type is not selected." },
  { id: "TC_KYC_NEG_02", type: "Negative", name: "Verify validation is displayed when ID Number is left blank." },
  { id: "TC_KYC_NEG_03", type: "Negative", name: "Verify validation is displayed when ID Proof Front Side document is not uploaded." },
  { id: "TC_KYC_NEG_04", type: "Negative", name: "Verify validation is displayed when ID Proof Back Side document is not uploaded." },
  { id: "TC_KYC_NEG_05", type: "Negative", name: "Verify validation is displayed when Address Proof Document Type is not selected." },
  { id: "TC_KYC_NEG_06", type: "Negative", name: "Verify validation is displayed when Address Number is left blank." },
  { id: "TC_KYC_NEG_07", type: "Negative", name: "Verify validation is displayed when Address Proof Front Side document is not uploaded." },
  { id: "TC_KYC_NEG_08", type: "Negative", name: "Verify validation is displayed when Address Proof Back Side document is not uploaded." },
  { id: "TC_KYC_NEG_09", type: "Negative", name: "Verify unsupported file formats (e.g., .exe, .bat, .zip) are rejected during document upload." },
  { id: "TC_KYC_NEG_10", type: "Negative", name: "Verify oversized document files exceeding the allowed limit are rejected with an appropriate error message." },

  // Create Tenant KYC Approve Screen - Positive
  { id: "TC_KYC_APP_01", type: "Positive", name: "Verify clicking APPROVE successfully approves the tenant KYC and displays a success message." },
  { id: "TC_KYC_APP_02", type: "Positive", name: "Verify clicking CANCEL closes the KYC approval popup without approving the KYC." },
  { id: "TC_KYC_APP_03", type: "Positive", name: "Verify the Approve KYC confirmation popup appears when the user clicks Approve & Send Verification Mail." },
  { id: "TC_KYC_APP_04", type: "Positive", name: "Verify KYC status is updated to Approved after successful approval." },

  // Create Tenant KYC Approve Screen - Negative
  { id: "TC_KYC_APP_NEG_01", type: "Negative", name: "Verify KYC approval is blocked when mandatory KYC details are missing." },
  { id: "TC_KYC_APP_NEG_02", type: "Negative", name: "Verify KYC approval fails when invalid or corrupted documents are uploaded." },
  { id: "TC_KYC_APP_NEG_03", type: "Negative", name: "Verify an error message is displayed when the KYC approval API returns a failure response." },
  { id: "TC_KYC_APP_NEG_04", type: "Negative", name: "Verify multiple rapid clicks on APPROVE do not create duplicate KYC approvals." }
];

const wb = XLSX.readFile(FILE);

// Remove the sheet if it already exists to start fresh
if (wb.SheetNames.includes(SHEET_NAME)) {
  wb.SheetNames = wb.SheetNames.filter((name) => name !== SHEET_NAME);
  delete wb.Sheets[SHEET_NAME];
}

const headers = ["TC_ID", "Module", "Scenario", "Type"];
const sheetData = [headers];

testCases.forEach((tc) => {
  sheetData.push([tc.id, "Tenant super admin", tc.name, tc.type]);
});

const ws = XLSX.utils.aoa_to_sheet(sheetData);
wb.SheetNames.push(SHEET_NAME);
wb.Sheets[SHEET_NAME] = ws;

// Also update the Regression sheet
const REG_SHEET = "Regression";
if (wb.SheetNames.includes(REG_SHEET)) {
  const regRows = XLSX.utils.sheet_to_json(wb.Sheets[REG_SHEET]);
  const exists = regRows.some((r) => r.TestName === "TenantsSuperAdminTest");
  if (!exists) {
    regRows.push({ TestName: "TenantsSuperAdminTest", Run: "YES", Mode: "serial" });
    const regHeaders = ["TestName", "Run", "Mode"];
    const regWs = XLSX.utils.json_to_sheet(regRows, { header: regHeaders });
    wb.Sheets[REG_SHEET] = regWs;
    console.log("Added TenantsSuperAdminTest to Regression sheet.");
  }
}

XLSX.writeFile(wb, FILE);
console.log(`Successfully created sheet "${SHEET_NAME}" with ${testCases.length} rows in ${FILE}.`);
