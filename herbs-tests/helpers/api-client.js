const axios = require('axios');

class ApiClient {
    constructor(baseURL = 'https://herb.tproject.su/web') {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async register(userData) {
        try {
            const endpoints = ['/api/auth/register', '/auth/register', '/register'];

            for (const endpoint of endpoints) {
                try {
                    const response = await this.client.post(endpoint, userData);
                    return { success: true, data: response.data };
                } catch (error) {
                    continue;
                }
            }

            return { success: false, error: 'Не удалось зарегистрироваться' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    async login(credentials) {
        try {
            const endpoints = ['/api/auth/login', '/auth/login', '/login'];

            for (const endpoint of endpoints) {
                try {
                    const response = await this.client.post(endpoint, credentials);
                    return { success: true, data: response.data };
                } catch (error) {
                    continue;
                }
            }

            return { success: false, error: 'Не удалось авторизоваться' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }

    async addToCart(productId, quantity = 1, token = null) {
        try {
            const config = {};
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }

            const response = await this.client.post('/api/cart/add', {
                productId,
                quantity
            }, config);

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || error.message
            };
        }
    }
}

module.exports = ApiClient;