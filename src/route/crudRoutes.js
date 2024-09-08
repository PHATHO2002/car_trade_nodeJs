const express = require('express');
const router = express.Router();
const SiteController = require('../controller/siteController')

router.get('/', SiteController.getHome);



module.exports = router;