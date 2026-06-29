import { test } from "@base-test";
import HomeSteps from "@uiSteps/HomeSteps";

const EMAIL = process.env.TENANT_EMAIL || "freshcart@gmail.com";
const PASS = process.env.TENANT_PASSWORD || "Welcome@123";

test("E2E Create Delivery debug with Rank 6", async ({ page }) => {
    // Listen for console, errors and responses
    page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));
    page.on('response', response => {
        if (response.status() >= 400) {
            console.log('RESPONSE ERROR:', response.status(), response.url());
            response.json().then(data => console.log('RESPONSE JSON:', JSON.stringify(data))).catch(() => {});
        }
    });

    const home = new HomeSteps(page);
    await home.launchApplication();
    await home.login(EMAIL, PASS, "tenant");
    await home.validateLogin(EMAIL);

    await page.goto(`${process.env.BASE_URL}setup/deliverysetup/create`);
    await page.waitForLoadState("networkidle");

    const form = page.locator('form');
    const selects = form.locator('select');
    const writableFormInputs = form.locator('input:not([type="number"]):not([type="date"]):not([type="checkbox"]):not([readonly])');

    // Fill fields
    await writableFormInputs.first().fill("1234"); // Area Code
    
    // Category Select
    const categorySelect = selects.first();
    await categorySelect.selectOption({ label: "All Categories" });

    // Transport Mode Select
    const transportSelect = selects.nth(1);
    await transportSelect.selectOption({ label: "Ship" });

    // Rank Select -> "6"
    const rankSelect = selects.nth(2);
    await rankSelect.selectOption({ label: "6" });

    // Fill Start Date (e.g. 2026-06-01)
    const startDateInput = page.locator('input[type="date"]').first();
    await startDateInput.fill("2026-06-01");

    // Fill End Date
    const endDateInput = page.locator('input[type="date"]').nth(1);
    await endDateInput.fill("2056-12-31");

    // Distance Tier Name
    await writableFormInputs.nth(1).fill("Standard Tier");

    // Distance ranges & costs
    await page.locator('input[type="number"]').nth(0).fill("0");
    await page.locator('input[type="number"]').nth(1).fill("100");
    await page.locator('input[type="number"]').nth(2).fill("0");
    await page.locator('input[type="number"]').nth(3).fill("50");
    await page.locator('input[type="number"]').nth(4).fill("5000");
    await page.locator('input[type="number"]').nth(5).fill("3000");
    
    // Expected Select
    const expectedSelect = selects.nth(3);
    await expectedSelect.selectOption({ index: 1 }); // days

    // Time (Days)
    await page.locator('input[type="number"]').nth(6).fill("5");

    // Click Save Setup
    const saveBtn = page.locator('button:has-text("Save Setup"), button:has-text("Save"), button[type="submit"]').first();
    await saveBtn.click();

    // Wait a bit for page to navigate or show errors
    await page.waitForTimeout(5000);

    console.log("URL after save click:", page.url());
});
