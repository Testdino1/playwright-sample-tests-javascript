import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class ContactUsPage extends BasePage{

  /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        contactUsBtn: `[data-testid="header-menu-contact-us"]`,
        contactUsTitle: `[data-testid="contact-us-heading"]`,
        firstNameInput: `[data-testid="contact-us-first-name-input"]`,
        lastNameInput: `[data-testid="contact-us-last-name-input"]`,
        subjectInput: `[data-testid="contact-us-subject-input"]`,
        messageInput: `[data-testid="contact-us-message-input"]`,
        sendMessageBtn: `//button[@data-testid="contact-us-submit-button"]`,
        successMessage: `[data-testid="contact-us-success-message"]`
    }

    async assertContactUsTitle() {
        await expect(this.page.locator(this.locators.contactUsTitle)).toHaveText('Contact Us');
    }

    async fillContactUsForm() {
        await this.page.fill(this.locators.firstNameInput, 'John');
        await this.page.fill(this.locators.lastNameInput, 'Doe');
        await this.page.fill(this.locators.subjectInput, 'Test Subject');
        await this.page.fill(this.locators.messageInput, 'This is a test message.');
        await this.page.click(this.locators.sendMessageBtn);
    }
    async verifySuccessContactUsFormSubmission() {
        await expect(this.page.locator(this.locators.successMessage)).toBeVisible();
    }
}
export default ContactUsPage;