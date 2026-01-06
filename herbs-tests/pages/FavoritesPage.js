const BasePage = require('./BasePage');

class FavoritesPage extends BasePage {
    constructor(page) {
        super(page);

        this.selectors = {
            pageTitle: 'h1:has-text("Избранное"), h2:has-text("Избранное"), .favorites-title',

            favoritesList: '.favorites-list, .wishlist-items, [class*="favorites"]',
            favoriteItem: '.favorite-item, .wishlist-item, [class*="item-"]',
            emptyFavorites: 'text=Избранное пусто, text=Нет избранных товаров, .empty-favorites',

            removeButton: 'button:has-text("Удалить"), .btn-remove, [class*="remove"]',
            addToCartButton: 'button:has-text("В корзину"), .btn-cart',
            moveAllToCart: 'button:has-text("Всё в корзину"), .move-all-cart',
            clearAll: 'button:has-text("Очистить всё"), .clear-all',

            pagination: '.pagination, .page-numbers',
            page2Button: 'a:has-text("2"), button:has-text("2")',
            nextPage: 'a:has-text("›"), a:has-text(">"), .next-page',

            itemName: '.item-name, .product-name, [class*="name"]',
            itemPrice: '.item-price, .price, [class*="price"]',
            itemImage: '.item-image, .product-image, img'
        };
    }

    async open() {
        await this.click(this.selectors.header.favorites);
        try {
            await this.waitForSelector(this.selectors.pageTitle, { timeout: 5000 });
        } catch {
        }
    }

    async getFavoriteItems() {
        if (await this.isEmpty()) {
            return [];
        }
        return await this.page.locator(this.selectors.favoriteItem).all();
    }

    async getFavoritesCount() {
        if (await this.isEmpty()) {
            return 0;
        }
        return await this.getCount(this.selectors.favoriteItem);
    }

    async isEmpty() {
        return await this.isVisible(this.selectors.emptyFavorites);
    }

    async addToCartFromFavorites(itemIndex = 0) {
        const items = await this.getFavoriteItems();
        if (items.length > itemIndex) {
            const addButton = items[itemIndex].locator(this.selectors.addToCartButton);
            if (await addButton.isVisible()) {
                await addButton.click();
                await this.page.waitForTimeout(500);
                return true;
            }
        }
        return false;
    }

    async removeFromFavorites(itemIndex = 0) {
        const items = await this.getFavoriteItems();
        if (items.length > itemIndex) {
            const removeButton = items[itemIndex].locator(this.selectors.removeButton);
            if (await removeButton.isVisible()) {
                await removeButton.click();
                await this.page.waitForTimeout(500);
                return true;
            }
        }
        return false;
    }

    async goToPage2() {
        if (await this.isVisible(this.selectors.page2Button)) {
            await this.click(this.selectors.page2Button);
            await this.waitForLoad();
            return true;
        } else if (await this.isVisible(this.selectors.nextPage)) {
            await this.click(this.selectors.nextPage);
            await this.waitForLoad();
            return true;
        }
        return false;
    }

    async addMultipleToCart(count = 3) {
        const items = await this.getFavoriteItems();
        const toAdd = Math.min(items.length, count);
        let added = 0;

        for (let i = 0; i < toAdd; i++) {
            if (await this.addToCartFromFavorites(i)) {
                added++;
                await this.page.waitForTimeout(300);
            }
        }

        return added;
    }

    async clearAllFavorites() {
        if (await this.isVisible(this.selectors.clearAll)) {
            await this.click(this.selectors.clearAll);
            await this.page.waitForTimeout(1000);
            return true;
        }
        return false;
    }

    async moveAllToCart() {
        if (await this.isVisible(this.selectors.moveAllToCart)) {
            await this.click(this.selectors.moveAllToCart);
            await this.page.waitForTimeout(1000);
            return true;
        }
        return false;
    }
}

module.exports = FavoritesPage;