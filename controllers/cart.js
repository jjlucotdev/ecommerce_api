const Cart = require("../models/Cart");
const Product = require("../models/Product");

module.exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found for this user' });
        }

        return res.status(200).send({ cart });
    } catch (error) {
        console.error("Error retrieving user's cart:", error);
        return res.status(500).send({ error: 'Failed to retrieve user\'s cart' });
    }
};

module.exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItems } = req.body;

        if (!userId || !cartItems || !Array.isArray(cartItems)) {
            return res.status(400).send({ error: 'Invalid request body' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                cartItems: [],
                totalPrice: 0
            });
        }

        for (const item of cartItems) {
            const { productId, quantity } = item;
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).send({ error: `Product not found for ID: ${productId}` });
            }

            if(product.isActive === true ){
                const existingItem = cart.cartItems.find(item => item.productId === productId);

                if (existingItem) {
                    existingItem.quantity += quantity;
                    existingItem.subtotal += quantity * product.price;
                } else {
                    cart.cartItems.push({
                        productId,
                        quantity,
                        subtotal: quantity * product.price
                    });
                }
            }else{
                return res.status(404).send({ error: `Product is not active for ID: ${productId}` });
            } 
        }

        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        return await cart.save()
        .then((cart) => {
            return res.status(201).send({ message: 'Products added to cart successfully', cart });
        })
        .catch((err) => {
            console.error("Error adding in cart:", error);
            return res.status(500).send({ error: 'Failed to add products to cart' });
        });

        
    } catch (error) {
        console.error("Error adding product(s) to cart:", error);
        return res.status(500).send({ error: 'Failed to add product(s) to cart' });
    }
};

module.exports.updateProductQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found for this user' });
        }

        let cartItem = cart.cartItems.find(item => item.productId === productId);
        
        if (!cartItem) {
            const productInfo = await Product.findById(productId);
            if (!productInfo) {
                return res.status(404).send({ error: 'Product not found' });
            }

            const newCartItem = {
                productId: productId,
                quantity: quantity,
                subtotal: quantity * productInfo.price
            };
            cart.cartItems.push(newCartItem);
            cartItem = newCartItem;
        } else {
            cartItem.quantity = quantity;
        }

        for (const item of cart.cartItems) {
            const productInfo = await Product.findById(item.productId);
            if (!productInfo) {
                return res.status(404).send({ error: `Product with ID ${item.productId} not found` });
            }
            item.subtotal = item.quantity * productInfo.price;
        }
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        await cart.save();
        
        return res.status(200).send({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        return res.status(500).send({ error: 'Failed to update cart quantity' });
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        cart.cartItems = [];
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        await cart.save();

        return res.status(200).send({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).send({ error: 'Failed to clear cart' });
    }
};


module.exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId; 

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        const productExists = cart.cartItems.some(item => item.productId === productId);

        if (!productExists) {
            return res.status(404).send({ error: `Product with ID ${productId} not found in cart` });
        }

        cart.cartItems = cart.cartItems.filter(item => item.productId !== productId);

        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        await cart.save();

        return res.status(200).send({ message: 'Product removed from cart successfully', cart });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        return res.status(500).send({ error: 'Failed to remove product from cart' });
    }
};