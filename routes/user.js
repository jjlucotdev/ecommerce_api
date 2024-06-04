const express = require('express');
const router = express.Router();
const { verify, verifyAdmin, isLoggedIn } = require("../auth");
const userController = require('../controllers/user');

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.retrieveUserDetails);

router.patch("/:id/setAsAdmin", verify, verifyAdmin, userController.setAsAdmin);

router.patch("/update-password", verify, userController.updatePassword);

router.post("/add-address", verify, userController.addAddress);

router.patch("/:addressId/update-address", verify, userController.updateAddress);

router.delete("/:addressId/delete-address", verify, userController.deleteAddress);

router.patch("/:addressId/set-default-address", verify, userController.setDefaultAddress);


module.exports = router;