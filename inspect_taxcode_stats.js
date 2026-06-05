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
  console.log('Logged in');

  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Get the full stat cards HTML
  const statCardsHtml = await page.evaluate(() => {
    const grid = document.querySelector('[class*="grid"][class*="gap"]');
    return grid ? grid.innerHTML.substring(0, 5000) : 'No grid found';
  });
  console.log('\n=== STAT CARDS HTML ===\n', statCardsHtml.substring(0, 3000));

  // Get stat card text content
  const cardTexts = await page.evaluate(() => {
    // Find all stat card containers
    const cards = document.querySelectorAll('[class*="rounded-xl"][class*="border"][class*="min-h"]');
    return Array.from(cards).map(c => c.textContent.trim().substring(0, 100));
  });
  console.log('\n=== CARD TEXT CONTENTS ===');
  cardTexts.forEach((t, i) => console.log(i, JSON.stringify(t)));

  // Specifically find p elements around "Total Codes"
  const totalCodesContext = await page.evaluate(() => {
    const allP = Array.from(document.querySelectorAll('p'));
    const label = allP.find(el => el.textContent?.trim().toLowerCase() === 'total codes');
    if (!label) return 'Label not found';
    const prev = label.previousElementSibling;
    const next = label.nextElementSibling;
    return {
      labelHTML: label.outerHTML,
      prevHTML: prev ? prev.outerHTML : 'no prev',
      nextHTML: next ? next.outerHTML.substring(0, 100) : 'no next',
      parentHTML: label.parentElement ? label.parentElement.outerHTML.substring(0, 500) : 'no parent',
      prevText: prev ? prev.textContent?.trim() : 'none'
    };
  });
  console.log('\n=== TOTAL CODES CONTEXT ===');
  console.log(JSON.stringify(totalCodesContext, null, 2));

  // Get total row count in listing
  const rowCount = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tbody tr');
    return rows.length;
  });
  console.log('\n=== TABLE ROW COUNT ===', rowCount);

  // Now create and delete a tax code to test if stat card updates
  console.log('\n=== CREATING A TEST TAX CODE ===');
  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode/create');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const testCode = 'STAT_TEST_' + Date.now().toString().slice(-6);
  // Fill form
  const countryInput = page.locator('input[placeholder*="country" i], input[placeholder*="Select country" i]').first();
  await countryInput.click();
  await countryInput.fill('India');
  await page.waitForTimeout(500);
  const option = page.locator('[role="option"]:has-text("India"), li:has-text("India")').first();
  if (await option.isVisible({ timeout: 2000 }).catch(() => false)) await option.click();

  const taxCodeInput = page.locator('input[placeholder*="KID-5" i], input[placeholder*="HSN" i]').first();
  await taxCodeInput.fill(testCode);

  const dateInputs = page.locator('input[type="date"], input[placeholder="dd-mm-yyyy"]');
  await dateInputs.nth(0).fill('2026-01-01');
  await dateInputs.nth(1).fill('2030-12-31');

  await page.locator('input[placeholder*="CGST" i], input[placeholder*="SGST" i]').first().fill('TestLine');
  await page.locator('input[placeholder*="5, 12, 18" i]').first().fill('5');

  await page.locator('button:has-text("Create Tax Code")').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  console.log('URL after create:', page.url());

  // Navigate to listing and read count
  await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const countAfterCreate = await page.evaluate(() => {
    const allP = Array.from(document.querySelectorAll('p'));
    const label = allP.find(el => el.textContent?.trim().toLowerCase() === 'total codes');
    if (!label) return -1;
    const prev = label.previousElementSibling;
    return prev ? parseInt(prev.textContent?.trim() ?? '0', 10) : -1;
  });
  console.log('Count after create:', countAfterCreate);

  // Now delete the tax code
  const testRow = page.locator(`table tbody tr:has(td:has-text("${testCode}"))`).first();
  if (await testRow.isVisible({ timeout: 3000 }).catch(() => false)) {
    await testRow.locator('td:last-child button').last().click();
    await page.locator('.swal2-confirm').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await page.locator('.swal2-confirm').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('Deleted test tax code');

    // Read count after delete (NO reload)
    await page.goto('https://migration.demn8gjs27bhv.amplifyapp.com/setup/taxcode');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const countAfterDelete = await page.evaluate(() => {
      const allP = Array.from(document.querySelectorAll('p'));
      const label = allP.find(el => el.textContent?.trim().toLowerCase() === 'total codes');
      if (!label) return -1;
      const prev = label.previousElementSibling;
      return prev ? parseInt(prev.textContent?.trim() ?? '0', 10) : -1;
    });
    console.log('Count after delete (fresh nav):', countAfterDelete);

    // Reload and read again
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const countAfterReload = await page.evaluate(() => {
      const allP = Array.from(document.querySelectorAll('p'));
      const label = allP.find(el => el.textContent?.trim().toLowerCase() === 'total codes');
      if (!label) return -1;
      const prev = label.previousElementSibling;
      return prev ? parseInt(prev.textContent?.trim() ?? '0', 10) : -1;
    });
    console.log('Count after reload:', countAfterReload);

    console.log('\nSUMMARY:');
    console.log('  After create:', countAfterCreate);
    console.log('  After delete (fresh nav):', countAfterDelete);
    console.log('  After reload:', countAfterReload);
    console.log('  Count decreased?', countAfterDelete < countAfterCreate);
  }

  await browser.close();
})().catch(e => console.error('Error:', e.message));
