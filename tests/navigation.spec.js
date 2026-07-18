// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

test.describe('Navigation Module', () => {
  test.describe('Navbar Validation', () => {
    test('Verify that all the navbar are working properly ',{tag: '@firefox'}, async () => {
      await allPages.homePage.clickBackToHomeButton();
      // await allPages.homePage.assertHomePage();
      await allPages.homePage.clickAllProductsNav();
      await allPages.allProductsPage.assertAllProductsTitle();
      await allPages.homePage.clickOnContactUsLink();
      await allPages.contactUsPage.assertContactUsTitle();
      
      await allPages.homePage.clickAboutUsNav();
      await allPages.homePage.assertAboutUsTitle();
    });
  });
});

test.describe('Contact Us Module', () => {
  test.describe('Contact Form Submission', () => {
    test('Verify that user is able to fill Contact Us page successfully ',{tag: '@firefox'}, async () => {
      await allPages.homePage.clickOnContactUsLink();
      await allPages.contactUsPage.assertContactUsTitle();
      await allPages.contactUsPage.fillContactUsForm();
      await allPages.contactUsPage.verifySuccessContactUsFormSubmission();
    });
  });
});

test.describe('User Settings', () => {
  test.describe('Change Password Flow', () => {
    test('Verify that user can change password successfully ',{tag: '@ios'}, async () => {

      await test.step('Change password and verify notification', async () => {
        await allPages.userPage.clickOnUserProfileIcon();
        await allPages.userPage.clickOnSecurityButton();
        await allPages.userPage.enterNewPassword();
        await allPages.userPage.enterConfirmNewPassword();
        await allPages.userPage.clickOnUpdatePasswordButton();
        await allPages.userPage.getUpdatePasswordNotification();
      });

      await test.step('Revert back to original password', async () => {
        await allPages.userPage.clickOnUserProfileIcon();
        await allPages.userPage.clickOnSecurityButton();
        await allPages.userPage.revertPasswordBackToOriginal();
        await allPages.userPage.getUpdatePasswordNotification();
      });

    });
  });
});
