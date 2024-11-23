import { Router } from "express";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Ticket from "../models/ticketModel.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const carts = await Cart.find().populate("products.product");
        res.status(200).json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los carritos" });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartRepository.getById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el carrito" });
    }
});

router.post('/:cid/products/:pid',authMiddleware,roleMiddleware('user'), async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            const cart = await cartRepository.getById(cid);
            if (!cart) {
                return res.status(404).json({ message: 'Carrito no encontrado' });
            }

            const product = await productRepository.getById(pid);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            const productIndex = cart.products.findIndex(
                (item) => item.product.toString() === pid
            );

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }

            await cartRepository.update(cid, cart);
            res.status(200).json({ message: 'Producto agregado al carrito', cart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al agregar el producto al carrito' });
        }
    }
);

router.post("/:cid/purchase", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartRepository.getById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        let totalAmount = 0;
        const productsNotPurchased = [];

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                totalAmount += product.price * item.quantity;
                await product.save();
            } else {
                productsNotPurchased.push(product._id);
            }
        }

        if (totalAmount > 0) {
            const ticket = await Ticket.create({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: req.user.email,
            });

            cart.products = cart.products.filter((item) =>
                productsNotPurchased.includes(item.product._id)
            );
            await cart.save();

            res.status(200).json({ ticket, productsNotPurchased });
        } else {
            res.status(400).json({
                message:
                    "No se pudo procesar la compra. Verifica el stock de los productos.",
                productsNotPurchased,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al procesar la compra" });
    }
});
export default router;
