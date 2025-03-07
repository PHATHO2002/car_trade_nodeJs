const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const authenToken = require('../middleware/authentoken');
const uploader = require('../middleware/uploader');

router.post('/register', UserController.createNewUser);
router.post('/post', authenToken, uploader, UserController.postTradeCar);
router.post('/get-selling-car', authenToken, UserController.getApprovaledCar);
router.post('/get-cart', authenToken, UserController.getCart);
router.post('/add-to-cart', authenToken, UserController.addToCart);
router.post('/chat-two', authenToken, UserController.chatTwo);
router.post('/get-message', authenToken, UserController.getMessage);
router.post('/delete-item-in-cart', authenToken, UserController.deleteItemInCart);
router.post('/mark-readed-mess', authenToken, UserController.markReadedMess);
router.post('/delete-post', authenToken, UserController.deletePost);

router.get('/get-list-chat-partner', authenToken, UserController.getListChatPartner);
router.get('/get-user-post', authenToken, UserController.getPosts);
router.get('/get-unread-mess', authenToken, UserController.getUnReadMess);
router.get('/get-user-own-posts', authenToken, UserController.getUserOwnPosts);
router.get('/search/:slug', authenToken, UserController.search);
router.get('/detail', authenToken, UserController.getDetailUser);

router.put('/', authenToken, UserController.updateUser);
module.exports = router;
