import { Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";
import { settingsHard } from "../utils/hydrationSettings";

//* Page object representing the Login page and its operations


export class LoginPage extends BasePage {
  // Login page locators
  private readonly locatorsLogin = {
    emailInput: this.page.getByRole("textbox", { name: /E-post/i }),
    passwordInput: this.page.getByRole("textbox", { name: /Passord/i }),
    loginButton: this.page.getByRole("button", { name: /Logg inn/i }),
    alertFailedLogin: this.page
      .getByRole("alert")
      .getByText(/Feil brukernavn \/ passord/i),
    systemCheckIcon: this.page.getByRole("banner").locator("button").nth(4),
  };

  constructor(page: Page) {
    super(page);
  }

  // Perform login with the given email and password
  async login(email: string, password: string): Promise<void> {
    await this.goTo("login");
    await this.locatorsLogin.emailInput.fill(email);
    await this.locatorsLogin.passwordInput.fill(password);
    await this.page.getByRole("button", { name: /Logg inn/i }).click();
  }

  // Verify that login was successful
  async verificationLoginSuccess(): Promise<void> {
    //! Poor hydration
    await expect(async () => {
      await expect(this.locatorsLogin.systemCheckIcon).toBeVisible();
    }).toPass(settingsHard);
  }

  // Verify that login failed
  async verificationLoginFail(): Promise<void> {
    await expect(this.locatorsLogin.alertFailedLogin).toBeVisible();
  }

  // Perform login if not already logged in, required to run tests in solo
  //? Required to run solo tests
  async loginForSingleTest(email: string, password: string): Promise<void> {
    const loginCheck = await this.locatorsLogin.systemCheckIcon.isVisible();
    if (!loginCheck) {
      await this.login(email, password);
      await this.verificationLoginSuccess();
    }
  }
}
