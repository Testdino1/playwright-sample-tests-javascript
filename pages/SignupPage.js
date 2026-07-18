import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class SignupPage extends BasePage{

  /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        signupPageTitle: `//h2[text()=' Create Account']`,
        firstName: `#firstname`,
        lastName: `#lastname`,
        email: `#email`,
        password: `#password`,
        signupButton: `//button[text()='Create Account']`,
        successSignupMessage: `Account created successfully! Please login to continue.`,
    }

    async navigateToSignupPage() {
        await this.navigateTo('/signup');
    }

    getSignupPageTitle() {
        return this.page.locator(this.locators.signupPageTitle);
    }

    getFirstNameInput() {
        return this.page.locator(this.locators.firstName);
    }

    getLastNameInput() {
        return this.page.locator(this.locators.lastName);
    }

    getEmailInput() {
        return this.page.locator(this.locators.email);
    }

    getPasswordInput() {
        return this.page.locator(this.locators.password);
    }

    getSignupButton() {
        return this.page.locator(this.locators.signupButton);
    }


    async assertSignupPage() {
        await expect(this.getSignupPageTitle()).toBeVisible();
        await expect(this.getFirstNameInput()).toBeVisible();
        await expect(this.getLastNameInput()).toBeVisible();
        await expect(this.getEmailInput()).toBeVisible();
        await expect(this.getPasswordInput()).toBeVisible();
        await expect(this.getSignupButton()).toBeVisible();
    }

    async signup(firstName, lastName, email, password) {
        await this.page.fill(this.locators.firstName, firstName);
        await this.page.fill(this.locators.lastName, lastName);
        await this.page.fill(this.locators.email, email);
        await this.page.fill(this.locators.password, password);
        await this.page.click(this.locators.signupButton);
        await this.page.waitForTimeout(2000);
    }

    async verifySuccessSignUp() {
        await expect(this.page.getByText(this.locators.successSignupMessage)).toBeVisible({ timeout: 10000 });
    }
}

export default SignupPage;