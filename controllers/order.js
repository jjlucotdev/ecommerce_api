const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

module.exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found for this user' });
        }

        const { cartItems, totalPrice } = cart;

        const newOrder = new Order({
            userId,
            productsOrdered: cartItems,
            totalPrice
        });

        const savedOrder = await newOrder.save();
        await Cart.deleteOne({ userId });
        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ error: 'Failed to create order' });
    }
};


module.exports.createReview = async (req, res) => {
    try {
        const { rating, remarks } = req.body;
        const productId = req.params.productId;
        const userId = req.user.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const userOrder = await Order.findOne({ userId, 'productsOrdered.productId': productId });
        if (!userOrder) {
            return res.status(403).json({ error: 'You cannot add a review for a product you have not ordered' });
        }

        const existingReview = product.reviews.find(review => review.createdBy.equals(userId));
        if (existingReview) {
            return res.status(403).json({ error: 'You have already reviewed this product' });
        }

        const newReview = {
            rating,
            remarks,
            createdBy: userId
        };

        product.reviews.push(newReview);

        await product.save();

        return res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({ error: 'Failed to add review' });
    }
};

module.exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ userId });
        if (!orders) {
            return res.status(404).send({ error: 'No orders found for this user' });
        }

        return res.status(200).send({ orders });
    } catch (error) {
        console.error("Error retrieving user's orders:", error);
        return res.status(500).send({ error: 'Failed to retrieve user\'s orders' });
    }
};

module.exports.getAllOrders = (req, res) => {
    if(req.user.isAdmin){
        Order.find({})
        .then((orders) => {
            return res.status(200).send({ orders });
        })
        .catch((err) => {
            console.error("Error finding all orders: ", err);
            return res.status(404).send({ error : "No orders found" });
        });
    }else{
        return res.status(403).send({ auth: "Failed", message: "Action Forbidden"});
    }
};