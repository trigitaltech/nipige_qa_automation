import excelToJson from "convert-excel-to-json";
import ExcelConstants from "../constants/ExcelConstants";

export default class ExcelUtil {
    public static getTestDataArray(sheet: string) {
        const result = excelToJson({
            sourceFile: ExcelConstants.TEST_PATH,
            columnToKey: {
                '*': '{{columnHeader}}',
            },
            sheetStubs: true,
            header: { rows: 1 },
            sheets: [sheet],
        });
        return result[sheet];
    }

    public static getSuiteTests(sheet: string) {
        const result = excelToJson({
            sourceFile: ExcelConstants.SUITE_PATH,
            columnToKey: {
                '*': '{{columnHeader}}',
            },
            sheetStubs: true,
            header: { rows: 1 },
            sheets: [sheet],
        });
        const testList: any[] = [];
        process.stdout.write("Creating Suite 0% ");
        // eslint-disable-next-line no-restricted-syntax
        for (const test of result[sheet]) {
            if (test.Run !== null && test.Run !== undefined && test.Run.toUpperCase() === ExcelConstants.YES) {
                testList.push({ TestName: test.TestName, Mode: test.Mode });
            }
            process.stdout.write("|");
        }
        if (testList.length === 0) {
            throw new Error(`${sheet} sheet does not have any test to run`);
        }
        process.stdout.write(" 100%");
        return testList;
    }

    private static formatDateValue(key: string, val: any): any {
        if (val === null || val === undefined) return val;
        if (typeof key === "string" && /date|dob|birthday|expiry|validity|schedule/i.test(key)) {
            if (val instanceof Date) {
                const yyyy = val.getFullYear();
                const mm = String(val.getMonth() + 1).padStart(2, "0");
                const dd = String(val.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}`;
            }
            const num = Number(val);
            if (!isNaN(num) && num >= 1 && num <= 60000) {
                const excelEpoch = new Date(1899, 11, 30);
                const date = new Date(excelEpoch.getTime() + num * 24 * 60 * 60 * 1000);
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                return `${yyyy}-${mm}-${dd}`;
            }
        }
        return val;
    }

    public static getTestData(sheet: string, testID: string) {
        const testData = this.getTestDataArray(sheet);
        let found = false;
        let data;
        for (let i = 0; i < testData.length; i++) {
            if (testData[i].TestID === testID) {
                data = testData[i];
                found = true;
            }
        }
        if (!found) {
            throw new Error(`Test '${testID}' was not found on '${sheet}' sheet`);
        }

        const formattedData: any = {};
        for (const key in data) {
            formattedData[key] = this.formatDateValue(key, data[key]);
        }
        return formattedData;
    }
}
