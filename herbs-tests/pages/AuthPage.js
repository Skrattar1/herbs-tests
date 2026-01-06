const BasePage = require('./BasePage');

class AuthPage extends BasePage {
    constructor(page) {
        super(page);

        this.selectors = {
            loginForm: 'form[action*="login"], #login-form',
            emailInput: 'input[name="email"], input[type="email"], #email',
            passwordInput: 'input[name="password"], input[type="password"], #password',
            loginButton: 'button[type="submit"]:has-text("Войти"), button:has-text("Вход")',

            registerTab: 'a:has-text("Зарегистрироваться"), button:has-text("Регистрация")',
            registerForm: 'form[action*="register"], #register-form',
            nameInput: 'input[name="name"], input[name="username"], #name',
            phoneInput: 'input[name="phone"], input[type="tel"], #phone',
            confirmPasswordInput: 'input[name="confirmPassword"], input[name="password_confirmation"]',
            registerButton: 'button:has-text("Зарегистрироваться"), button[type="submit"]:has-text("Зарегистрироваться")',

            showRegister: 'text=Зарегистрироваться',
            showLogin: 'text=Войти'
        };
    }

    async openLoginForm() {
        await this.click(this.selectors.header.login);
        await this.waitForSelector(this.selectors.emailInput, { timeout: 5000 });
    }

    async login(email, password) {
        await this.fill(this.selectors.emailInput, email);
        await this.fill(this.selectors.passwordInput, password);
        await this.click(this.selectors.loginButton);
        await this.page.waitForTimeout(2000);
    }

    async openRegistrationForm() {
        await this.openLoginForm();

        // Пробуем найти кнопку переключения на регистрацию
        if (await this.isVisible(this.selectors.registerTab)) {
            await this.click(this.selectors.registerTab);
        } else if (await this.isVisible(this.selectors.showRegister)) {
            await this.click(this.selectors.showRegister);
        }

        await this.waitForSelector(this.selectors.nameInput, { timeout: 5000 });
    }

    async register(userData) {
        await this.fill(this.selectors.emailInput, userData.email);
        await this.fill(this.selectors.passwordInput, userData.password);

        if (await this.isVisible(this.selectors.confirmPasswordInput)) {
            await this.fill(this.selectors.confirmPasswordInput, userData.password);
        }

        if (await this.isVisible(this.selectors.nameInput)) {
            await this.fill(this.selectors.nameInput, userData.name);
        }

        if (await this.isVisible(this.selectors.phoneInput)) {
            await this.fill(this.selectors.phoneInput, userData.phone);
        }

        await this.click(this.selectors.registerButton);
        await this.page.waitForTimeout(3000);
    }

    async isLoggedIn() {
        try {
            const profileVisible = await this.isVisible(this.selectors.header.profile);
            const logoutVisible = await this.isVisible(this.selectors.header.logout);
            return profileVisible || logoutVisible;
        } catch {
            return false;
        }
    }

    async logout() {
        if (await this.isLoggedIn()) {
            try {
                await this.click(this.selectors.header.logout);
                await this.waitForSelector(this.selectors.header.login, { timeout: 5000 });
                return true;
            } catch (error) {
                console.log('Ошибка при выходе:', error.message);
                return false;
            }
        }
        return true;
    }
}

module.exports = AuthPage;