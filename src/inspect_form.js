const { chromium } = require('@playwright/test');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Logging in...");
  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/login');
  await page.locator('#username').first().fill('freshcart@gmail.com');
  await page.locator('#password').first().fill('Welcome@123');
  await page.locator('button:has-text("Tenant"), label:has-text("Tenant")').first().click();
  await page.locator('button[type="submit"], button:has-text("Log in")').first().click();
  await page.waitForURL(/\/home/, { timeout: 15000 });
  console.log("Logged in successfully.");
  
  console.log("Navigating to Create Delivery Setup page...");
  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/deliverysetup/create');
  await page.waitForLoadState('networkidle');
  
  // Extract inputs, checkboxes, selects, and textareas with their surrounding labels/texts
  console.log("Extracting form structure...");
  const fields = await page.evaluate(() => {
    const results = [];
    
    // Checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(el => {
      const label = el.nextElementSibling?.textContent || el.parentElement?.textContent || "";
      results.push({
        type: 'checkbox',
        label: label.trim().replace(/\s+/g, ' '),
        id: el.id,
        name: el.name,
        selector: `input[type="checkbox"]${el.id ? '#' + el.id : ''}`
      });
    });
    
    // Selects
    document.querySelectorAll('select').forEach(el => {
      const label = el.previousElementSibling?.textContent || el.parentElement?.previousElementSibling?.textContent || "";
      results.push({
        type: 'select',
        label: label.trim().replace(/\s+/g, ' '),
        id: el.id,
        name: el.name,
        options: Array.from(el.options).map(o => o.text.trim())
      });
    });
    
    // Text/Date/Number inputs
    document.querySelectorAll('input[type="text"], input[type="date"], input[type="number"]').forEach(el => {
      const label = el.previousElementSibling?.textContent || el.parentElement?.previousElementSibling?.textContent || "";
      results.push({
        type: el.type,
        label: label.trim().replace(/\s+/g, ' '),
        id: el.id,
        name: el.name,
        placeholder: el.placeholder
      });
    });
    
    return results;
  });
  
  console.log("FORM FIELDS DUMP:");
  console.log(JSON.stringify(fields, null, 2));
  
  await browser.close();
})();
