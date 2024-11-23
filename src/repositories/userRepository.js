import userDAO from '../dao/users/userDAO.js';
import UserDTO from '../dtos/userDTO.js';

class UserRepository {
    async getAll() {
        const users = await userDAO.getAll();
        return users.map((user) => new UserDTO(user));
    }

    async getById(id) {
        const user = await userDAO.getById(id);
        return new UserDTO(user);
    }
}

export default new UserRepository();
