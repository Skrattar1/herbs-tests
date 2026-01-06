const { test, expect } = require('@playwright/test');
const axios = require('axios');
const testData = require('../../helpers/test-data');

const API_BASE = 'https://herb.tproject.su/web/api';

test.describe('API тесты авторизации', () => {
    let user;

    test.beforeEach(() => {
        user = testData.generateUser();
    });

    test('Регистрация пользователя', async ({ request }) => {
        const response = await request.post(`${API_BASE}/auth/register`, {
            data: {
                email: user.email,
                password: user.password,
                name: user.name,
                phone: user.phone
            }
        });

        expect(response.status()).toBeLessThan(500);
        const body = await response.json();

        if (response.status() === 200 || response.status() === 201) {
            expect(body).toHaveProperty('success', true);
        } else if (response.status() === 400) {
            console.log('Регистрация вернула 400:', body);
        }
    });

    test('Авторизация и разлогин', async ({ request }) => {
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

        expect(loginResponse.status()).toBe(200);
        const loginBody = await loginResponse.json();
        expect(loginBody).toHaveProperty('token');
        const logoutResponse = await request.post(`${API_BASE}/auth/logout`, {
            headers: {
                'Authorization': `Bearer ${loginBody.token}`
            }
        });

        expect(logoutResponse.status()).toBeLessThan(500);
    });
});