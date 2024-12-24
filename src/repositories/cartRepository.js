import cartDAO from "../dao/carts/cartDAO.js";
import productDAO from "../dao/products/productDAO.js";
import CartDTO from "../dtos/cartDTO.js";
import ticketService from "../services/ticketService.js";

class CartRepository {
    async getAllCarts() {
        const carts = await cartDAO.getAll();
        return carts.map(cart => new CartDTO(cart));
    }

    async getCartById(id) {
        const cart = await this.validateCartExistence(id);
        return new CartDTO(cart);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.validateCartExistence(cartId);
        const product = await this.validateProductExistence(productId);

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cartDAO.update(cartId, cart);
        return new CartDTO(cart);
    }

    async processPurchase(cartId, userEmail) {
        const cart = await this.validateCartExistence(cartId);
        if (cart.products.length === 0) {
            throw new Error("El carrito está vacío");
        }

        let totalAmount = 0;
        const productsNotPurchased = [];

        for (const item of cart.products) {
            const product = await productDAO.getById(item.product);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                totalAmount += product.price * item.quantity;
                await productDAO.update(product._id, product);
            } else {
                productsNotPurchased.push(product._id);
            }
        }

        if (totalAmount === 0) {
            throw new Error("No se pudo procesar la compra. Verifica el stock de los productos.");
        }

        const ticket = await ticketService.createTicket(totalAmount, userEmail);
        cart.products = cart.products.filter(item =>
            productsNotPurchased.includes(item.product._id)
        );

        await cartDAO.update(cartId, cart);
        return { ticket, productsNotPurchased };
    }

    async validateCartExistence(cartId) {
        const cart = await cartDAO.getById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    }

    async validateProductExistence(productId) {
        const product = await productDAO.getById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    }
}

export default new CartRepository();