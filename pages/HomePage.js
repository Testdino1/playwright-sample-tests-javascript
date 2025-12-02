import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class HomePage extends BasePage{

  /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        navbar: {
            homeNav: `//li[text()="Home"]`,
            aboutUsNav: `//li[text()="About Us"]`,
            contactUsNav: `//li[text()="Contact Us"]`,
            allProductsNav: `//li[text()="All Products"]`,
            showNowButton: `//a[@href="/products"]/button[text()="Shop Now"]`,
            ProductImage: `img[src="/products/Speaker.png"][alt="JBL Charge 4 Bluetooth Speaker"]`,
            addToCartButton: `[data-testid="add-to-cart-button"]`,
            AddCartNotification: `div[role="status"][aria-live="polite"]:has-text("Added to the cart")`,
            priceRangeSlider2 : `[data-testid="all-products-price-range-input-1"]`,
            priceRangeSlider1 : `[data-testid="all-products-price-range-input-0"]`,
            filterButton : `[data-testid="all-products-filter-toggle"]`,
            aboutUsTitle: `[data-testid="about-us-title"]`,
        }
    }

    async clickOnFilterButton() {
        await this.page.locator(this.locators.navbar.filterButton).click();
    }

    async AdjustPriceRangeSlider(minPrice, maxPrice) {
        await this.page.locator(this.locators.navbar.priceRangeSlider1).fill(minPrice);
        await this.page.locator(this.locators.navbar.priceRangeSlider2).fill(maxPrice);
    }

    async clickOnShopNowButton() {
        await this.page.locator(this.locators.navbar.showNowButton).click();
    }

    getProductImage() {
        return this.page.locator(this.locators.navbar.ProductImage);
    }

    async clickProductImage() {
        await this.getProductImage().click();
    }

    getAddToCartButton() {
        return this.page.locator(this.locators.navbar.addToCartButton);
    }
    
    async clickAddToCartButton() {
        await this.getAddToCartButton().click();
    }

    getAddCartNotification() {
        return this.page.locator(this.locators.navbar.AddCartNotification);
    }

    async validateAddCartNotification() {
        await expect(this.getAddCartNotification()).toBeVisible();
    }

    getHomeNav() {
        return this.page.locator(this.locators.navbar.homeNav).first();
    }

    getAboutUsNav() {
        return this.page.locator(this.locators.navbar.aboutUsNav).first();
    }

    getContactUsNav() {
        return this.page.locator(this.locators.navbar.contactUsNav).first();
    }

    getAllProductsNav() {
        return this.page.locator(this.locators.navbar.allProductsNav).first();
    }

    async clickAllProductsNav() {
        await this.getAllProductsNav().click();
    }

    getShowNowButton() {
        return this.page.locator(this.locators.navbar.showNowButton);
    }

    async clickOnContactUsLink() {
        await this.getContactUsNav().click();
    }

    async clickBackToHomeButton() {
        await this.getHomeNav().click();
    }

    async assertHomePage() {
        await expect(this.page.locator(this.locators.navbar.homeNav)).toBeVisible({ timeout: 10000 });
    }

    async clickAboutUsNav() {
        await this.getAboutUsNav().click();
    }
    
    async assertAboutUsTitle() {
        await expect(this.page.locator(this.locators.navbar.aboutUsTitle)).toBeVisible({ timeout: 10000 });
    }
}

export default HomePage;