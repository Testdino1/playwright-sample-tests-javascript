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

test('Verify that user can login and logout successfully', {tag: '@chromium'}, async () => {
  await login();
  await logout();
});

test('Verify that all the navbar are working properly', {tag: '@webkit'}, async () => {
    await login();
    await allPages.homePage.clickBackToHomeButton();
    // await allPages.homePage.assertHomePage();
    await allPages.homePage.clickAllProductsNav();
    await allPages.allProductsPage.assertAllProductsTitle();
    await allPages.homePage.clickOnContactUsLink();
    await allPages.contactUsPage.assertContactUsTitle();
    await allPages.homePage.clickAboutUsNav();
    await allPages.homePage.assertAboutUsTitle();
}); 

test('Verify that user can edit and delete a product review', {tag: '@chromium'}, async () => {
  await test.step('Login as existing user and navigate to a product', async () => {
    await login();
  })

  await test.step('Navigate to all product section and select a product', async () => {
    await allPages.homePage.clickOnShopNowButton();
    await allPages.allProductsPage.assertAllProductsTitle();
    await allPages.allProductsPage.clickNthProduct(1);
  })


  await test.step('Submit a product review and verify submission', async () => {
    await allPages.productDetailsPage.clickOnReviewsTab();
    await allPages.productDetailsPage.assertReviewsTab();
    
    await allPages.productDetailsPage.clickOnWriteAReviewBtn();
    await allPages.productDetailsPage.fillReviewForm();
    await allPages.productDetailsPage.assertSubmittedReview({
        name: 'John Doe',
        title: 'Great Product',
        opinion: 'This product exceeded my expectations. Highly recommend!'
    }); 
  })

  await test.step('Edit the submitted review and verify changes', async () => {
    await allPages.productDetailsPage.clickOnEditReviewBtn();
    await allPages.productDetailsPage.updateReviewForm();
    await allPages.productDetailsPage.assertUpdatedReview({
        title: 'Updated Review Title',
        opinion: 'This is an updated review opinion.'
    })
    });

  await test.step('Delete the submitted review and verify deletion', async () => {
    await allPages.productDetailsPage.clickOnDeleteReviewBtn();
  })
});

test('Verify that User Can Complete the Journey from Login to Order Placement', {tag: '@chromium'}, async () => {
  const productName = 'GoPro HERO10 Black';
  await login();
  await allPages.inventoryPage.clickOnShopNowButton();
  await allPages.inventoryPage.clickOnAllProductsLink();
  await allPages.inventoryPage.searchProduct(productName);
  await allPages.inventoryPage.verifyProductTitleVisible(productName);
  await allPages.inventoryPage.clickOnAddToCartIcon();

  await allPages.cartPage.clickOnCartIcon();
  await allPages.cartPage.verifyCartItemVisible(productName);
  await allPages.cartPage.clickOnCheckoutButton();
  await allPages.checkoutPage.verifyCheckoutTitle();
  await allPages.checkoutPage.verifyProductInCheckout(productName);
  await allPages.checkoutPage.selectCashOnDelivery();
  await allPages.checkoutPage.verifyCashOnDeliverySelected();
  await allPages.checkoutPage.clickOnPlaceOrder();
  await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
});

test('Verify that a New User Can Successfully Complete the Journey from Registration to a Single Order Placement', {tag: '@chromium'}, async () => {
  // fresh test data
  const email = `test+${Date.now()}@test.com`;
  const firstName = 'Test';
  const lastName = 'User';

  let productName;
  let productPrice;
  let productReviewCount;

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

  await test.step('Navigate to all product and add to wishlist section', async () => {
    await allPages.homePage.clickAllProductsNav();
    await allPages.allProductsPage.assertAllProductsTitle();

    productName = await allPages.allProductsPage.getNthProductName(1);
    productPrice = await allPages.allProductsPage.getNthProductPrice(1);
    productReviewCount = await allPages.allProductsPage.getNthProductReviewCount(1);

    await allPages.allProductsPage.clickNthProductWishlistIcon(1);
    await expect(allPages.allProductsPage.getNthProductWishlistIconCount(1)).toContainText('1');
    await allPages.allProductsPage.clickNthProduct(1);

    await allPages.productDetailsPage.assertProductNameTitle(productName);
    await allPages.productDetailsPage.assertProductPrice(productName, productPrice);
    await allPages.productDetailsPage.assertProductReviewCount(productName, productReviewCount);
    await expect(allPages.allProductsPage.getNthProductWishlistIconCount(1)).toContainText('1');
  })

  await test.step('Add product to cart, add new address and checkout', async () => {
    await allPages.productDetailsPage.clickAddToCartButton();

    await allPages.productDetailsPage.clickCartIcon();
    await allPages.cartPage.assertYourCartTitle();
    await expect(allPages.cartPage.getCartItemName()).toContainText(productName, { timeout: 10000 });
    await expect(allPages.cartPage.getCartItemPrice()).toContainText(productPrice);
    await expect(allPages.cartPage.getCartItemQuantity()).toContainText('1');
    await allPages.cartPage.clickIncreaseQuantityButton();
    await expect(allPages.cartPage.getCartItemQuantity()).toContainText('2');

    const cleanPrice = productPrice.replace(/[₹,]/g, '');
    const priceValue = parseFloat(cleanPrice) * 2;
    await expect(allPages.cartPage.getTotalValue()).toContainText(
      priceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
    await allPages.cartPage.clickOnCheckoutButton();

    // Fill shipping address and save
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.fillShippingAddress(
      firstName, email, 'New York', 'New York', '123 Main St', '10001', 'United States'
    );
    await allPages.checkoutPage.clickSaveAddressButton();
    await allPages.checkoutPage.assertAddressAddedToast();

    // COD, verify summary, place order
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.assertOrderSummaryTitle();
    await expect(allPages.checkoutPage.getOrderSummaryImage()).toBeVisible();
    await expect(allPages.checkoutPage.getOrderSummaryProductName()).toContainText(productName);
    await allPages.checkoutPage.verifyProductInCheckout(productName);
    await expect(allPages.checkoutPage.getOrderSummaryProductQuantity()).toContainText('2');
    await expect(allPages.checkoutPage.getOrderSummaryProductPrice()).toContainText(productPrice);

    const subtotalValue = parseFloat(cleanPrice) * 2;
    const formattedSubtotal = subtotalValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    await expect(await allPages.checkoutPage.getOrderSummarySubtotalValue()).toContain(formattedSubtotal);
    await expect(allPages.checkoutPage.getOrderSummaryShippingValue()).toContainText('Free');
    await allPages.checkoutPage.clickOnPlaceOrder();

    // Order details and return to home
    await allPages.orderDetailsPage.assertOrderDetailsTitle();
    await allPages.orderDetailsPage.assertOrderPlacedName();
    await allPages.orderDetailsPage.assertOrderPlacedMessage();
    await allPages.orderDetailsPage.assertOrderPlacedDate();
    await allPages.orderDetailsPage.assertOrderInformationTitle();
    await allPages.orderDetailsPage.assertOrderConfirmedTitle();
    await allPages.orderDetailsPage.assertOrderConfirmedMessage();
    await allPages.orderDetailsPage.assertShippingDetailsTitle();
    await allPages.orderDetailsPage.assertShippingEmailValue(email);
    await allPages.orderDetailsPage.assertPaymentMethodAmount(formattedSubtotal);
    await allPages.orderDetailsPage.assertDeliveryAddressLabel();
    await allPages.orderDetailsPage.assertDeliveryAddressValue();
    await allPages.orderDetailsPage.assertContinueShoppingButton();

    await allPages.orderDetailsPage.assertOrderSummaryTitle();
    await allPages.orderDetailsPage.assertOrderSummaryProductName(productName);
    await allPages.orderDetailsPage.assertOrderSummaryProductQuantity('2');
    await allPages.orderDetailsPage.assertOrderSummaryProductPrice(productPrice);
    await allPages.orderDetailsPage.assertOrderSummarySubtotalValue(formattedSubtotal);
    await allPages.orderDetailsPage.assertOrderSummaryShippingValue('Free');
    await allPages.orderDetailsPage.assertOrderSummaryTotalValue(formattedSubtotal);
    await allPages.orderDetailsPage.clickBackToHomeButton();
  });
});

test('Verify that user add product to cart before logging in and then complete order after logging in', {tag: '@firefox'}, async () => {
  await test.step('Navigate and add product to cart before logging in', async () => {
    await allPages.homePage.clickOnShopNowButton();
    await allPages.homePage.clickProductImage();
    await allPages.homePage.clickAddToCartButton();
    await allPages.homePage.validateAddCartNotification();
    await allPages.loginPage.clickOnUserProfileIcon();
  })
  await test.step('Login and complete order', async () => {
    await login();
    await allPages.cartPage.clickOnCartIcon();
    await allPages.cartPage.clickOnCheckoutButton();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCashOnDeliverySelected();
    await allPages.checkoutPage.clickOnPlaceOrder();
    await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
})
});

test('Verify that user can filter products by price range', {tag: '@firefox'}, async () => {
    await login();
    await allPages.homePage.clickOnShopNowButton();
    await allPages.homePage.clickOnFilterButton();
    await allPages.homePage.AdjustPriceRangeSlider('10000', '20000');
    await allPages.homePage.clickOnFilterButton();
});

test('Verify if user can add product to wishlist, moves it to card and then checks out', {tag: '@firefox'}, async () => {
    await login();
  
    await test.step('Add product to wishlistand then add to cart', async () => {
      await allPages.homePage.clickOnShopNowButton();
      await allPages.inventoryPage.addToWishlist();
      await allPages.inventoryPage.assertWishlistIcon();
      await allPages.inventoryPage.clickOnWishlistIconHeader();
      await allPages.inventoryPage.assertWishlistPage();
      await allPages.inventoryPage.clickOnWishlistAddToCard();
    })
  
    await test.step('Checkout product added to cart', async () => {
      await allPages.cartPage.clickOnCartIcon();
      await allPages.cartPage.clickOnCheckoutButton();
      await allPages.checkoutPage.verifyCheckoutTitle();
      await allPages.checkoutPage.selectCashOnDelivery();
      await allPages.checkoutPage.verifyCashOnDeliverySelected();
      await allPages.checkoutPage.clickOnPlaceOrder();
      await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
    })
  
});

test('Verify new user views and cancels an order in my orders', {tag: '@firefox'}, async () => {
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

test('Verify that the new user is able to Sign Up, Log In, and Navigate to the Home Page Successfully', {tag: '@webkit'}, async () => {
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

test('Verify that user is able to fill Contact Us page successfully', {tag: '@webkit'}, async () => {
    await login();
    await allPages.homePage.clickOnContactUsLink();
    await allPages.contactUsPage.assertContactUsTitle();
    await allPages.contactUsPage.fillContactUsForm();
    await allPages.contactUsPage.verifySuccessContactUsFormSubmission();
});

test('Verify that user is able to submit a product review', {tag: '@webkit'}, async () => {
  await test.step('Login as existing user and navigate to a product', async () => {
    await login();
  })

  await test.step('Navigate to all product section and select a product', async () => {
    await allPages.homePage.clickOnShopNowButton();
    await allPages.allProductsPage.assertAllProductsTitle();
    await allPages.allProductsPage.clickNthProduct(1);
  })

  await test.step('Submit a product review and verify submission', async () => {
    await allPages.productDetailsPage.clickOnReviewsTab();
    await allPages.productDetailsPage.assertReviewsTab();
    
    await allPages.productDetailsPage.clickOnWriteAReviewBtn();
    await allPages.productDetailsPage.fillReviewForm();
    await allPages.productDetailsPage.assertSubmittedReview({
        name: 'John Doe',
        title: 'Great Product',
        opinion: 'This product exceeded my expectations. Highly recommend!'
    });
  })
});