const XLSX = require("d:/Trigital poject/nipige_qa_automation/node_modules/xlsx");
const path = require("path");
const fs = require("fs");

const localPath = path.resolve(__dirname, "../src/resources/data/testData_local_backup.xlsx");
const developPath = path.resolve(__dirname, "../src/resources/data/testData_develop.xlsx");
const outputPath = path.resolve(__dirname, "../src/resources/data/testData.xlsx");

if (!fs.existsSync(localPath)) {
  console.error(`Local backup file not found at ${localPath}`);
  process.exit(1);
}
if (!fs.existsSync(developPath)) {
  console.error(`Develop file not found at ${developPath}`);
  process.exit(1);
}

const wbLocal = XLSX.readFile(localPath);
const wbDevelop = XLSX.readFile(developPath);

const wbMerged = XLSX.utils.book_new();

const allSheets = Array.from(new Set([...wbLocal.SheetNames, ...wbDevelop.SheetNames]));

console.log("Starting master sheet merge...");
console.log(`Local sheets: [${wbLocal.SheetNames.join(", ")}]`);
console.log(`Develop sheets: [${wbDevelop.SheetNames.join(", ")}]`);

allSheets.forEach(sheetName => {
  // Skip Regression for custom handling
  if (sheetName === "Regression") return;

  const hasLocal = wbLocal.SheetNames.includes(sheetName);
  const hasDevelop = wbDevelop.SheetNames.includes(sheetName);

  if (hasLocal && !hasDevelop) {
    console.log(`- Sheet [${sheetName}]: Only in local. Keeping intact.`);
    XLSX.utils.book_append_sheet(wbMerged, wbLocal.Sheets[sheetName], sheetName);
  } else if (!hasLocal && hasDevelop) {
    console.log(`- Sheet [${sheetName}]: Only in develop. Adding sheet.`);
    XLSX.utils.book_append_sheet(wbMerged, wbDevelop.Sheets[sheetName], sheetName);
  } else {
    console.log(`- Sheet [${sheetName}]: Exists in both. Merging rows...`);
    const dataLocal = XLSX.utils.sheet_to_json(wbLocal.Sheets[sheetName], { header: 1 });
    const dataDevelop = XLSX.utils.sheet_to_json(wbDevelop.Sheets[sheetName], { header: 1 });

    if (dataLocal.length === 0) {
      const ws = XLSX.utils.aoa_to_sheet(dataDevelop);
      XLSX.utils.book_append_sheet(wbMerged, ws, sheetName);
      return;
    }
    if (dataDevelop.length === 0) {
      const ws = XLSX.utils.aoa_to_sheet(dataLocal);
      XLSX.utils.book_append_sheet(wbMerged, ws, sheetName);
      return;
    }

    const headerLocal = dataLocal[0];
    const headerDevelop = dataDevelop[0];

    // Find key column index
    const keyCandidateNames = ["Test Case ID", "Test ID", "Test Case ID", "TestName", "TestID", "TC ID", "TC_ID"];
    let keyIdxLocal = -1;
    let keyIdxDevelop = -1;

    for (const name of keyCandidateNames) {
      keyIdxLocal = headerLocal.findIndex(h => h && h.toString().trim().toLowerCase() === name.toLowerCase());
      if (keyIdxLocal !== -1) break;
    }
    for (const name of keyCandidateNames) {
      keyIdxDevelop = headerDevelop.findIndex(h => h && h.toString().trim().toLowerCase() === name.toLowerCase());
      if (keyIdxDevelop !== -1) break;
    }

    const mergedHeader = Array.from(new Set([...headerLocal, ...headerDevelop]));
    const mergedData = [mergedHeader];

    if (keyIdxLocal !== -1 && keyIdxDevelop !== -1) {
      console.log(`  Using primary key: local idx ${keyIdxLocal} ("${headerLocal[keyIdxLocal]}"), develop idx ${keyIdxDevelop} ("${headerDevelop[keyIdxDevelop]}")`);
      
      const localMap = new Map();
      for (let i = 1; i < dataLocal.length; i++) {
        const row = dataLocal[i];
        if (!row || row.length === 0) continue;
        const keyVal = row[keyIdxLocal];
        if (keyVal !== undefined && keyVal !== null) {
          localMap.set(keyVal.toString().trim(), row);
        } else {
          mergedData.push(row);
        }
      }

      const processedLocalKeys = new Set();
      for (let i = 1; i < dataDevelop.length; i++) {
        const devRow = dataDevelop[i];
        if (!devRow || devRow.length === 0) continue;
        const keyVal = devRow[keyIdxDevelop];
        const keyStr = keyVal !== undefined && keyVal !== null ? keyVal.toString().trim() : null;

        if (keyStr && localMap.has(keyStr)) {
          const localRow = localMap.get(keyStr);
          const mergedRow = [];
          mergedHeader.forEach(colName => {
            const lColIdx = headerLocal.indexOf(colName);
            const dColIdx = headerDevelop.indexOf(colName);

            const lVal = lColIdx !== -1 ? localRow[lColIdx] : undefined;
            const dVal = dColIdx !== -1 ? devRow[dColIdx] : undefined;

            if (lVal !== undefined && lVal !== null && lVal !== "") {
              mergedRow.push(lVal);
            } else {
              mergedRow.push(dVal !== undefined ? dVal : "");
            }
          });
          mergedData.push(mergedRow);
          processedLocalKeys.add(keyStr);
        } else {
          const mergedRow = [];
          mergedHeader.forEach(colName => {
            const dColIdx = headerDevelop.indexOf(colName);
            const dVal = dColIdx !== -1 ? devRow[dColIdx] : undefined;
            mergedRow.push(dVal !== undefined ? dVal : "");
          });
          mergedData.push(mergedRow);
        }
      }

      // Add local rows that were not in develop
      for (const [keyStr, localRow] of localMap.entries()) {
        if (!processedLocalKeys.has(keyStr)) {
          const mergedRow = [];
          mergedHeader.forEach(colName => {
            const lColIdx = headerLocal.indexOf(colName);
            const lVal = lColIdx !== -1 ? localRow[lColIdx] : undefined;
            mergedRow.push(lVal !== undefined ? lVal : "");
          });
          mergedData.push(mergedRow);
        }
      }
    } else {
      console.log(`  No key column found. Deduplicating rows.`);
      const rowStrings = new Set();
      const addRow = (row, header) => {
        if (!row || row.length === 0) return;
        const mergedRow = [];
        mergedHeader.forEach(colName => {
          const idx = header.indexOf(colName);
          const val = idx !== -1 ? row[idx] : undefined;
          mergedRow.push(val !== undefined ? val : "");
        });
        const str = JSON.stringify(mergedRow);
        if (!rowStrings.has(str)) {
          rowStrings.add(str);
          mergedData.push(mergedRow);
        }
      };

      for (let i = 1; i < dataLocal.length; i++) {
        addRow(dataLocal[i], headerLocal);
      }
      for (let i = 1; i < dataDevelop.length; i++) {
        addRow(dataDevelop[i], headerDevelop);
      }
    }

    const ws = XLSX.utils.aoa_to_sheet(mergedData);
    XLSX.utils.book_append_sheet(wbMerged, ws, sheetName);
  }
});

// Custom Merge for Regression Sheet
console.log("- Sheet [Regression]: Merging, deduplicating, and adding PrivacySettingTest...");
const regLocal = XLSX.utils.sheet_to_json(wbLocal.Sheets["Regression"]);
const regDevelop = XLSX.utils.sheet_to_json(wbDevelop.Sheets["Regression"]);

const regressionMap = new Map();

// Load develop rows first
regDevelop.forEach(row => {
  if (row.TestName) {
    regressionMap.set(row.TestName.trim(), {
      TestName: row.TestName.trim(),
      Run: row.Run ? row.Run.toString().trim() : "NO",
      Mode: row.Mode ? row.Mode.toString().trim() : "serial"
    });
  }
});

// Override/merge with local rows
regLocal.forEach(row => {
  if (row.TestName) {
    const testName = row.TestName.trim();
    const localRun = row.Run ? row.Run.toString().trim() : "NO";
    const localMode = row.Mode ? row.Mode.toString().trim() : "serial";

    if (regressionMap.has(testName)) {
      const existing = regressionMap.get(testName);
      // Prefer Run="YES" if either has it
      const finalRun = (localRun === "YES" || existing.Run === "YES") ? "YES" : "NO";
      existing.Run = finalRun;
      existing.Mode = localMode; // Prefer local mode configuration
    } else {
      regressionMap.set(testName, {
        TestName: testName,
        Run: localRun,
        Mode: localMode
      });
    }
  }
});

// Add PrivacySettingTest if not exists
regressionMap.set("PrivacySettingTest", {
  TestName: "PrivacySettingTest",
  Run: "YES",
  Mode: "serial"
});

// Convert back to arrays
const regressionHeaders = ["TestName", "Run", "Mode"];
const regressionAOA = [regressionHeaders];
for (const row of regressionMap.values()) {
  regressionAOA.push([row.TestName, row.Run, row.Mode]);
}

const wsRegression = XLSX.utils.aoa_to_sheet(regressionAOA);
XLSX.utils.book_append_sheet(wbMerged, wsRegression, "Regression");

// Add new PrivacySettingTest sheet with 20 test cases
console.log("- Sheet [PrivacySettingTest]: Creating sheet with 20 test cases...");
const privacySettingHeaders = ["TestID", "Description", "Run", "Mode"];
const privacySettingCases = [
  ["TC_PS_01", "Verify user can navigate to Privacy Setting page successfully", "YES", "serial"],
  ["TC_PS_02", "Verify Create Privacy Setting form opens successfully", "YES", "serial"],
  ["TC_PS_03", "Verify user can create Terms & Conditions record", "YES", "serial"],
  ["TC_PS_04", "Verify user can create Privacy Policy record", "YES", "serial"],
  ["TC_PS_05", "Verify user can create About Us record", "YES", "serial"],
  ["TC_PS_06", "Verify validation appears when Type is blank", "YES", "serial"],
  ["TC_PS_07", "Verify validation appears when Title is blank", "YES", "serial"],
  ["TC_PS_08", "Verify validation appears when Content is blank", "YES", "serial"],
  ["TC_PS_09", "Verify newly created record appears in grid", "YES", "serial"],
  ["TC_PS_10", "Verify user can edit existing record", "YES", "serial"],
  ["TC_PS_11", "Verify mandatory field validation during edit", "YES", "serial"],
  ["TC_PS_12", "Verify rich text formatting is saved correctly", "YES", "serial"],
  ["TC_PS_13", "Verify multiple subsections can be added", "YES", "serial"],
  ["TC_PS_14", "Verify large content can be saved successfully", "YES", "serial"],
  ["TC_PS_15", "Verify status toggle changes Active/Inactive", "YES", "serial"],
  ["TC_PS_16", "Verify status update failure handling", "YES", "serial"],
  ["TC_PS_17", "Verify delete confirmation popup appears", "YES", "serial"],
  ["TC_PS_18", "Verify record is deleted successfully", "YES", "serial"],
  ["TC_PS_19", "Verify cancel delete keeps record unchanged", "YES", "serial"],
  ["TC_PS_20", "Verify pagination works correctly", "YES", "serial"]
];

const privacySettingAOA = [privacySettingHeaders, ...privacySettingCases];
const wsPrivacySetting = XLSX.utils.aoa_to_sheet(privacySettingAOA);
XLSX.utils.book_append_sheet(wbMerged, wsPrivacySetting, "PrivacySettingTest");

// Write merged workbook back
XLSX.writeFile(wbMerged, outputPath);
console.log(`Excel sheets merge successfully completed. Output written to ${outputPath}`);
