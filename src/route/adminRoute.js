const express = require('express');
const router = express.Router();
const authenToken = require('../middleware/authentoken');
const authenAdmin = require('../middleware/authenAdmin');

const AdminController = require('../controller/adminController');

// route admin user
router.get('/get-PendingCars', authenToken, authenAdmin, AdminController.getPendingCars);

module.exports = router;
