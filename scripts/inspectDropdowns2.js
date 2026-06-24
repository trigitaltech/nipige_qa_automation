const { chromium } = require("@playwright/test");
require("dotenv").config();

(async () => {
    const browser = await chromium.launch({ headless: true, slowMo: 100 });
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    const BASE = process.env.BASE_URL || "https://migration.demn8gjs27bhv.amplifyapp.com/";

    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    console.log("URL after goto:", page.url());

    // Try all possible email inputs
    const emailInputs = await page.locator('input').evaluateAll((els) =>
        els.map((e) => ({ type: e.type, name: e.name, placeholder: e.placeholder, id: e.id }))
    );
    console.log("Inputs on login page:", JSON.stringify(emailInputs));

    await page.locator('input').nth(0).fill("freshcart@gmail.com").catch(() => {});
    await page.locator('input').nth(1).fill("Welcome@123").catch(() => {});

    // Click Tenant button if visible
    const tenant = page.locator('text=Tenant').first();
    if (await tenant.isVisible({ timeout: 3000 }).catch(() => false)) {
        await tenant.click();
        console.log("Clicked Tenant");
    }

    // Click login
    await page.locator('button[type="submit"]').first().click().catch(async () => {
        await page.locator('button:has-text("Login")').first().click().catch(() => {});
    });
    await page.waitForTimeout(5000);
    console.log("URL after login:", page.url());

    // Navigate to report
    await page.goto(BASE + "analytics/dailyRegistration");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);
    console.log("URL on report:", page.url());

    // Try scrolling multiple times
    for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(500);
    }
    await page.waitForTimeout(1500);

    // Dump ALL text-bearing elements in Registration Detail area
    const allText = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll("button, select, div[role], span[role], [aria-haspopup], [data-radix-collection-item]").forEach((el) => {
            const t = (el.innerText || "").trim().substring(0, 50);
            if (t && (t.includes("Role") || t.includes("Source") || t.includes("Status") || t.includes("Apply"))) {
                const r = el.getBoundingClientRect();
                results.push({
                    tag: el.tagName,
                    text: t,
                    role: el.getAttribute("role"),
                    type: el.getAttribute("type"),
                    class: (el.className || "").substring(0, 100),
                    ariaHaspopup: el.getAttribute("aria-haspopup"),
                    rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
                });
            }
        });
        return results;
    });
    console.log("\n=== Filter-area elements ===");
    console.log(JSON.stringify(allText, null, 2));

    await page.waitForTimeout(3000);
    await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
