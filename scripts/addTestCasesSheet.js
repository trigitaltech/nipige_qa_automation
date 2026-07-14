/**
 * Updates (or replaces) the "Commission Rules" sheet in testData.xlsx — 56 test cases.
 * Run once: node scripts/addTestCasesSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "Commission Rules";

const testCases = [
  // Listing Screen Positive
  { id: "TC_COM_01", desc: "Verify Commission Rules page loads successfully with all summary cards, filters, search bar, and rules list." },
  { id: "TC_COM_02", desc: "Verify user can search for an existing Rule Name and the correct rule is displayed." },
  { id: "TC_COM_03", desc: "Verify user can filter rules using tabs (All Types, Basement, Ground, Develop) and matching records are displayed." },
  { id: "TC_COM_04", desc: "Verify user can filter rules using the 'Applicable To' dropdown and only relevant rules are shown." },
  { id: "TC_COM_05", desc: "Verify clicking the View icon opens the selected Commission Rule details page." },
  { id: "TC_COM_06", desc: "Verify clicking the Edit icon opens the selected Commission Rule in edit mode." },
  { id: "TC_COM_07", desc: "Verify clicking the '+ Create Commission Rule' button navigates to the Create Commission Rule page." },
  { id: "TC_COM_08", desc: "Verify Export button successfully downloads the Commission Rules data." },
  
  // Listing Screen Negative
  { id: "TC_COM_09", desc: "Verify searching with an invalid Rule Name displays 'No Records Found' or an empty result." },
  { id: "TC_COM_10", desc: "Verify system handles special characters entered in the search field without crashing." },
  { id: "TC_COM_11", desc: "Verify unauthorized users cannot access the Create Commission Rule page." },
  { id: "TC_COM_12", desc: "Verify unauthorized users cannot edit an existing Commission Rule." },
  { id: "TC_COM_13", desc: "Verify Export functionality displays an appropriate error message when the export service is unavailable." },
  { id: "TC_COM_14", desc: "Verify clicking View for a deleted/non-existing Commission Rule displays an appropriate error message." },
  { id: "TC_COM_15", desc: "Verify pagination controls are disabled or handled correctly when there is only one page of records." },
  { id: "TC_COM_16", desc: "Verify expired user session redirects the user to the Login page when attempting any action (Search, View, Edit, Export, Create)." },
  
  // Creation Screen Positive
  { id: "TC_COM_17", desc: "Verify user can create a Commission Rule by entering all valid mandatory fields and clicking Save." },
  { id: "TC_COM_18", desc: "Verify Rule Name field accepts valid alphanumeric values and saves successfully." },
  { id: "TC_COM_19", desc: "Verify user can select Rule Type, Event Type, Applicable To, and Applied On from the dropdown lists." },
  { id: "TC_COM_20", desc: "Verify Charge Code field accepts a valid charge code value." },
  { id: "TC_COM_21", desc: "Verify Commission Value (%) can be entered manually and reflected correctly in Live Preview." },
  { id: "TC_COM_22", desc: "Verify Commission Value (%) can be adjusted using the slider control." },
  { id: "TC_COM_23", desc: "Verify Live Preview section updates dynamically when Rule Name is changed." },
  { id: "TC_COM_24", desc: "Verify Live Preview displays correct Rule Type, Event Type, Applicable To, and Applied On values based on user selections." },
  { id: "TC_COM_25", desc: "Verify clicking Cancel returns the user to the Commission Rules listing page without saving data." },
  { id: "TC_COM_26", desc: "Verify newly created Commission Rule appears in the Commission Rules list after successful save." },
  
  // Creation Screen Negative
  { id: "TC_COM_27", desc: "Verify validation message appears when Rule Name is left blank." },
  { id: "TC_COM_28", desc: "Verify validation message appears when Event Type is not selected." },
  { id: "TC_COM_29", desc: "Verify validation message appears when Applicable To is not selected." },
  { id: "TC_COM_30", desc: "Verify validation message appears when Applied On is not selected." },
  { id: "TC_COM_31", desc: "Verify validation message appears when Charge Code is left blank." },
  { id: "TC_COM_32", desc: "Verify system does not allow Commission Value below the minimum allowed percentage." },
  { id: "TC_COM_33", desc: "Verify system does not allow Commission Value above the maximum allowed percentage." },
  { id: "TC_COM_34", desc: "Verify Rule Name field rejects special characters if they are not permitted by business rules." },
  { id: "TC_COM_35", desc: "Verify duplicate Rule Name cannot be created if uniqueness is required." },
  { id: "TC_COM_36", desc: "Verify user cannot save the Commission Rule when one or more mandatory fields are empty." },
  
  // View Screen Positive
  { id: "TC_COM_37", desc: "Verify View Commission Rule page loads successfully with all commission rule details displayed correctly." },
  { id: "TC_COM_38", desc: "Verify Rule Name, Rule Type, Event Type, Applicable To, Applied On, Charge Code, and Commission Percentage are displayed correctly." },
  { id: "TC_COM_39", desc: "Verify MTD Revenue, Applied Orders, and Rate summary cards display correct values." },
  { id: "TC_COM_40", desc: "Verify Recent Applications section displays the latest commission transactions with correct order numbers and amounts." },
  { id: "TC_COM_41", desc: "Verify clicking the Edit Rule button navigates the user to the Edit Commission Rule screen." },
  
  // View Screen Negative
  { id: "TC_COM_42", desc: "Verify appropriate error message is displayed when an invalid Commission Rule ID is accessed." },
  { id: "TC_COM_43", desc: "Verify deleted or inactive Commission Rules cannot be viewed and display an appropriate error message." },
  { id: "TC_COM_44", desc: "Verify unauthorized users cannot access the View Commission Rule page." },
  { id: "TC_COM_45", desc: "Verify the system handles missing or null Commission Rule data without page crashes." },
  { id: "TC_COM_46", desc: "Verify expired user sessions redirect the user to the Login page when accessing the View Commission Rule page." },
  
  // Edit Screen Positive
  { id: "TC_COM_47", desc: "Verify user can successfully update the Commission Rule by modifying valid field values and clicking Update Rule." },
  { id: "TC_COM_48", desc: "Verify changes made to Rule Name, Rule Type, Event Type, Applicable To, Applied On, Charge Code, and Commission Value are saved successfully." },
  { id: "TC_COM_49", desc: "Verify Live Preview updates automatically when Commission Value (%) is changed." },
  { id: "TC_COM_50", desc: "Verify user can update Commission Value using both the input field and slider control." },
  { id: "TC_COM_51", desc: "Verify clicking Delete successfully removes the Commission Rule and redirects to the Commission Rules listing page." },
  
  // Edit Screen Negative
  { id: "TC_COM_52", desc: "Verify validation message appears when Rule Name is cleared and user clicks Update Rule." },
  { id: "TC_COM_53", desc: "Verify validation message appears when Charge Code is removed and user attempts to save." },
  { id: "TC_COM_54", desc: "Verify system does not allow Commission Value below the minimum allowed percentage." },
  { id: "TC_COM_55", desc: "Verify system does not allow Commission Value above the maximum allowed percentage." },
  { id: "TC_COM_56", desc: "Verify user cannot update the Commission Rule when one or more mandatory fields are empty." }
];

const headers = [
    "TestID",
    "Issue",
    "Description",
    "UserName",
    "Password",
    "persona"
];

// Generate spreadsheet data starting with headers
const wsData = [headers];

testCases.forEach((tc, index) => {
    wsData.push([
        tc.id,
        (6001 + index).toString(), // Auto-generate issue number starting from 6001
        tc.desc,
        "freshcart@gmail.com",
        "Welcome@123",
        "tenant"
    ]);
});

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
    console.log(`Successfully updated ${testCases.length} rows in '${SHEET_NAME}' sheet in ${FILE}`);
} catch (err) {
    console.error("Failed to update testData.xlsx:", err.message);
    process.exit(1);
}
