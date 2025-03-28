const express = require('express');
const router = express.Router();

const authenAdmin = require('../middleware/authenAdmin');

const AdminController = require('../controller/adminController');

// route admin user
router.get('/car/pending', authenAdmin, AdminController.getPendingCars);
router.get('/car/data-brand-count-month', authenAdmin, AdminController.getBrandCountByMonth);
router.post('/car/decision', authenAdmin, AdminController.decisionPendingCar);
module.exports = router;
