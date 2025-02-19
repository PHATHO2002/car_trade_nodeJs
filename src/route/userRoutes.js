const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const authenToken = require('../middleware/authentoken');
const uploader = require('../middleware/uploader');

// const uploadCloud = require('../middleware/uploader');

// const UserController = require('../controller/userController');

router.post('/register', UserController.createNewUser);
router.post('/post', authenToken, uploader, UserController.postTradeCar);
router.post('/get-selling-car', authenToken, UserController.getApprovaledCar);
router.post('/get-cart', authenToken, UserController.getCart);
router.post('/add-to-cart', authenToken, UserController.addToCart);
router.post('/chat-two', authenToken, UserController.chatTwo);
router.post('/get-message', authenToken, UserController.getMessage);
router.post('/delete-item-in-cart', authenToken, UserController.deleteItemInCart);
module.exports = router;
