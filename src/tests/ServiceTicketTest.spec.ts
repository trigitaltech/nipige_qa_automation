import HomeSteps from "@uiSteps/HomeSteps";
import ServiceTicketSteps from "@uiSteps/ServiceTicketSteps";
import { test } from "@base-test";
import Allure from "@allure";
import ExcelUtil from "@utils/ExcelUtil";
import { getCredential, Role } from "@config/Credentials";

const SHEET = "ServiceTicketTest";

const data1 = ExcelUtil.getTestData(SHEET, "TC01_ViewAndCloseServiceTicket");
test(`${data1.TestID} - ${data1.Description}`, async ({ page }) => {
    Allure.attachDetails(data1.Description, data1.Issue);

    const credential = getCredential(Role.TENANT);
    const home = new HomeSteps(page);
    const ticket = new ServiceTicketSteps(page);

    // Precondition: log in as Tenant (identical pattern to TenantLoginTest.spec.ts)
    await home.launchApplication();
    await home.login(credential.email, credential.password, data1.persona);
    await home.validateLogin(credential.email);

    // Step 1: Navigate to Service Ticket listing page
    await ticket.navigateToServiceTickets();

    // Step 2: Click View (eye icon) for the ticket matching TicketID from Excel
    await ticket.clickViewForTicket(data1.TicketID);

    // Step 3: Verify ticket detail fields on the View page
    await ticket.verifyViewDetails(
        data1.TicketID,
        data1.CustomerName,
        data1.Subject,
        data1.Status,
    );

    // Step 4: Navigate back to the listing
    await ticket.navigateBackToListing();

    // Step 5: Click Edit (pencil icon) for the ticket matching TicketID from Excel
    await ticket.clickEditForTicket(data1.TicketID);

    // Step 6: Verify the Edit page has loaded
    await ticket.verifyEditPageLoaded();

    // Step 7: Verify current status is OPEN
    await ticket.verifyCurrentStatus(data1.Status);

    // Step 8: Change status to CLOSED
    await ticket.changeStatus(data1.NewStatus);

    // Step 9: Enter Note to Customer
    await ticket.enterNoteToCustomer(data1.NoteToCustomer);

    // Step 10: Enter Internal Note
    await ticket.enterInternalNote(data1.InternalNote);

    // Step 11: Click Update
    await ticket.clickUpdate();

    // Step 12: Verify update succeeded
    await ticket.verifyUpdateSuccess();

    // Step 13: Refresh the listing (grid does not auto-refresh after closure)
    await ticket.clickRefresh();

    // Step 14: Verify ticket status is CLOSED in the listing
    await ticket.verifyTicketStatusInListing(data1.TicketID, data1.NewStatus);

    await home.logout();
});

const data2 = ExcelUtil.getTestData(SHEET, "TC02_InvalidTicketID");
test(`${data2.TestID} - ${data2.Description}`, async ({ page }) => {
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
