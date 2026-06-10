/* eslint-disable @typescript-eslint/no-unused-vars */
import { test as base, BrowserContext } from '@playwright/test';

// Execution-view zoom: render every page at 60% (like Ctrl-minus) so the full application screen is
// visible during execution and recording. Implemented via the CSS `zoom` property in an init script,
// so it does NOT change the viewport size, locators, assertions, waits, or any test behaviour.
export const EXECUTION_ZOOM = 0.60;

/** Apply the 75% execution-view zoom to a browser context (covers all its pages and navigations). */
export async function applyExecutionZoom(context: BrowserContext): Promise<void> {
  await context.addInitScript((zoom) => {
    const apply = () => document.documentElement?.style.setProperty('zoom', String(zoom));
    apply();
    document.addEventListener('DOMContentLoaded', apply);
  }, EXECUTION_ZOOM);
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
