import { test } from "./base"
import { expect } from "@playwright/test";
import { userData } from "./utils/credentials"
import { LoginPage } from "./pages/classes";

const validUser = userData[0].testUser;
const validPassword = userData[0].password;
const invalidUser = userData[1].testUser;
const invalidPassword = userData[1].password;

test.describe.serial('E2E Test', () => {
        test('1. Sign In', async ({ page }) => {
                await test.step("Failed Login:", async () => {
                  const loginPage = new LoginPage(page);

                  await loginPage.goTo("login");
                  await loginPage.login(invalidUser, invalidPassword);
                  await loginPage.verificationLoginFail();
                }); 

                await test.step("Successful Login:", async () => {
                  const loginPage = new LoginPage(page);

                  await loginPage.goTo("login");
                  await loginPage.login(validUser, validPassword);
                  await loginPage.verificationLoginSuccess();
                }); 

                        
        });

        test('2. Create Purchase', async ({ page }) => {
                await test.step("Navigation:", async () => {
                        await page
                          .getByRole("banner")
                          .locator("button")
                          .first()
                          .click();
                        await page
                          .getByRole("button", { name: /Bokføring/i })
                          .click();
                        await page
                          .getByRole("link", { name: /Bokfør andre filer/i })
                          .click();
                })
                        
        });

        test('3. Duplicate Invoice Number Handling', async ({ page }) => {
                        
        });

        test('4. Contact Creation - Validation', async ({ page }) => {
                        
        });

        test('5. Contact Creation - Success', async ({ page }) => {
                        
        });
});