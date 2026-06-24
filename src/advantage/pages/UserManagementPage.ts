export default class UserManagementPage {

    // Navigation

    static USER_MANAGEMENT_MENU =
        "//span[normalize-space()='User Management']";

    static PAGE_TITLE =
        "//h1[contains(normalize-space(),'User Management')]";

    // Search

    static SEARCH_BOX =
        "input[placeholder='Name / Email']";

    static NO_DATA_MESSAGE =
        "text=No users found.";

    // Table

    static TABLE =
        "table";

    static TABLE_BODY =
        "tbody";

    static TABLE_ROWS =
        "tbody tr";

    // Tabs

    static ALL_USERS_TAB =
        "//button[contains(.,'All Users')]";

    static PENDING_TAB =
        "//button[contains(.,'Pending Approval')]";

    static APPROVED_TAB =
        "//button[contains(.,'Approved')]";

    static REJECTED_TAB =
        "//button[contains(.,'Rejected')]";

    // Action Buttons

    static VIEW_BUTTON =
        "button[aria-label='View']";

    static EDIT_BUTTON =
        "button[aria-label='Edit']";

    static DELETE_BUTTON =
        "button[aria-label='Delete']";

    // View Page

    static VIEW_PAGE_TITLE =
        "//h1[contains(normalize-space(),'View User')]";

    static USER_INFORMATION_SECTION =
        "//h2[contains(.,'User Information')]";

    static BACK_BUTTON =
        "//button[normalize-space()='Back']";

    // Edit Page

    static EDIT_PAGE_TITLE =
        "//h1[contains(normalize-space(),'Edit User')]";

    static FIRST_NAME_INPUT =
        "//label[contains(.,'First Name')]/following::input[1]";

    static LAST_NAME_INPUT =
        "//label[contains(.,'Last Name')]/following::input[1]";

    static PHONE_INPUT =
        "//label[contains(.,'Phone')]/following::input[1]";

    static EMAIL_INPUT =
        "//label[contains(.,'Email')]/following::input[1]";

    static CITY_INPUT =
        "//label[contains(.,'City')]/following::input[1]";

    static STATE_INPUT =
        "//label[contains(.,'State')]/following::input[1]";

    static COUNTRY_INPUT =
        "//label[contains(.,'Country')]/following::input[1]";

    static ZIPCODE_INPUT =
        "//label[contains(.,'Zipcode')]/following::input[1]";

    static USER_NAME_INPUT =
        "//label[contains(.,'User Name')]/following::input[1]";

    static ABOUT_ME_TEXTAREA =
        "//label[contains(.,'About Me')]/following::textarea[1]";

    static UPDATE_BUTTON =
        "//button[normalize-space()='Update']";

    static CANCEL_BUTTON =
        "//button[normalize-space()='Cancel']";

    // Delete

    static CONFIRM_DELETE_BUTTON =
        "//button[contains(.,'Delete') or contains(.,'Confirm')]";

    static DELETE_SUCCESS_MESSAGE =
        "text=/deleted|success/i";

    // Toast Messages

    static SUCCESS_TOAST =
        "[role='status']";

    static ERROR_TOAST =
        "[role='alert']";

    // Create User

static CREATE_BUTTON =
    "button:has-text('Create')";

static FULL_NAME =
    "input[placeholder='e.g. Ravi Kumar']";

static EMAIL =
    "input[placeholder='ravi@example.com']";

static PHONE =
    "input[placeholder*='98765']";

static DOB =
    "input[type='date']";

static GENDER =
    "input[placeholder='Select gender']";

static ADDRESS =
    "input[placeholder*='Street address']";

static GOOGLE_ADDRESS_ITEM =
    ".pac-item";

static GOOGLE_ADDRESS_POPUP =
    ".pac-container";

static SAVE_CONTINUE_BUTTON =
    "button:has-text('Save & Continue')";

// Step 2 - Service & Skills

static CATEGORY =
    "input[placeholder='Select category...']";

static ROLE =
    "input[placeholder='Select role...']";

static INTERMEDIATE_LEVEL =
    "button:has-text('Intermediate')";

static EXPERIENCE =
    "input[placeholder='e.g. 3']";

// Step 2 - Account Access

static USERNAME =
    "input[placeholder='Create username']";

static PASSWORD =
    "input[placeholder='Enter password']";

static CONFIRM_PASSWORD =
    "input[placeholder='Re-enter password']";

static CREATE_USER_BUTTON =
    "button:has-text('Create User')";

static SUCCESS_MESSAGE =
    "text=/success|created/i";

static ID_TYPE =
    "input[role='combobox'][value='Aadhaar Card']";

static ADDRESS_TYPE =
    "input[placeholder='Select address type']";

static ID_NUMBER =
    "input[placeholder='1234 5678 9012']";

static FILE_UPLOAD =
    "input[type='file']";
static COMPLETE_SETUP_BUTTON =
    "//button[contains(.,'Complete Setup')]";
}
