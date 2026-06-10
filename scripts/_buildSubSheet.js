// One-off helper: add/replace the "SubscriptionPlanTest" sheet in testData.xlsx with the
// TC01–TC30 mapping for the Subscription Plan (Tenant) module. Run: node scripts/_buildSubSheet.js
const path = require("path");
const XLSX = require("xlsx");

const FILE = path.join(__dirname, "..", "src", "resources", "data", "testData.xlsx");
const SHEET = "SubscriptionPlanTest";
const TAX = "TAX_VALIDATION_806531";

// Valid baseline a positive row inherits; per-row overrides applied below.
const base = {
    Type: "Positive", Plan_Name: "", Scope: "CUSTOMER", Org_Access: "GLOBAL",
    Payment_Type: "PRE-PAID", Tax_Code: TAX, Charge_Code: "73301", Currency: "USD",
    Price: "12", UOM: "AMOUNT", Base_Qty: "1", Cadence: "QUARTERLY", Auto_Renewal: "Yes",
    Plan_Type: "DURATION", Validity_Days: "3", Plan_Limit: "", Feature1: "admin",
    Feature2: "NULL", Expected_Result: "",
};
const row = (id, o) => ({ TC_ID: id, ...base, ...o });

const rows = [
    // ---------- Positive TC01–TC15 ----------
    row("TC01", { Plan_Name: "CreatePlan001", Expected_Result: "Plan created successfully" }),
    row("TC02", { Plan_Name: "ScopeSelect001", Scope: "CUSTOMER", Expected_Result: "Scope dropdown selection works" }),
    row("TC03", { Plan_Name: "OrgAccess001", Org_Access: "LIMITED", Expected_Result: "Org Access Level selection works" }),
    row("TC04", { Plan_Name: "PaymentType001", Payment_Type: "PRE-PAID", Expected_Result: "Payment Type selection works" }),
    row("TC05", { Plan_Name: "CadenceSel001", Cadence: "QUARTERLY", Expected_Result: "Cadence Type selection works" }),
    row("TC06", { Plan_Name: "Decimal001", Price: "12.50", Expected_Result: "Price accepts decimal values" }),
    row("TC07", { Plan_Name: "AutoRenew001", Expected_Result: "Auto Renewal toggle works" }),
    row("TC08", { Plan_Name: "SingleFeat001", Feature1: "admin", Feature2: "NULL", Expected_Result: "Single feature creation works" }),
    row("TC09", { Plan_Name: "MultiFeat001", Feature1: "admin", Feature2: "manager", Expected_Result: "Multiple feature creation works" }),
    row("TC10", { Plan_Name: "Preview001", Scope: "CUSTOMER", Expected_Result: "Plan Preview updates dynamically" }),
    row("TC11", { Plan_Name: "Redirect001", Expected_Result: "Create Plan redirects to listing" }),
    row("TC12", { Plan_Name: "Table001", Expected_Result: "Created plan appears in table" }),
    row("TC13", { Plan_Name: "Best Plan_95197", Expected_Result: "Search returns matching plan" }),
    row("TC14", { Type: "Filter", Plan_Name: "CustomerFilter001", Scope: "CUSTOMER", Expected_Result: "Customer scope filter — every row CUSTOMER" }),
    row("TC15", { Type: "Filter", Plan_Name: "PartnerFilter001", Scope: "PARTNER", Expected_Result: "Partner scope filter — every row PARTNER" }),

    // ---------- Negative TC16–TC30 ----------
    row("TC16", { Type: "Negative", Plan_Name: "BLANK", Expected_Result: "Plan Name is required" }),
    row("TC17", {
        Type: "Negative", Plan_Name: "NULL", Scope: "NULL", Org_Access: "NULL", Payment_Type: "NULL",
        Tax_Code: "NULL", Charge_Code: "NULL", Currency: "NULL", Price: "NULL", UOM: "NULL", Base_Qty: "NULL",
        Cadence: "NULL", Plan_Type: "NULL", Validity_Days: "NULL", Feature1: "NULL", Feature2: "NULL",
        Expected_Result: "Mandatory fields are required",
    }),
    row("TC18", { Type: "Negative", Plan_Name: "PriceAlpha001", Price: "ABC123", Expected_Result: "Price rejects non-numeric input" }),
    row("TC19", { Type: "Negative", Plan_Name: "NegQty001", Base_Qty: "-1", Expected_Result: "Negative Base Quantity rejected" }),
    row("TC20", { Type: "Negative", Plan_Name: "ZeroQty001", Base_Qty: "0", Expected_Result: "Zero Base Quantity rejected" }),
    row("TC21", { Type: "Negative", Plan_Name: "ValidityAlpha001", Validity_Days: "ABC", Expected_Result: "Validity rejects non-numeric input" }),
    row("TC22", { Type: "Negative", Plan_Name: "Best Plan_95197", Expected_Result: "Duplicate name accepted (no uniqueness guard)" }),
    row("TC23", { Type: "Negative", Plan_Name: "LongDesc001", Expected_Result: "Long description accepted (no length limit)" }),
    row("TC24", { Type: "Negative", Plan_Name: "BadTax001", Tax_Code: "INVALIDTAX999", Expected_Result: "Invalid Tax Code not selectable" }),
    row("TC25", { Type: "Negative", Plan_Name: "ScopeGuard001", Expected_Result: "Scope is pre-filled (guarded by default)" }),
    row("TC26", { Type: "Negative", Plan_Name: "BlankFeat001", Feature1: "BLANK", Feature2: "NULL", Expected_Result: "Blank feature validation" }),
    row("TC27", { Type: "Negative", Plan_Name: "CurrencyGuard001", Expected_Result: "Currency is pre-filled (guarded by default)" }),
    row("TC28", { Type: "Negative", Plan_Name: "BadCadence001", Cadence: "INVALID", Expected_Result: "Invalid Cadence Type not selectable" }),
    row("TC29", { Type: "Negative", Plan_Name: "ApiFail001", Expected_Result: "API/Network failure shows no false success" }),
    row("TC30", { Type: "Negative", Plan_Name: "InvalidUrl001", Expected_Result: "Invalid plan URL shows error/not-found" }),
];

const headers = Object.keys(rows[0]);
const wb = XLSX.readFile(FILE);
const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
wb.Sheets[SHEET] = ws;
if (!wb.SheetNames.includes(SHEET)) wb.SheetNames.push(SHEET);
XLSX.writeFile(wb, FILE);
console.log(`Wrote ${rows.length} rows to sheet '${SHEET}'. Sheets now: ${wb.SheetNames.join(", ")}`);
