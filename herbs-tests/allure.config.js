module.exports = {
    outputFolder: 'allure-results',
    reportFolder: 'allure-report',
    categories: [
        {
            name: 'Product defects',
            messageRegex: '.*AssertionError.*',
            matchedStatuses: ['failed']
        },
        {
            name: 'Test defects',
            messageRegex: '.*TimeoutError.*',
            matchedStatuses: ['broken']
        },
        {
            name: 'Skipped tests',
            matchedStatuses: ['skipped']
        },
        {
            name: 'Passed tests',
            matchedStatuses: ['passed']
        }
    ],
    environmentInfo: {
        test_project: 'Herbs E-commerce',
        site_url: 'https://herb.tproject.su/web/',
        tester: 'Automation QA',
        platform: process.platform,
        node_version: process.version,
        playwright_version: require('@playwright/test/package.json').version
    }
};