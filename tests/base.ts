import { test as base, BrowserContext, Page } from "@playwright/test";
import * as path from "path";

let sharedContext: BrowserContext;
let sharedPage: Page;
let allErrors: Error[] = [];

// Extend the base test with custom fixtures
export const test = base.extend<{
  context: BrowserContext;
  page: Page;
  exceptionLogger: void;
}>({
  // Provide a new browser context for each test
  context: async ({ browser }, use) => {
    if (!sharedContext) {
      sharedContext = await browser.newContext();
    }
    await use(sharedContext);
  },

  // Provide a new page for each test
  page: async ({ context }, use) => {
    if (!sharedPage) {
      sharedPage = await context.newPage();
    }
    await use(sharedPage);
  },

  // Log exceptions and take screenshots on page errors
  exceptionLogger: [
    async ({ page, context }, use) => {
      const browserName = context?.browser()?.browserType().name();

      page.on("pageerror", async (error) => {
        allErrors.push(error);
        const screenshotPath = path.resolve(
          __dirname,
          `../playwright-report/screenshots/errors/error-${browserName}-${Date.now()}.png`
        );

        await page.screenshot({ path: screenshotPath });
      });

      await use();
    },
    { auto: true },
  ],
});

// Attach all collected errors to the test report
test.afterAll(async () => {
  if (sharedPage) {
    await sharedPage.close();
  }
  if (sharedContext) {
    await sharedContext.close();
  }

  if (allErrors.length > 0) {
    await test.info().attach("frontend-exceptions", {
      body: allErrors.map((error) => error.stack).join("\n-----\n"),
    });
  }
});
