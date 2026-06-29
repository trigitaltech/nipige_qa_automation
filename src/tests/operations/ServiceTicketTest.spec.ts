import HomeSteps from "@uiSteps/HomeSteps";
import ServiceTicketSteps from "@uiSteps/ServiceTicketSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import { getCredential, Role } from "@config/Credentials";

const SHEET = "ServiceTicketTest";

const data2 = ExcelUtil.getTestData(SHEET, "TC02_InvalidTicketID");
test(`${data2.TestID} - ${data2.Description} @regression @operations`, async ({ page }) => {
    Allure.attachDetails(data2.Description, data2.Issue);

    const credential = getCredential(Role.TENANT);
    const home = new HomeSteps(page);
    const ticket = new ServiceTicketSteps(page);

    await home.launchApplication();
    await home.login(credential.email, credential.password, data2.persona);
    await home.validateLogin(credential.email);

    await ticket.navigateToServiceTickets();
    await ticket.searchByTicketId(data2.TicketID);
    await ticket.verifyNoDataMessage();

    await home.logout();
});
