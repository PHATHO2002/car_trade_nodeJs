const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const authenToken = require('../middleware/authentoken');
const uploader = require('../middleware/uploader');

// const uploadCloud = require('../middleware/uploader');

// const UserController = require('../controller/userController');

router.post('/register', UserController.createNewUser);
router.post('/post', authenToken, uploader, UserController.postTradeCar);
module.exports = router;
