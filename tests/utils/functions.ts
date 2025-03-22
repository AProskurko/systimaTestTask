import { Locator, expect } from "@playwright/test";

export async function checkTextColor(
  locator: Locator,
  expectedColor: string
): Promise<void> {
  const color = await locator.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue("color");
  });
  expect(color).toBe(expectedColor);
}
