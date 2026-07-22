import { Page } from "@playwright/test";

/**
 * Rate limit handler - add delay between rapid API calls
 */
export async function handleRateLimiting(page: Page) {
  // Wait 2 seconds to avoid 429 errors
  await page.waitForTimeout(Number(process.env.RATE_LIMIT_DELAY || 2000));
}

/**
 * Browser crash recovery
 */
export async function ensureBrowserIsOpen(page: Page) {
  if (!page || !page.context() || !page.context().browser()) {
    throw new Error("Browser context has been closed. Test cannot continue.");
  }
}

/**
 * Add retry logic to API calls
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
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      if (error.message.includes("429") && i < maxRetries - 1) {
        await page.waitForTimeout(5000); // Wait 5 seconds on rate limit
      } else {
        throw error;
      }
    }
  }
  throw lastError || new Error("API call failed after max retries");
}
