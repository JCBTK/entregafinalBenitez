import productDAO from '../dao/products/productDAO.js';
import ProductDTO from '../dtos/productDTO.js';

class ProductRepository {
    async getAllProducts() {
        const products = await productDAO.getAll();
        return products.map(product => new ProductDTO(product));
    }
    async createProduct(productData) {
        const newProduct = await productDAO.create(productData);
        return new ProductDTO(newProduct);
    }
    async getProductById(id) {
        const product = await productDAO.getById(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return new ProductDTO(product);
    }
    async updateProduct(id, productData) {
        const updatedProduct = await productDAO.update(id, productData);
        if (!updatedProduct) {
            throw new Error('No se pudo actualizar el producto');
        }
        return new ProductDTO(updatedProduct);
    }
    async deleteProduct(id) {
        const deletedProduct = await productDAO.delete(id);
        if (!deletedProduct) {
            throw new Error('No se pudo eliminar el producto');
        }
        return deletedProduct;
    }
}

export default new ProductRepository();
