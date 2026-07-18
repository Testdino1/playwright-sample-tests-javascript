import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class OrderDetailsPage extends BasePage{

  /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        orderDetailsTitle: 'order-details-title',
        orderId: 'order-id',
        orderPlacedName: 'order-placed-name',
        orderPlacedMessage: 'order-placed-message',
        orderPlacedDate: 'order-placed-date',
        backToHomeButton: 'back-to-home',
        orderInformation: {
            orderInformationTitle: 'order-information-title',
            orderConfirmedTitle:'order-confirmed-title',
            orderConfirmedMessage:'order-confirmed-message',
            shippingDetailsTitle:'shipping-details-title',
            shippingEmailValue:'shipping-email-value',
            paymentMethodAmount:'payment-method-amount',
            deliveryAddressLabel:'delivery-address-label',
            deliveryAddressValue:'delivery-address-value',
            continueShoppingButton:'continue-shopping-button'
        },
        orderSummary: {
            orderSummaryTitle:'order-summary-title',
            orderSummaryProductName:'order-item-name',
            orderSummaryProductQuantity:'order-item-quantity',
            orderSummaryProductPrice:'order-item-price',
            subtotalValue:'subtotal-value',
            shippingValue:'shipping-value',
            totalValue:'total-value'
        }
    }

    async assertOrderDetailsTitle() {
        await expect(this.page.getByTestId(this.locators.orderDetailsTitle)).toBeVisible();
    }

    getOrderId() {
        return this.page.getByTestId(this.locators.orderId)
    }

    getBackToHomeButton() {
        return this.page.getByTestId(this.locators.backToHomeButton)
    }

    async clickBackToHomeButton() {
        await this.getBackToHomeButton().click();
    }

    async assertOrderPlacedName() {
        await expect(this.page.getByTestId(this.locators.orderPlacedName)).toBeVisible();
    }

    async assertOrderPlacedMessage() {
        await expect(this.page.getByTestId(this.locators.orderPlacedMessage)).toBeVisible();
    }

    async assertOrderPlacedDate() {
        await expect(this.page.getByTestId(this.locators.orderPlacedDate)).toBeVisible();
    }

    async assertOrderInformationTitle() {
        await expect(this.page.getByTestId(this.locators.orderInformation.orderInformationTitle)).toBeVisible();
    }


    // ****************************** Order Information ****************************** //
    async assertOrderConfirmedTitle() {
        await expect(this.page.getByTestId(this.locators.orderInformation.orderConfirmedTitle)).toBeVisible();
    }

    async assertOrderConfirmedMessage() {
        await expect(this.page.getByTestId(this.locators.orderInformation.orderConfirmedMessage)).toBeVisible();
    }


    async assertShippingDetailsTitle() {
        await expect(this.page.getByTestId(this.locators.orderInformation.shippingDetailsTitle)).toBeVisible();
    }

    async assertShippingEmailValue(email) {
        await expect(this.page.getByTestId(this.locators.orderInformation.shippingEmailValue)).toContainText(email);
    }

    async assertPaymentMethodAmount(amount) {
        await expect(this.page.getByTestId(this.locators.orderInformation.paymentMethodAmount)).toContainText(amount);
    }

    async assertDeliveryAddressLabel() {
        await expect(this.page.getByTestId(this.locators.orderInformation.deliveryAddressLabel)).toBeVisible();
    }

    async assertDeliveryAddressValue() {
        await expect(this.page.getByTestId(this.locators.orderInformation.deliveryAddressValue)).toBeVisible();
    }

    getContinueShoppingButton() {
        return this.page.getByTestId(this.locators.orderInformation.continueShoppingButton)
    }

    async clickContinueShoppingButton() {
        await this.getContinueShoppingButton().click();
    }

    async assertContinueShoppingButton() {
        await expect(this.getContinueShoppingButton()).toBeVisible();
    }

    // ****************************** Order Summary ****************************** //
    async assertOrderSummaryTitle() {
        await expect(this.page.getByTestId(this.locators.orderSummary.orderSummaryTitle)).toBeVisible();
    }

    async assertOrderSummaryProductName(productName) {
        await expect(this.page.getByTestId(this.locators.orderSummary.orderSummaryProductName)).toContainText(productName);
    }

    async assertOrderSummaryProductQuantity(quantity) {
        await expect(this.page.getByTestId(this.locators.orderSummary.orderSummaryProductQuantity)).toContainText(quantity);
    }

    async assertOrderSummaryProductPrice(price) {
        await expect(this.page.getByTestId(this.locators.orderSummary.orderSummaryProductPrice)).toContainText(price);
    }
    
    async assertOrderSummarySubtotalValue(subtotal) {
        await expect(this.page.getByTestId(this.locators.orderSummary.subtotalValue)).toContainText(subtotal);
    }

    async assertOrderSummaryShippingValue(shipping) {
        await expect(this.page.getByTestId(this.locators.orderSummary.shippingValue)).toContainText(shipping);
    }

    async assertOrderSummaryTotalValue(total) {
        await expect(this.page.getByTestId(this.locators.orderSummary.totalValue)).toContainText(total);
    }
    
}

export default OrderDetailsPage;