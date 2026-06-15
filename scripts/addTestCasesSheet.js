const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "Commission Rules";

const testCases = [
  // Listing Positive
  { id: "TC_COM_01", type: "Positive", name: "Verify Commission Rules page loads successfully with all summary cards, filters, search bar, and rules list." },
  { id: "TC_COM_02", type: "Positive", name: "Verify user can search for an existing Rule Name and the correct rule is displayed." },
  { id: "TC_COM_03", type: "Positive", name: "Verify user can filter rules using tabs (All Types, Basement, Ground, Develop) and matching records are displayed." },
  { id: "TC_COM_04", type: "Positive", name: "Verify user can filter rules using the 'Applicable To' dropdown and only relevant rules are shown." },
  { id: "TC_COM_05", type: "Positive", name: "Verify clicking the View icon opens the selected Commission Rule details page." },
  { id: "TC_COM_06", type: "Positive", name: "Verify clicking the Edit icon opens the selected Commission Rule in edit mode." },
  { id: "TC_COM_07", type: "Positive", name: "Verify clicking the '+ Create Commission Rule' button navigates to the Create Commission Rule page." },
  { id: "TC_COM_08", type: "Positive", name: "Verify Export button successfully downloads the Commission Rules data." },
  // Listing Negative
  { id: "TC_COM_09", type: "Negative", name: "Verify searching with an invalid Rule Name displays 'No Records Found' or an empty result." },
  { id: "TC_COM_10", type: "Negative", name: "Verify system handles special characters entered in the search field without crashing." },
  { id: "TC_COM_11", type: "Negative", name: "Verify unauthorized users cannot access the Create Commission Rule page." },
  { id: "TC_COM_12", type: "Negative", name: "Verify unauthorized users cannot edit an existing Commission Rule." },
  { id: "TC_COM_13", type: "Negative", name: "Verify Export functionality displays an appropriate error message when the export service is unavailable." },
  { id: "TC_COM_14", type: "Negative", name: "Verify clicking View for a deleted/non-existing Commission Rule displays an appropriate error message." },
  { id: "TC_COM_15", type: "Negative", name: "Verify pagination controls are disabled or handled correctly when there is only one page of records." },
  { id: "TC_COM_16", type: "Negative", name: "Verify expired user session redirects the user to the Login page when attempting any action (Search, View, Edit, Export, Create)." },
  // Create Positive
  { id: "TC_COM_17", type: "Positive", name: "Verify user can create a Commission Rule by entering all valid mandatory fields and clicking Save." },
  { id: "TC_COM_18", type: "Positive", name: "Verify Rule Name field accepts valid alphanumeric values and saves successfully." },
  { id: "TC_COM_19", type: "Positive", name: "Verify user can select Rule Type, Event Type, Applicable To, and Applied On from the dropdown lists." },
  { id: "TC_COM_20", type: "Positive", name: "Verify Charge Code field accepts a valid charge code value." },
  { id: "TC_COM_21", type: "Positive", name: "Verify Commission Value (%) can be entered manually and reflected correctly in Live Preview." },
  { id: "TC_COM_22", type: "Positive", name: "Verify Commission Value (%) can be adjusted using the slider control." },
  { id: "TC_COM_23", type: "Positive", name: "Verify Live Preview section updates dynamically when Rule Name is changed." },
  { id: "TC_COM_24", type: "Positive", name: "Verify Live Preview displays correct Rule Type, Event Type, Applicable To, and Applied On values based on user selections." },
  { id: "TC_COM_25", type: "Positive", name: "Verify clicking Cancel returns the user to the Commission Rules listing page without saving data." },
  { id: "TC_COM_26", type: "Positive", name: "Verify newly created Commission Rule appears in the Commission Rules list after successful save." },
  // Create Negative
  { id: "TC_COM_27", type: "Negative", name: "Verify validation message appears when Rule Name is left blank." },
  { id: "TC_COM_28", type: "Negative", name: "Verify validation message appears when Event Type is not selected." },
  { id: "TC_COM_29", type: "Negative", name: "Verify validation message appears when Applicable To is not selected." },
  { id: "TC_COM_30", type: "Negative", name: "Verify validation message appears when Applied On is not selected." },
  { id: "TC_COM_31", type: "Negative", name: "Verify validation message appears when Charge Code is left blank." },
  { id: "TC_COM_32", type: "Negative", name: "Verify system does not allow Commission Value below the minimum allowed percentage." },
  { id: "TC_COM_33", type: "Negative", name: "Verify system does not allow Commission Value above the maximum allowed percentage." },
  { id: "TC_COM_34", type: "Negative", name: "Verify Rule Name field rejects special characters if they are not permitted by business rules." },
  { id: "TC_COM_35", type: "Negative", name: "Verify duplicate Rule Name cannot be created if uniqueness is required." },
  { id: "TC_COM_36", type: "Negative", name: "Verify user cannot save the Commission Rule when one or more mandatory fields are empty." },
  // View Positive
  { id: "TC_COM_37", type: "Positive", name: "Verify View Commission Rule page loads successfully with all commission rule details displayed correctly." },
  { id: "TC_COM_38", type: "Positive", name: "Verify Rule Name, Rule Type, Event Type, Applicable To, Applied On, Charge Code, and Commission Percentage are displayed correctly." },
  { id: "TC_COM_39", type: "Positive", name: "Verify MTD Revenue, Applied Orders, and Rate summary cards display correct values." },
  { id: "TC_COM_40", type: "Positive", name: "Verify Recent Applications section displays the latest commission transactions with correct order numbers and amounts." },
  { id: "TC_COM_41", type: "Positive", name: "Verify clicking the Edit Rule button navigates the user to the Edit Commission Rule screen." },
  // View Negative
  { id: "TC_COM_42", type: "Negative", name: "Verify appropriate error message is displayed when an invalid Commission Rule ID is accessed." },
  { id: "TC_COM_43", type: "Negative", name: "Verify deleted or inactive Commission Rules cannot be viewed and display an appropriate error message." },
  { id: "TC_COM_44", type: "Negative", name: "Verify unauthorized users cannot access the View Commission Rule page." },
  { id: "TC_COM_45", type: "Negative", name: "Verify the system handles missing or null Commission Rule data without page crashes." },
  { id: "TC_COM_46", type: "Negative", name: "Verify expired user sessions redirect the user to the Login page when accessing the View Commission Rule page." },
  // Edit Positive
  { id: "TC_COM_47", type: "Positive", name: "Verify user can successfully update the Commission Rule by modifying valid field values and clicking Update Rule." },
  { id: "TC_COM_48", type: "Positive", name: "Verify changes made to Rule Name, Rule Type, Event Type, Applicable To, Applied On, Charge Code, and Commission Value are saved successfully." },
  { id: "TC_COM_49", type: "Positive", name: "Verify Live Preview updates automatically when Commission Value (%) is changed." },
  { id: "TC_COM_50", type: "Positive", name: "Verify user can update Commission Value using both the input field and slider control." },
  { id: "TC_COM_51", type: "Positive", name: "Verify clicking Delete successfully removes the Commission Rule and redirects to the Commission Rules listing page." },
  // Edit Negative
  { id: "TC_COM_52", type: "Negative", name: "Verify validation message appears when Rule Name is cleared and user clicks Update Rule." },
  { id: "TC_COM_53", type: "Negative", name: "Verify validation message appears when Charge Code is removed and user attempts to save." },
  { id: "TC_COM_54", type: "Negative", name: "Verify system does not allow Commission Value below the minimum allowed percentage." },
  { id: "TC_COM_55", type: "Negative", name: "Verify system does not allow Commission Value above the maximum allowed percentage." },
  { id: "TC_COM_56", type: "Negative", name: "Verify user cannot update the Commission Rule when one or more mandatory fields are empty." }
];

const wb = XLSX.readFile(FILE);

// Columns: Test Case ID, Module, Test Case Name, Scenario Type
const sheetData = [
  ["Test Case ID", "Module", "Test Case Name", "Scenario Type"]
];

testCases.forEach((tc) => {
  sheetData.push([tc.id, "Commission Rules", tc.name, tc.type]);
});

wb.SheetNames.push(SHEET_NAME);
wb.Sheets[SHEET_NAME] = XLSX.utils.aoa_to_sheet(sheetData);
XLSX.writeFile(wb, FILE);
console.log(`Created sheet "${SHEET_NAME}" in ${FILE}`);
