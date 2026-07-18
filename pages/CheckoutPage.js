import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class CheckoutPage extends BasePage {

  /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        shippingAddress: {
            checkoutTitle: 'checkout-title',
            checkoutShippingAddressTitle: 'checkout-shipping-address-title',
            checkoutShippingAddressFirstName: 'checkout-first-name-input',
            checkoutShippingAddressEmail: 'checkout-email-input',
            checkoutShippingAddressCity: 'checkout-city-input',
            checkoutShippingAddressState: 'checkout-state-input',
            checkoutShippingAddressStreetAddress: 'checkout-street-input',
            checkoutShippingAddressZipCode: 'checkout-zip-code-input',
            checkoutShippingAddressCountry: 'checkout-country-input',
            checkoutCancelButton: 'checkout-cancel-button',
            checkoutChangeShippingAddressLink: `[data-testid="checkout-change-address-button"]`,
            addNewShippingAddressButton: `[data-testid="add-new-address-button"]`,
            addressFirstName: `[data-testid="checkout-first-name-input"]`,
            checkoutSaveAddressButton: 'checkout-save-address-button',
        },
        paymentMethod: {
            checkoutPaymentMethodTitle: 'checkout-payment-method-title',
            checkoutCreditCardButton: 'checkout-credit-card-button',
            checkoutDebitCardButton: 'checkout-debit-card-button',
            checkoutNetbankingButton: 'checkout-netbanking-button',
            checkoutCodButton: 'checkout-cod-button',
            checkoutCardNumberInput: 'checkout-card-number-input',
            checkoutCardHolderNameInput: 'checkout-cardholder-name-input',
            checkoutExpirationDateMonthInput: 'checkout-expiration-date-month-input',
            checkoutExpirationDateYearInput: 'checkout-expiration-date-year-input',
            checkoutCvvInput: 'checkout-cvv-input',
        },
        orderSummary: {
            checkoutOrderSummaryTitle: 'checkout-order-summary-title',
            checkoutOrderSummaryImage: '[data-testid="checkout-order-summary-title"] + div img',
            checkoutProductName: 'checkout-product-header',
            checkoutProductQuantity: 'checkout-product-quantity',
            checkoutProductPrice: 'checkout-product-price',
            checkoutSubtotalValue: 'checkout-subtotal-value',
            checkoutShippingValue: 'checkout-shipping-value',
            checkoutTotalValue: 'checkout-total-value',
            checkoutPlaceOrderButton: 'checkout-place-order-button',
            checkoutContinueShoppingButton: 'checkout-continue-shopping-button'
        },
        // New locators
        checkoutTitle: "h1[data-testid='checkout-title']",
        productNameInCheckout: "//h3[normalize-space()='{}']",
        cashOnDeliveryButton: "//button[normalize-space()='Cash on Delivery']",
        cashOnDeliveryText: "//p[normalize-space()='Cash on Delivery']",
        placeOrderButton: "//button[normalize-space()='Place Order']",
        orderSuccessMessage: "//p[contains(text(), 'Your order was placed successf')]",
        orderItemNameConfirmation: "p[data-testid='order-item-name']",
        continueShoppingButton: 'button[data-testid="continue-shopping-button"]',
        orderConfirmedTitle: `[data-testid="order-confirmed-title"]`
    }

    // **************** Shipping Address **************** //
    async assertCheckoutTitle() {
        await expect(this.page.getByTestId(this.locators.shippingAddress.checkoutTitle)).toBeVisible({ timeout: 10000 });
    }

    getShippingAddressTitle() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutShippingAddressTitle)
    }

    getShippingAddressFirstName() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutShippingAddressFirstName)
    }

    getShippingAddressEmail() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutShippingAddressEmail)
    }

    getShippingAddressCity() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutShippingAddressCity)
    }

    getShippingAddressState() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutShippingAddressState)
    }

    getShippingAddressStreetAddress() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutShippingAddressStreetAddress)
    }

    getShippingAddressZipCode() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutShippingAddressZipCode)
    }

    getShippingAddressCountry() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutShippingAddressCountry)
    }

    getShippingAddressCancelButton() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutCancelButton)
    }

    async clickCancelButton() {
        await this.getShippingAddressCancelButton().click();
    }

    getSaveAddressButton() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutSaveAddressButton)
    }

    async clickSaveAddressButton() {
        await this.getSaveAddressButton().click();
    }

    async fillShippingAddress(firstName, email, city, state, streetAddress, zipCode, country) {
        await this.getShippingAddressFirstName().fill(firstName);
        await this.getShippingAddressEmail().fill(email);
        await this.getShippingAddressCity().fill(city);
        await this.getShippingAddressState().fill(state);
        await this.getShippingAddressStreetAddress().fill(streetAddress);
        await this.getShippingAddressZipCode().fill(zipCode);
        await this.getShippingAddressCountry().fill(country);
    }

    getShippingAddressChangeLink() {
        return this.page.getByTestId(this.locators.shippingAddress.checkoutChangeShippingAddressLink)
    }

    async clickChangeShippingAddressLink() {
        await this.getShippingAddressChangeLink().click({ force: true });
    }

    getAddNewShippingAddressButton() {
        return this.page.getByTestId(this.locators.shippingAddress.addNewShippingAddressButton)
    }

    async clickAddNewShippingAddressButton() {
        await this.getAddNewShippingAddressButton().click({ force: true });
    }

    async assertAddressAddedToast() {
        await expect(this.page.getByText('Address added successfully')).toBeVisible({ timeout: 10000 });
    }

    // **************** Payment Method **************** //

    getAddressFirstName() {
        return this.page.getByTestId(this.locators.shippingAddress.addressFirstName)
    }

    getPaymentMethodTitle() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutPaymentMethodTitle)
    }

    getCreditCardButton() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutCreditCardButton)
    }

    getDebitCardButton() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutDebitCardButton)
    }
    
    getNetbankingButton() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutNetbankingButton)
    }
    
    getCodButton() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutCodButton)
    }

    async clickCodButton() {
        await this.getCodButton().click();
    }

    getCardNumberInput() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutCardNumberInput)
    }

    getCardHolderNameInput() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutCardHolderNameInput)
    }

    getExpirationDateMonthInput() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutExpirationDateMonthInput)
    }

    getExpirationDateYearInput() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutExpirationDateYearInput)
    }
    
    getCvvInput() {
        return this.page.getByTestId(this.locators.paymentMethod.checkoutCvvInput)
    }

    // ************************** Order Summary ************************** //

    getOrderSummaryTitle() {
        return this.page.getByTestId(this.locators.orderSummary.checkoutOrderSummaryTitle)
    }

    async assertOrderSummaryTitle() {
        await expect(this.page.getByTestId(this.locators.orderSummary.checkoutOrderSummaryTitle)).toBeVisible();
    }

    getOrderSummaryImage() {
        return this.page.locator(this.locators.orderSummary.checkoutOrderSummaryImage)
    }

    getOrderSummaryProductName() {
        return this.page.getByTestId(this.locators.orderSummary.checkoutProductName)
    }
    
    getOrderSummaryProductQuantity() {
        return this.page.getByTestId(this.locators.orderSummary.checkoutProductQuantity)
    }

    getOrderSummaryProductPrice() {
        return this.page.getByTestId(this.locators.orderSummary.checkoutProductPrice)
    }

    getOrderSummarySubtotalValue() {
        return this.page.getByTestId(this.locators.orderSummary.checkoutSubtotalValue).textContent();
    }
    
    getOrderSummaryShippingValue() {
        return this.page.getByTestId(this.locators.orderSummary.checkoutShippingValue)
    }

    getOrderSummaryTotalValue() {
        return this.page.getByTestId(this.locators.orderSummary.checkoutTotalValue)
    }

    getPlaceOrderButton() {
        return this.page.getByTestId(this.locators.orderSummary.checkoutPlaceOrderButton)
    }

    async clickPlaceOrderButton() {
        await this.getPlaceOrderButton().click();
    }

    getContinueShoppingButton() {
        return this.page.getByTestId(this.locators.orderSummary.checkoutContinueShoppingButton)
    }

    async clickContinueShoppingButton() {
        await this.getContinueShoppingButton().click();
    }
    
    async verifyCheckoutTitle() {
        await expect(this.page.locator(this.locators.checkoutTitle)).toBeVisible();
    }

    async verifyProductInCheckout(productName) {
        const locator = this.page.locator(this.locators.productNameInCheckout.replace('{}', productName)).nth(1);
        await expect(locator).toBeVisible();
        await expect(locator).toHaveText(productName);
    }

    async selectCashOnDelivery() {
        await this.page.locator(this.locators.cashOnDeliveryButton).click({ force: true });
    }

    async verifyCashOnDeliverySelected() {
        await expect(this.page.locator(this.locators.cashOnDeliveryText)).toBeVisible();
    }

    async clickOnPlaceOrder() {
        await this.page.locator(this.locators.placeOrderButton).click({ force: true });
    }

    async verifyOrderPlacedSuccessfully() {
        await expect(this.page.locator(this.locators.orderSuccessMessage)).toBeVisible();
    }

    async verifyOrderItemName(productName) {
        await expect(this.page.locator(this.locators.orderItemNameConfirmation)).toBeVisible();
        await expect(this.page.locator(this.locators.orderItemNameConfirmation)).toHaveText(productName);
    }
    
    async verifyOrderConfirmedTitle() {
        await expect(this.page.locator(this.locators.orderConfirmedTitle)).toBeVisible({ timeout: 50000 });
    }

    getOnContinueShoppingButton() {
        return this.page.locator(this.locators.continueShoppingButton)
    }

    async clickOnContinueShoppingButton() {
        await this.getOnContinueShoppingButton().click({ timeout: 50000 });
    }
}

export default CheckoutPage;