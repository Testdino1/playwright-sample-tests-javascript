import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class LoginPage extends BasePage{

  /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        loginPageTitle: `//h2[text()=' Sign In']`,
        userName: `[placeholder="Your email address"]`,
        password: `[placeholder="Your password"]`,
        loginButton: `//button[text()='Sign in']`,
        invalidLoginError: '[data-test="error"]',
        userIcon: `//*[name()='svg'][.//*[name()='path' and contains(@d,'M25.1578 1')]]`,
        logoutButton: `//p[text()='Log Out']`,
        signupLink: `Sign up`,
        successSignInMessage: `Logged in successfully`,
    }

    async navigateToLoginPage() {
        await this.navigateTo('/');
    }

    getLoginPageTitle() {
        return this.page.locator(this.locators.loginPageTitle);
    }

    getUserNameInput() {
        return this.page.locator(this.locators.userName);
    }

    getPasswordInput() {
        return this.page.locator(this.locators.password);
    }

    getLoginButton() {
        return this.page.locator(this.locators.loginButton);
    }

    async clickUserIcon() {
        await this.page.locator(this.locators.userIcon).click();
    }

    async clickOnUserProfileIcon() {
        await this.page.locator(this.locators.userIcon).click();
    }

    async assertLoginPage() {
        await expect(this.getLoginPageTitle()).toBeVisible();
        await expect(this.getUserNameInput()).toBeVisible();
        await expect(this.getPasswordInput()).toBeVisible();
        await expect(this.getLoginButton()).toBeVisible();
    }

    async login(username, password) {
        await this.page.fill(this.locators.userName, username);
        await this.page.fill(this.locators.password, password);
        await this.page.click(this.locators.loginButton);
        await this.page.waitForTimeout(2000);
    }

    async clickOnLogoutButton() {
        await this.page.locator(this.locators.logoutButton).click();
    }
    async validateSignInPage() {
        await expect(this.getLoginPageTitle()).toBeVisible();
    }

    async clickOnSignupLink() {
        await this.page.getByText(this.locators.signupLink).click();
    }

    async verifySuccessSignIn() {
        await expect(this.page.getByText(this.locators.successSignInMessage)).toBeVisible({ timeout: 10000 });
    }
}

export default LoginPage;