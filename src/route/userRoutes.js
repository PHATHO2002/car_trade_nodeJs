const express = require('express');
const router = express.Router();
const authenToken = require('../middleware/authentoken');
const uploadCloud = require('../middleware/uploader')


const UserController = require('../controller/userController');


router.post('/register', uploadCloud.single('avatar'), UserController.createNewUser);
router.post('/login', UserController.login);
router.delete('/logout', authenToken, UserController.logout)
// refesh token



module.exports = router;