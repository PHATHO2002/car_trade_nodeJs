const express = require('express');
const router = express.Router();
const authenToken = require('../middleware/authentoken')
const SiteController = require('../controller/siteController');
const siteController = require('../controller/siteController');

router.get('/get-all-user', authenToken, SiteController.getAllUser);
router.get('/get-login', SiteController.getLogin);

router.post('/login', SiteController.login)
// refesh token
router.post('/refreshToken', siteController.refreshtoken)


module.exports = router;