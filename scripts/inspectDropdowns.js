const { chromium } = require("@playwright/test");
require("dotenv").config();

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const BASE = process.env.BASE_URL || "https://migration.demn8gjs27bhv.amplifyapp.com/";

    // Login
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', process.env.TENANT_EMAIL || "freshcart@gmail.com").catch(() => {});
    await page.fill('input[type="password"]', process.env.TENANT_PASSWORD || "Welcome@123").catch(() => {});
    const tenantBtn = page.locator('button:has-text("Tenant"), [role="button"]:has-text("Tenant")').first();
    if (await tenantBtn.isVisible({ timeout: 3000 }).catch(() => false)) await tenantBtn.click();
    await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first().click().catch(() => {});
    await page.waitForTimeout(5000);

    // Navigate to page
    await page.goto(BASE + "analytics/dailyRegistration");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Scroll down to Registration Detail section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    // Find elements with "All Roles" text
    const allRolesInfo = await page.evaluate(() => {
        const results = [];
        const seen = new Set();
        document.querySelectorAll("*").forEach((el) => {
            const own = el.childNodes;
            let directText = "";
            own.forEach((n) => { if (n.nodeType === 3) directText += n.textContent; });
            const innerText = el.innerText || "";
            if ((innerText.trim() === "All Roles" || directText.trim() === "All Roles") && !seen.has(el)) {
                seen.add(el);
                const rect = el.getBoundingClientRect();
                results.push({
                    tag: el.tagName,
                    role: el.getAttribute("role"),
                    type: el.getAttribute("type"),
                    name: el.getAttribute("name"),
                    class: (el.className || "").substring(0, 120),
                    ariaHaspopup: el.getAttribute("aria-haspopup"),
                    ariaExpanded: el.getAttribute("aria-expanded"),
                    dataSlot: el.getAttribute("data-slot"),
                    id: el.id,
                    visible: rect.width > 0 && rect.height > 0,
                    rect: { top: Math.round(rect.top), left: Math.round(rect.left), w: Math.round(rect.width), h: Math.round(rect.height) },
                });
            }
        });
        return results.slice(0, 8);
    });
    console.log("\n=== Elements with text 'All Roles' ===");
    console.log(JSON.stringify(allRolesInfo, null, 2));

    // Find all select elements
    const selects = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("select")).map((el) => ({
            name: el.getAttribute("name"),
            id: el.id,
            class: (el.className || "").substring(0, 80),
            value: el.value,
            optionCount: el.options.length,
            firstOptions: Array.from(el.options).slice(0, 4).map((o) => o.text),
            rect: (() => { const r = el.getBoundingClientRect(); return { t: Math.round(r.top), w: Math.round(r.width) }; })(),
        }));
    });
    console.log("\n=== All <select> elements ===");
    console.log(JSON.stringify(selects, null, 2));

    await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
