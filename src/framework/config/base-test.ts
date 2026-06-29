import { test as base, BrowserContext, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Execution-view zoom: render every page at 60% (like Ctrl-minus) so the full application screen is
// visible during execution and recording. Implemented via the CSS `zoom` property in an init script,
// so it does NOT change the viewport size, locators, assertions, waits, or any test behaviour.
export const EXECUTION_ZOOM = 1.0;

/** Apply the execution-view zoom to a browser context (covers all its pages and navigations). */
export async function applyExecutionZoom(context: BrowserContext): Promise<void> {
  await context.addInitScript((zoom) => {
    const apply = () => document.documentElement?.style.setProperty('zoom', String(zoom));
    apply();
    document.addEventListener('DOMContentLoaded', apply);
  }, EXECUTION_ZOOM);
}

/** Restores cached sessionStorage auth state on a browser context level. */
export async function applySessionStateToContext(context: BrowserContext, role: string): Promise<void> {
  const sessionPath = path.resolve(`playwright/.auth/${role}.session.json`);
  if (fs.existsSync(sessionPath)) {
    const sessionData = fs.readFileSync(sessionPath, 'utf8');
    await context.addInitScript((dataStr) => {
      const data = JSON.parse(dataStr);
      for (const [key, value] of Object.entries(data)) {
        window.sessionStorage.setItem(key, value as string);
      }
    }, sessionData);
  }
}

/** Restores cached sessionStorage auth state on a page level. */
export async function applySessionState(page: Page, role: string): Promise<void> {
  await applySessionStateToContext(page.context(), role);
}

export const test = base.extend<{ MyFixtures }, { gData: Map<string, any> }>({
  gData: [async ({ }, use) => {
    const data = new Map<string, any>();
    data.set("SPACE", " ");
    data.set("HYPHEN", "-");
    data.set("UNDERSCORE", "_");
    await use(data);
  }, { scope: 'worker' }],

  page: async ({ page, gData }, use) => {
    await applyExecutionZoom(page.context());
    await use(page);
  },
});
export { expect } from '@playwright/test';
