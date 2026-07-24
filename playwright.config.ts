import { PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";
import Browser from "./src/framework/manager/Browser";

dotenv.config();

const timeInMin: number = 60 * 1000;
const defaultBrowser: string = String(process.env.BROWSER ?? "chromium").toLowerCase();

const isCI = !!process.env.CI;
const isHeadless = process.env.HEADLESS === "true";

let viewportConfig: { width: number; height: number } | null = null;
if (isCI) {
  viewportConfig = { width: 1920, height: 1080 };
} else if (isHeadless) {
  viewportConfig = { width: 1280, height: 1000 };
}

let retriesConfig = Number.parseInt(String(process.env.RETRIES ?? "2"), 10);
if (isCI) {
  retriesConfig = process.env.CI_RETRIES ? Number.parseInt(process.env.CI_RETRIES, 10) : 2;
}

let workersConfig = Number.parseInt(String(process.env.PARALLEL_THREAD ?? "6"), 10);
if (isCI) {
  workersConfig = process.env.CI_WORKERS ? Number.parseInt(process.env.CI_WORKERS, 10) : 6;
}

const config: PlaywrightTestConfig = {
  use: {
    browserName: Browser.type(defaultBrowser),
    headless: isCI ? true : isHeadless,
    channel: Browser.channel(defaultBrowser),
    launchOptions: {
      args: isCI
        ? [
            "--window-size=1920,1080",
            "--disable-extensions",
            "--disable-plugins",
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--no-sandbox",
            "--disable-gpu",
          ]
        : [
            "--start-maximized",
            "--disable-extensions",
            "--disable-plugins",
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--no-sandbox",
            "--disable-gpu",
          ],
      headless: isCI ? true : isHeadless,
      timeout: Number.parseInt(String(process.env.BROWSER_LAUNCH_TIMEOUT ?? "30000"), 10),
      // Disable slowMo in CI for speed; local debugging can set via .env
      slowMo: isCI ? 0 : Number.parseInt(String(process.env.SLOW_MO ?? "0"), 10),
      downloadsPath: "./test-results/downloads",
    },
    viewport: viewportConfig,
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    // Increased timeouts to handle slow UI interactions and network latency
    actionTimeout: Number.parseInt(String(process.env.ACTION_TIMEOUT ?? "60"), 10) * 1000, // 60 seconds for actions
    navigationTimeout: Number.parseInt(String(process.env.NAVIGATION_TIMEOUT ?? "45"), 10) * 1000, // 45 seconds for navigation
    // Capture screenshots only when a test fails to reduce I/O overhead
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  testDir: "./src/tests",
  outputDir: "./test-results/failure",
  retries: retriesConfig, // Keep 2 retries for flaky tests
  preserveOutput: "always",
  reportSlowTests: null,
  // Increased test timeout to handle complex UI scenarios
  timeout: Number.parseInt(String(process.env.TEST_TIMEOUT ?? "15"), 10) * timeInMin, // 15 minutes per test
  fullyParallel: false,
  workers: workersConfig,

  reporter: isCI
    ? [
        ["dot"],
        ["html", { open: "never", outputFolder: "./test-results/report" }],
      ]
    : [
        ["dot"],
        [
          "allure-playwright",
          {
            detail: false,
            suiteTitle: false,
            environmentInfo: {
              OS: process.platform.toUpperCase(),
              BROWSER: String(process.env.BROWSER ?? "").toUpperCase(),
              BASE_URL: process.env.BASE_URL,
            },
          },
        ],
        ["html", { open: "never", outputFolder: "./test-results/report" }],
        ["junit", { outputFile: "./test-results/results/results.xml" }],
        ["json", { outputFile: "./test-results/results/results.json" }],
        ["./src/framework/logger/TestListener.ts"],
      ],

  projects: [
    {
      name: "setup",
      testMatch: "**/*.setup.ts",
    },
    {
      name: "local",
      dependencies: ["setup"],
      testMatch: process.env.TEST_NAME
        ? process.env.TEST_NAME.split(",").map((name) => `**/*${name.trim()}*.spec.ts`)
        : ["**/*.spec.ts"],
    },
    {
      name: "suite",
      dependencies: ["setup"],
      testMatch: "**/*.test.ts",
      fullyParallel: true,
    },
  ],
};

export default config;
