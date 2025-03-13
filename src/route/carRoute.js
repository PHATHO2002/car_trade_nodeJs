const express = require('express');
const router = express.Router();
const CarController = require('../controller/carController');
const authenToken = require('../middleware/authentoken');
const uploader = require('../middleware/uploader');
router.post('/post', authenToken, uploader, CarController.postTradeCar);
router.post('/get-selling-car', authenToken, CarController.getApprovaledCar);
// router.get('/brands',CarController)
router.get('/search/:slug', authenToken, CarController.search);
module.exports = router;
