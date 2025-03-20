const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
const authenToken = require('../middleware/authentoken');

router.post('/', UserController.create);

router.get('/', UserController.get);
router.patch('/', authenToken, UserController.update);
module.exports = router;
