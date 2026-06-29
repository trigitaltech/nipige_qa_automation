import fs from "fs";
import path from "path";

export default class JsonUtil {
    private static readonly FIXTURES_DIR = path.resolve(__dirname, "../../resources/fixtures");

    /**
     * Reads a JSON fixture file and returns the parsed object.
     * @param fileName Name of the JSON file (e.g., "reusableData.json")
     */
    public static getFixtureData<T = any>(fileName: string): T {
        const filePath = path.join(this.FIXTURES_DIR, fileName);
        if (!fs.existsSync(filePath)) {
            throw new Error(`JSON fixture file not found at: ${filePath}`);
        }
        const fileContent = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(fileContent) as T;
    }
}
