import { test } from "@base-test";
import HomeSteps from "@uiSteps/HomeSteps";

const EMAIL = "nipigev2@yopmail.com";
const PASS = "admin@123";
const PERSONA = "tenant";

test("Inspect Registration Detail dropdowns", async ({ page }) => {
    const home = new HomeSteps(page);
    await home.launchApplication();
    await home.login(EMAIL, PASS, PERSONA);
    await page.goto(`${process.env.BASE_URL}analytics/dailyRegistration`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Scroll to bottom to reveal Registration Detail section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Find all elements that contain "All Roles" text
    const allRolesInfo = await page.evaluate(() => {
        const results: any[] = [];
        document.querySelectorAll("*").forEach((el) => {
            const text = (el as HTMLElement).innerText?.trim();
            if (text === "All Roles" || text?.startsWith("All Roles")) {
                results.push({
                    tag: el.tagName,
                    role: el.getAttribute("role"),
                    type: el.getAttribute("type"),
                    name: el.getAttribute("name"),
                    class: el.className?.substring(0, 100),
                    ariaHaspopup: el.getAttribute("aria-haspopup"),
                    ariaExpanded: el.getAttribute("aria-expanded"),
                    dataSlot: el.getAttribute("data-slot"),
                    id: el.id,
                    text,
                });
            }
        });
        return results.slice(0, 5);
    });
    console.log("All Roles elements:", JSON.stringify(allRolesInfo, null, 2));

    // Also check for any select elements on page
    const selects = await page.evaluate(() => {
        const results: any[] = [];
        document.querySelectorAll("select").forEach((el) => {
            results.push({
                name: el.getAttribute("name"),
                id: el.id,
                class: el.className?.substring(0, 80),
                value: el.value,
                optionCount: el.options.length,
                firstOptions: Array.from(el.options).slice(0, 3).map((o) => o.text),
            });
        });
        return results;
    });
    console.log("Select elements:", JSON.stringify(selects, null, 2));
});
