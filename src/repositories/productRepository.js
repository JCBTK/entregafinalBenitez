import productDAO from '../dao/products/productDAO.js';
import ProductDTO from '../dtos/productDTO.js';

class ProductRepository {
    async getAll() {
        const products = await productDAO.getAll();
        return products.map((product) => new ProductDTO(product));
    }
}

export default new ProductRepository();
