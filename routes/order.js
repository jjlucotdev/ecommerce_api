const express = require('express');
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const orderController = require('../controllers/order');

router.post("/checkout", verify, orderController.createOrder);

router.post("/:productId/create-review", verify, orderController.createReview);

router.get("/my-orders", verify, orderController.getUserOrders);

router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);


module.exports = router;