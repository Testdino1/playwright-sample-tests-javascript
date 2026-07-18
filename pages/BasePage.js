import { Page } from '@playwright/test';

class BasePage {
    /**
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
    }

    async navigateTo(url) {
        await this.page.goto(url);
    }

    async getPageTitle() {
        return await this.page.title();
    }
}

export default BasePage;