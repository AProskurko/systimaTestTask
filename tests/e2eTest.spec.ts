import { test } from "./base";
import { LoginPage } from "./pages/login.page";
import { userData } from "./utils/credentials";
import { CreatePurchasePage } from "./pages/createPurchase.page";
import { CreateContactPage } from "./pages/createContact.page";
import * as testData from "./utils/testDataFile";

const validUser: string = userData[0].testUser;
const validPassword: string = userData[0].password;
const invalidUser: string = userData[1].testUser;
const invalidPassword: string = userData[1].password;

const formData: testData.FormData = testData.purchaseFormData;
const contactName: string = testData.contactName;

const ERROR_COLOR: string = "rgb(255, 82, 82)";

// E2E Test Suite
test.describe("E2E Test", () => {
  // Test case for sign in
  test("1. Sign In", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step("Failed Login:", async () => {
      await loginPage.login(invalidUser, invalidPassword);
      await loginPage.verificationLoginFail();
    });

    await test.step("Successful Login:", async () => {
      await loginPage.login(validUser, validPassword);
      await loginPage.verificationLoginSuccess();
    });
  });

  // Test case for creating a purchase
  test("2. Create Purchase", async ({ page }) => {
    const createPurchasePage = new CreatePurchasePage(page);

    await test.step("Navigation:", async () => {
      await createPurchasePage.loginForSingleTest(validUser, validPassword);
      await createPurchasePage.goToCreatePurchase();
    });

    await test.step("Form filling:", async () => {
      await createPurchasePage.fillFormAll({
        contact: formData.contact,
        amount: formData.amount,
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,
        account: formData.account,
      });
    });

    await test.step("Expected Result:", async () => {
      await createPurchasePage.fillFormSubmit();
      await createPurchasePage.verifySubmitPost();
      await createPurchasePage.verifyFormEmpty();
    });
  });

  // Test case for handling duplicate invoice number
  test("3. Duplicate Invoice Number Handling", async ({ page }) => {
    const createPurchasePage = new CreatePurchasePage(page);

    await test.step("Navigation:", async () => {
      await createPurchasePage.loginForSingleTest(validUser, validPassword);
      await createPurchasePage.goToCreatePurchase();
    });

    await test.step("Form filling:", async () => {
      await createPurchasePage.fillFormAll(formData);
    });

    await test.step("Expected Result:", async () => {
      await createPurchasePage.fillFormSubmit();
      await createPurchasePage.verifySubmitError();
      await createPurchasePage.verifySubmitErrorColor(ERROR_COLOR);
      await createPurchasePage.verifyFormNotEmpty(formData);
    });
  });

  // Test case for contact creation validation
  test("4. Contact Creation - Validation", async ({ page }) => {
    const createContactPage = new CreateContactPage(page);

    await test.step("Navigation:", async () => {
      await createContactPage.loginForSingleTest(validUser, validPassword);
      await createContactPage.goToCreateContact();
      await createContactPage.openCreateContactDialog();
      await createContactPage.verifyDialogVisible();
    });

    await test.step("Steps:", async () => {});
    await createContactPage.submitNewContact();

    await test.step("Expected Result:", async () => {});
    await createContactPage.verifyErrorName();
    await createContactPage.verifyErrorNameColor(ERROR_COLOR);
    await createContactPage.exitNewContact();
  });

  // Test case for successful contact creation
  test("5. Contact Creation - Success", async ({ page }) => {
    const createContactPage = new CreateContactPage(page);

    await test.step("Navigation:", async () => {
      await createContactPage.loginForSingleTest(validUser, validPassword);
      await createContactPage.goToCreateContact();
      await createContactPage.openCreateContactDialog();
      await createContactPage.verifyDialogVisible();
    });

    await test.step("Steps:", async () => {
      await createContactPage.inputContactName(contactName);
      await createContactPage.submitNewContact();
    });

    await test.step("Expected Result:", async () => {
      await createContactPage.verifyCreateContactSuccess();
    });
  });
});
