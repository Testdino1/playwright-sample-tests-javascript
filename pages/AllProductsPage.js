import BasePage from './BasePage.js';
import { expect } from '@playwright/test';

class AllProductsPage extends BasePage{

  /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
        super(page);
        this.page = page;
    }

    locators = {
        allProductsTitle: `//h1[text()="All Products"]`,
        nthProduct: `[href*="/product-detail/product"]`,
        nthProductName: `[href*="/product-detail/product"] h2`,
        nthProductPrice: `[href*="/product-detail/product"] p`,
        nthProductReviewCount: `[href*="/product-detail/product"] h2 + div span.text-sm`,
        nthProductWishlistIcon: '[aria-label="heart"]',
        nthProductWishlistIconCount: '.bg-orange-100'
        
    }

    async assertAllProductsTitle() {
        await expect(this.page.locator(this.locators.allProductsTitle)).toBeVisible();
    }

    getNthProduct(n) {
        return this.page.locator(this.locators.nthProduct).nth(n - 1)
    }

    async clickNthProduct(n) {
        await this.getNthProduct(n).click();
    }

    getNthProductName(n) {
        return this.page.locator(this.locators.nthProductName).nth(n - 1).textContent();
    }

    getNthProductPrice(n) {
        return this.page.locator(this.locators.nthProductPrice).nth(n - 1).textContent();
    }

    getNthProductReviewCount(n) {
        return this.page.locator(this.locators.nthProductReviewCount).nth(n - 1).textContent();
    }

    getNthProductWishlistIcon(n) {
        return this.page.locator(this.locators.nthProductWishlistIcon).nth(n - 1)
    }

    async clickNthProductWishlistIcon(n) {
        await this.getNthProduct(n).hover()
        await this.getNthProductWishlistIcon(n).click();
        await expect(this.page.getByText('Added to the wishlist')).toBeVisible();
    }

    getNthProductWishlistIconCount(n) {
        return this.page.locator(this.locators.nthProductWishlistIconCount).nth(n - 1);
    }

}

export default AllProductsPage;