const BasePage = require('./BasePage');

class CatalogPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async addToCart(productIndex = 0) {
        const buttons = this.page.locator('button:has-text("В корзину")');
        const count = await buttons.count();

        if (count > productIndex) {
            await buttons.nth(productIndex).click();
            await this.page.waitForTimeout(1000);
            return true;
        }
        return false;
    }

    async addMultipleToCart(count = 2) {
        const buttons = this.page.locator('button:has-text("В корзину")');
        const available = await buttons.count();
        const toAdd = Math.min(available, count);

        let added = 0;
        for (let i = 0; i < toAdd; i++) {
            await buttons.nth(i).click();
            added++;
            await this.page.waitForTimeout(1000);
        }

        return added;
    }

    async getCartCount() {
        try {
            const cartLink = this.page.locator('a:has-text("Корзина")');
            const text = await cartLink.textContent();
            const match = text.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
        } catch {
            return 0;
        }
    }
}

module.exports = CatalogPage;