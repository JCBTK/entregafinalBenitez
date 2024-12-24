import { Router } from 'express';
import mockService from '../services/mockService.js';
const router = Router();

router.get('/mockingusers', async (req, res) => {
    try {
        const users = await mockService.getMockUsers(50);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error en /mockingusers:', error);
        res.status(500).json({ message: 'Error generando usuarios mock' });
    }
});

router.get('/mockingpets', async (req, res) => {
    try {
        const pets = await mockService.getMockPets(10);
        res.status(200).json(pets);
    } catch (error) {
        console.error('Error en /mockingpets:', error);
        res.status(500).json({ message: 'Error generando mascotas mock' });
    }
});
router.post('/generateData', async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;

        const result = await mockService.generateAndSaveMockData(
            parseInt(users),
            parseInt(pets)
        );

        res.status(201).json({
            message: 'Datos generados e insertados exitosamente',
            result,
        });
    } catch (error) {
        console.error('Error en /generateData:', error);
        res.status(500).json({ message: 'Error generando datos', error: error.message });
    }
});

export default router;
