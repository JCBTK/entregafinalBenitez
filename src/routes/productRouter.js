import { Router } from 'express';
import productRepository from '../repositories/productRepository.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productRepository.getAll();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    async (req, res) => {
        try {
            const newProduct = await productRepository.create(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear el producto' });
        }
    }
);

export default router;
