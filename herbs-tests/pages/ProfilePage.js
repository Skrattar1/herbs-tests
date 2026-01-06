const BasePage = require('./BasePage');

class ProfilePage extends BasePage {
    constructor(page) {
        super(page);

        this.selectors = {
            pageTitle: 'h1:has-text("Профиль"), h1:has-text("Мой профиль"), h2:has-text("Профиль")',
            profileMenu: '.profile-menu, .user-nav, [class*="profile"]',

            profileForm: 'form[action*="profile"], #profile-form, .profile-form',
            nameInput: 'input[name="name"], #name, [name="name"]',
            emailInput: 'input[name="email"], #email, [name="email"]',
            phoneInput: 'input[name="phone"], #phone, [name="phone"]',
            birthDateInput: 'input[name="birthDate"], #birthDate, [type="date"]',
            addressInput: 'textarea[name="address"], input[name="address"], #address',

            saveButton: 'button:has-text("Сохранить"), button[type="submit"]',
            editButton: 'button:has-text("Редактировать"), .btn-edit, #edit-profile',
            cancelButton: 'button:has-text("Отмена"), .btn-cancel',
            changePasswordLink: 'a:has-text("Сменить пароль"), .change-password',

            tabPersonal: 'a:has-text("Личные данные"), [href*="personal"]',
            tabOrders: 'a:has-text("Мои заказы"), [href*="orders"]',
            tabAddresses: 'a:has-text("Адреса"), [href*="addresses"]'
        };
    }

    async open() {
        await this.click(this.selectors.header.profile);
        await this.waitForSelector(this.selectors.pageTitle, { timeout: 10000 });
    }

    async openPersonalData() {
        await this.open();
        if (await this.isVisible(this.selectors.tabPersonal)) {
            await this.click(this.selectors.tabPersonal);
            await this.page.waitForTimeout(1000);
        }
    }

    async openEditMode() {
        if (await this.isVisible(this.selectors.editButton)) {
            await this.click(this.selectors.editButton);
            await this.page.waitForTimeout(1000);
            return true;
        }
        return false;
    }

    async updateProfile(data) {
        await this.openPersonalData();

        if (!await this.isVisible(this.selectors.saveButton)) {
            await this.openEditMode();
        }

        if (data.name && await this.isVisible(this.selectors.nameInput)) {
            await this.fill(this.selectors.nameInput, data.name);
        }

        if (data.phone && await this.isVisible(this.selectors.phoneInput)) {
            await this.fill(this.selectors.phoneInput, data.phone);
        }

        if (data.email && await this.isVisible(this.selectors.emailInput)) {
            await this.fill(this.selectors.emailInput, data.email);
        }

        if (data.address && await this.isVisible(this.selectors.addressInput)) {
            await this.fill(this.selectors.addressInput, data.address);
        }

        await this.click(this.selectors.saveButton);
        await this.page.waitForTimeout(2000);

        return await this.isSuccessMessageVisible();
    }

    async getProfileData() {
        await this.openPersonalData();

        const data = {};

        if (await this.isVisible(this.selectors.nameInput)) {
            data.name = await this.page.locator(this.selectors.nameInput).inputValue();
        }

        if (await this.isVisible(this.selectors.emailInput)) {
            data.email = await this.page.locator(this.selectors.emailInput).inputValue();
        }

        if (await this.isVisible(this.selectors.phoneInput)) {
            data.phone = await this.page.locator(this.selectors.phoneInput).inputValue();
        }

        return data;
    }

    async isSuccessMessageVisible() {
        return await this.isVisible(this.selectors.successMessage);
    }

    async openOrders() {
        await this.open();
        if (await this.isVisible(this.selectors.tabOrders)) {
            await this.click(this.selectors.tabOrders);
            await this.page.waitForTimeout(1000);
            return true;
        }
        return false;
    }

    async openAddresses() {
        await this.open();
        if (await this.isVisible(this.selectors.tabAddresses)) {
            await this.click(this.selectors.tabAddresses);
            await this.page.waitForTimeout(1000);
            return true;
        }
        return false;
    }
}

module.exports = ProfilePage;