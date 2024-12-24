import { Router } from 'express';
import userRepository from '../repositories/userRepository.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const user = await userRepository.registerUser(req.body);
        res.status(201).json({ message: 'Usuario registrado', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { token, user } = await userRepository.loginUser(req.body);
        res.status(200).json({ message: 'Inicio de sesión exitoso', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await userRepository.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
