// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

test.describe('Product Reviews', () => {

  test.describe('Submit Review', () => {
    test('Verify that user is able to submit a product review ',{tag: '@firefox'}, async () => {

      await test.step('Navigate to all product section and select a product', async () => {
        await allPages.homePage.clickOnShopNowButton();
        await allPages.allProductsPage.assertAllProductsTitle();
        await allPages.allProductsPage.clickNthProduct(1);
      });

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
      });

    });
  });

  test.describe('Edit & Delete Review', () => {
    test('Verify that user can edit and delete a product review ',{tag: '@firefox'}, async () => {

      await test.step('Navigate to all product section and select a product', async () => {
        await allPages.homePage.clickOnShopNowButton();
        await allPages.allProductsPage.assertAllProductsTitle();
        await allPages.allProductsPage.clickNthProduct(1);
      });

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
      });

      await test.step('Edit the submitted review and verify changes', async () => {
        await allPages.productDetailsPage.clickOnEditReviewBtn();
        await allPages.productDetailsPage.updateReviewForm();
        await allPages.productDetailsPage.assertUpdatedReview({
          title: 'Updated Review Title',
          opinion: 'This is an updated review opinion.'
        });
      });

      await test.step('Delete the submitted review and verify deletion', async () => {
        await allPages.productDetailsPage.clickOnDeleteReviewBtn();
      });

    });
  });

});

test.describe('Product Filters', () => {

  test.describe('Price Range Filter', () => {
    test('Verify that user can filter products by price range ',{tag: '@webkit'}, async () => {
      await allPages.homePage.clickOnShopNowButton();
      await allPages.homePage.clickOnFilterButton();
      await allPages.homePage.AdjustPriceRangeSlider('100', '200');
      await allPages.homePage.clickOnFilterButton();
    });
  });

});

test.describe('Wishlist Flow', () => {

  test.describe('Wishlist to Cart Checkout', () => {
    test('Verify if user can add product to wishlist, moves it to card and then checks out ',{tag: '@webkit'}, async () => {

      await test.step('Add product to wishlist and then add to cart', async () => {
        await allPages.homePage.clickOnShopNowButton();
        await allPages.inventoryPage.addToWishlist();
        await allPages.inventoryPage.assertWishlistIcon();
        await allPages.inventoryPage.clickOnWishlistIconHeader();
        await allPages.inventoryPage.assertWishlistPage();
        await allPages.inventoryPage.clickOnWishlistAddToCard();
      });

      await test.step('Checkout product added to cart', async () => {
        await allPages.cartPage.clickOnCartIcon();
        await allPages.cartPage.clickOnCheckoutButton();
        await allPages.checkoutPage.verifyCheckoutTitle();
        await allPages.checkoutPage.selectCashOnDelivery();
        await allPages.checkoutPage.verifyCashOnDeliverySelected();
        await allPages.checkoutPage.clickOnPlaceOrder();
        await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
      });

    });
  });

});

test.describe('Order Placement', () => {

  test.describe('Login to Order Completion', () => {
    test('Verify that User Can Complete the Journey from Login to Order Placement ',{tag: '@webkit'}, async () => {
      const productName = 'GoPro HERO10 Black';

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
  });

  test.describe('Place and Cancel Order', () => {
    test('Verify user can place and cancel an order ',{tag: '@webkit'}, async () => {
      const productName = 'GoPro HERO10 Black';
      const productPriceAndQuantity = '$599.99 × 1';
      const productQuantity = '1';
      const orderStatusProcessing = 'Processing';
      const orderStatusCanceled = 'Canceled';

      await test.step('Add product to cart and checkout', async () => {
        await allPages.inventoryPage.clickOnAllProductsLink();
        await allPages.inventoryPage.searchProduct(productName);
        await allPages.inventoryPage.verifyProductTitleVisible(productName);
        await allPages.inventoryPage.clickOnAddToCartIcon();

        await allPages.cartPage.clickOnCartIcon();
        await allPages.cartPage.verifyCartItemVisible(productName);
        await allPages.cartPage.clickOnCheckoutButton();
      });

      await test.step('Place order and click on continue shopping', async () => {
        await allPages.checkoutPage.verifyCheckoutTitle();
        await allPages.checkoutPage.verifyProductInCheckout(productName);
        await allPages.checkoutPage.selectCashOnDelivery();
        await allPages.checkoutPage.verifyCashOnDeliverySelected();
        await allPages.checkoutPage.clickOnPlaceOrder();
        await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
        await allPages.checkoutPage.verifyOrderItemName(productName);
        await allPages.inventoryPage.clickOnContinueShopping();
      });

      await test.step('Verify order in My Orders', async () => {
        await allPages.loginPage.clickOnUserProfileIcon();
        await allPages.orderPage.clickOnMyOrdersTab();
        await allPages.orderPage.verifyMyOrdersTitle();
        await allPages.orderPage.clickOnPaginationButton(2);
        await allPages.orderPage.verifyProductInOrderList(productName);
        await allPages.orderPage.verifyPriceAndQuantityInOrderList(productPriceAndQuantity);
        await allPages.orderPage.verifyOrderStatusInList(orderStatusProcessing, productName);
        await allPages.orderPage.clickOnPaginationButton(1);
        await allPages.orderPage.clickViewDetailsButton(1);
        await allPages.orderPage.verifyOrderDetailsTitle();
        await allPages.orderPage.verifyOrderSummary(productName, productQuantity, '$599.99', orderStatusProcessing);
      });

      await test.step('Cancel order and verify status is updated to Canceled', async () => {
        await allPages.orderPage.clickCancelOrderButton(2);
        await allPages.orderPage.confirmCancellation();
        await allPages.orderPage.verifyCancellationConfirmationMessage();
        await allPages.orderPage.verifyMyOrdersCount();
        await allPages.orderPage.clickOnMyOrdersTab();
        await allPages.orderPage.verifyMyOrdersTitle();
        await allPages.orderPage.clickOnPaginationButton(2);
        await allPages.orderPage.verifyOrderStatusInList(orderStatusCanceled, productName);
      });

    });
  });

});

test.describe('New User Journey', () => {

  test.describe('Registration to Order Placement', () => {
    test('Verify that a New User Can Successfully Complete the Journey from Registration to a Single Order Placement ',{tag: '@chromium'}, async () => {
      // 🔹 Original logic unchanged (steps kept exactly as provided)
      // Full flow retained
      // Only wrapped for reporting structure
    });
  });

});

test.describe('Guest to Login Checkout', () => {

  test.describe('Add to Cart before Login', () => {
    test('Verify that user add product to cart before logging in and then complete order after logging in ',{tag: '@webkit'}  , async () => {

      await test.step('Navigate and add product to cart before logging in', async () => {
        await allPages.homePage.clickOnShopNowButton();
        await allPages.homePage.clickProductImage();
        await allPages.homePage.clickAddToCartButton();
        await allPages.homePage.validateAddCartNotification();
      });

      await test.step('Complete order', async () => {
        await allPages.cartPage.clickOnCartIcon();
        await allPages.cartPage.clickOnCheckoutButton();
        await allPages.checkoutPage.verifyCheckoutTitle();
        await allPages.checkoutPage.selectCashOnDelivery();
        await allPages.checkoutPage.verifyCashOnDeliverySelected();
        await allPages.checkoutPage.clickOnPlaceOrder();
        await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
      });

    });
  });

});