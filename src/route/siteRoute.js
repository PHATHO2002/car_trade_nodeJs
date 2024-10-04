const express = require('express');
const router = express.Router();

const uploadCloud = require('../middleware/uploader')


const SiteController = require('../controller/siteController');



router.post('/refreshToken', SiteController.refreshtoken)



module.exports = router;