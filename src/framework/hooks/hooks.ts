import { Page } from "@playwright/test";
import test from "@playwright/test";

/**
 * Rate limit handler - add delay between rapid API calls
 */
export async function handleRateLimiting(page: Page) {
  // Wait to avoid 429 errors from backend
  const delay = Number(process.env.RATE_LIMIT_DELAY || 2000);
  await page.waitForTimeout(delay);
}

/**
 * Browser crash recovery - ensure browser context is still open
 */
export async function ensureBrowserIsOpen(page: Page) {
  if (!page || !page.context() || !page.context().browser()) {
    throw new Error("Browser context has been closed. Test cannot continue.");
  }
}

/**
 * Add retry logic to API calls with exponential backoff
 */
export async function apiCallWithRetry(
  page: Page,
  apiCall: () => Promise<any>,
  maxRetries = 3,
) {
  let lastError: any = null;
  for (let i = 0; i < maxRetries; i += 1) {
    try {
      await handleRateLimiting(page);
      await test.step(`API Call Attempt ${i + 1}/${maxRetries}`, async () => {
        // Call executes here
      });
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      console.error(`API call attempt ${i + 1} failed:`, error.message);
      
      if (error.message.includes("429") && i < maxRetries - 1) {
        // Rate limited - wait longer before retry
        const backoffDelay = 5000 * (i + 1); // Exponential backoff: 5s, 10s, 15s
        console.warn(`Rate limited. Backing off for ${backoffDelay}ms...`);
        await page.waitForTimeout(backoffDelay);
      } else if (i < maxRetries - 1) {
        // Other errors - wait shorter duration
        await page.waitForTimeout(2000);
      } else if (i === maxRetries - 1) {
        // Last attempt - fail with clear error
        throw new Error(`API call failed after ${maxRetries} attempts: ${error.message}`);
      }
    }
  }
  throw lastError || new Error("API call failed after max retries");
}

/**
 * Validate page load - ensure critical elements exist
 * Throws detailed error if page failed to load
 */
export async function validatePageLoad(
  page: Page,
  pageTitle: string,
  expectedSelectors: string[] = [],
) {
  try {
    await test.step(`Validate page load: ${pageTitle}`, async () => {
      // Wait for at least one selector to be present
      if (expectedSelectors.length > 0) {
        try {
          await Promise.race(
            expectedSelectors.map((selector) =>
              page.waitForSelector(selector, { timeout: 10000 })
            )
          );
        } catch (error) {
          throw new Error(
            `Page '${pageTitle}' failed to load. Expected selectors not found: ${expectedSelectors.join(", ")}`
          );
        }
      } else {
        // Generic page load check
        await page.waitForLoadState("domcontentloaded", { timeout: 10000 });
      }
    });
  } catch (error) {
    console.error(`❌ Page load validation failed for ${pageTitle}:`, error.message);
    throw error;
  }
}

/**
 * Safe credential retrieval with fallback and error handling
 */
export async function getSafeCredential(
  credentialType: string,
  defaultValue?: string,
): Promise<string> {
  const value = process.env[credentialType] || defaultValue;
  if (!value) {
    console.warn(`⚠️ Missing credential: ${credentialType}. Check .env file or test data.`);
    throw new Error(
      `Missing required credential: ${credentialType}. ` +
      `Set it in .env file (copy from .env.example) or update test data in Excel sheet.`
    );
  }
  return value;
}
