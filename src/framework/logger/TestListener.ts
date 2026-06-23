/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 Reporter, TestCase, TestError, TestResult, TestStep, 
} from "@playwright/test/reporter";
import Logger from "./Logger";

const TEST_SEPARATOR = "##############################################################################";
const STEP_SEPARATOR = "------------------------------------------------------------------------------";

export default class TestListener implements Reporter {
    onTestBegin(test: TestCase, result: TestResult): void {
        this.printLogs(`Test: ${test.title} - Started`, TEST_SEPARATOR);
    }
 
    onTestEnd(test: TestCase, result: TestResult): void {
        if (result.status === 'failed') {
            Logger.error(`Test: ${test.title} - ${result.status}\n${result.error.stack}`);
        }
        this.printLogs(`Test: ${test.title} - ${result.status}`, TEST_SEPARATOR);

        // Update Excel sheet
        const match = test.title.match(/(TC_OM_\d+)/);
        if (match) {
            const tcId = match[1];
            const status = result.status === 'passed' ? 'Pass' : result.status === 'failed' ? 'Fail' : 'Skipped';
            let actualResult = "";
            if (result.status === 'passed') {
                actualResult = "Test passed successfully.";
            } else if (result.status === 'failed') {
                actualResult = result.errors.map(e => e.message || "").join("\n");
                if (!actualResult && result.error) {
                    actualResult = result.error.message || result.error.stack || "Test failed.";
                }
                // Strip ANSI escape colors
                actualResult = actualResult.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{1,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
                if (actualResult.length > 500) {
                    actualResult = actualResult.substring(0, 500) + "...";
                }
            } else {
                actualResult = "Test was skipped.";
            }
            const durationSec = (result.duration / 1000).toFixed(2) + "s";

            try {
                const XLSX = require("xlsx");
                const path = require("path");
                const filePath = path.resolve("src/resources/data/testData.xlsx");
                const sheetName = "OfficeManagement";
                const wb = XLSX.readFile(filePath);
                const ws = wb.Sheets[sheetName];
                if (ws) {
                    const data: any[] = XLSX.utils.sheet_to_json(ws);
                    const row = data.find((r: any) => r["Test Case ID"] === tcId);
                    if (row) {
                        row["Status"] = status;
                        row["Actual Result"] = actualResult;
                        row["Execution Time"] = durationSec;
                        
                        const newWs = XLSX.utils.json_to_sheet(data, {
                            header: ["Test Case ID", "Description", "persona", "Type", "ExpectedMessage", "Issue", "Status", "Actual Result", "Execution Time"]
                        });
                        wb.Sheets[sheetName] = newWs;
                        XLSX.writeFile(wb, filePath);
                    }
                }
            } catch (e) {
                console.error(`Failed to update Excel sheet for ${tcId}`, e);
            }
        }
    }

    onStdOut(chunk: string | Buffer, test?: TestCase, result?: TestResult): void {
        Logger.info(chunk);
    }

    onStdErr(chunk: string | Buffer, test?: TestCase, result?: TestResult): void {
        Logger.error(chunk);
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === "test.step") {
            if (typeof step.parent !== "undefined") {
                Logger.info(step.title);
            } else {
                this.printLogs(`Started Step: ${step.title}`, STEP_SEPARATOR);
            }
        }
    }

    onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === "test.step" && typeof step.parent === "undefined") {
            this.printLogs(`Completed Step: ${step.title}`, STEP_SEPARATOR);
        }
    }

    onError(error: TestError): void {
        Logger.error(`Message: ${error.message}`);
        Logger.error(`Stack: ${error.stack}`);
        Logger.error(`Value: ${error.value}`);
    }

    onEnd(result: any): void {
        try {
            const XLSX = require("xlsx");
            const path = require("path");
            const filePath = path.resolve("src/resources/data/testData.xlsx");
            const sheetName = "OfficeManagement";
            const wb = XLSX.readFile(filePath);
            const ws = wb.Sheets[sheetName];
            if (ws) {
                const data: any[] = XLSX.utils.sheet_to_json(ws);
                const omResults = data.filter((r: any) => r["Test Case ID"] && r["Test Case ID"].startsWith("TC_OM_"));
                if (omResults.length === 0) return;

                const total = 55;
                const executed = omResults.filter((r: any) => r["Status"] && r["Status"] !== "Not Run" && r["Status"] !== "").length;
                const passed = omResults.filter((r: any) => r["Status"] === "Pass").length;
                const failed = omResults.filter((r: any) => r["Status"] === "Fail").length;
                const skipped = total - executed;
                const passPercentage = executed > 0 ? ((passed / executed) * 100).toFixed(2) : "0.00";
                const failedIds = omResults.filter((r: any) => r["Status"] === "Fail").map((r: any) => r["Test Case ID"]);
                const failureReasons = omResults.filter((r: any) => r["Status"] === "Fail").map((r: any) => `${r["Test Case ID"]}: ${r["Actual Result"]}`).join("\n");

                Logger.info(TEST_SEPARATOR);
                Logger.info("OFFICE MANAGEMENT REGRESSION SUITE EXECUTION SUMMARY (FROM EXCEL)");
                Logger.info(TEST_SEPARATOR);
                Logger.info(`Total Test Cases   : ${total}`);
                Logger.info(`Executed           : ${executed}`);
                Logger.info(`Passed             : ${passed}`);
                Logger.info(`Failed             : ${failed}`);
                Logger.info(`Skipped            : ${skipped}`);
                Logger.info(`Pass Percentage    : ${passPercentage}%`);
                if (failedIds.length > 0) {
                    Logger.info(`Failed Test Cases  : ${failedIds.join(", ")}`);
                    Logger.info(`Failure Reasons    :\n${failureReasons}`);
                } else {
                    Logger.info(`Failed Test Cases  : None`);
                }
                Logger.info(TEST_SEPARATOR);
            }
        } catch (e) {
            console.error("Failed to generate Excel execution summary", e);
        }
    }

    private printLogs(msg: string, separator: string) {
        Logger.info(separator);
        Logger.info(`${msg.toUpperCase()}`);
        Logger.info(separator);
    }
}
