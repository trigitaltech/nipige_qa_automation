import { chromium } from "@playwright/test";
const base = "https://migration.demn8gjs27bhv.amplifyapp.com";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage(); // default viewport 1280x720
await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 });
await page.locator("#username").fill("freshcart@gmail.com");
await page.locator("#password").fill("Welcome@123");
await page.locator('button:text-is("Tenant")').click();
await page.locator('button:text-is("Log in")').click();
await page.waitForURL("**/home", { timeout: 30000 });
await page.waitForTimeout(1500);

const hdr = await page.evaluate(() => {
  return [...document.querySelectorAll("header button, header [role='button']")].map(b => {
    const r = b.getBoundingClientRect();
    const visible = r.width > 0 && r.height > 0 && getComputedStyle(b).visibility !== "hidden";
    return { text:(b.innerText||"").trim().slice(0,20), aria:b.getAttribute("aria-label"), haspopup:b.getAttribute("aria-haspopup"), visible, cls:b.className.slice(0,50) };
  });
});
console.log("HEADER:", JSON.stringify(hdr, null, 1));

// click the visible profile trigger (aria-haspopup, visible)
const trigger = page.locator('header button[aria-haspopup="true"]').filter({ hasNot: page.locator('.hidden') });
const popupBtns = page.locator('button[aria-haspopup="true"]');
const n = await popupBtns.count();
let clicked = false;
for (let i = 0; i < n; i++) {
  if (await popupBtns.nth(i).isVisible()) { await popupBtns.nth(i).click(); clicked = true; console.log("clicked haspopup idx", i); break; }
}
if (!clicked) console.log("no visible haspopup button");
await page.waitForTimeout(1000);
const menu = await page.evaluate(() =>
  [...document.querySelectorAll("[role='menuitem'], [role='menu'] *, [class*='dropdown'] *")]
    .filter(e => (e.textContent||"").trim() && e.children.length===0)
    .map(e => ({ role:e.getAttribute("role"), text:(e.textContent||"").trim().slice(0,30) })).slice(0,15));
console.log("MENU ITEMS:", JSON.stringify(menu, null, 1));
await browser.close();
