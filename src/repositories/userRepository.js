import userDAO from '../dao/users/userDAO.js';
import UserDTO from '../dtos/userDTO.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserRepository {
    async getAllUsers() {
        const users = await userDAO.getAll();
        return users.map(user => new UserDTO(user));
    }
    async getUserById(id) {
        const user = await userDAO.getById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return new UserDTO(user);
    }
    async registerUser({ name, email, password, role }) {
        const existingUsers = await userDAO.getAll();
        if (existingUsers.some(user => user.email === email)) {
            throw new Error('El usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userDAO.create({ name, email, password: hashedPassword, role });
        return new UserDTO(newUser);
    }
    async loginUser({ email, password }) {
        const users = await userDAO.getAll();
        const user = users.find(user => user.email === email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return { token, user: new UserDTO(user) };
    }
    async updateUser(id, updateData) {
        const updatedUser = await userDAO.update(id, updateData);
        if (!updatedUser) {
            throw new Error('No se pdo actualizar el usuario');
        }
        return new UserDTO(updatedUser);
    }
    async deleteUser(id) {
        const deletedUser = await userDAO.delete(id);
        if (!deletedUser) {
            throw new Error('No se pudo eliminar el usuario');
        }
        return deletedUser;
    }
}

export default new UserRepository();
