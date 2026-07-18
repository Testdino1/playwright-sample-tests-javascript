import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class CartPage extends BasePage{

  /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        yourCartTitle: 'h2:has-text("Your Cart")',
        cartItemImage: '[data-testid="cart-item-image"]',
        cartItemName: '[data-testid="cart-item-header"]',
        cartItemQuantity: '[data-testid="item-quantity"]',
        increaseQuantityButton: '[data-testid="increase-quantity"]',
        decreaseQuantityButton: '[data-testid="decrease-quantity"]',
        cartItemPrice: '[data-testid="item-price"]',
        removeCartItem: '[data-testid="remove-item"]',
        subtotalLabel: '[data-testid="subtotal-label"]',
        subtotalValue: '[data-testid="subtotal-value"]',
        shippingLabel: '[data-testid="shipping-label"]',
        shippingValue: '[data-testid="shipping-value"]',
        totalLabel: '[data-testid="total-label"]',
        totalValue: '[data-testid="total-value"]',
        checkoutButton: '[data-testid="checkout-button"]',
        viewCartButton: '[data-testid="view-cart-button"]',
        shoppingCartIcon: `[data-testid="header-cart-icon"]`,
    }

    async assertYourCartTitle() {
        await expect(this.page.locator(this.locators.yourCartTitle)).toBeVisible({ timeout: 10000 });
    }

    getCartItemImage() {
        return this.page.locator(this.locators.cartItemImage)
    }

    getCartItemName() {
        return this.page.locator(this.locators.cartItemName)
    }

    getCartItemQuantity() {
        return this.page.locator(this.locators.cartItemQuantity)
    }

    getIncreaseQuantityButton() {
        return this.page.locator(this.locators.increaseQuantityButton).first();
    }

    async clickIncreaseQuantityButton() {
        await this.getIncreaseQuantityButton().click();
    }

    getDecreaseQuantityButton() {
        return this.page.locator(this.locators.decreaseQuantityButton)
    }

    async clickDecreaseQuantityButton() {
        await this.getDecreaseQuantityButton().click();
    }

    getCartItemPrice() {
        return this.page.locator(this.locators.cartItemPrice)
    }

    getRemoveCartItem() {
        return this.page.locator(this.locators.removeCartItem)
    }

    getSubtotalLabel() {
        return this.page.locator(this.locators.subtotalLabel)
    }

    getSubtotalValue() {
        return this.page.locator(this.locators.subtotalValue)
    }

    getShippingLabel() {
        return this.page.locator(this.locators.shippingLabel)
    }

    getShippingValue() {
        return this.page.locator(this.locators.shippingValue)
    }

    getTotalLabel() {
        return this.page.locator(this.locators.totalLabel)
    }

    getTotalValue() {
        return this.page.locator(this.locators.totalValue);
    }

    getCheckoutButton() {
        return this.page.locator(this.locators.checkoutButton)
    }

    async clickCheckoutButton() {
        await this.getCheckoutButton().click();
    }

    getViewCartButton() {
        return this.page.locator(this.locators.viewCartButton)
    }

    async clickViewCartButton() {
        await this.getViewCartButton().click();
    }

    async clickOnCartIcon() {
        await this.page.locator(this.locators.shoppingCartIcon).click({ force: true });
    }

    async verifyCartItemVisible(productName) {
        await expect(this.page.locator(this.locators.cartItemName)).toBeVisible();
        await expect(this.page.locator(this.locators.cartItemName)).toHaveText(productName);
    }

    async clickOnCheckoutButton() {
        await this.page.waitForTimeout(2000);
        await this.page.locator(this.locators.checkoutButton).click({ force: true });
    }

    async verifyIncreasedQuantity(expectedQuantity) {
        await expect(this.page.locator(this.locators.cartItemQuantity)).toHaveText(expectedQuantity);
    }
}

export default CartPage;