import { chromium } from "@playwright/test";
const base = "https://migration.demn8gjs27bhv.amplifyapp.com";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.goto(base + "/login", { waitUntil: "networkidle", timeout: 60000 });
await page.locator("#username").fill("freshcart@gmail.com");
await page.locator("#password").fill("wrongpass123");
await page.locator('button:text-is("Tenant")').click();
await page.locator('button:text-is("Log in")').click();
// Poll quickly for any toast/alert appearing
for (let i = 0; i < 20; i++) {
  await page.waitForTimeout(400);
  const found = await page.evaluate(() => {
    const cands = [];
    document.querySelectorAll("[role='alert'], [role='status'], li[data-sonner-toast], [class*='toast'], [class*='Toast'], [class*='sonner']").forEach(el => {
      const t = (el.innerText||"").trim();
      if (t && el.tagName !== "BUTTON") cands.push({ tag: el.tagName, role: el.getAttribute("role"), cls: el.className.slice(0,80), text: t.slice(0,140) });
    });
    return cands;
  });
  if (found.length) { console.log("ITER", i, JSON.stringify(found, null, 1)); break; }
}
await browser.close();
