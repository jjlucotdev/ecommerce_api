const express = require('express');
const router = express.Router();
const { verify } = require("../auth");
const cartController = require('../controllers/cart');

router.get("/", verify, cartController.getUserCart);

router.post("/addToCart", verify, cartController.addToCart);

router.patch("/updateQuantity", verify, cartController.updateProductQuantity);

router.delete("/:productId/removeFromCart", verify, cartController.removeFromCart);

router.delete("/clearCart", verify, cartController.clearCart);


module.exports = router;