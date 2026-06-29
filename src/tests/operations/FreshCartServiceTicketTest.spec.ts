import FreshCartSteps from "@uiSteps/FreshCartSteps";
import HomeSteps from "@uiSteps/HomeSteps";
import ServiceTicketSteps from "@uiSteps/ServiceTicketSteps";
import { test } from "@base-test";
import Allure from "@allure";
import { getCredential, Role } from "@config/Credentials";
import FreshCartConstants from "@uiConstants/FreshCartConstants";

test("FreshCart_TC01 - Create FreshCart Support Ticket and Close via Tenant Portal", async ({ page, gData }) => {
    Allure.attachDetails(
        // eslint-disable-next-line max-len
        "Creates a support ticket on FreshCart, closes it via the Tenant portal, verifies CLOSED status on FreshCart, then logs out.",
        "",
    );

    const freshCart = new FreshCartSteps(page);
    const home = new HomeSteps(page);
    const ticket = new ServiceTicketSteps(page);
    const credential = getCredential(Role.TENANT);

    // ── Part 1: FreshCart — create a new support ticket ──────────────────────

    await freshCart.loginToFreshCart();
    await freshCart.navigateToOrders();
    await freshCart.openFirstOrder();
    await freshCart.clickNeedHelp();
    await freshCart.clickSupportTicketOption();
    await freshCart.clickRaiseTicket();
    await freshCart.fillAndSubmitTicket(
        "Delivery Issues",
        "Automation Test Issue",
        "Ticket created by automation framework.",
    );

    const capturedTicketId = await freshCart.captureGeneratedTicketId();
    gData.set(FreshCartConstants.CAPTURED_TICKET_ID, capturedTicketId);

    // ── Part 2: Tenant Portal — close the captured ticket ────────────────────

    await home.launchApplication();
    await home.login(credential.email, credential.password, "tenant");
    await home.validateLogin(credential.email);

    await ticket.navigateToServiceTickets();
    await ticket.clickRefresh();
    await ticket.searchByTicketId(capturedTicketId);
    await ticket.clickViewForTicket(capturedTicketId);
    // Status is not asserted here — ticket may not be OPEN if previously acted upon
    await ticket.verifyViewDetails(capturedTicketId, "", "", "");
    await ticket.navigateBackToListing();
    await ticket.searchByTicketId(capturedTicketId);

    await ticket.clickEditForTicket(capturedTicketId);
    await ticket.verifyEditPageLoaded();
    await ticket.verifyCurrentStatus("OPEN");
    await ticket.changeStatus("CLOSED");
    await ticket.enterNoteToCustomer("Ticket closed successfully");
    await ticket.enterInternalNote("Closed by automation test");
    await ticket.clickUpdate();

    await ticket.clickRefresh();
    await ticket.verifyTicketStatusInListing(capturedTicketId, "CLOSED");

    await home.logout();

    // ── Part 3: FreshCart — verify ticket is CLOSED, then logout ─────────────
    // No standalone Support Tickets nav link exists — must navigate via order.
    // Confirmed path: Orders → View Details → Need Help → Support Ticket → reload.

    await freshCart.loginToFreshCart();
    await freshCart.navigateToOrders();
    await freshCart.openFirstOrder();
    await freshCart.clickNeedHelp();
    await freshCart.clickSupportTicketOption();
    await freshCart.verifyTicketStatusInFreshCart(capturedTicketId, "Closed");
    await freshCart.logoutFromFreshCart();
    await freshCart.verifyFreshCartLoginPage();
});

test("FreshCart_TC02 - Negative: Search Invalid Ticket ID in Tenant Portal", async ({ page, gData }) => {
    Allure.attachDetails(
        // eslint-disable-next-line max-len
        "Searches for a dynamically derived invalid ticket ID in the Tenant Service Tickets listing and verifies no data is found.",
        "",
    );

    const home = new HomeSteps(page);
    const ticket = new ServiceTicketSteps(page);
    const credential = getCredential(Role.TENANT);

    // Derive invalid ID from the ticket captured in TC01 (same worker)
    const capturedTicketId: string = gData.get(FreshCartConstants.CAPTURED_TICKET_ID) ?? "";
    if (!capturedTicketId) {
        throw new Error("TC01 did not complete successfully. Captured Ticket ID unavailable.");
    }
    const invalidTicketId = capturedTicketId.length > 0
        ? capturedTicketId.substring(0, capturedTicketId.length - 1)
          + ((Number(capturedTicketId.slice(-1)) + 1) % 10)
        : "";

    await home.launchApplication();
    await home.login(credential.email, credential.password, "tenant");
    await home.validateLogin(credential.email);

    await ticket.navigateToServiceTickets();
    await ticket.clickRefresh();
    await ticket.searchByTicketId(invalidTicketId);
    await ticket.verifyNoDataMessage();

    await home.logout();
});
