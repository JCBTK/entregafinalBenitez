import bcrypt from 'bcrypt';

export const generateMockUsers = (num) => {
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
};
