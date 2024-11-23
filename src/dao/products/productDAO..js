import Product from '../../models/productModel.js';
class ProductDAO {
    async getAll() {
        return await Product.find();
    }

    async getById(id) {
        return await Product.findById(id);
    }

    async create(productData) {
        return await Product.create(productData);
    }

    async update(id, productData) {
        return await Product.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default new ProductDAO();
