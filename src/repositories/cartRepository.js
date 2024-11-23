import cartDAO from '../dao/carts/cartDAO.js';
import CartDTO from '../dtos/cartDTO.js';

class CartRepository {
    async getById(id) {
        const cart = await cartDAO.getById(id);
        return new CartDTO(cart);
    }
}

export default new CartRepository();
