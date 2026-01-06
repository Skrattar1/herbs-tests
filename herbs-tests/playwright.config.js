// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 120000,
    expect: {
        timeout: 10000
    },
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: 1,
    workers: 3,
    reporter: [
        ['list'],
        ['html', {
            outputFolder: 'playwright-report',
            open: 'never'
        }],
        ['allure-playwright', {
            detail: true,
            outputFolder: 'allure-results',
            suiteTitle: true
        }]
    ],

    use: {
        headless: false,
        actionTimeout: 15000,
        navigationTimeout: 30000,
        baseURL: 'https://herb.tproject.su/web/',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
        ignoreHTTPSErrors: true,
    },
});