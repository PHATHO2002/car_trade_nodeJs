const express = require('express');
const authenToken = require('../middleware/authentoken');
const router = express.Router();
const SiteController = require('../controller/siteController');
router.post('/login', SiteController.login);
router.post('/logout', SiteController.logout);
router.post('/refreshToken', SiteController.refreshtoken);

module.exports = router;
