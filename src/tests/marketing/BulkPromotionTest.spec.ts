import { Page } from "@playwright/test";
import HomeSteps from "@uiSteps/HomeSteps";
import BulkPromotionSteps from "@uiSteps/BulkPromotionSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import { getCredential, Role } from "@config/Credentials";

const SHEET = "BulkPromotion";

let sharedPage!: Page;
let home!: HomeSteps;
let bulk!: BulkPromotionSteps;

// mode: "serial" is intentionally NOT used — serial mode skips all remaining
// tests when one fails, which prevents independent reporting of TC04-TC07.
// Tests run in declaration order naturally; the shared session is maintained
// via module-level variables initialised in beforeAll.
test.describe("Bulk Promotion", () => {
    test.beforeAll(async ({ browser }) => {
        const credential = getCredential(Role.BULK_PROMOTION_TENANT);
        const d = ExcelUtil.getTestData(SHEET, "TC01_Customer_FirstName");
        sharedPage = await browser.newPage();
        home = new HomeSteps(sharedPage);
        bulk = new BulkPromotionSteps(sharedPage);
        await home.launchApplication();
        await home.login(credential.email, credential.password, d.persona);
        await home.validateLogin(credential.email);
    });

    // Navigate back to the Bulk Promotion Create page before every test.
    // This ensures each test starts from a known state regardless of whether
    // the previous test passed or failed.
    test.beforeEach(async () => {
        await bulk.navigateToBulkPromotion();
        await bulk.clickCreate();
    });

    test.afterAll(async () => {
        await home.logout();
        await sharedPage?.close();
    });

    // ── TC01: Customer — First Name ───────────────────────────────────────────────
    const d01 = ExcelUtil.getTestData(SHEET, "TC01_Customer_FirstName");
    test(`${d01.TestID} - ${d01.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d01.Description, d01.Issue);
        await bulk.selectEntity(d01.Entity);
        await bulk.runCriteriaFlow(d01.Criteria, d01.Value, d01.Operator);
    });

    // ── TC02: Customer — Last Name ────────────────────────────────────────────────
    const d02 = ExcelUtil.getTestData(SHEET, "TC02_Customer_LastName");
    test(`${d02.TestID} - ${d02.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d02.Description, d02.Issue);
        await bulk.selectEntity(d02.Entity);
        await bulk.runCriteriaFlow(d02.Criteria, d02.Value, d02.Operator);
    });

    // ── TC03: Customer — Email ────────────────────────────────────────────────────
    const d03 = ExcelUtil.getTestData(SHEET, "TC03_Customer_Email");
    test(`${d03.TestID} - ${d03.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d03.Description, d03.Issue);
        await bulk.selectEntity(d03.Entity);
        await bulk.runCriteriaFlow(d03.Criteria, d03.Value, d03.Operator);
    });

    // ── TC04: Customer — Phone ────────────────────────────────────────────────────
    const d04 = ExcelUtil.getTestData(SHEET, "TC04_Customer_Phone");
    test(`${d04.TestID} - ${d04.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d04.Description, d04.Issue);
        await bulk.selectEntity(d04.Entity);
        await bulk.runPhoneCriteriaFlow(d04.Criteria, d04.Value, d04.Operator);
    });

    // ── TC05: Customer — Customer No ──────────────────────────────────────────────
    const d05 = ExcelUtil.getTestData(SHEET, "TC05_Customer_CustomerNo");
    test(`${d05.TestID} - ${d05.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d05.Description, d05.Issue);
        await bulk.selectEntity(d05.Entity);
        await bulk.runCriteriaFlow(d05.Criteria, d05.Value, d05.Operator);
    });

    // ── TC06: Customer — City ─────────────────────────────────────────────────────
    const d06 = ExcelUtil.getTestData(SHEET, "TC06_Customer_City");
    test(`${d06.TestID} - ${d06.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d06.Description, d06.Issue);
        await bulk.selectEntity(d06.Entity);
        await bulk.runCriteriaFlow(d06.Criteria, d06.Value, d06.Operator);
    });

    // ── TC07: Customer — State ────────────────────────────────────────────────────
    const d07 = ExcelUtil.getTestData(SHEET, "TC07_Customer_State");
    test(`${d07.TestID} - ${d07.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d07.Description, d07.Issue);
        await bulk.selectEntity(d07.Entity);
        await bulk.runCriteriaFlow(d07.Criteria, d07.Value, d07.Operator);
    });

    // ── TC08: Customer — Date ─────────────────────────────────────────────────────
    const d08 = ExcelUtil.getTestData(SHEET, "TC08_Customer_Date");
    test(`${d08.TestID} - ${d08.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d08.Description, d08.Issue);
        const [fromDate, toDate] = String(d08.Value).split("|").map((value) => value.trim());
        await bulk.selectEntity(d08.Entity);
        await bulk.runDateCriteriaFlow(d08.Criteria, fromDate, toDate, d08.Operator);
    });

    // TC09: Customer - Invalid Email
    const d09 = ExcelUtil.getTestData(SHEET, "TC09_Customer_InvalidEmail");
    test(`${d09.TestID} - ${d09.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d09.Description, d09.Issue);
        await bulk.selectEntity(d09.Entity);
        await bulk.runCriteriaFlow(d09.Criteria, d09.Value, d09.Operator);
    });

    // TC10: Customer - Invalid Phone
    const d10 = ExcelUtil.getTestData(SHEET, "TC10_Customer_InvalidPhone");
    test(`${d10.TestID} - ${d10.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d10.Description, d10.Issue);
        await bulk.selectEntity(d10.Entity);
        await bulk.runCriteriaFlow(d10.Criteria, d10.Value, d10.Operator);
    });

    // TC11: Customer - Invalid Customer No
    const d11 = ExcelUtil.getTestData(SHEET, "TC11_Customer_InvalidCustomerNo");
    test(`${d11.TestID} - ${d11.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d11.Description, d11.Issue);
        await bulk.selectEntity(d11.Entity);
        await bulk.runCriteriaFlow(d11.Criteria, d11.Value, d11.Operator);
    });

    // ── TC12: Order — City ────────────────────────────────────────────────────────
    const d12 = ExcelUtil.getTestData(SHEET, "TC12_Order_City");
    test(`${d12.TestID} - ${d12.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d12.Description, d12.Issue);
        await bulk.selectEntity(d12.Entity);
        await bulk.runCriteriaFlow(d12.Criteria, d12.Value, d12.Operator);
    });

    // ── TC13: Order — Date ────────────────────────────────────────────────────────
    const d13 = ExcelUtil.getTestData(SHEET, "TC13_Order_Date");
    test(`${d13.TestID} - ${d13.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d13.Description, d13.Issue);
        const [fromDate, toDate] = String(d13.Value).split("|").map((v) => v.trim());
        await bulk.selectEntity(d13.Entity);
        await bulk.runDateCriteriaFlow(d13.Criteria, fromDate, toDate, d13.Operator);
    });

    // ── TC14: Order — Order Amount (Range) ────────────────────────────────────────
    const d14 = ExcelUtil.getTestData(SHEET, "TC14_Order_OrderAmount");
    test(`${d14.TestID} - ${d14.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d14.Description, d14.Issue);
        const [minAmount, maxAmount] = String(d14.Value).split("|").map((v) => v.trim());
        await bulk.selectEntity(d14.Entity);
        await bulk.runRangeCriteriaFlow(d14.Criteria, minAmount, maxAmount, d14.Operator);
    });

    // ── TC15: Order — Invalid City (negative) ────────────────────────────────────
    const d15 = ExcelUtil.getTestData(SHEET, "TC15_Order_InvalidCity");
    test(`${d15.TestID} - ${d15.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d15.Description, d15.Issue);
        await bulk.selectEntity(d15.Entity);
        await bulk.runCriteriaFlow(d15.Criteria, d15.Value, d15.Operator);
    });

    // ── TC16: Order — Invalid Order Amount (negative) ────────────────────────────
    const d16 = ExcelUtil.getTestData(SHEET, "TC16_Order_InvalidOrderAmount");
    test(`${d16.TestID} - ${d16.Description} @regression @marketing`, async () => {
        Allure.attachDetails(d16.Description, d16.Issue);
        const [minAmount, maxAmount] = String(d16.Value).split("|").map((v) => v.trim());
        await bulk.selectEntity(d16.Entity);
        await bulk.runRangeCriteriaFlow(d16.Criteria, minAmount, maxAmount, d16.Operator);
    });

    // ── Legacy commented-out stubs (kept for reference) ──────────────────────────
    // const d08 = ExcelUtil.getTestData(SHEET, "TC08_Customer_RefererId");
    // test(`${d08.TestID} - ${d08.Description} @regression @marketing`, async () => {
    //     Allure.attachDetails(d08.Description, d08.Issue);
    //     await bulk.clickCreate();
    //     await bulk.selectEntity(d08.Entity);
    //     await bulk.runCriteriaFlow(d08.Criteria, d08.Value);
    // });

    // const d09 = ExcelUtil.getTestData(SHEET, "TC09_Customer_RefererId");
    // test(`${d09.TestID} - ${d09.Description} @regression @marketing`, async () => {
    //     Allure.attachDetails(d09.Description, d09.Issue);
    //     await bulk.clickCreate();
    //     await bulk.selectEntity(d09.Entity);
    //     await bulk.runCriteriaFlow(d09.Criteria, d09.Value);
    // });

    // const d10 = ExcelUtil.getTestData(SHEET, "TC10_AddConditionRow");
    // test(`${d10.TestID} - ${d10.Description} @regression @marketing`, async () => {
    //     Allure.attachDetails(d10.Description, d10.Issue);
    //     await bulk.clickCreate();
    //     await bulk.selectEntity(d10.Entity);
    //     await bulk.addCondition();
    //     await bulk.verifyConditionRowCount(2);
    // });

    // const d11 = ExcelUtil.getTestData(SHEET, "TC11_RemoveConditionRow");
    // test(`${d11.TestID} - ${d11.Description} @regression @marketing`, async () => {
    //     Allure.attachDetails(d11.Description, d11.Issue);
    //     await bulk.clickCreate();
    //     await bulk.selectEntity(d11.Entity);
    //     await bulk.addCondition();
    //     await bulk.verifyConditionRowCount(2);
    //     await bulk.removeCondition(1);
    //     await bulk.verifyConditionRowCount(1);
    // });

    // const d12 = ExcelUtil.getTestData(SHEET, "TC12_OrOperator");
    // test(`${d12.TestID} - ${d12.Description} @regression @marketing`, async () => {
    //     Allure.attachDetails(d12.Description, d12.Issue);
    //     await bulk.clickCreate();
    //     await bulk.selectEntity(d12.Entity);
    //     await bulk.selectCriteria(d12.Criteria1, 0);
    //     await bulk.addCondition();
    //     await bulk.selectOperator(d12.Operator, 0);
    //     await bulk.enterValue(d12.Value1, 0);
    //     await bulk.addCondition();
    //     await bulk.selectCriteria(d12.Criteria2, 1);
    //     await bulk.selectOperator(d12.Operator, 1);
    //     await bulk.enterValue(d12.Value2, 1);
    //     await bulk.clickViewImpactedCustomer();
    //     await bulk.verifyNoValidationError();
    //     await bulk.verifyImpactedCustomers();
    // });

    // const d13 = ExcelUtil.getTestData(SHEET, "TC13_ViewImpactedCustomer");
    // test(`${d13.TestID} - ${d13.Description} @regression @marketing`, async () => {
    //     Allure.attachDetails(d13.Description, d13.Issue);
    //     await bulk.clickCreate();
    //     await bulk.selectEntity(d13.Entity);
    //     await bulk.runCriteriaFlow(d13.Criteria, d13.Value);
    // });

    // const d14 = ExcelUtil.getTestData(SHEET, "TC14_DownloadButton");
    // test(`${d14.TestID} - ${d14.Description} @regression @marketing`, async () => {
    //     Allure.attachDetails(d14.Description, d14.Issue);
    //     await bulk.clickCreate();
    //     await bulk.selectEntity(d14.Entity);
    //     await bulk.runCriteriaFlow(d14.Criteria, d14.Value);
    //     await bulk.verifyDownloadButtonEnabled();
    // });
});
