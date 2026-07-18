import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class ProductDetailsPage extends BasePage{

  /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        plusIconToAddQuantity: '[aria-label="plus"]',
        totalQuantity: '[aria-label="minus"] + div',
        addToCartButton: 'ADD TO CART',
        headerCartIcon: 'header-cart-icon',
        productAdditionalInfoTab : `[data-testid="additional-info-tab"]`,
        productReviewsTab : `[data-testid="reviews-tab"]`,
        writeReviewBtn: `//button[@data-testid="write-review-button"]`,
        yourNameInput: `[data-testid="review-form-name-input"]`,
        emailInput: `[data-testid="review-form-email-input"]`,
        ratingStars: `[data-testid="review-form-rating-4"]`,
        reviewTitleInput: `[data-testid="review-form-title-input"]`,
        giveYourOpinionInput: `[data-testid="review-form-review-input"]`,
        submitBtn: `[data-testid="review-form-submit-button"]`,
        editReviewBtn: `[data-testid="edit-review-button"]`,
        deleteReviewBtn: `[data-testid="delete-review-button"]`

    }

    async assertProductNameTitle(productName) {
        await expect(this.page.locator(`//h1[text()="${productName}"]`).first()).toBeVisible();
    }

    async assertProductReviewCount(productName, productReviewCount) {
        await expect(this.page.locator(`//h1[text()="${productName}"]/following-sibling::div/p`).first()).toContainText(productReviewCount);
    }

    async assertProductPrice(productName, productPrice) {
        await expect(this.page.locator(`//h1[text()="${productName}"]/following-sibling::p[contains(@class, 'font-medium')]`).first()).toContainText(productPrice);
    }

    getPlusIconToAddQuantity() {
        return this.page.locator(this.locators.plusIconToAddQuantity)
    }

    async clickPlusIconToAddQuantity() {
        await this.getPlusIconToAddQuantity().click();
    }

    getTotalQuantity() {
        return this.page.locator(this.locators.totalQuantity)
    }

    getAddToCartButton() {
        return this.page.getByText(this.locators.addToCartButton)
    }

    getProductAdditionalInfoTab() {
        return this.page.locator(this.locators.productAdditionalInfoTab)
    }

    getProductReviewsTab() {
        return this.page.locator(this.locators.productReviewsTab)
    }

    async clickOnReviewsTab() {
        await this.getProductReviewsTab().click();
    }

    async assertReviewsTab() {
        await expect(this.getProductReviewsTab()).toBeVisible();
    }

    async clickOnAdditionalInfoTab() {
        await this.getProductAdditionalInfoTab().click();
    }

    async assertAdditionalInfoTab() {
        await expect(this.getProductAdditionalInfoTab()).toBeVisible();
    }

    async clickAddToCartButton() {
        await this.getAddToCartButton().click();
        await expect(this.page.getByText('Added to the cart')).toBeVisible();
    }

    getCartIcon() {
        return this.page.getByTestId(this.locators.headerCartIcon)
    }

    async clickCartIcon() {
        await this.getCartIcon().click();
    }

    async clickOnWriteAReviewBtn() {
        await this.page.locator(this.locators.writeReviewBtn).click();
    }

    async fillReviewForm() {
        await this.page.fill(this.locators.yourNameInput, 'John Doe');
        await this.page.fill(this.locators.emailInput, 'testing@gmail.com');
        await this.page.click(this.locators.ratingStars);
        await this.page.fill(this.locators.reviewTitleInput, 'Great Product');
        await this.page.fill(this.locators.giveYourOpinionInput, 'This product exceeded my expectations. Highly recommend!');
        await this.page.click(this.locators.submitBtn);
    }
    async assertSubmittedReview({ name, title, opinion }) {
        await this.page.waitForTimeout(3000); // Wait for 1 second to ensure the form is ready
        await expect(this.page.locator(`text=${name}`)).toBeVisible();
        await expect(this.page.locator(`text=${title}`)).toBeVisible();
        await expect(this.page.locator(`text=${opinion}`)).toBeVisible();
    }

    async clickOnEditReviewBtn() {
        await this.page.locator(this.locators.editReviewBtn).click();
    }

    async updateReviewForm() {
        await this.page.waitForTimeout(3000); // Wait for 1 second to ensure the form is ready
        await this.page.fill(this.locators.reviewTitleInput, 'Updated Review Title');
        await this.page.fill(this.locators.giveYourOpinionInput, 'This is an updated review opinion.');
        await this.page.click(this.locators.submitBtn);
    }

    async assertUpdatedReview({ title, opinion }) {
        await this.page.waitForTimeout(3000); // Wait for 1 second to ensure the form is ready
        await expect(this.page.locator(`text=${title}`)).toBeVisible();
        await expect(this.page.locator(`text=${opinion}`)).toBeVisible();
    }

    async clickOnDeleteReviewBtn() {
        await this.page.locator(this.locators.deleteReviewBtn).click();
        await this.page.keyboard.press('Enter');
    }
}

export default ProductDetailsPage;