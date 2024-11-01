import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
const router = Router();

router.post('/register', [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
    body('email').isEmail().withMessage('Email is not valid').custom(async (email) => {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email already in use');
        }
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    const { first_name, last_name, age, email, password } = req.body;
    try {
        const newUser = await userModel.create({ first_name, last_name, age, email, password });
        res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user || !user.isValidPassword(password)) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, 'tu_secreto', { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true });
        res.json({ status: 'success', payload: { user, token } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userModel.find().select('-password');
        res.json({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
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
