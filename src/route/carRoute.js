const express = require('express');
const router = express.Router();
const CarController = require('../controller/carController');
const authenToken = require('../middleware/authentoken');
const uploader = require('../middleware/uploader');
router.post('/', authenToken, uploader, CarController.create);
router.delete('/:id', authenToken, CarController.delete);
router.patch('/update-sale-status/:id', authenToken, uploader, CarController.update_saleStatus);

router.get('/search/:slug', authenToken, CarController.search);
router.get('/', CarController.get);

router.get('/brands', CarController.getBrandsOfCar); // not resfull api here
module.exports = router;
