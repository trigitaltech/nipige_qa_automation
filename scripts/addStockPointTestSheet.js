/**
 * Updates (or replaces) the "StockPointSellerTest" sheet in testData.xlsx — 68 test cases.
 * Run once: node scripts/addStockPointTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "StockPointSellerTest";

const rows = [
    // ── Stock Points Listing Screen: Positive ──
    {
        "TestID": "TC_LIST_01",
        "Issue": "27001",
        "Description": "Verify the Stock Points page loads successfully with all summary cards, search box, and stock point records displayed.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Stock Points page loads successfully with summary cards and search box.",
        "TC_ID": "TC_LIST_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify page load success.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_LIST_02",
        "Issue": "27002",
        "Description": "Verify the Current Page Results count matches the number of records displayed in the table.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Count indicator matches rows displayed.",
        "TC_ID": "TC_LIST_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify current page count matches table rows count.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_LIST_03",
        "Issue": "27003",
        "Description": "Verify the Total Stock Points count displays the correct total number of stock points.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Total count indicator matches database records count.",
        "TC_ID": "TC_LIST_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify total stock points count logic matches.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_LIST_04",
        "Issue": "27004",
        "Description": "Verify searching with a valid Stock Point name returns the correct matching record.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Matching stock point is displayed in listing.",
        "TC_ID": "TC_LIST_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify search by name returns correct record.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_LIST_05",
        "Issue": "27005",
        "Description": "Verify searching with a valid Email ID returns the correct stock point record.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Matching email record is displayed in listing.",
        "TC_ID": "TC_LIST_05",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify search by email returns correct record.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_LIST_06",
        "Issue": "27006",
        "Description": "Verify clicking the View (Eye) icon opens the selected Stock Point details page.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Details page displays matching information.",
        "TC_ID": "TC_LIST_06",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify View icon click navigates to details.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_LIST_07",
        "Issue": "27007",
        "Description": "Verify clicking Create Stock Point navigates to the Create Stock Point screen.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Create page form loads successfully.",
        "TC_ID": "TC_LIST_07",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify Create button navigates to onboarding.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_LIST_08",
        "Issue": "27008",
        "Description": "Verify clicking the Refresh icon reloads the latest stock point data successfully.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Grid reloads latest database records.",
        "TC_ID": "TC_LIST_08",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify refresh icon reloads latest data.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_LIST_09",
        "Issue": "27009",
        "Description": "Verify the correct Office Type badge (Branch Office, Head Office, Default) is displayed for each stock point.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Badge displays corresponding office type.",
        "TC_ID": "TC_LIST_09",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify office type badges render correctly.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_LIST_10",
        "Issue": "27010",
        "Description": "Verify clicking the Back button navigates to the previous page successfully.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Redirects back to main listing view grid.",
        "TC_ID": "TC_LIST_10",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify back arrow redirects back to features list.",
        "Type": "Positive"
    },

    // ── Stock Points Listing Screen: Negative ──
    {
        "TestID": "TC_LIST_NEG_01",
        "Issue": "27011",
        "Description": "Verify searching with a non-existent Stock Point name displays no records found.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "No records found is displayed.",
        "TC_ID": "TC_LIST_NEG_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify searching non-existing name displays no records found.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_LIST_NEG_02",
        "Issue": "27012",
        "Description": "Verify searching with invalid special characters (@#$%^&*) does not crash the application.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Special characters are handled safely without crash.",
        "TC_ID": "TC_LIST_NEG_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify search handles special characters safely.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_LIST_NEG_03",
        "Issue": "27013",
        "Description": "Verify the page handles API failure gracefully while loading stock point records.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Toaster error is displayed; list fails gracefully.",
        "TC_ID": "TC_LIST_NEG_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify graceful error on API failure loading records.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_LIST_NEG_04",
        "Issue": "27014",
        "Description": "Verify an appropriate error message is displayed when the stock point details API fails after clicking the View icon.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "API details request failure displays gracefully.",
        "TC_ID": "TC_LIST_NEG_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify details API failure displays error message.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_LIST_NEG_05",
        "Issue": "27015",
        "Description": "Verify the table displays an empty-state message when no stock points exist.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Empty list warning displays.",
        "TC_ID": "TC_LIST_NEG_05",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify table displays empty state.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_LIST_NEG_06",
        "Issue": "27016",
        "Description": "Verify incorrect or malformed email search values do not return unrelated records.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Malformed queries display zero matches.",
        "TC_ID": "TC_LIST_NEG_06",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify malformed email search returns zero results.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_LIST_NEG_07",
        "Issue": "27017",
        "Description": "Verify rapid multiple clicks on the Refresh button do not create duplicate API requests or UI issues.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "UI remains stable; requests are single-processed.",
        "TC_ID": "TC_LIST_NEG_07",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify rapid refresh click handles safely.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_LIST_NEG_08",
        "Issue": "27018",
        "Description": "Verify clicking the View icon for a deleted/inactive stock point displays an appropriate error message.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Details warning is shown for inactive stock points.",
        "TC_ID": "TC_LIST_NEG_08",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify inactive view action displays warning.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_LIST_NEG_09",
        "Issue": "27019",
        "Description": "Verify unauthorized users cannot access the Stock Points page and receive an access denied message.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Blocked or redirects to login.",
        "TC_ID": "TC_LIST_NEG_09",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify unauthorized access blocks page load.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_LIST_NEG_10",
        "Issue": "27020",
        "Description": "Verify the summary cards do not display negative, null, or incorrect counts when API data is invalid.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Count defaults to zero.",
        "TC_ID": "TC_LIST_NEG_10",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify count defaults to zero on invalid API response.",
        "Type": "Negative"
    },

    // ── View Stock Point Screen: Positive ──
    {
        "TestID": "TC_VIEW_01",
        "Issue": "27021",
        "Description": "Verify the View Stock Point page loads successfully with all Stock Point details displayed.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "View page loads successfully showing detailed tabs.",
        "TC_ID": "TC_VIEW_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify details page load success.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_VIEW_02",
        "Issue": "27022",
        "Description": "Verify Office information (Stock Point Name, Office Type, Email, Phone, City, State, Country, Zipcode) is displayed correctly.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Office details display correctly.",
        "TC_ID": "TC_VIEW_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify office info matches data model.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_VIEW_03",
        "Issue": "27023",
        "Description": "Verify Organization details (Organization Name, Registration No, GST No, FSSAI No, Own Company) are displayed correctly.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Organization details display correctly.",
        "TC_ID": "TC_VIEW_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify organization details matches data model.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_VIEW_04",
        "Issue": "27024",
        "Description": "Verify Bill To section displays the linked billing office information correctly.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Billing office linked name displays correctly.",
        "TC_ID": "TC_VIEW_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify billing office linked details.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_VIEW_05",
        "Issue": "27025",
        "Description": "Verify Authentication details (Username, Email, Phone, Security Question, Security Answer) are displayed correctly.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Authentication credentials display correctly.",
        "TC_ID": "TC_VIEW_05",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify authentication details matches data model.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_VIEW_06",
        "Issue": "27026",
        "Description": "Verify the Office Type badge (e.g., Branch Office) matches the configured office type.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Office type badge renders correctly.",
        "TC_ID": "TC_VIEW_06",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify badge type matches configurations.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_VIEW_07",
        "Issue": "27027",
        "Description": "Verify clicking the Back button navigates to the Stock Point listing page.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Redirects back to list.",
        "TC_ID": "TC_VIEW_07",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify back navigates to listing.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_VIEW_08",
        "Issue": "27028",
        "Description": "Verify clicking the Create button navigates to the Create Stock Point page.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Redirects to onboarding screen.",
        "TC_ID": "TC_VIEW_08",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify onboarding redirect from details page.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_VIEW_09",
        "Issue": "27029",
        "Description": "Verify the Search box is displayed and accepts valid search input.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Search box accepts search term input.",
        "TC_ID": "TC_VIEW_09",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify search displays on details screen.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_VIEW_10",
        "Issue": "27030",
        "Description": "Verify the Refresh button reloads the latest stock point details successfully.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Details refreshes to latest values.",
        "TC_ID": "TC_VIEW_10",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify refresh updates details page details.",
        "Type": "Positive"
    },

    // ── View Stock Point Screen: Negative ──
    {
        "TestID": "TC_VIEW_NEG_01",
        "Issue": "27031",
        "Description": "Verify an appropriate error message is displayed when the Stock Point details API returns no data.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "API empty details displays warning.",
        "TC_ID": "TC_VIEW_NEG_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify error on empty details response.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_VIEW_NEG_02",
        "Issue": "27032",
        "Description": "Verify the page handles API/network failure gracefully while loading stock point details.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Toaster error is displayed gracefully.",
        "TC_ID": "TC_VIEW_NEG_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify details API failures handle.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_VIEW_NEG_03",
        "Issue": "27033",
        "Description": "Verify accessing the page with an invalid Stock Point ID displays a \"Record Not Found\" message.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "\"Record Not Found\" displays.",
        "TC_ID": "TC_VIEW_NEG_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify invalid ID details view throws not found.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_VIEW_NEG_04",
        "Issue": "27034",
        "Description": "Verify missing Organization information does not break the page layout and displays placeholders/default values.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Default placeholders displays cleanly.",
        "TC_ID": "TC_VIEW_NEG_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify missing organization fields has placeholder.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_VIEW_NEG_05",
        "Issue": "27035",
        "Description": "Verify missing Bill To information is displayed as \"-\" or appropriate default values.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "\"-\" placeholder displays.",
        "TC_ID": "TC_VIEW_NEG_05",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify missing billing link returns dash.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_VIEW_NEG_06",
        "Issue": "27036",
        "Description": "Verify missing Authentication details are handled gracefully without page crashes.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Empty credentials render placeholders cleanly.",
        "TC_ID": "TC_VIEW_NEG_06",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify missing auth info doesn't crash layout.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_VIEW_NEG_07",
        "Issue": "27037",
        "Description": "Verify unauthorized users cannot access the View Stock Point page and receive an access denied message.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Blocked or redirects to login.",
        "TC_ID": "TC_VIEW_NEG_07",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify unauthorized details access blocks loading.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_VIEW_NEG_08",
        "Issue": "27038",
        "Description": "Verify invalid search input (special characters only) does not cause application errors.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Special characters searches are handled safely.",
        "TC_ID": "TC_VIEW_NEG_08",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify details search handles special characters safely.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_VIEW_NEG_09",
        "Issue": "27039",
        "Description": "Verify the Refresh button handles API timeout/failure scenarios correctly.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Refresh stops and toaster displays error.",
        "TC_ID": "TC_VIEW_NEG_09",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify details refresh handles timeouts gracefully.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_VIEW_NEG_10",
        "Issue": "27040",
        "Description": "Verify null or empty values in fields (Email, Phone, GST No, FSSAI No, Security Answer) are displayed properly without UI corruption.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Render placeholders safely without UI breaks.",
        "TC_ID": "TC_VIEW_NEG_10",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify null/empty values don't break UI layout.",
        "Type": "Negative"
    },

    // ── Stock Point Onboarding – Office Screen: Positive ──
    {
        "TestID": "TC_CR_OFF_01",
        "Issue": "27041",
        "Description": "Verify user can create a Stock Point by entering all mandatory fields with valid data and click Next successfully.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Navigates to Step 2 Organization page.",
        "TC_ID": "TC_CR_OFF_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify step 1 submits valid mandatory data.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_OFF_02",
        "Issue": "27042",
        "Description": "Verify valid email address can be added using the Add Email button.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Email input row is added successfully.",
        "TC_ID": "TC_CR_OFF_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify adding email row succeeds.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_OFF_03",
        "Issue": "27043",
        "Description": "Verify valid phone number with country code can be added using the Add Phone button.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Phone input row is added successfully.",
        "TC_ID": "TC_CR_OFF_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify adding phone row succeeds.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_OFF_04",
        "Issue": "27044",
        "Description": "Verify selecting a valid location from Google Search auto-populates Country, State, City, and Zipcode fields.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Fields populate correctly from Google maps search.",
        "TC_ID": "TC_CR_OFF_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify Google address selection auto-populates.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_OFF_05",
        "Issue": "27045",
        "Description": "Verify user can select different Office Types from the dropdown successfully.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Dropdown selection updates successfully.",
        "TC_ID": "TC_CR_OFF_05",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify office type selects dropdown options.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_OFF_06",
        "Issue": "27046",
        "Description": "Verify map pin location is updated correctly when a valid address is searched and selected.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Map pointer updates to selected pin.",
        "TC_ID": "TC_CR_OFF_06",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify map pin updates on location search.",
        "Type": "Positive"
    },

    // ── Stock Point Onboarding – Office Screen: Negative ──
    {
        "TestID": "TC_CR_OFF_NEG_01",
        "Issue": "27047",
        "Description": "Verify validation message appears when Stock Point Name is left blank and user clicks Next.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows Name is required.",
        "TC_ID": "TC_CR_OFF_NEG_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify validation warning on empty stock point name.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_OFF_NEG_02",
        "Issue": "27048",
        "Description": "Verify validation message appears when Email field contains an invalid email format.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows Email is malformed.",
        "TC_ID": "TC_CR_OFF_NEG_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify validation warning on invalid email inputs.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_OFF_NEG_03",
        "Issue": "27049",
        "Description": "Verify validation message appears when Phone Number contains alphabets or special characters.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows Phone is invalid.",
        "TC_ID": "TC_CR_OFF_NEG_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify validation warning on invalid phone inputs.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_OFF_NEG_04",
        "Issue": "27050",
        "Description": "Verify user cannot proceed when mandatory fields (Country, State, City, Zipcode) are empty.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Required fields highlight; step navigation blocked.",
        "TC_ID": "TC_CR_OFF_NEG_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify step navigation blocks on empty address fields.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_OFF_NEG_05",
        "Issue": "27051",
        "Description": "Verify Zipcode field rejects invalid formats (letters, special characters, insufficient digits).",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows Zipcode format is invalid.",
        "TC_ID": "TC_CR_OFF_NEG_05",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify zipcode field rejects malformed digits.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_OFF_NEG_06",
        "Issue": "27052",
        "Description": "Verify user cannot proceed when Google location search returns no valid address or an invalid address is entered.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Warning prompts on missing location details.",
        "TC_ID": "TC_CR_OFF_NEG_06",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify location bounds check blocks on empty map values.",
        "Type": "Negative"
    },

    // ── Stock Point Onboarding – Organization Screen: Positive ──
    {
        "TestID": "TC_CR_ORG_01",
        "Issue": "27053",
        "Description": "Verify user can proceed to the next step by entering valid Organization Name, Logo, Registration No, GST/License No, and FSSAI No.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Navigates to Step 3 Authentication page.",
        "TC_ID": "TC_CR_ORG_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify step 2 submits valid organization data.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_ORG_02",
        "Issue": "27054",
        "Description": "Verify user can upload a valid logo file (JPG/PNG) successfully.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Logo preview updates successfully.",
        "TC_ID": "TC_CR_ORG_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify file upload accepts logo format.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_ORG_03",
        "Issue": "27055",
        "Description": "Verify Organization Name uniqueness validation passes for a new unique organization name.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Unique name accepted successfully.",
        "TC_ID": "TC_CR_ORG_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify unique organization name validation.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_ORG_04",
        "Issue": "27056",
        "Description": "Verify user can select the Own Company checkbox and continue successfully.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Checkbox selects; continuation accepted.",
        "TC_ID": "TC_CR_ORG_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify Own Company checkbox updates.",
        "Type": "Positive"
    },

    // ── Stock Point Onboarding – Organization Screen: Negative ──
    {
        "TestID": "TC_CR_ORG_NEG_01",
        "Issue": "27057",
        "Description": "Verify validation message appears when Organization Name is left blank and user clicks Next.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows Organization Name is required.",
        "TC_ID": "TC_CR_ORG_NEG_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify validation warning on empty org name.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_ORG_NEG_02",
        "Issue": "27058",
        "Description": "Verify validation message appears when a duplicate Organization Name is entered.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows duplicate org name restriction.",
        "TC_ID": "TC_CR_ORG_NEG_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify duplicate org name creation is blocked.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_ORG_NEG_03",
        "Issue": "27059",
        "Description": "Verify user cannot proceed without uploading the mandatory Logo file.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows Logo upload is required.",
        "TC_ID": "TC_CR_ORG_NEG_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify mandatory logo file checks block submit.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_ORG_NEG_04",
        "Issue": "27060",
        "Description": "Verify validation message appears when Registration No, GST/License No, or FSSAI No is left empty and user clicks Next.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Required field highlights displays.",
        "TC_ID": "TC_CR_ORG_NEG_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify registration numbers validation triggers.",
        "Type": "Negative"
    },

    // ── Stock Point Onboarding - Authentication Screen: Positive ──
    {
        "TestID": "TC_CR_AUTH_01",
        "Issue": "27061",
        "Description": "Verify user can proceed to the next step by entering valid Username, Email, Phone Number, and Password.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Stock point onboarding finishes successfully.",
        "TC_ID": "TC_CR_AUTH_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify step 3 submits valid credentials data.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_AUTH_02",
        "Issue": "27062",
        "Description": "Verify system accepts a valid email format (e.g., user@example.com).",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Username email format accepted successfully.",
        "TC_ID": "TC_CR_AUTH_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify credential email validation checks.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_AUTH_03",
        "Issue": "27063",
        "Description": "Verify system accepts a valid phone number with country code selected.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Credentials phone accepts digits.",
        "TC_ID": "TC_CR_AUTH_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify credential phone validation checks.",
        "Type": "Positive"
    },
    {
        "TestID": "TC_CR_AUTH_04",
        "Issue": "27064",
        "Description": "Verify password visibility toggle (eye icon) correctly shows and hides the password.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Eye toggle toggles password characters view.",
        "TC_ID": "TC_CR_AUTH_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify visibility eye toggles password text.",
        "Type": "Positive"
    },

    // ── Stock Point Onboarding - Authentication Screen: Negative ──
    {
        "TestID": "TC_CR_AUTH_NEG_01",
        "Issue": "27065",
        "Description": "Verify validation message appears when Username is left blank and user clicks Next.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows Username is required.",
        "TC_ID": "TC_CR_AUTH_NEG_01",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify validation warning on empty username.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_AUTH_NEG_02",
        "Issue": "27066",
        "Description": "Verify validation message appears when an invalid email format is entered (e.g., abc@com).",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows Email format is invalid.",
        "TC_ID": "TC_CR_AUTH_NEG_02",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify validation warning on invalid email inputs.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_AUTH_NEG_03",
        "Issue": "27067",
        "Description": "Verify validation message appears when Phone Number contains alphabets or special characters.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error shows Phone is invalid.",
        "TC_ID": "TC_CR_AUTH_NEG_03",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify validation warning on invalid phone inputs.",
        "Type": "Negative"
    },
    {
        "TestID": "TC_CR_AUTH_NEG_04",
        "Issue": "27068",
        "Description": "Verify user cannot proceed when Password field is empty or does not meet password policy requirements.",
        "UserName": "grocery@gmail.com",
        "Password": "Test@123",
        "persona": "seller",
        "ExpectedResult": "Validation error warns password rules.",
        "TC_ID": "TC_CR_AUTH_NEG_04",
        "Module": "Stock Point Onboarding",
        "Scenario": "Verify password policy rules validation warning.",
        "Type": "Negative"
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
    "TC_ID",
    "Module",
    "Scenario",
    "Type"
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
