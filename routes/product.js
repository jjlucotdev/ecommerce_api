const express = require('express');
const router = express.Router();
const { verify, verifyAdmin, isLoggedIn } = require("../auth");
const productController = require('../controllers/product');

router.get("/get-all-category", productController.getAllCategory);

router.get("/:categoryId/filter-by-category", productController.filterByCategory);

router.get("/active", productController.getAllActiveProducts);

router.get("/all", verify, verifyAdmin, productController.getAllProducts);

router.post("/", verify, verifyAdmin, productController.addProduct);

router.get("/:productId", productController.getProduct);

router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

router.post("/searchByName", productController.searchProductsByName);

router.post("/searchByPrice", productController.searchProductsByPrice);

router.post("/add-category", verify, verifyAdmin, productController.addCategory);

router.patch("/:categoryId/update-category", verify, verifyAdmin, productController.updateCategory);

module.exports = router;