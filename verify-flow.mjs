import { chromium, expect } from "@playwright/test";
const base = "https://migration.demn8gjs27bhv.amplifyapp.com";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();

await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 });
await page.locator("#username").fill("freshcart@gmail.com");
await page.locator("#password").fill("Welcome@123");
const persona = "tenant";
const label = persona.trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
await page.locator(`button:text-is("${label}")`).click();
await page.locator('button:text-is("Log in")').click();

const profile = page.locator('button[aria-haspopup="true"]').first();
const error = page.locator(".Toastify__toast--error");
await expect(profile.or(error).first()).toBeVisible({ timeout: 15000 });
if (await error.isVisible()) throw new Error("Login error: " + (await error.innerText()).trim());
await expect(page).toHaveURL(/\/home/, { timeout: 15000 });
console.log("LOGIN OK, url =", page.url());

await profile.click();
await page.locator('text="Logout"').first().click();
await expect(page.locator("#username")).toBeVisible({ timeout: 15000 });
console.log("LOGOUT OK, url =", page.url());

await browser.close();
console.log("FLOW VERIFIED");
