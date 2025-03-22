import { Page, expect, Locator } from "@playwright/test";

//* Base page object containing common functionality for all pages


export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  // Navigate to a specific path
  //? leave "path" empty to goto Home page
  async goTo(path?: string): Promise<void> {
    await this.page.goto(`/${path}`, { waitUntil: "domcontentloaded" });
  }

  // Verify the color of an element
  async verifyElementColor(
    locator: Locator,
    expectedColor: string
  ): Promise<void> {
    const color = await locator.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(color).toBe(expectedColor);
  }
}
