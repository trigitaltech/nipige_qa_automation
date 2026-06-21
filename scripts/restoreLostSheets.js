/**
 * Restores 23 sheets lost on develop (commit 97f1487 "Resolved conflicts keeping local data" took
 * one side of a binary conflict instead of merging, dropping testData.xlsx from 35 sheets to 14).
 *
 * Strategy: start from the last-known-good 35-sheet workbook (commit 0c0ecaf) and layer in develop's
 * genuinely new additions since then:
 *   - "Features(Admin)" and "FeaturesSuperAdminTest" data sheets (new on develop, not in 0c0ecaf)
 *   - Regression sheet: apply develop's Run/Mode edits for rows that exist in both (these look like
 *     intentional recent changes), and add any TestName rows present in develop but missing from
 *     the good Regression sheet (e.g. FeaturesSuperAdminTest).
 *
 * Nothing from either side is silently dropped — run once:
 *   node scripts/restoreLostSheets.js <path-to-good-xlsx> <path-to-current-develop-xlsx>
 */
const XLSX = require("xlsx");
const path = require("path");

const [, , goodArg, devArg] = process.argv;
const GOOD_FILE = path.resolve(__dirname, goodArg || "../tmp_check/good_0c0ecaf.xlsx");
const DEV_FILE = path.resolve(__dirname, devArg || "../tmp_check/develop_now.xlsx");
const OUTPUT_FILE = path.resolve(__dirname, "../src/resources/data/testData.xlsx");

const goodWb = XLSX.readFile(GOOD_FILE);
const devWb = XLSX.readFile(DEV_FILE);

console.log("good (0c0ecaf) sheets:", goodWb.SheetNames.length);
console.log("current develop sheets:", devWb.SheetNames.length);

// 1) Add develop's new data sheets that aren't in the good workbook.
const newSheetNames = devWb.SheetNames.filter((n) => !goodWb.SheetNames.includes(n));
for (const name of newSheetNames) {
  XLSX.utils.book_append_sheet(goodWb, devWb.Sheets[name], name);
  console.log(`Added new sheet from develop: '${name}'`);
}

// 2) Merge Regression: apply develop's Run/Mode for overlapping TestNames, add any develop-only rows.
const goodReg = XLSX.utils.sheet_to_json(goodWb.Sheets.Regression);
const devReg = XLSX.utils.sheet_to_json(devWb.Sheets.Regression);
const devRegMap = new Map(devReg.map((r) => [r.TestName, r]));
const goodNames = new Set(goodReg.map((r) => r.TestName));

const mergedReg = goodReg.map((r) => {
  const devRow = devRegMap.get(r.TestName);
  if (devRow && (devRow.Run !== r.Run || devRow.Mode !== r.Mode)) {
    console.log(`Applying develop's Run/Mode update for '${r.TestName}': `
      + `${r.Run}/${r.Mode} -> ${devRow.Run}/${devRow.Mode || r.Mode}`);
    return { TestName: r.TestName, Run: devRow.Run, Mode: devRow.Mode || r.Mode };
  }
  return r;
});
const devOnlyRows = devReg.filter((r) => !goodNames.has(r.TestName));
for (const r of devOnlyRows) {
  console.log(`Adding develop-only Regression row: '${r.TestName}'`);
  mergedReg.push(r);
}

const headers = ["TestName", "Run", "Mode"];
const wsData = [headers, ...mergedReg.map((r) => headers.map((h) => (r[h] !== undefined ? r[h] : "")))];
goodWb.Sheets.Regression = XLSX.utils.aoa_to_sheet(wsData);

console.log("");
console.log("Final sheet count:", goodWb.SheetNames.length);
console.log("Final Regression row count:", mergedReg.length);
console.log("Final sheets:", goodWb.SheetNames.join(", "));

XLSX.writeFile(goodWb, OUTPUT_FILE);
console.log(`Written restored workbook to ${OUTPUT_FILE}`);
