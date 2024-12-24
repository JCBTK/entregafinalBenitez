import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import Pet from '../models/petModel.js';

class MockRepository {
    generateMockUsers(num) {
        const roles = ['user', 'admin'];
        const users = [];
        for (let i = 0; i < num; i++) {
            users.push({
                first_name: `User${i + 1}`,
                last_name: `Mock${i + 1}`,
                age: Math.floor(Math.random() * 50) + 18,
                email: `user${i + 1}@mockmail.com`,
                password: bcrypt.hashSync('coder123', 10),
                role: roles[Math.floor(Math.random() * roles.length)],
                pets: [],
            });
        }
        return users;
    }

    generateMockPets(num) {
        const pets = [];
        for (let i = 0; i < num; i++) {
            pets.push({
                name: `Pet${i + 1}`,
                type: 'mock',
                age: Math.floor(Math.random() * 15) + 1,
            });
        }
        return pets;
    }

    async insertMockUsers(users) {
        return await User.insertMany(users);
    }

    async insertMockPets(pets) {
        return await Pet.insertMany(pets);
    }

    async generateAndInsertData(userCount, petCount) {
        const users = this.generateMockUsers(userCount);
        const pets = this.generateMockPets(petCount);

        const insertedUsers = await this.insertMockUsers(users);
        const insertedPets = await this.insertMockPets(pets);

        return {
            users: insertedUsers.length,
            pets: insertedPets.length,
        };
    }
}

export default new MockRepository();
