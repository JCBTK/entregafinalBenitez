import { Router } from "express";
import cartRepository from "../repositories/cartRepository.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        const carts = await cartRepository.getAllCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/:cid", authMiddleware, async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartRepository.getCartById(cid);
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/:cid/products/:pid", authMiddleware, roleMiddleware("user"), async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartRepository.addProductToCart(cid, pid, quantity);
        res.status(200).json({ message: "Producto agregado al carrito", cart: updatedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/:cid/purchase", authMiddleware, async (req, res) => {
    try {
        const { cid } = req.params;
        const userEmail = req.user.email;
        const result = await cartRepository.processPurchase(cid, userEmail);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
