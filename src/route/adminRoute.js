const express = require('express');
const router = express.Router();

const authenAdmin = require('../middleware/authenAdmin');

const AdminController = require('../controller/adminController');

// route admin user
router.get('/get-PendingCars', authenAdmin, AdminController.getPendingCars);
router.post('/decision-pendingCars', authenAdmin, AdminController.decisionPendingCar);
module.exports = router;
