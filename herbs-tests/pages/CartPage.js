const BasePage = require('./BasePage');

class CartPage extends BasePage {
    constructor(page) {
        super(page);

        this.selectors = {
            pageTitle: 'h1:has-text("Корзина"), h2:has-text("Корзина"), .cart-title',

            cartItems: '.cart-items, .basket-items, tbody tr, [class*="cart-item"]',
            cartItem: '.cart-item, .basket-item, tr.item',
            emptyCart: 'text=Корзина пуста, text=Ваша корзина пуста, .empty-cart',

            removeButton: 'button:has-text("Удалить"), .btn-remove, [class*="remove"]',
            increaseButton: 'button:has-text("+"), .btn-increase, .increase',
            decreaseButton: 'button:has-text("-"), .btn-decrease, .decrease',
            quantityInput: 'input[type="number"], .quantity-input, [name*="quantity"]',

            subtotal: '.subtotal, .cart-subtotal, [class*="subtotal"]',
            total: '.total, .cart-total, [class*="total"]',
            discount: '.discount, .coupon, [class*="discount"]',

            couponInput: 'input[name="coupon"], #coupon, .coupon-input',
            applyCoupon: 'button:has-text("Применить"), .apply-coupon',

            agreementCheckbox: 'input[type="checkbox"][name="agreement"], #agreement, [name*="agree"]',
            agreementLabel: 'label:has-text("соглашение"), label:has-text("согласен")',

            checkoutButton: 'button:has-text("Оформить заказ"), button:has-text("Перейти к оплате"), .checkout',
            continueShopping: 'a:has-text("Продолжить покупки"), .continue-shopping',
            clearCart: 'button:has-text("Очистить корзину"), .clear-cart',

            deliveryOptions: '.delivery-options, [name*="delivery"]',
            addressInput: 'input[name="address"], #address, [name*="address"]'
        };
    }

    async open() {
        await this.click(this.selectors.header.cart);
        try {
            await this.waitForSelector(this.selectors.pageTitle, { timeout: 5000 });
        } catch {
        }
    }

    async getCartItems() {
        if (await this.isEmpty()) {
            return [];
        }
        return await this.page.locator(this.selectors.cartItem).all();
    }

    async getItemCount() {
        if (await this.isEmpty()) {
            return 0;
        }
        return await this.getCount(this.selectors.cartItem);
    }

    async isEmpty() {
        return await this.isVisible(this.selectors.emptyCart);
    }

    async acceptAgreement() {
        if (await this.isVisible(this.selectors.agreementCheckbox)) {
            const checkbox = this.page.locator(this.selectors.agreementCheckbox);
            if (!await checkbox.isChecked()) {
                await checkbox.check();
                return true;
            }
        } else if (await this.isVisible(this.selectors.agreementLabel)) {
            await this.click(this.selectors.agreementLabel);
            return true;
        }
        return false;
    }

    async proceedToCheckout() {
        if (await this.isVisible(this.selectors.checkoutButton)) {
            await this.click(this.selectors.checkoutButton);
            await this.page.waitForTimeout(3000);
            return true;
        }
        return false;
    }

    async updateQuantity(itemIndex = 0, quantity) {
        const items = await this.getCartItems();
        if (items.length > itemIndex) {
            const qtyInput = items[itemIndex].locator(this.selectors.quantityInput);
            const increaseBtn = items[itemIndex].locator(this.selectors.increaseButton);

            if (await qtyInput.isVisible()) {
                await qtyInput.fill(quantity.toString());
                await this.page.waitForTimeout(500);
                return true;
            } else if (await increaseBtn.isVisible()) {
                const currentQty = await this.getCurrentQuantity(itemIndex);
                const clicksNeeded = quantity - currentQty;

                if (clicksNeeded > 0) {
                    for (let i = 0; i < clicksNeeded; i++) {
                        await increaseBtn.click();
                        await this.page.waitForTimeout(200);
                    }
                }
                return true;
            }
        }
        return false;
    }

    async getCurrentQuantity(itemIndex = 0) {
        const items = await this.getCartItems();
        if (items.length > itemIndex) {
            const qtyInput = items[itemIndex].locator(this.selectors.quantityInput);
            if (await qtyInput.isVisible()) {
                const value = await qtyInput.inputValue();
                return parseInt(value) || 1;
            }
        }
        return 1;
    }

    async removeItem(itemIndex = 0) {
        const items = await this.getCartItems();
        if (items.length > itemIndex) {
            const removeBtn = items[itemIndex].locator(this.selectors.removeButton);
            if (await removeBtn.isVisible()) {
                await removeBtn.click();
                await this.page.waitForTimeout(1000);
                return true;
            }
        }
        return false;
    }

    async clearCart() {
        if (await this.isVisible(this.selectors.clearCart)) {
            await this.click(this.selectors.clearCart);
            await this.page.waitForTimeout(1000);
            return true;
        }
        return false;
    }

    async applyCoupon(code) {
        if (await this.isVisible(this.selectors.couponInput)) {
            await this.fill(this.selectors.couponInput, code);
            await this.click(this.selectors.applyCoupon);
            await this.page.waitForTimeout(1000);
            return true;
        }
        return false;
    }

    async getTotalPrice() {
        try {
            const totalText = await this.getText(this.selectors.total);
            const match = totalText.match(/[\d\s]+[.,]\d+/);
            return match ? parseFloat(match[0].replace(/\s/g, '').replace(',', '.')) : 0;
        } catch {
            return 0;
        }
    }

    async isCheckoutAvailable() {
        return await this.isVisible(this.selectors.checkoutButton) &&
            !await this.isEmpty();
    }
}

module.exports = CartPage;