import { Page, expect } from "@playwright/test";
import { LoginPage } from "./login.page";
import { checkTextColor } from "../utils/functions";
import { settingsLight } from "../utils/hydrationSettings";


 //* Page object representing the Contact creation page and its operations

export class CreateContactPage extends LoginPage {
  private readonly locators = {
    // Menu elements
    menuOpenIcon: this.page.getByRole("banner").locator("button").first(),
    menuContactsIcon: this.page
      .getByText(/SelskapsoversiktOversiktBokfø/i)
      .getByRole("link", { name: /Kontakter/i }),

    // Contacts page | Kontakt
    buttonNewContact: this.page.getByRole("button", { name: /Ny kontakt/i }),

    // New contact dialog
    dialogCreateContact: this.page.locator(
      ".v-dialog > div > div > .v-card > .v-card__text"
    ),
    dialogNameInput: this.page
      .locator(".v-dialog > div > div > .v-card > .v-card__text")
      .getByRole("textbox", { name: /Navn/i }),
    dialogClose: this.page
      .getByRole("dialog")
      .getByRole("button")
      .filter({ hasText: /^$/ }),

    // Submit
    submitCreateContact: this.page.getByRole("button", {
      name: /Opprett kontakt/i,
    }),

    // Alerts
    alertSubmitSuccess: this.page
      .getByRole("status")
      .filter({ hasText: /Ny kontakt lagret/i }),
    alertNoName: this.page.getByText("Vennligst skriv inn navn"),
  };

  constructor(page: Page) {
    super(page);
  }

  // Navigate to the create contact page if need
  async goToCreateContact(): Promise<void> {
    const menuCheck = await this.locators.menuContactsIcon.isVisible();

    if (!menuCheck) {
      await this.locators.menuOpenIcon.click();
    }
    await this.locators.menuContactsIcon.click();
  }

  // Open the create contact dialog
  async openCreateContactDialog(): Promise<void> {
    await this.locators.buttonNewContact.click();
  }

  // Verify that the create contact dialog is visible
  async verifyDialogVisible(): Promise<void> {
    await expect(async () => {
      await expect(this.locators.dialogCreateContact).toBeVisible();
    }).toPass(settingsLight);
  }

  // Input the contact name in the dialog
  async inputContactName(contactName: string): Promise<void> {
    await this.locators.dialogNameInput.fill(contactName);
  }

  // Submit the new contact form
  async submitNewContact(): Promise<void> {
    await this.locators.submitCreateContact.click();
  }

  // Close the create contact dialog
  async exitNewContact(): Promise<void> {
    await this.locators.dialogClose.click();
  }

  // Verify that the contact was created successfully
  async verifyCreateContactSuccess(): Promise<void> {
    await expect(async () => {
      await expect(this.locators.alertSubmitSuccess).toBeVisible();
    }).toPass(settingsLight);
  }

  // Verify the color of the "no name" error text
  async verifyErrorName(): Promise<void> {
    await expect(async () => {
      await expect(this.locators.alertNoName).toBeVisible();
    }).toPass(settingsLight);
  }

  // Verify the color of the "no name" error text
  async verifyErrorNameColor(textColor): Promise<void> {
    await checkTextColor(this.locators.alertNoName, textColor);
  }
}