import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class OrderPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        myOrdersTab: "//p[normalize-space()='My Orders']",
        myOrdersTitle: "h2[data-testid='my-orders-title']",
        viewDetailsButton: "(//button[normalize-space()='View'])[1]",
        orderDetailsTitle: "//h1[normalize-space()='Order Details']",
        orderItemName: "p[data-testid='order-item-name']",
        orderItemQuantity: "p:has-text('Qty:')",
        orderTotalValue: "p[data-testid='total-value']",
        orderStatusDisplay: "div[class*='badge']",
        cancelOrderButton: "button:has-text('Cancel')",
        confirmCancellationButton: "//button[normalize-space()='Yes, Cancel Order']",
        toasterMessage: "div[id='_rht_toaster'] > div > div",
        paginationButton: "//button[normalize-space()='{}']",
        productNameInOrderList: "h3[normalize-space()='{}']",
        priceAndQuantityInOrderList: "div[normalize-space()='{}']",
        orderStatusInList: "div[normalize-space()='{}']",
        myOrdersCount: "span[data-testid='my-orders-count']",
    }

    async clickOnMyOrdersTab() {
        await this.page.locator(this.locators.myOrdersTab).click({ force: true });
    }

    async verifyMyOrdersTitle() {
        await expect(this.page.locator(this.locators.myOrdersTitle)).toBeVisible();
    }

    async clickViewDetailsButton(orderIndex = 1) {
        await this.page.locator(`(//button[normalize-space()='View'])[${orderIndex}]`).click();
    }

    async verifyOrderDetailsTitle() {
        await expect(this.page.locator(this.locators.orderDetailsTitle)).toBeVisible();
    }

    async verifyOrderSummary(productName, quantity, amount, status) {
        await expect(this.page.locator(this.locators.orderItemName)).toHaveText(productName);
        await expect(this.page.locator(this.locators.orderItemQuantity)).toContainText(`Qty: ${quantity}`);
        await expect(this.page.locator(this.locators.orderTotalValue)).toContainText(amount);
        await expect(this.page.locator(this.locators.orderStatusDisplay)).toHaveText(status);
    }

    async clickCancelOrderButton(buttonIndex = 2) {
        await this.page.locator(`(//button[normalize-space()='Cancel'])[${buttonIndex}]`).click({ force: true });
    }

    async confirmCancellation() {
        await this.page.locator(this.locators.confirmCancellationButton).click({ force: true });
    }

    async verifyCancellationConfirmationMessage() {
        await expect(this.page.locator(this.locators.toasterMessage)).toBeVisible();
        await expect(this.page.locator(this.locators.toasterMessage)).toContainText('canceled successfully');
    }

    async verifyOrderStatusIsCanceled(productName) {
        await expect(this.page.locator(`//h3[normalize-space()='${productName}']`).locator('xpath=./ancestor::div[contains(@class, "card")]//div[contains(@class, "badge")]')).toHaveText('Canceled');
    }

    async clickOnPaginationButton(pageNumber) {
        await this.page.locator(this.locators.paginationButton.replace('{}', pageNumber)).click({ force: true });
    }

    async verifyProductInOrderList(productName) {
        await expect(this.page.locator(this.locators.productNameInOrderList.replace('{}', productName))).toBeVisible();
    }

    async verifyPriceAndQuantityInOrderList(priceAndQuantity) {
        await expect(this.page.locator(this.locators.priceAndQuantityInOrderList.replace('{}', priceAndQuantity))).toBeVisible();
    }

    async verifyOrderStatusInList(status, productName) {
        await expect(this.page.locator(`//h3[normalize-space()='${productName}']`).locator('xpath=./ancestor::div[contains(@class, "card")]//div[contains(@class, "badge")]')).toHaveText(status);
    }

    async verifyMyOrdersCount() {
        await expect(this.page.locator(this.locators.myOrdersCount)).toBeVisible();
    }
}

export default OrderPage;