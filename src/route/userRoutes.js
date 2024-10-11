const express = require('express');
const router = express.Router();
const authenToken = require('../middleware/authentoken');

const uploadCloud = require('../middleware/uploader');


const UserController = require('../controller/userController');


router.post('/register', uploadCloud.single('avatar'), UserController.createNewUser);






module.exports = router;