const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const localPath = path.resolve(__dirname, "../src/resources/data/testData.xlsx");
const developPath = path.resolve(__dirname, "../src/resources/data/testData_develop.xlsx");
const outputPath = path.resolve(__dirname, "../src/resources/data/testData.xlsx"); // write back to local

if (!fs.existsSync(localPath)) {
  console.error(`Local file not found at ${localPath}`);
  process.exit(1);
}
if (!fs.existsSync(developPath)) {
  console.error(`Develop file not found at ${developPath}. Please run extraction first.`);
  process.exit(1);
}

const wbLocal = XLSX.readFile(localPath);
const wbDevelop = XLSX.readFile(developPath);

const wbMerged = XLSX.utils.book_new();

const allSheets = Array.from(new Set([...wbLocal.SheetNames, ...wbDevelop.SheetNames]));

console.log("Starting excel sheet merge...");
console.log(`Local sheets: [${wbLocal.SheetNames.join(", ")}]`);
console.log(`Develop sheets: [${wbDevelop.SheetNames.join(", ")}]`);

allSheets.forEach(sheetName => {
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
    const keyCandidateNames = ["Test Case ID", "Test ID", "Test Case ID", "TestName", "TestID"];
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

    // Merge headers to get union of columns
    const mergedHeader = Array.from(new Set([...headerLocal, ...headerDevelop]));
    const mergedData = [mergedHeader];

    if (keyIdxLocal !== -1 && keyIdxDevelop !== -1) {
      console.log(`  Using primary key column: local index ${keyIdxLocal} ("${headerLocal[keyIdxLocal]}"), develop index ${keyIdxDevelop} ("${headerDevelop[keyIdxDevelop]}")`);
      
      // Map local rows by key
      const localMap = new Map();
      for (let i = 1; i < dataLocal.length; i++) {
        const row = dataLocal[i];
        if (!row || row.length === 0) continue;
        const keyVal = row[keyIdxLocal];
        if (keyVal !== undefined && keyVal !== null) {
          localMap.set(keyVal.toString().trim(), row);
        } else {
          // If no key value, append row directly to mergedData
          mergedData.push(row);
        }
      }

      // Process develop rows
      const processedLocalKeys = new Set();
      for (let i = 1; i < dataDevelop.length; i++) {
        const devRow = dataDevelop[i];
        if (!devRow || devRow.length === 0) continue;
        const keyVal = devRow[keyIdxDevelop];
        const keyStr = keyVal !== undefined && keyVal !== null ? keyVal.toString().trim() : null;

        if (keyStr && localMap.has(keyStr)) {
          // Merge matching rows
          const localRow = localMap.get(keyStr);
          const mergedRow = [];
          mergedHeader.forEach(colName => {
            const lColIdx = headerLocal.indexOf(colName);
            const dColIdx = headerDevelop.indexOf(colName);

            const lVal = lColIdx !== -1 ? localRow[lColIdx] : undefined;
            const dVal = dColIdx !== -1 ? devRow[dColIdx] : undefined;

            // Merge logic: prefer local if defined, otherwise dev
            if (lVal !== undefined && lVal !== null && lVal !== "") {
              mergedRow.push(lVal);
            } else {
              mergedRow.push(dVal !== undefined ? dVal : "");
            }
          });
          mergedData.push(mergedRow);
          processedLocalKeys.add(keyStr);
        } else {
          // Row exists only in develop, map it to the merged header columns
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
      console.log(`  No key column found. Performing row-by-row fallback merge.`);
      // Fallback: simple deduplicated append
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

XLSX.writeFile(wbMerged, outputPath);
console.log(`Merge complete! Saved merged excel sheet to ${outputPath}`);
