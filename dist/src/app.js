"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const users = [];
for (let i = 0; i < 3; i++) {
    users.push({
        name: {
            firstName: faker_1.faker.name.firstName(),
            lastName: faker_1.faker.name.lastName(),
        },
        email: faker_1.faker.helpers.unique(faker_1.faker.internet.email, [
            faker_1.faker.name.firstName(),
            faker_1.faker.name.lastName(),
        ]),
        password: faker_1.faker.internet.password(),
        workspaces: faker_1.faker.random.word(),
    });
}
JSON.stringify(users, null, 2);
console.log(users);
