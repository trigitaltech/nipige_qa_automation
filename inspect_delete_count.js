const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/');
  await page.waitForLoadState('networkidle');
  await page.locator('#username').fill('freshcart@gmail.com');
  await page.locator('#password').fill('Welcome@123');
  const t = page.locator('button:has-text("Tenant")').first();
  if (await t.isVisible({ timeout: 3000 }).catch(() => false)) await t.click();
  await page.locator('button:text-is("Log in")').first().click();
  await page.waitForURL(/\/home/, { timeout: 30000 });

  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Count all rows across all pages
  async function countAllRows() {
    // clear search
    await page.locator('input[placeholder="Search tax code, country..."]').clear().catch(() => {});
    await page.waitForTimeout(500);

    let total = 0;
    for (let p = 0; p < 20; p++) {
      await page.waitForTimeout(500);
      const rows = await page.locator('table tbody tr').count();
      total += rows;
      console.log(`  Page ${p+1}: ${rows} rows (total so far: ${total})`);
      // Check next button
      const nextLink = page.locator('a[aria-label="Go to next page"]').first();
      const exists = await nextLink.count().then(c => c > 0);
      if (!exists) {
        console.log('  No next link found');
        break;
      }
      const disabled = await nextLink.getAttribute('aria-disabled');
      console.log(`  Next link aria-disabled: ${disabled}`);
      if (disabled === 'true') break;
      await nextLink.click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(500);
    }
    return total;
  }

  // Also check pagination HTML
  const paginationHtml = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="pagination"]');
    return nav ? nav.outerHTML.substring(0, 800) : 'NO PAGINATION NAV';
  });
  console.log('=== PAGINATION HTML ===\n', paginationHtml);

  console.log('\n=== BEFORE CREATE: counting all rows ===');
  const beforeCreate = await countAllRows();
  console.log('Total before create:', beforeCreate);

  // Create a test tax code
  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode');
  await page.waitForLoadState('networkidle');
  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode/create');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const testCode = 'COUNT_TEST_' + Date.now().toString().slice(-6);
  const countryInput = page.locator('input[placeholder*="Select country" i], input[placeholder*="country" i]').first();
  await countryInput.click();
  await countryInput.fill('India');
  await page.waitForTimeout(500);
  const opt = page.locator('[role="option"]:has-text("India"), li:has-text("India")').first();
  if (await opt.isVisible({ timeout: 2000 }).catch(() => false)) await opt.click();
  await page.locator('input[placeholder*="KID-5" i], input[placeholder*="HSN" i]').first().fill(testCode);
  const dates = page.locator('input[type="date"], input[placeholder="dd-mm-yyyy"]');
  await dates.nth(0).fill('2026-01-01');
  await dates.nth(1).fill('2030-12-31');
  await page.locator('input[placeholder*="CGST" i], input[placeholder*="SGST" i]').first().fill('TestLine');
  await page.locator('input[placeholder*="5, 12, 18" i]').first().fill('5');
  await page.locator('button:has-text("Create Tax Code")').click();
  await page.waitForLoadState('networkidle');
  console.log('URL after create:', page.url());

  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  console.log('\n=== AFTER CREATE: counting all rows ===');
  const afterCreate = await countAllRows();
  console.log('Total after create:', afterCreate, '(change:', afterCreate - beforeCreate, ')');

  // Delete the test code
  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const searchInput = page.locator('input[placeholder="Search tax code, country..."]');
  await searchInput.fill(testCode);
  await page.waitForTimeout(1000);

  const row = page.locator(`table tbody tr:has(td:has-text("${testCode}"))`).first();
  const rowExists = await row.isVisible({ timeout: 3000 }).catch(() => false);
  console.log('\nTest row visible for delete?', rowExists);

  if (rowExists) {
    await row.locator('td:last-child button').last().click();
    const popup = page.locator('.swal2-popup').first();
    await popup.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const popupVisible = await popup.isVisible({ timeout: 2000 }).catch(() => false);
    console.log('Delete popup visible?', popupVisible);
    if (popupVisible) {
      const confirmBtn = page.locator('.swal2-confirm').first();
      console.log('Confirm button text:', await confirmBtn.textContent());
      await confirmBtn.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      console.log('Deleted. URL:', page.url());
    }
  }

  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  console.log('\n=== AFTER DELETE: counting all rows ===');
  const afterDelete = await countAllRows();
  console.log('Total after delete:', afterDelete, '(change from create:', afterDelete - afterCreate, ')');
  console.log('\nSUMMARY:');
  console.log('  Before create:', beforeCreate);
  console.log('  After create:', afterCreate, '(change:', afterCreate - beforeCreate, ')');
  console.log('  After delete:', afterDelete, '(change:', afterDelete - afterCreate, ')');

  await browser.close();
})().catch(e => console.error('Error:', e.message));
