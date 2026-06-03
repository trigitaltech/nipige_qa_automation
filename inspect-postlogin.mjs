import { chromium } from "@playwright/test";

const base = "https://migration.demn8gjs27bhv.amplifyapp.com";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.goto(base + "/login", { waitUntil: "networkidle", timeout: 60000 });

await page.locator("#username").fill("freshcart@gmail.com");
await page.locator("#password").fill("Welcome@123");
await page.locator('button:text-is("Tenant")').click();
await page.locator('button:text-is("Log in")').click();

// wait for navigation away from /login OR an error
await page.waitForTimeout(6000);

const info = await page.evaluate(() => {
  const out = {};
  out.url = location.href;
  out.title = document.title;
  // error message candidates
  out.bodyTextSnippet = document.body.innerText.slice(0, 600);
  return out;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
