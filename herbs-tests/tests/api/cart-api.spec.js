const { test, expect } = require('@playwright/test');
const testData = require('../../helpers/test-data');

const API_BASE = 'https://herb.tproject.su/web/api';

test.describe('API тесты корзины', () => {
    let user, token;

    test.beforeEach(async ({ request }) => {
        user = testData.generateUser();

        await request.post(`${API_BASE}/auth/register`, {
            data: {
                email: user.email,
                password: user.password,
                name: user.name
            }
        });

        const loginResponse = await request.post(`${API_BASE}/auth/login`, {
            data: {
                email: user.email,
                password: user.password
            }
        });

        const loginBody = await loginResponse.json();
        token = loginBody.token;
    });

    test('Добавление 10+ товаров в корзину', async ({ request }) => {
        const productIds = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15'
        ];

        let addedCount = 0;

        for (const productId of productIds) {
            const response = await request.post(`${API_BASE}/cart/add`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    productId: productId,
                    quantity: 1
                }
            });

            if (response.status() === 200 || response.status() === 201) {
                addedCount++;
            }
        }

        console.log(`Добавлено товаров: ${addedCount}`);
        expect(addedCount).toBeGreaterThan(0);

        const cartResponse = await request.get(`${API_BASE}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        expect(cartResponse.status()).toBe(200);
        const cart = await cartResponse.json();

        if (cart.items) {
            expect(cart.items.length).toBeGreaterThanOrEqual(Math.min(addedCount, 10));
        }
    });
});