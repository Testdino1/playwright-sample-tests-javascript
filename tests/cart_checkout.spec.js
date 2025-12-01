// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';
import dotenv from 'dotenv';
dotenv.config({ override: true });

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

async function login(username = process.env.USERNAME, password = process.env.PASSWORD) {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.validateSignInPage();
  await allPages.loginPage.login(username, password);
}

async function login1(username = process.env.USERNAME1, password = process.env.PASSWORD) {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.validateSignInPage();
  await allPages.loginPage.login(username, password);
}

async function logout() {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.clickOnLogoutButton();
}

test('Verify that user is able to delete selected product from cart', {tag:'@ios'}, async () => {
    const productName = 'GoPro HERO10 Black';
    await login();
    await allPages.inventoryPage.clickOnShopNowButton();
    await allPages.inventoryPage.clickOnAllProductsLink();
    await allPages.inventoryPage.searchProduct(productName);
    await allPages.inventoryPage.verifyProductTitleVisible(productName);
    await allPages.inventoryPage.clickOnAddToCartIcon();

    await allPages.cartPage.clickOnCartIcon();
    await allPages.cartPage.verifyCartItemVisible(productName);
    await allPages.cartPage.clickOnDeleteProductIcon();
    await allPages.cartPage.verifyCartItemDeleted(productName);
    await allPages.cartPage.verifyEmptyCartMessage();
    await allPages.cartPage.clickOnStartShoppingButton();
    await allPages.allProductsPage.assertAllProductsTitle();
});

test('Verify new user views and cancels an order in my orders', {tag: '@chromium'}, async () => {
    const email = `test+${Date.now()}@test.com`;
    const firstName = 'Test';
    const lastName = 'User';

    let productName= `Rode NT1-A Condenser Mic`;

  await test.step('Verify that user can register successfully', async () => {
    await allPages.loginPage.clickOnUserProfileIcon();
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.clickOnSignupLink();
    await allPages.signupPage.assertSignupPage();
    await allPages.signupPage.signup(firstName, lastName, email, process.env.PASSWORD);
    await allPages.signupPage.verifySuccessSignUp();
  })

  await test.step('Verify that user can login successfully', async () => {
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.login(email, process.env.PASSWORD);
    await allPages.loginPage.verifySuccessSignIn();
    await expect(allPages.homePage.getHomeNav()).toBeVisible({ timeout: 30000 });
  })

  await test.step('Navigate to All Products and add view details of a random product', async () => {
    await allPages.homePage.clickAllProductsNav();
    await allPages.allProductsPage.assertAllProductsTitle();
    productName = await allPages.allProductsPage.getNthProductName(1);
    await allPages.allProductsPage.clickNthProduct(1);
    await allPages.productDetailsPage.clickAddToCartButton();
  })

  await test.step('Add product to cart, add new address and checkout', async () => {
    await allPages.productDetailsPage.clickCartIcon();
    await allPages.cartPage.assertYourCartTitle();
    await expect(allPages.cartPage.getCartItemName()).toContainText(productName, { timeout: 10000 });
    await allPages.cartPage.clickOnCheckoutButton();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.fillShippingAddress(
      firstName, email, 'New York', 'New York', '123 Main St', '10001', 'United States'
    );
    await allPages.checkoutPage.clickSaveAddressButton();
    await allPages.checkoutPage.assertAddressAddedToast();
  })

  await test.step('Complete order and verify in my orders', async () => {
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.clickOnPlaceOrder();
    await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
    await allPages.inventoryPage.clickOnContinueShopping();

    await allPages.loginPage.clickOnUserProfileIcon();
    await allPages.orderPage.clickOnMyOrdersTab();
    await allPages.orderPage.clickCancelOrderButton();
    await allPages.orderPage.confirmCancellation();
  });
});

test('Verify That a New User Can Successfully Complete the Journey from Registration to a Multiple Order Placement', {tag: '@chromium'}, async () => {
    const email = `test+${Date.now()}@test.com`;
    const firstName = 'Test';
    const lastName = 'User';

    let productName= `Rode NT1-A Condenser Mic`;

  await test.step('Verify that user can register successfully', async () => {
    // Signup
    await allPages.loginPage.clickOnUserProfileIcon();
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.clickOnSignupLink();
    await allPages.signupPage.assertSignupPage();
    await allPages.signupPage.signup(firstName, lastName, email, process.env.PASSWORD);
    await allPages.signupPage.verifySuccessSignUp();
  })

  await test.step('Verify that user can login successfully', async () => {
    // Login as new user
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.login(email, process.env.PASSWORD);
    await allPages.loginPage.verifySuccessSignIn();
    await expect(allPages.homePage.getHomeNav()).toBeVisible({ timeout: 30000 });
  })

  await test.step('Navigate to All Products and add view details of a random product', async () => {
    await allPages.homePage.clickOnShopNowButton();
    await allPages.allProductsPage.assertAllProductsTitle();
    await allPages.allProductsPage.clickNthProduct(1);
    await allPages.productDetailsPage.clickOnReviewsTab();
    await allPages.productDetailsPage.assertReviewsTab();
    await allPages.productDetailsPage.clickOnAdditionalInfoTab();
    await allPages.productDetailsPage.assertAdditionalInfoTab();
  })

  await test.step('Add product to cart, change quantity, add new address and checkout', async () => {
    await allPages.productDetailsPage.clickAddToCartButton();
    await allPages.productDetailsPage.clickCartIcon();
    await allPages.cartPage.clickIncreaseQuantityButton();
    await allPages.cartPage.clickOnCheckoutButton();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCashOnDeliverySelected();
    await allPages.checkoutPage.fillShippingAddress(process.env.SFIRST_NAME, email, process.env.SCITY, process.env.SSTATE, process.env.SSTREET_ADD, process.env.SZIP_CODE, process.env.SCOUNTRY);
    await allPages.checkoutPage.clickSaveAddressButton();
    await allPages.checkoutPage.clickOnPlaceOrder();
    await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
    await allPages.checkoutPage.verifyOrderConfirmedTitle();
    await allPages.checkoutPage.clickOnContinueShoppingButton();
  })

  await test.step('Add another product to cart, select existing address and checkout', async () => {
    await allPages.homePage.clickOnShopNowButton();
    await allPages.allProductsPage.assertAllProductsTitle();
    await allPages.allProductsPage.clickNthProduct(1);
    await allPages.productDetailsPage.clickAddToCartButton();
    await allPages.productDetailsPage.clickCartIcon();
    await allPages.cartPage.clickOnCheckoutButton();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCashOnDeliverySelected();
    await allPages.checkoutPage.clickOnPlaceOrder();
    await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
  })
});

test('Verify that the new user is able to Sign Up, Log In, and Navigate to the Home Page Successfully', {tag: '@chromium'}, async () => {
    const email = `test+${Date.now()}@test.com`;
    const firstName = 'Test';
    const lastName = 'User';

  await test.step('Verify that user can register successfully', async () => {
    await allPages.loginPage.clickOnUserProfileIcon();
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.clickOnSignupLink();
    await allPages.signupPage.assertSignupPage();
    await allPages.signupPage.signup(firstName, lastName, email, process.env.PASSWORD);
    await allPages.signupPage.verifySuccessSignUp();
  })

  await test.step('Verify that user can login successfully', async () => {
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.login(email, process.env.PASSWORD);
    await allPages.loginPage.verifySuccessSignIn();
    await expect(allPages.homePage.getHomeNav()).toBeVisible({ timeout: 30000 });
  })
})

test('Verify that user can update personal information', {tag: '@firefox'}, async () => {
    await login();
    await allPages.userPage.clickOnUserProfileIcon();
    await allPages.userPage.updatePersonalInfo();
    await allPages.userPage.verifyPersonalInfoUpdated();
});
