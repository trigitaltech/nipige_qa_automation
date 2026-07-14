/**
 * Updates (or replaces) the "SkillTest" sheet in testData.xlsx — 25 test cases.
 * Run once: node scripts/addSkillTestSheet.js
 */
const XLSX = require("xlsx");
const path = require("path");

const FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const SHEET_NAME = "SkillTest";

const rows = [
    // ── Skill Listing Page ──
    {
        "TestID": "TC_SKILL_01",
        "Issue": "10001",
        "Description": "Verify Skill List Loads Successfully",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Open Skill Setup page → Verify skill records, columns, and action buttons are displayed."
    },
    {
        "TestID": "TC_SKILL_02",
        "Issue": "10002",
        "Description": "Verify Empty Search Result",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter invalid search keyword → Verify \"No Records Found\" message is displayed."
    },
    {
        "TestID": "TC_SKILL_03",
        "Issue": "10003",
        "Description": "Verify Search by Skill Name",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter existing skill name in search box → Verify matching skill is displayed."
    },
    {
        "TestID": "TC_SKILL_04",
        "Issue": "10004",
        "Description": "Verify Category Filter",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Select a category from dropdown → Verify only skills from selected category are shown."
    },
    {
        "TestID": "TC_SKILL_05",
        "Issue": "10005",
        "Description": "Verify Pagination Navigation",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Click Next/Previous page → Verify records change according to selected page."
    },

    // ── Create Skill Page ──
    {
        "TestID": "TC_SKILL_06",
        "Issue": "10006",
        "Description": "Create Skill with Valid Data",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter valid Code, Name, Description, Category, Icon, Sort Order → Click Save → Verify skill is created successfully."
    },
    {
        "TestID": "TC_SKILL_07",
        "Issue": "10007",
        "Description": "Create Skill Without Required Fields",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Leave mandatory fields blank → Click Save → Verify validation messages appear."
    },
    {
        "TestID": "TC_SKILL_08",
        "Issue": "10008",
        "Description": "Verify Code Format Validation",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter lowercase letters or spaces in Code field → Save → Verify validation error is displayed."
    },
    {
        "TestID": "TC_SKILL_09",
        "Issue": "10009",
        "Description": "Verify Duplicate Skill Code Restriction",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter existing skill code → Save → Verify duplicate code error appears."
    },
    {
        "TestID": "TC_SKILL_10",
        "Issue": "10010",
        "Description": "Verify Duplicate Skill Name Restriction",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter existing skill name → Save → Verify duplicate name error appears."
    },
    {
        "TestID": "TC_SKILL_11",
        "Issue": "10011",
        "Description": "Verify Maximum Character Limit for Name",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter name exceeding allowed length → Save → Verify validation message."
    },
    {
        "TestID": "TC_SKILL_12",
        "Issue": "10012",
        "Description": "Verify Description Character Limit",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter description exceeding allowed length → Save → Verify validation error."
    },
    {
        "TestID": "TC_SKILL_13",
        "Issue": "10013",
        "Description": "Verify Category Selection is Mandatory",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Leave category unselected → Save → Verify category required validation."
    },
    {
        "TestID": "TC_SKILL_14",
        "Issue": "10014",
        "Description": "Verify Valid Icon URL Preview",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter valid image URL → Verify icon preview is displayed correctly."
    },
    {
        "TestID": "TC_SKILL_15",
        "Issue": "10015",
        "Description": "Verify Invalid Icon URL Handling",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter invalid image URL → Verify broken image/error handling message."
    },
    {
        "TestID": "TC_SKILL_16",
        "Issue": "10016",
        "Description": "Verify Sort Order Acceptance",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter valid numeric sort order → Save → Verify skill appears in correct order."
    },
    {
        "TestID": "TC_SKILL_17",
        "Issue": "10017",
        "Description": "Verify Non-Numeric Sort Order Validation",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter alphabetic/special characters in sort order → Save → Verify validation error."
    },
    {
        "TestID": "TC_SKILL_18",
        "Issue": "10018",
        "Description": "Verify Cancel Button Functionality",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter data → Click Cancel → Verify user is redirected without saving changes."
    },

    // ── Edit Skill Page ──
    {
        "TestID": "TC_SKILL_19",
        "Issue": "10019",
        "Description": "Update Existing Skill Successfully",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Edit skill name/description/category → Click Update Skill → Verify changes are saved."
    },
    {
        "TestID": "TC_SKILL_20",
        "Issue": "10020",
        "Description": "Verify Unsaved Changes Are Not Persisted",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Modify fields → Navigate back without saving → Reopen skill → Verify original data remains unchanged."
    },

    // ── Additional High-Value Automation Cases ──
    {
        "TestID": "TC_SKILL_21",
        "Issue": "10021",
        "Description": "Verify \"Other Category\" Field Visibility",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Select \"Other\" category → Verify \"Other Category\" textbox becomes visible and editable."
    },
    {
        "TestID": "TC_SKILL_22",
        "Issue": "10022",
        "Description": "Verify Other Category Mandatory When Category=Other",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Select \"Other\" and leave custom category blank → Save → Verify validation error."
    },
    {
        "TestID": "TC_SKILL_23",
        "Issue": "10023",
        "Description": "Verify Back Button on Edit Page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Click Back button → Verify user returns to Skill Listing page."
    },
    {
        "TestID": "TC_SKILL_24",
        "Issue": "10024",
        "Description": "Verify Skill Sorting on Listing Page",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Create skills with different sort orders → Verify lower sort order appears first."
    },
    {
        "TestID": "TC_SKILL_25",
        "Issue": "10025",
        "Description": "Verify XSS Prevention in Name/Description Fields",
        "UserName": "freshcart@gmail.com",
        "Password": "Welcome@123",
        "persona": "tenant",
        "ExpectedResult": "Enter script tags in Name/Description → Save → Verify input is sanitized and no script executes."
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
