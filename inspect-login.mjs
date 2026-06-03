import { chromium } from "@playwright/test";

const url = "https://migration.demn8gjs27bhv.amplifyapp.com/login";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

const dump = await page.evaluate(() => {
  const out = {};
  const inputs = [...document.querySelectorAll("input")].map(i => ({
    name: i.getAttribute("name"), id: i.id, type: i.type,
    placeholder: i.placeholder, className: i.className,
  }));
  out.inputs = inputs;
  // Role buttons / login button - capture clickable elements with text
  const clickables = [...document.querySelectorAll("button, [role='button'], a")].map(b => ({
    tag: b.tagName, text: (b.innerText || "").trim().slice(0, 40),
    id: b.id, type: b.getAttribute("type"), className: b.className,
  })).filter(b => b.text);
  out.clickables = clickables;
  return out;
});

console.log(JSON.stringify(dump, null, 2));
await browser.close();
