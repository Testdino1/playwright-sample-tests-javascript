// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

test.describe('Address Module', () => {

  test.describe('Add, Edit & Delete Address', () => {
    test('Verify that User Can Add, Edit, and Delete Addresses after Logging In ',{tag: '@ios'}, async () => {

      await test.step('Verify that user is able to add address successfully', async () => {
        await allPages.userPage.clickOnUserProfileIcon();
        await allPages.userPage.clickOnAddressTab();
        await allPages.userPage.clickOnAddAddressButton();
        await allPages.userPage.fillAddressForm();
        await allPages.userPage.verifytheAddressIsAdded();
      });

      await test.step('Verify that user is able to edit address successfully', async () => {
        await allPages.userPage.clickOnEditAddressButton();
        await allPages.userPage.updateAddressForm();
        await allPages.userPage.verifytheUpdatedAddressIsAdded();
      });

      await test.step('Verify that user is able to delete address successfully', async () => {
        await allPages.userPage.clickOnDeleteAddressButton();
      });
    });
  });

  test.describe('Add Address for New User', () => {
    test('Verify that the New User is able to add Addresses in the Address section ',{tag: '@andriod'}, async () => {
      await allPages.userPage.clickOnUserProfileIcon();
      await allPages.userPage.clickOnAddressTab();
      await allPages.userPage.clickOnAddAddressButton();
      await allPages.userPage.checkAddNewAddressMenu();
      await allPages.userPage.fillAddressForm();
    });
  });

});

test.describe('Order Placement', () => {

  test.describe('Multiple Quantity Purchase', () => {
    test('Verify that user can purchase multiple quantities in a single order ',{tag: '@andriod'}, async () => {
      const productName = 'GoPro HERO10 Black';

      await allPages.inventoryPage.clickOnShopNowButton();
      await allPages.inventoryPage.clickOnAllProductsLink();
      await allPages.inventoryPage.searchProduct(productName);
      await allPages.inventoryPage.verifyProductTitleVisible(productName);
      await allPages.inventoryPage.clickOnAddToCartIcon();

      await allPages.cartPage.clickOnCartIcon();
      await allPages.cartPage.verifyCartItemVisible(productName);
      await allPages.cartPage.clickIncreaseQuantityButton();
      await allPages.cartPage.verifyIncreasedQuantity('3');
      await allPages.cartPage.clickOnCheckoutButton();
      await allPages.checkoutPage.verifyCheckoutTitle();
      await allPages.checkoutPage.verifyProductInCheckout(productName);
      await allPages.checkoutPage.selectCashOnDelivery();
      await allPages.checkoutPage.verifyCashOnDeliverySelected();
      await allPages.checkoutPage.clickOnPlaceOrder();
      await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
    });
  });

});
