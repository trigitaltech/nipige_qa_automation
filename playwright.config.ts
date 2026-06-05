import { PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";
import Browser from "./src/framework/manager/Browser";

dotenv.config();

const timeInMin: number = 60 * 1000;
const defaultBrowser: string = String(process.env.BROWSER ?? "chromium").toLowerCase();

const config: PlaywrightTestConfig = {
  use: {
    browserName: Browser.type(defaultBrowser),
    headless: false,
    channel: Browser.channel(defaultBrowser),
    launchOptions: {
      args: [
        "--start-maximized",
        "--disable-extensions",
        "--disable-plugins",
      ],
      headless: false,
      timeout: Number.parseInt(String(process.env.BROWSER_LAUNCH_TIMEOUT ?? "30000"), 10),
      slowMo: 100,
      downloadsPath: "./test-results/downloads",
    },
    viewport: null,
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    actionTimeout: Number.parseInt(String(process.env.ACTION_TIMEOUT ?? "1"), 10) * timeInMin,
    navigationTimeout: Number.parseInt(String(process.env.NAVIGATION_TIMEOUT ?? "1"), 10) * timeInMin,
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },
    video: "retain-on-failure",
  },

  testDir: "./src/tests",
  outputDir: "./test-results/failure",
  retries: Number.parseInt(String(process.env.RETRIES ?? "0"), 10),
  preserveOutput: "failures-only",
  reportSlowTests: null,
  timeout: Number.parseInt(String(process.env.TEST_TIMEOUT ?? "1"), 10) * timeInMin,
  workers: Number.parseInt(String(process.env.PARALLEL_THREAD ?? "1"), 10),

  reporter: [
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
      name: "local",
      testMatch: process.env.TEST_NAME
        ? process.env.TEST_NAME.split(",").map((name) => `**/*${name.trim()}*.spec.ts`)
        : ["**/*.spec.ts"],
    },
    {
      name: "suite",
      testMatch: "**/*.test.ts",
    },
  ],
};

export default config;
