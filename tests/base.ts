import { test as base, BrowserContext, Page } from "@playwright/test";
import * as path from "path";

let allErrors: Error[] = [];

// Extend the base test with custom fixtures
export const test = base.extend<{
  context: BrowserContext;
  page: Page;
  exceptionLogger: void;
}>({
  // Provide a new browser context for each test
  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },

  // Provide a new page for each test
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
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
  if (allErrors.length > 0) {
    await test.info().attach("frontend-exceptions", {
      body: allErrors.map((error) => error.stack).join("\n-----\n"),
    });
  }
});
