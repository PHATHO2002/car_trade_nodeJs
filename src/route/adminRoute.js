const express = require('express');
const router = express.Router();


const uploadCloud = require('../middleware/uploader');
const authenAdmin = require('../middleware/authenAdmin');

const AdminController = require('../controller/adminController');


// route admin user
router.post('/add-product', uploadCloud.single('image'), authenAdmin, AdminController.addProduct);





module.exports = router;