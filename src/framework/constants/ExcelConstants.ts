import path from 'path';

export default class ExcelConstants {
    static readonly TEST_PATH = process.env.TEST_DATA_PATH 
        ? path.resolve(process.env.TEST_DATA_PATH)
        : './src/resources/data/testData.xlsx';

    static readonly SUITE_PATH = process.env.TEST_DATA_PATH
        ? path.resolve(process.env.TEST_DATA_PATH)
        : '../../resources/data/testData.xlsx';

    static readonly YES = "YES";
}

