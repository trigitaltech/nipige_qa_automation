/* eslint-disable no-tabs */
/* eslint-disable no-restricted-syntax */
import fs from "fs";
import path from 'path';
import CommonConstants from "../constants/CommonConstants";
import SuiteTemplate from "../template/SuiteTemplate";
import CLIUtil from "../utils/CLIUtil";
import ExcelUtil from "../utils/ExcelUtil";

export default class SuiteManager {
    private static getSpecMap(dir: string): Map<string, string> {
        const specMap = new Map<string, string>();
        function walk(currentDir: string) {
            const files = fs.readdirSync(currentDir);
            for (const file of files) {
                const filePath = path.join(currentDir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    walk(filePath);
                } else if (file.endsWith(".spec.ts")) {
                    const relPath = path.relative(dir, filePath).replace(/\\/g, "/");
                    specMap.set(file, relPath);
                }
            }
        }
        walk(dir);
        return specMap;
    }

    public static createSuite() {
        const specMap = this.getSpecMap(CommonConstants.TEST_FOLDER_PATH);
        const sheet = CLIUtil.getValueOf("SHEET");
        this.deleteFiles(CommonConstants.TEST_FOLDER_PATH);
        let testList = CommonConstants.BLANK;
        const seenTests = new Set<string>();
        for (const { TestName, Mode } of ExcelUtil.getSuiteTests(sheet)) {            
            if (seenTests.has(TestName)) {
                continue;
            }
            seenTests.add(TestName);
            let modeOfRun = CommonConstants.BLANK;
            if (Mode !== undefined && Mode !== null && Mode !== CommonConstants.BLANK) {
                modeOfRun = `\n\ttest.describe.configure({ mode: '${Mode.toLowerCase()}' });`;
            }
            const specFile = `${TestName}.spec.ts`;
            const resolvedPath = specMap.get(specFile) || specFile;
            testList += `\ntest.describe("${TestName}", () => {${modeOfRun}
	require("./${resolvedPath}");
});`;
        }        
        fs.writeFileSync(`${CommonConstants.TEST_FOLDER_PATH}${sheet}${CommonConstants.TEST_SUITE_FILE_FORMAT}`,
            SuiteTemplate.getTemplate(sheet, testList));
        console.log(" Completed!! ");
    }

    private static deleteFiles(directory: string) {
        const files = fs.readdirSync(directory);
        for (const file of files) {
            if (file.includes(CommonConstants.TEST_SUITE_FILE_FORMAT)) { fs.unlinkSync(path.join(directory, file)); }
        }
    }
}

SuiteManager.createSuite();
