import { Process, Member, User } from './types/appTypes'
import { faker } from '@faker-js/faker'

const users: User[] = []
for (let i = 0; i < 3; i++) {
  users.push({
    name: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    },
    email: faker.helpers.unique(faker.internet.email, [
      faker.name.firstName(),
      faker.name.lastName(),
    ]),
    password: faker.internet.password(),
    workspaces: faker.random.word(),
  })
}

JSON.stringify(users, null, 2)
console.log(users);
