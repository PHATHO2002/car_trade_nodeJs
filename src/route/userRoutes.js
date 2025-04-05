const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const authenToken = require('../middleware/authentoken');

router.post('/', UserController.verifyAndRegisterUser);
router.post('/register/send-otp', UserController.sendOtpForRegistration);
router.get('/', authenToken, UserController.get);
router.patch('/', authenToken, UserController.update);
router.patch('/change-pass', authenToken, UserController.updatePassword);

module.exports = router;
