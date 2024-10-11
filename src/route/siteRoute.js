const express = require('express');
const router = express.Router();


const authenToken = require('../middleware/authentoken');

const SiteController = require('../controller/siteController');


router.post('/refreshToken', SiteController.refreshtoken)
router.post('/login', SiteController.login);
router.delete('/logout', authenToken, SiteController.logout);



module.exports = router;