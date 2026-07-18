// UserPage.js
import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class UserPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.page = page;
  }

  // Single source of truth for selectors (prefer data-testid where available)
  locators = {
    // Header / user menu
    userIcon: `//*[name()='svg'][.//*[name()='path' and contains(@d,'M25.1578 1')]]`,
    logoutButton: `//p[text()='Log Out']`,

    // Profile tabs & sections
    addressTab: `(//*[@data-testid="menu-item-label"])[3]`,
    addAddressButton: `[data-testid="add-new-address-button"]`,
    addNewAddressMenu: `//h2[text()='Add New Address']`,

    // Address form (data-testid)
    addressingFirstName: `[data-testid="first-name-input"]`,
    addressingEmail: `[data-testid="email-input"]`,
    streetAddress: `[data-testid="street-address-input"]`,
    cityInput: `[data-testid="city-input"]`,
    stateInput: `[data-testid="state-input"]`,
    countryInput: `[data-testid="country-input"]`,
    zipCodeInput: `[data-testid="zip-code-input"]`,
    saveAddressButton: `[data-testid="save-address-button"]`,

    // Address cards list (generic selector for names)
    addressCardName: `[data-testid="address-name"]`,
    editAddressButton: `(//*[@data-icon='edit'])[1]`,
    deleteAddressButton: `(//*[@data-icon='delete'])[1]`,
    confirmDeleteButton: `//button[normalize-space(text())='Delete']`,
    updateAddressButton: `//button[text()='Update']`,

    // Personal info section (profile form)
    firstName: `[name="firstname"]`,
    lastName: `[name="lastName"]`,
    contactNumber: `[name="contactNumber"]`,
    savePersonalInfo: `[aria-label="save"]`,

    // Security / password change
    securityButton: `//button[text()="Security"]`,
    enterNewPassword: `[placeholder="Enter new password"]`,
    confirmNewPassword: `[placeholder="Confirm your password"]`,
    updatePasswordButton: `[data-testid="my-profile-reset-password-button"]`,
    updateNotification: `div[role="status"][aria-live="polite"]`,
  };

  /* -----------------------------
   * Generic helpers used in tests
   * ----------------------------- */
  async clickOnUserProfileIcon() {
    await this.page.locator(this.locators.userIcon).click();
  }

  /* ---------- Addresses ---------- */
  async clickOnAddressTab() {
    await this.page.locator(this.locators.addressTab).click();
  }

  async clickOnAddAddressButton() {
    await this.page.locator(this.locators.addAddressButton).click();
  }

  async checkAddNewAddressMenu() {
    await expect(this.page.locator(this.locators.addNewAddressMenu)).toBeVisible();
  }

  async fillAddressForm() {
    await this.page.locator(this.locators.addressingFirstName).fill('Tester');
    await this.page.locator(this.locators.addressingEmail).fill('testing123@example.com');
    await this.page.locator(this.locators.streetAddress).fill('SBP, Utran');
    await this.page.locator(this.locators.cityInput).fill('Surat');
    await this.page.locator(this.locators.stateInput).fill('Gujarat');
    await this.page.locator(this.locators.countryInput).fill('India');
    await this.page.locator(this.locators.zipCodeInput).fill('12345');
    await this.page.locator(this.locators.saveAddressButton).click();
  }

  async verifytheAddressIsAdded() {
    // Assert at least one address card with the name we just saved is visible
    const name = this.page.locator(this.locators.addressCardName);
    await expect(name).toBeVisible();
  }

  async clickOnEditAddressButton() {
    await this.page.locator(this.locators.editAddressButton).click();
  }

  async updateAddressForm() {
    // Update to a new first name and keep other fields valid
    await this.page.locator(this.locators.addressingFirstName).fill('Test1');
    await this.page.locator(this.locators.addressingEmail).fill('john.doe@example.com');
    await this.page.locator(this.locators.streetAddress).fill('123 Main St');
    await this.page.locator(this.locators.cityInput).fill('Anytown');
    await this.page.locator(this.locators.stateInput).fill('CA');
    await this.page.locator(this.locators.countryInput).fill('United States');
    await this.page.locator(this.locators.zipCodeInput).fill('12345');
    await this.page.locator(this.locators.updateAddressButton).click();
  }

  async verifytheUpdatedAddressIsAdded() {
    await expect(this.page.locator(this.locators.addressCardName)).toContainText('Test1');
  }

  async clickOnDeleteAddressButton() {
    // Ensure the address exists before deleting
    await expect(this.page.locator(this.locators.addressCardName)).toContainText('Test1');
    await this.page.locator(this.locators.deleteAddressButton).click();
    await this.page.locator(this.locators.confirmDeleteButton).click();
  }

  /* ------- Personal Info -------- */
  async updatePersonalInfo() {
    await this.page.locator(this.locators.firstName).fill('Test1');
    await this.page.locator(this.locators.lastName).fill('Testing');
    await this.page.locator(this.locators.contactNumber).fill('9999999999');
    await this.page.locator(this.locators.savePersonalInfo).click();
  }

  async verifyPersonalInfoUpdated() {
    await this.page.reload();
    await expect(this.page.locator(this.locators.firstName)).toHaveValue('Test1');
    await expect(this.page.locator(this.locators.lastName)).toHaveValue('Testing');
    await expect(this.page.locator(this.locators.contactNumber)).toHaveValue('9999999999');
  }

  /* --------- Security (PW) ------ */
  async clickOnSecurityButton() {
    await this.page.locator(this.locators.securityButton).click();
  }

  async enterNewPassword() {
    await this.page.locator(this.locators.enterNewPassword).fill(process.env.NEW_PASSWORD);
  }

  async enterConfirmNewPassword() {
    await this.page.locator(this.locators.confirmNewPassword).fill(process.env.NEW_PASSWORD);
  }

  async clickOnUpdatePasswordButton() {
    await this.page.locator(this.locators.updatePasswordButton).click();
  }

  async revertPasswordBackToOriginal() {
    await this.page.locator(this.locators.enterNewPassword).fill(process.env.PASSWORD);
    await this.page.locator(this.locators.confirmNewPassword).fill(process.env.PASSWORD);
    await this.page.locator(this.locators.updatePasswordButton).click();
  }

  async getUpdatePasswordNotification() {
    const toast = this.page.locator(this.locators.updateNotification);
    await expect(toast).toBeVisible();
    await expect(toast).toHaveText(/Password updated successfully/i);
  }
}

export default UserPage;