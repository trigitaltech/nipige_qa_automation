import { test as setup } from "@playwright/test";
import fs from "fs";
import path from "path";
import HomeSteps from "@uiSteps/HomeSteps";
import { getCredential, Role } from "@config/Credentials";

const rolesToAuthenticate = [
  { role: Role.ADMIN, filename: "admin.json", persona: "admin" },
  { role: Role.TENANT, filename: "tenant.json", persona: "tenant" },
  { role: Role.SELLER, filename: "seller.json", persona: "seller" },
  { role: Role.BULK_PROMOTION_TENANT, filename: "bulk_promotion_tenant.json", persona: "tenant" },
];

for (const { role, filename, persona } of rolesToAuthenticate) {
  setup(`Authenticate as ${role}`, async ({ page }) => {
    const statePath = path.resolve(`playwright/.auth/${filename}`);
    
    // Check if state is fresh (e.g., created less than 1 hour ago)
    if (fs.existsSync(statePath)) {
      const stats = fs.statSync(statePath);
      const ageInMinutes = (Date.now() - stats.mtimeMs) / (60 * 1000);
      if (ageInMinutes < 60) {
        console.log(`Skipping authentication for ${role} (session state is fresh)`);
        return;
      }
    }
    
    const creds = getCredential(role);
    const home = new HomeSteps(page);

    let attempt = 0;
    const maxAttempts = 3;
    while (attempt < maxAttempts) {
      attempt++;
      try {
        await home.launchApplication();
        await home.login(creds.email, creds.password, persona);
        await home.validateLogin(creds.email);
        break;
      } catch (error: any) {
        if (attempt >= maxAttempts) {
          throw error;
        }
        console.warn(`Authentication attempt ${attempt} for ${role} failed: ${error.message}. Retrying in 10 seconds...`);
        await page.waitForTimeout(10000);
      }
    }
    
    // Ensure parent directory exists
    const dir = path.dirname(statePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    await page.context().storageState({ path: statePath });
    
    // Save sessionStorage
    const sessionStorageData = await page.evaluate(() => JSON.stringify(sessionStorage));
    const sessionPath = statePath.replace('.json', '.session.json');
    fs.writeFileSync(sessionPath, sessionStorageData, 'utf8');
    
    console.log(`Saved session state for ${role} to ${filename}`);
  });
}
