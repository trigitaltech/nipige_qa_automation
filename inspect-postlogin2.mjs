import { chromium } from "@playwright/test";

const base = "https://migration.demn8gjs27bhv.amplifyapp.com";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.goto(base + "/login", { waitUntil: "networkidle", timeout: 60000 });
await page.locator("#username").fill("freshcart@gmail.com");
await page.locator("#password").fill("Welcome@123");
await page.locator('button:text-is("Tenant")').click();
await page.locator('button:text-is("Log in")').click();
await page.waitForURL("**/home", { timeout: 30000 });
await page.waitForTimeout(2000);

// Find smallest elements whose text is exactly the account name
const nameEls = await page.evaluate(() => {
  const matches = [];
  document.querySelectorAll("*").forEach(el => {
    const t = (el.textContent || "").trim();
    if ((t === "FreshCart" || t === "FRESHCART") && el.children.length === 0) {
      matches.push({ tag: el.tagName, id: el.id, className: el.className, text: t });
    }
  });
  return matches.slice(0, 10);
});
console.log("NAME ELEMENTS:", JSON.stringify(nameEls, null, 1));

// Try to open a user/profile menu to find logout. Look for avatar buttons.
const headerBtns = await page.evaluate(() => {
  return [...document.querySelectorAll("header button, [class*='avatar'], button[aria-haspopup], header [role='button']")]
    .map(b => ({ tag: b.tagName, text: (b.innerText||"").trim().slice(0,30), aria: b.getAttribute("aria-label"), cls: b.className.slice(0,60) }))
    .slice(0, 15);
});
console.log("HEADER BUTTONS:", JSON.stringify(headerBtns, null, 1));

// Click the top-left account name area to see if a menu with Logout appears
try {
  await page.locator('button:has-text("FreshCart")').first().click({ timeout: 4000 });
  await page.waitForTimeout(1200);
  const logout = await page.evaluate(() =>
    [...document.querySelectorAll("*")].filter(e => /log\s?out|sign\s?out/i.test((e.textContent||"")) && e.children.length===0)
      .map(e => ({ tag:e.tagName, text:(e.textContent||"").trim(), cls:e.className.slice(0,60), role:e.getAttribute("role") })).slice(0,8));
  console.log("LOGOUT CANDIDATES:", JSON.stringify(logout, null, 1));
} catch (e) {
  console.log("could not click account name:", e.message);
}
await browser.close();
