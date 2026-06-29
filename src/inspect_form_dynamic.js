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
  
  console.log("Navigating to Create Delivery Setup page...");
  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/deliverysetup/create');
  await page.waitForLoadState('networkidle');
  
  // By default, let's see which checkboxes are checked
  const defaultStates = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input[type="checkbox"]')).map(el => ({
      label: el.nextElementSibling?.textContent?.trim() || el.parentElement?.textContent?.trim() || "",
      checked: el.checked
    }));
  });
  console.log("Default Checkbox States:", defaultStates);
  
  // Uncheck "Applied for all states" and "Applied for all cities" and see what new elements appear
  console.log("Unchecking 'Applied for all states' and 'Applied for all cities'...");
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i++) {
    const label = await checkboxes.nth(i).evaluate(el => el.nextElementSibling?.textContent?.trim() || el.parentElement?.textContent?.trim() || "");
    if (label.includes("Applied for all states") || label.includes("Applied for all cities") || label.includes("all source states") || label.includes("all source cities")) {
      const isChecked = await checkboxes.nth(i).isChecked();
      if (isChecked) {
        await checkboxes.nth(i).click();
      }
    }
  }
  
  await page.waitForTimeout(2000); // Wait for potential UI updates
  
  // Now dump all visible inputs/selects again
  const dynamicFields = await page.evaluate(() => {
    const results = [];
    
    // Selects
    document.querySelectorAll('select').forEach(el => {
      const label = el.previousElementSibling?.textContent || el.parentElement?.previousElementSibling?.textContent || "";
      results.push({
        type: 'select',
        label: label.trim().replace(/\s+/g, ' '),
        id: el.id,
        name: el.name
      });
    });
    
    // Text/Date/Number inputs
    document.querySelectorAll('input[type="text"], input[type="date"], input[type="number"]').forEach(el => {
      if (el.id === 'sidebar-search') return;
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
  
  console.log("DYNAMIC FIELDS DUMP AFTER UNCHECKING:");
  console.log(JSON.stringify(dynamicFields, null, 2));
  
  await browser.close();
})();
