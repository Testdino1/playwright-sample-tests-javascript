// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

test.describe('Cart Module', () => {
  test.describe('Product Removal', () => {
    test('Verify that user is able to delete selected product from cart ',{tag: '@ios'}, async () => {
      const productName = 'GoPro HERO10 Black';
      await allPages.inventoryPage.clickOnAllProductsLink();
      await allPages.inventoryPage.searchProduct(productName);
      await allPages.inventoryPage.verifyProductTitleVisible(productName);
      await allPages.inventoryPage.clickOnAddToCartIcon();

      await allPages.cartPage.clickOnCartIcon();
      await allPages.cartPage.verifyCartItemVisible(productName);
      await allPages.cartPage.clickOnDeleteProductIcon();
      await allPages.cartPage.verifyCartItemDeleted(productName);
      // await allPages.cartPage.clickOnStartShoppingButton();
      // await allPages.allProductsPage.assertAllProductsTitle();
    });
  });
});

test.describe('Orders Module', () => {
  test.describe('Order Cancellation', () => {
    test('Verify new user views and cancels an order in my orders ',{tag: '@chromium'}, async () => {
      const email = `test+${Date.now()}@test.com`;
      const firstName = 'Test';
      const lastName = 'User';
      let productName = `Rode NT1-A Condenser Mic`;

      await test.step('Verify that user can register successfully', async () => {
        // await allPages.loginPage.clickOnUserProfileIcon();
        // await allPages.loginPage.validateSignInPage();
        // await allPages.loginPage.clickOnSignupLink();
        // await allPages.signupPage.assertSignupPage();
        // await allPages.signupPage.signup(firstName, lastName, email, process.env.PASSWORD);
        // await allPages.signupPage.verifySuccessSignUp();
      });

      await test.step('Navigate to All Products and add view details of a random product', async () => {
        await allPages.homePage.clickAllProductsNav();
        productName = await allPages.allProductsPage.getNthProductName(1);
        await allPages.allProductsPage.clickNthProduct(1);
        await allPages.productDetailsPage.clickAddToCartButton();
      });

      await test.step('Add product to cart, add new address and checkout', async () => {
        await allPages.productDetailsPage.clickCartIcon();
      //   await allPages.cartPage.assertYourCartTitle();
      //   await expect(allPages.cartPage.getCartItemName()).toContainText(productName, { timeout: 10000 });
      //   await allPages.cartPage.clickOnCheckoutButton();
      //   await allPages.checkoutPage.verifyCheckoutTitle();
      //   await allPages.checkoutPage.fillShippingAddress(
      //     firstName, email, 'New York', 'New York', '123 Main St', '10001', 'United States'
      //   );
      //   await allPages.checkoutPage.clickSaveAddressButton();
      //   await allPages.checkoutPage.assertAddressAddedToast();
      // });

      // await test.step('Complete order and verify in my orders', async () => {
      //   await allPages.checkoutPage.selectCashOnDelivery();
      //   await allPages.checkoutPage.verifyCheckoutTitle();
      //   await allPages.checkoutPage.clickOnPlaceOrder();
      //   await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
      //   await allPages.inventoryPage.clickOnContinueShopping();

      //   await allPages.loginPage.clickOnUserProfileIcon();
      //   await allPages.orderPage.clickOnMyOrdersTab();
      //   await allPages.orderPage.clickCancelOrderButton();
      //   await allPages.orderPage.confirmCancellation();
      });
    });
  });
});

test.describe('User Journey', () => {
  test.describe('Multiple Order Placement', () => {
    test('Verify That a New User Can Successfully Complete the Journey from Registration to a Multiple Order Placement ',{tag: '@chromium'}, async () => {
      const email = `test+${Date.now()}@test.com`;
      const firstName = 'Test';
      const lastName = 'User';

      await test.step('Verify that user can register successfully', async () => {
        // await allPages.loginPage.clickOnUserProfileIcon();
        // await allPages.loginPage.validateSignInPage();
        // await allPages.loginPage.clickOnSignupLink();
        // await allPages.signupPage.assertSignupPage();
        // await allPages.signupPage.signup(firstName, lastName, email, process.env.PASSWORD);
        // await allPages.signupPage.verifySuccessSignUp();
      });

      await test.step('Navigate product details and validate tabs', async () => {
        await allPages.homePage.clickOnShopNowButton();
        // await allPages.allProductsPage.assertAllProductsTitle();
        // await allPages.allProductsPage.clickNthProduct(1);
        // await allPages.productDetailsPage.clickOnReviewsTab();
        // await allPages.productDetailsPage.assertReviewsTab();
        // await allPages.productDetailsPage.clickOnAdditionalInfoTab();
        // await allPages.productDetailsPage.assertAdditionalInfoTab();
      });

      await test.step('Place first order', async () => {
        // await allPages.productDetailsPage.clickAddToCartButton();
        // await allPages.productDetailsPage.clickCartIcon();
        // await allPages.cartPage.clickIncreaseQuantityButton();
        // await allPages.cartPage.clickOnCheckoutButton();
        // await allPages.checkoutPage.verifyCheckoutTitle();
        // await allPages.checkoutPage.selectCashOnDelivery();
        // await allPages.checkoutPage.fillShippingAddress(
        //   process.env.SFIRST_NAME,
        //   email,
        //   process.env.SCITY,
        //   process.env.SSTATE,
        //   process.env.SSTREET_ADD,
        //   process.env.SZIP_CODE,
        //   process.env.SCOUNTRY
        // );
        // await allPages.checkoutPage.clickSaveAddressButton();
        // await allPages.checkoutPage.clickOnPlaceOrder();
        // await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
        // await allPages.checkoutPage.clickOnContinueShoppingButton();
      });

      await test.step('Place second order using existing address', async () => {
        // await allPages.homePage.clickOnShopNowButton();
        // await allPages.allProductsPage.assertAllProductsTitle();
        // await allPages.allProductsPage.clickNthProduct(1);
        // await allPages.productDetailsPage.clickAddToCartButton();
        // await allPages.productDetailsPage.clickCartIcon();
        // await allPages.cartPage.clickOnCheckoutButton();
        // await allPages.checkoutPage.verifyCheckoutTitle();
        // await allPages.checkoutPage.selectCashOnDelivery();
        // await allPages.checkoutPage.clickOnPlaceOrder();
        // await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
      });
    });
  });
});

test.describe('Authentication', () => {
  test.describe('Signup & Login', () => {
    test('Verify that the new user is able to Sign Up, Log In, and Navigate to the Home Page Successfully ',{tag: '@chromium'}, async () => {
      const email = `test+${Date.now()}@test.com`;
      const firstName = 'Test';
      const lastName = 'User';

      // await allPages.loginPage.clickOnUserProfileIcon();
      // await allPages.loginPage.validateSignInPage();
      // await allPages.loginPage.clickOnSignupLink();
      // await allPages.signupPage.assertSignupPage();
      // await allPages.signupPage.signup(firstName, lastName, email, process.env.PASSWORD);
      // await allPages.signupPage.verifySuccessSignUp();

      // await allPages.loginPage.validateSignInPage();
      // await allPages.loginPage.login(email, process.env.PASSWORD);
      // await allPages.loginPage.verifySuccessSignIn();
      // await expect(allPages.homePage.getHomeNav()).toBeVisible({ timeout: 30000 });
    });
  });
});

test.describe('User Profile', () => {
  test.describe('Personal Information', () => {
    test('Verify that user can update personal information ',{tag: '@firefox'}, async () => {
      await allPages.userPage.clickOnUserProfileIcon();
      // await allPages.userPage.updatePersonalInfo();
      // await allPages.userPage.verifyPersonalInfoUpdated();
    });
  });
});
