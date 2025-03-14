const express = require('express');
const router = express.Router();
const CartController = require('../controller/cartController');
const authenToken = require('../middleware/authentoken');
const uploader = require('../middleware/uploader');
router.post('/', authenToken, uploader, CartController.add);
router.delete('/:id', authenToken, CartController.delete);

router.get('/', authenToken, CartController.get);

module.exports = router;
