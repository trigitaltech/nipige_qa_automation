require('dotenv').config();
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const email = process.env.TENANT_EMAIL || "freshcart@gmail.com";
  const pass = process.env.TENANT_PASSWORD || "Welcome@123";
  const baseUrl = process.env.BASE_URL || "https://migration.demn8gjs27bhv.amplifyapp.com/";

  console.log("Logging in...");
  await page.goto(baseUrl);
  await page.fill('#username', email);
  await page.fill('#password', pass);
  const tenantRole = page.locator('button:text-is("Tenant")').first();
  if (await tenantRole.isVisible()) {
    await tenantRole.click();
  }
  await page.click('button:text-is("Log in")');
  await page.waitForURL(/\/home/, { timeout: 15000 });

  console.log("Navigating to Advertisement Create page...");
  await page.goto(`${baseUrl}advertisement/create`);
  await page.waitForLoadState("networkidle");

  // Step 1: Select Type
  console.log("Selecting Video Type...");
  const selects = page.locator('select');
  const count = await selects.count();
  for (let i = 0; i < count; i++) {
    const opts = await selects.nth(i).locator('option').allTextContents();
    if (opts.some(o => o.includes('Video'))) {
      await selects.nth(i).selectOption({ label: 'Video' });
      console.log("Selected Video via select index", i);
      break;
    }
  }
  await page.waitForTimeout(1000);

  // Step 1: Select Placement
  const placementTrigger = page.locator('button:has-text("Open options"), button:has-text("Select Placement")').first();
  if (await placementTrigger.isVisible()) {
    await placementTrigger.click();
    await page.waitForTimeout(500);
    const opt = page.locator('[role="option"]').first();
    await opt.click();
  }

  // Step 1: Select Visibility
  for (let i = 0; i < count; i++) {
    const opts = await selects.nth(i).locator('option').allTextContents();
    if (opts.some(o => o.includes('Global'))) {
      await selects.nth(i).selectOption({ label: 'Global' });
      break;
    }
  }

  // Set dates
  const dates = page.locator('input[type="date"]');
  if (await dates.count() >= 2) {
    await dates.nth(0).fill('2026-06-15');
    await dates.nth(1).fill('2026-07-14');
  }

  // Upload icon
  const uploadBtn = page.locator('input[type="file"]').first();
  const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 15000 });
  await uploadBtn.evaluate(node => node.click());
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('D:\\Automation\\TestData\\icon.jpg');
  await page.waitForTimeout(1000);

  // Click continue
  console.log("Clicking Continue...");
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(2000);

  // Step 2: Upload Video
  console.log("Uploading Video on Step 2...");
  const addVideoBtn = page.locator('button:has-text("Add New Video"), button:has-text("Add Video"), button:has-text("Upload Video")').first();
  if (await addVideoBtn.isVisible()) {
    await addVideoBtn.click();
    await page.waitForTimeout(800);
  }
  
  const videoUploadBtn = page.locator('input[type="file"]').last();
  const videoChooserPromise = page.waitForEvent('filechooser', { timeout: 15000 });
  await videoUploadBtn.evaluate(node => node.click());
  const videoChooser = await videoChooserPromise;
  await videoChooser.setFiles('D:\\Automation\\TestData\\advertisement.mp4');
  await page.waitForTimeout(1500);

  // Set content
  const editor = page.locator('[contenteditable="true"], textarea, input[name="content"]').first();
  if (await editor.isVisible()) {
    await editor.click();
    await page.keyboard.type("VIDEO_TEST_9999");
  }

  // Set Navigation URL criteria
  const urlRadio = page.locator('button[role="radio"]:has-text("URL"), input[type="radio"][value="url"]').first();
  if (await urlRadio.isVisible()) {
    await urlRadio.click();
    await page.waitForTimeout(500);
  }
  const urlInput = page.locator('input[placeholder*="http"]').first();
  if (await urlInput.isVisible()) {
    await urlInput.fill("https://google.com");
  }

  // Capture before submit screenshot
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.screenshot({ path: 'C:/Users/anura/.gemini/antigravity-ide/brain/4f4091b8-4816-46c4-beb0-4038cb816ca6/scratch/video_before_submit.png' });

  // Click Create
  console.log("Clicking Create...");
  const createBtn = page.locator('button:has-text("Create Advertisement"), button:has-text("Save"), button[type="submit"]').first();
  await createBtn.click();
  await page.waitForTimeout(5000);

  // Take screenshot after submit
  await page.screenshot({ path: 'C:/Users/anura/.gemini/antigravity-ide/brain/4f4091b8-4816-46c4-beb0-4038cb816ca6/scratch/video_after_submit.png' });
  console.log("After submit URL:", page.url());

  const bodyText = await page.locator('body').innerText();
  console.log("Page text after submit:\n", bodyText.substring(0, 1000));

  await browser.close();
})();
