class CartDTO {
    constructor({ _id, products }) {
        this.id = _id;
        this.products = products.map(({ product, quantity }) => ({
            productId: product._id,
            name: product.name,
            quantity,
            price: product.price,
        }));
    }
}

export default CartDTO;
