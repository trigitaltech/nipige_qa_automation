import HomeSteps from "@uiSteps/HomeSteps";
import NotificationTemplateSteps from "@uiSteps/NotificationTemplateSteps";
import { test as base } from "@base-test";
import { BrowserContext, Page } from "@playwright/test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";

const SHEET = "NotificationTemplate";
const TENANT = { email: "freshcart@gmail.com", password: "Welcome@123", persona: "tenant" };

async function applyEightyPercentZoom(context: BrowserContext): Promise<void> {
    await context.addInitScript(() => {
        const apply = () => document.documentElement?.style.setProperty("zoom", "0.8");
        apply();
        document.addEventListener("DOMContentLoaded", apply);
    });
}

const test = base.extend<{ tenantPage: Page }, { workerTenantPage: Page }>({
    workerTenantPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ viewport: null });
        await applyEightyPercentZoom(context);
        const page = await context.newPage();
        const home = new HomeSteps(page);
        await home.launchApplication();
        await home.login(TENANT.email, TENANT.password, TENANT.persona);
        await home.validateLogin(TENANT.email);
        await use(page);
        await context.close();
    }, { scope: "worker" }],
    tenantPage: async ({ workerTenantPage }, use) => { await use(workerTenantPage); },
});

test.afterEach(async ({ tenantPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const shot = await tenantPage.screenshot({ fullPage: true }).catch(() => null);
        if (shot) await testInfo.attach("failure-screenshot", { body: shot, contentType: "image/png" });
    }
});

test.describe.configure({ retries: 1 });

const ROWS = ExcelUtil.getTestDataArray(SHEET).filter(r => r.Runnable === "Yes" || r.Runnable === "YES");

test.describe.serial("Notification Template Suite", () => {
    const stamp = Date.now() % 100000;
    const concern = "PROMOTIONAL"; // Use an existing valid concern
    const dummyBody = `Automation_${stamp}`;

    for (const data of ROWS) {
        test(`${data.TC_ID} - ${data.Scenario}`, async ({ tenantPage }) => {
            Allure.attachDetails(`${data.Scenario}`, `Priority: ${data.Priority}`);
            const notif = new NotificationTemplateSteps(tenantPage);
            await notif.navigateToNotificationTemplate();

            // Based on TC_ID we route to the specific logic
            switch (data.TC_ID) {
                case "TC_NT_01":
                    await notif.verifyListingLoaded();
                    break;
                case "TC_NT_02":
                    await notif.verifyListingLoaded(); // Covers existing templates displaying
                    break;
                case "TC_NT_03":
                    await notif.clickCreateTemplate();
                    break;
                case "TC_NT_04":
                    await notif.clickCreateTemplate();
                    await notif.clearConcernSelection();
                    await notif.verifyCannotCreateWithoutConcern();
                    break;
                case "TC_NT_05":
                    await notif.clickCreateTemplate();
                    await notif.selectConcern(concern);
                    break;
                case "TC_NT_06":
                    await notif.switchTemplateTypes();
                    break;
                case "TC_NT_07":
                    await notif.createEmailTemplate(concern, `Subject_${stamp}`, `Email_Body_${stamp}`, "AutoName", "auto@mail.com");
                    break;
                case "TC_NT_08":
                    await notif.createEmailTemplateFails(concern, true, false);
                    break;
                case "TC_NT_09":
                    await notif.createEmailTemplateFails(concern, false, true);
                    break;
                case "TC_NT_10":
                    await notif.createSmsTemplate(concern, `SMS_Body_${stamp}`, `TID_${stamp}`);
                    break;
                case "TC_NT_11":
                    await notif.createSmsTemplateFails(concern, `SMS_Body_No_ID_${stamp}`);
                    break;
                case "TC_NT_12":
                    await notif.createWhatsappTemplate(concern, `Header_${stamp}`, `WA_Body_${stamp}`, `TID_${stamp}`);
                    break;
                case "TC_NT_13":
                    await notif.createWhatsappTemplateFails(concern, `Header_No_Body_${stamp}`);
                    break;
                case "TC_NT_14":
                    await notif.verifyWhatsappVariables(concern);
                    break;
                case "TC_NT_15":
                    await notif.createInAppTemplate(concern, `InApp_Subj_${stamp}`, `InApp_Body_${stamp}`);
                    break;
                case "TC_NT_16":
                    await notif.createInAppTemplateFails(concern, true); // Subject is empty
                    break;
                case "TC_NT_17":
                    await notif.verifyInAppImageUpload(concern, true); // Supported format
                    break;
                case "TC_NT_18":
                    await notif.verifyInAppImageUpload(concern, false); // Unsupported format
                    break;
                case "TC_NT_19":
                    await notif.createEmailTemplate(concern, `Dup_Subj_${stamp}`, dummyBody, "DupName", "dup@mail.com");
                    await notif.verifyTemplateInListing(concern, dummyBody);
                    break;
                case "TC_NT_20":
                    test.fail(true, "BUG-002: Application allows duplicate templates without validation error");
                    await notif.verifyDuplicateTemplateFails(concern, `Dup_Subj_${stamp}`, dummyBody, "DupName", "dup@mail.com");
                    break;
                case "TC_NT_21":
                    await notif.verifyPositiveSearch("TC_NT_21", "Concern", concern);
                    break;
                case "TC_NT_22":
                    await notif.verifyNegativeSearch("TC_NT_22", "Concern", "INVALID_KEYWORD_XYZ999");
                    break;
                case "TC_NT_23":
                    // To delete, create a new one first just to be safe, or use dummyBody
                    await notif.createEmailTemplate(concern, `Delete_Subj_${stamp}`, `Delete_Body_${stamp}`, "Name", "m@m.com");
                    await notif.deleteTemplate(`Delete_Body_${stamp}`);
                    await notif.verifyTemplateDeleted(`Delete_Body_${stamp}`);
                    break;
                case "TC_NT_24":
                    await notif.createEmailTemplate(concern, `Cancel_Del_Subj_${stamp}`, `Cancel_Del_Body_${stamp}`, "Name", "m@m.com");
                    await notif.cancelDeleteTemplate(`Cancel_Del_Body_${stamp}`);
                    break;
                case "TC_NT_25":
                    await notif.verifyRefresh();
                    break;
                default:
                    throw new Error(`Test Case ID '${data.TC_ID}' is not implemented in the spec file.`);
            }
            
            // Cleanup: If a test ends on the create page without submitting, click Cancel to return to listing
            if (tenantPage.url().includes("/create")) {
                await tenantPage.locator('main >> button:has-text("Cancel")').first().click().catch(() => {});
            }
        });
    }
});
