const { test, expect } = require('@playwright/test');

test.describe('E2E для Herbs', () => {

    test('E2E сценарий', async ({ page }) => {
        test.setTimeout(180000); // 3 минуты

        console.log('=== Начало E2E теста ===');

        //Открытие сайта
        await test.step('1. Открытие сайта', async () => {
            await page.goto('https://herb.tproject.su/web/');
            console.log('Сайт открыт');

            const title = await page.title();
            console.log(`Заголовок: ${title}`);

            try {
                const cookieBtn = page.locator('button:has-text("Окей")');
                if (await cookieBtn.isVisible({ timeout: 3000 })) {
                    await cookieBtn.click();
                    console.log('Куки приняты');
                }
            } catch {}
        });

        //Проверка каталога
        await test.step('2. Проверка каталога', async () => {
            await page.waitForSelector('button:has-text("В корзину")', { timeout: 15000 });
            const products = await page.locator('button:has-text("В корзину")').count();
            console.log(`Найдено товаров: ${products}`);
            expect(products).toBeGreaterThan(0);
        });

        //Добавление в корзину (без авторизации)
        await test.step('3. Добавление в корзину', async () => {
            const addButtons = page.locator('button:has-text("В корзину")');
            const toAdd = Math.min(2, await addButtons.count());

            for (let i = 0; i < toAdd; i++) {
                await addButtons.nth(i).click();
                console.log(`  Добавлен товар ${i+1} в корзину`);
                await page.waitForTimeout(1000);
            }

            console.log(`Добавлено ${toAdd} товаров в корзину`);

            const cartLink = page.locator('a:has-text("Корзина")');
            await cartLink.click();
            await page.waitForLoadState('networkidle');

            const url = page.url();
            const pageText = await page.textContent('body');

            if (url.includes('cart') || pageText.includes('Корзина')) {
                console.log('Успешно перешли в корзину');

                const cartItems = page.locator('.cart-item, tr, [class*="item"]');
                const itemCount = await cartItems.count();

                if (itemCount > 0) {
                    console.log(`В корзине ${itemCount} товар(ов)`);

                    const agreementCheckbox = page.locator('input[type="checkbox"][name="agreement"], #agreement');
                    if (await agreementCheckbox.isVisible({ timeout: 3000 })) {
                        if (!await agreementCheckbox.isChecked()) {
                            await agreementCheckbox.check();
                            console.log('✓ Соглашение принято');
                        }
                    }

                    const checkoutBtn = page.locator('button:has-text("Оформить"), button:has-text("Оплата")');
                    if (await checkoutBtn.isVisible({ timeout: 3000 })) {
                        await checkoutBtn.click();
                        await page.waitForTimeout(2000);

                        const newUrl = page.url();
                        if (newUrl !== url) {
                            console.log('✓ Перешли к оформлению заказа');
                        }
                    }
                }
            }
        });

        console.log('E2E тест завершен успешно');
    });
});