import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        const existingUser = await userRepository.getAll().then((users) =>
            users.find((user) => user.email === email)
        );
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userRepository.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ message: 'Usuario registrado', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        const users = await userRepository.getAll();
        const user = users.find((u) => u.email === email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userRepository.getAll();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userRepository.getById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ status: 'success', payload: req.user });
});

router.put('/:id', passport.authenticate('jwt', { session: false }), [
    body('first_name').optional().notEmpty().withMessage('First name is required'),
    body('last_name').optional().notEmpty().withMessage('Last name is required'),
    body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive number'),
    body('email').optional().isEmail().withMessage('Email is not valid').custom(async (email, { req }) => {
        const existingUser = await userModel.findOne({ email });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
            throw new Error('Email already in use');
        }
    }),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    const { id } = req.params;
    const { first_name, last_name, age, email, password } = req.body;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password }, { new: true });
        res.json({ status: 'success', payload: updatedUser });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
        await userModel.findByIdAndDelete(id);
        res.json({ status: 'success', message: 'User deleted' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

export default router;
