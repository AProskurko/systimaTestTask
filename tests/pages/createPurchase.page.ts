import { Page, expect } from "@playwright/test";
import { LoginPage } from "./login.page";
import { checkTextColor } from "../utils/functions";
import { settingsHard, settingsLight } from "../utils/hydrationSettings";
import { FormData } from "../utils/testDataFile";

//* Page object representing the Purchase creation page and its operations


export class CreatePurchasePage extends LoginPage {
  private readonly locators = {
    // Menu elements
    menuOpenIcon: this.page.getByRole("banner").locator("button").first(),
    bookingIcon: this.page
      .getByText("SelskapsoversiktOversiktBokfø")
      .getByRole("button", { name: /Bokføring/i }),
    postOtherFile: this.page
      .getByText("SelskapsoversiktOversiktBokfø")
      .getByRole("link", { name: /Bokfør andre filer/i }),

    // Contacts|Kontakt
    inputContact: this.page.getByTestId(/contact-select/i),
    buttonContact: this.page.getByRole("button", {
      name: /Kontakt/i,
    }),
    buttonContactOptions: this.page.getByText(/Søk Ny Kontakt/i),

    // Total Amount | Totalt beløp
    inputTotalAmount: this.page.getByRole("textbox", {
      name: /Totalt beløp inkl/i,
    }),

    // Invoice date | Fakturadato
    buttonDateInvoice: this.page.getByRole("button", {
      name: /Fakturadato/i,
    }),

    // Due date | Fakturadato
    buttonDateDue: this.page.getByRole("button", { name: /Forfallsdato/i }),

    // Account | Konto
    inputAccount: this.page.getByTestId(/account-select/i),
    buttonAccount: this.page.getByRole("button", { name: /Konto/i }),
    buttonAccountOption: this.page.getByText(/Søk Ny konto/i),

    // Invoice Number | Fakturanr
    inputInvoiceNumber: this.page.getByRole("textbox", { name: /Fakturanr/i }),

    // Submit Post | Bokfør
    submitPost: this.page.getByRole("button", {
      name: "Bokfør",
      exact: true,
    }),

    // Submit confirm popup
    confirmSubmit: this.page
      .getByRole("status")
      .filter({ hasText: /Bilag opprettet med bilagsnr/i }),

    // Error: Invoice Number | Fakturanr
    errorAlertInvoiceNumber: this.page.getByText(
      /Fakturanr. er allerede bokført/i
    ),
  };

  constructor(page: Page) {
    super(page);
  }

  // Navigate to the create purchase page if need
  async goToCreatePurchase(): Promise<void> {
    const currentUrl = await this.page.url();

    if (!currentUrl.includes("bookkeeping/purchase")) {
      await this.ensureMenuIsOpen();
      await this.navigateToPurchasePage();
    }
  }

  private async ensureMenuIsOpen(): Promise<void> {
    const menuPurchaseCheck = await this.locators.bookingIcon.isVisible();
    if (!menuPurchaseCheck) {
      await this.locators.menuOpenIcon.dblclick();
    }
  }

  private async navigateToPurchasePage(): Promise<void> {
    const menuPostOtherFileCheck =
      await this.locators.postOtherFile.isVisible();
    if (!menuPostOtherFileCheck) {
      await this.locators.bookingIcon.click();
    }
    await this.locators.postOtherFile.click();
  }

  // Fill the contact select field in the form
  async fillFormContactSelect(contactOption: RegExp): Promise<void> {
    //* Contact select
    await this.locators.buttonContact.click();
    await this.page.getByRole("option", { name: contactOption }).click();
  }

  // Fill the total amount field in the form
  async fillFormTotalAmount(value: string): Promise<void> {
    await this.locators.inputTotalAmount.fill(value);
  }

  // Fill the invoice date field in the form
  async fillFormInvoiceDate(date: string): Promise<void> {
    await this.locators.buttonDateInvoice.fill(date);
  }

  // Fill the due date field in the form
  async fillFormDueDate(date: string): Promise<void> {
    await this.locators.buttonDateDue.fill(date);
  }

  // Fill the account select field in the form
  async fillFormAccountSelect(account: RegExp): Promise<void> {
    await this.locators.buttonAccount.click();
    await this.page.getByRole("option", { name: account }).click();
  }

  // Fill the invoice number field in the form
  async fillFormInvoiceNumber(invoiceNumber: string): Promise<void> {
    this.locators.inputInvoiceNumber.fill(invoiceNumber);
  }

  // Fill all fields in the form
  async fillFormAll(data: FormData): Promise<void> {
    await this.fillFormContactSelect(data.contact);
    await this.fillFormTotalAmount(data.amount);
    await this.fillFormInvoiceDate(data.invoiceDate);
    await this.fillFormDueDate(data.dueDate);
    await this.fillFormAccountSelect(data.account);
    if (data.invoiceNumber) {
      await this.fillFormInvoiceNumber(data.invoiceNumber);
    }
  }

  // Submit the form
  async fillFormSubmit(): Promise<void> {
    await this.locators.submitPost.click();
  }

  // Verify that the form was submitted successfully
  async verifySubmitPost(): Promise<void> {
    await expect(async () => {
      await expect(this.locators.confirmSubmit).toBeVisible();
    }).toPass();
  }

  // Verify that there was an error submitting the form
  async verifySubmitError(): Promise<void> {
    await expect(async () => {
      await expect(this.locators.errorAlertInvoiceNumber).toBeVisible();
    }).toPass(settingsLight);
  }

  // Verify the color of the error text
  async verifySubmitErrorColor(textColor): Promise<void> {
    await checkTextColor(this.locators.errorAlertInvoiceNumber, textColor);
  }

  // Verify that the form is empty
  async verifyFormEmpty(): Promise<void> {
    await expect(async () => {
      await expect(this.locators.inputContact).toHaveValue("");
      await expect(this.locators.inputTotalAmount).toHaveValue("");
      await expect(this.locators.buttonDateInvoice).toHaveValue("");
      await expect(this.locators.buttonDateDue).toHaveValue("");
      await expect(this.locators.inputAccount).toHaveValue("");
    }).toPass(settingsLight);
  }

  // Verify that the form is not empty
  async verifyFormNotEmpty(data: FormData): Promise<void> {
    await expect(async () => {
      await expect(this.locators.buttonContact).toHaveText(data.contact);
      await expect(this.locators.inputTotalAmount).toHaveValue(data.amount);
      await expect(this.locators.buttonDateInvoice).toHaveValue(
        data.invoiceDate
      );
      await expect(this.locators.buttonDateDue).toHaveValue(data.dueDate);
      await expect(this.locators.buttonAccount).toHaveText(data.account);
      if (data.invoiceNumber) {
        await expect(this.locators.inputInvoiceNumber).toHaveValue(
          data.invoiceNumber
        );
      }
    }).toPass(settingsLight);
  }
};