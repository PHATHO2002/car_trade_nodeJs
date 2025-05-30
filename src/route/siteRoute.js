const express = require('express');
const authenToken = require('../middleware/authentoken');
const router = express.Router();
const SiteController = require('../controller/siteController');
router.post('/login', SiteController.login);
router.post('/login/google', SiteController.loginGoogle);
router.post('/logout', authenToken, SiteController.logout);
router.post('/refreshToken', SiteController.refreshtoken);
router.get('/', SiteController.test);
//sadasddd
module.exports = router;
