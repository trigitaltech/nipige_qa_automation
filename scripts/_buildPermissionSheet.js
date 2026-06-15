// One-off helper: rebuild the "Permission" sheet in testData.xlsx, fully data-driven.
// Positive TC01–TC05 use the real existing values (from the task prompt): 2 cases search by Resource
// URL (TC01, TC04 — unique URLs) and 3 by Permission Name (TC02, TC03, TC05). Negative TC06–TC10
// keep the invalid values originally provided. Run: node scripts/_buildPermissionSheet.js
const path = require("path");
const XLSX = require("xlsx");

const FILE = path.join(__dirname, "..", "src", "resources", "data", "testData.xlsx");
const SHEET = "Permission";

const rows = [
    // ---- Positive (real existing values) ----
    { TC_ID: "TC01", Type: "Positive", Permission_Name: "OVERRIDE_RETURN_REJECT_V3", Method: "POST",
        Resource_URL: "/api/v3/orders/:orderId/return/override-reject", Search_By: "Resource URL",
        Search_Value: "/api/v3/orders/:orderId/return/override-reject", Expected_Result: "Record found, data matches" },
    { TC_ID: "TC02", Type: "Positive", Permission_Name: "GET_UPCOMING_BOX", Method: "GET",
        Resource_URL: "/box-subscriptions/:id/upcoming", Search_By: "Permission Name",
        Search_Value: "GET_UPCOMING_BOX", Expected_Result: "Record found, data matches" },
    { TC_ID: "TC03", Type: "Positive", Permission_Name: "EDIT_UPCOMING_BOX", Method: "PATCH",
        Resource_URL: "/box-subscriptions/:id/upcoming", Search_By: "Permission Name",
        Search_Value: "EDIT_UPCOMING_BOX", Expected_Result: "Record found, data matches" },
    { TC_ID: "TC04", Type: "Positive", Permission_Name: "BOX_TEMPLATE_UPDATE", Method: "PUT",
        Resource_URL: "/api/boxes/admin/:id/templates/:cycleKey", Search_By: "Resource URL",
        Search_Value: "/api/boxes/admin/:id/templates/:cycleKey", Expected_Result: "Record found, data matches" },
    { TC_ID: "TC05", Type: "Positive", Permission_Name: "BOX_PRODUCT_DELETE", Method: "DELETE",
        Resource_URL: "/api/boxes/admin/:id", Search_By: "Permission Name",
        Search_Value: "BOX_PRODUCT_DELETE", Expected_Result: "Record found, data matches" },

    // ---- Negative (invalid values — must return no record) ----
    { TC_ID: "TC06", Type: "Negative", Permission_Name: "OVERRIDE_RETURN_REJECT_V3_INVALID", Method: "POST",
        Resource_URL: "", Search_By: "Permission Name",
        Search_Value: "OVERRIDE_RETURN_REJECT_V3_INVALID", Expected_Result: "No record found" },
    { TC_ID: "TC07", Type: "Negative", Permission_Name: "GET_UPCOMING_BOX_INVALID", Method: "GET",
        Resource_URL: "", Search_By: "Permission Name",
        Search_Value: "GET_UPCOMING_BOX_INVALID", Expected_Result: "No record found" },
    { TC_ID: "TC08", Type: "Negative", Permission_Name: "EDIT_UPCOMING_BOX_INVALID", Method: "PATCH",
        Resource_URL: "", Search_By: "Permission Name",
        Search_Value: "EDIT_UPCOMING_BOX_INVALID", Expected_Result: "No record found" },
    { TC_ID: "TC09", Type: "Negative", Permission_Name: "BOX_TEMPLATE_UPDATE_INVALID", Method: "PUT",
        Resource_URL: "", Search_By: "Permission Name",
        Search_Value: "BOX_TEMPLATE_UPDATE_INVALID", Expected_Result: "No record found" },
    { TC_ID: "TC10", Type: "Negative", Permission_Name: "BOX_PRODUCT_DELETE_INVALID", Method: "DELETE",
        Resource_URL: "", Search_By: "Permission Name",
        Search_Value: "BOX_PRODUCT_DELETE_INVALID", Expected_Result: "No record found" },

    // ---- Create / Delete (values generated at runtime — kept as informational rows) ----
    { TC_ID: "TC11", Type: "Create", Permission_Name: "RANDOM", Method: "POST", Resource_URL: "RANDOM",
        Search_By: "Permission Name", Search_Value: "RANDOM", Expected_Result: "Permission created successfully" },
    { TC_ID: "TC12", Type: "Delete", Permission_Name: "RANDOM", Method: "POST", Resource_URL: "RANDOM",
        Search_By: "Permission Name", Search_Value: "RANDOM", Expected_Result: "Permission deleted successfully" },
];

const headers = Object.keys(rows[0]);
const wb = XLSX.readFile(FILE);
wb.Sheets[SHEET] = XLSX.utils.json_to_sheet(rows, { header: headers });
if (!wb.SheetNames.includes(SHEET)) wb.SheetNames.push(SHEET);
XLSX.writeFile(wb, FILE);
console.log(`Wrote ${rows.length} rows to '${SHEET}'. Columns: ${headers.join(", ")}`);
