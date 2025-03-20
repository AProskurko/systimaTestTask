import { Page, expect } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goTo(path: string ): Promise<void> {
    await this.page.goto(`/${path}`, { waitUntil: "domcontentloaded" });
  }
}

export class LoginPage extends BasePage {
  // Login page locators
  private locatorsLoginPage = {
    emailInput: this.page.getByRole("textbox", { name: /E-post/i }),
    passwordInput: this.page.getByRole("textbox", { name: /Passord/i }),
    loginButton: this.page.getByRole("button", { name: /Logg inn/i }),
    alertFailedLogin: this.page.getByRole('alert').getByText(/Feil brukernavn \/ passord/i)
  };

  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string): Promise<void> {
    await this.locatorsLoginPage.emailInput.fill(email);
    await this.locatorsLoginPage.passwordInput.fill(password);
    await this.page.getByRole("button", { name: /Logg inn/i }).click();
  }

  async verificationLoginSuccess(): Promise<void> {
    //! login take to much time. waitforUrl need to avoid false error
    await this.page.waitForURL(/dashboard/i);
    await expect(this.page).toHaveURL(/dashboard/i);
  }

  async verificationLoginFail(): Promise<void> {
    await expect(this.locatorsLoginPage.alertFailedLogin).toBeVisible();
  }
}