class TestDataGenerator {
    constructor() {
        this.russianNames = [
            'Иван', 'Алексей', 'Дмитрий', 'Сергей', 'Андрей',
            'Мария', 'Екатерина', 'Анна', 'Ольга', 'Наталья'
        ];

        this.russianLastNames = [
            'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов',
            'Васильев', 'Попов', 'Соколов', 'Михайлов', 'Новиков'
        ];
    }

    generateEmail(prefix = 'test') {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `${prefix}_${timestamp}_${random}@test.ru`;
    }

    generatePhone() {
        const operators = ['901', '902', '916', '925', '926', '927', '999'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        const number = Math.floor(1000000 + Math.random() * 9000000);
        return `+7${operator}${number}`;
    }

    generateName() {
        return this.russianNames[Math.floor(Math.random() * this.russianNames.length)];
    }

    generateLastName() {
        return this.russianLastNames[Math.floor(Math.random() * this.russianLastNames.length)];
    }

    generatePassword(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    generateUser() {
        const name = this.generateName();
        return {
            email: this.generateEmail(name.toLowerCase()),
            password: this.generatePassword(),
            name: name,
            lastName: this.generateLastName(),
            phone: this.generatePhone(),
            birthDate: this.generateBirthDate(),
            address: `ул. Тестовая, д. ${Math.floor(Math.random() * 100)}, кв. ${Math.floor(Math.random() * 200)}`
        };
    }

    generateBirthDate() {
        const year = 1980 + Math.floor(Math.random() * 20);
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

module.exports = new TestDataGenerator();