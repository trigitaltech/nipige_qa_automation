import { PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";
import Browser from "./src/framework/manager/Browser";

const result = dotenv.config();

const timeInMin: number = 60 * 1000;
const defaultBrowser: string = String(process.env.BROWSER ?? "chromium").toLowerCase();

const config: PlaywrightTestConfig = {
  use: {
    browserName: Browser.type(defaultBrowser),
    headless: process.env.CI ? true : process.env.HEADLESS === "true",
    channel: Browser.channel(defaultBrowser),
    launchOptions: {
      args: [
        "--start-maximized",
        "--disable-extensions",
        "--disable-plugins",
      ],
      headless: process.env.CI ? true : process.env.HEADLESS === "true",
      timeout: Number.parseInt(String(process.env.BROWSER_LAUNCH_TIMEOUT ?? "30000"), 10),
      slowMo: process.env.CI ? 0 : 100, // Disable slowMo in CI
      downloadsPath: "./test-results/downloads",
    },
    viewport: null,
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    actionTimeout: Number.parseInt(String(process.env.ACTION_TIMEOUT ?? "30"), 10) * 1000, // 30 seconds - realistic timeout
    navigationTimeout: Number.parseInt(String(process.env.NAVIGATION_TIMEOUT ?? "30"), 10) * 1000, // 30 seconds - realistic timeout
    screenshot: {
      mode: process.env.CI ? "only-on-failure" : "on",
      fullPage: true,
    },
    video: "retain-on-failure",
  },

  testDir: "./src/tests",
  outputDir: "./test-results/failure",
  retries: process.env.CI ? 2 : 0, // Retry flaky tests 2 times in CI only
  preserveOutput: "always",
  reportSlowTests: null,
  timeout: Number.parseInt(String(process.env.TEST_TIMEOUT ?? "5"), 10) * timeInMin, // 5 minutes per test
  fullyParallel: false,
  workers: process.env.CI
    ? Math.max(4, require('os').cpus().length - 2) // Dynamic workers based on CPU count
    : Number.parseInt(String(process.env.PARALLEL_THREAD ?? "1"), 10),

  reporter: process.env.CI
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
    },
  ],
};

export default config;
