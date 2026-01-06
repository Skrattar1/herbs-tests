class BasePage {
    constructor(page) {
        this.page = page;

        this.selectors = {
            header: {
                logo: 'a:has-text("Herbs"), .logo',
                catalog: 'a:has-text("Каталог")',
                about: 'a:has-text("О нас")',
                news: 'a:has-text("Новости")',
                favorites: 'a:has-text("Избранное")',
                cart: 'a:has-text("Корзина")',
                login: 'a:has-text("Войти")',
                profile: 'a:has-text("Мой профиль"), a:has-text("Профиль")',
                logout: 'button:has-text("Выйти"), a:has-text("Выйти")'
            },

            cookieAccept: 'button:has-text("Окей"), button:has-text("Принять")',
            successMessage: '.alert-success, .message-success, [class*="success"]',
            errorMessage: '.alert-error, .message-error, [class*="error"]'
        };
    }

    async goto(url) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
        await this.acceptCookies();
    }

    async acceptCookies() {
        try {
            const cookieBtn = this.page.locator(this.selectors.cookieAccept);
            if (await cookieBtn.isVisible({ timeout: 3000 })) {
                await cookieBtn.click();
            }
        } catch (error) {
            // Если нет кнопки - продолжаем
        }
    }

    async waitForLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async click(selector) {
        await this.page.locator(selector).first().click();
    }

    async fill(selector, text) {
        await this.page.locator(selector).fill(text);
    }

    async waitForSelector(selector, options = {}) {
        await this.page.waitForSelector(selector, options);
    }

    async isVisible(selector) {
        try {
            return await this.page.locator(selector).isVisible({ timeout: 3000 });
        } catch {
            return false;
        }
    }

    async getText(selector) {
        try {
            return await this.page.locator(selector).textContent();
        } catch {
            return '';
        }
    }

    async getCount(selector) {
        return await this.page.locator(selector).count();
    }
}

module.exports = BasePage;