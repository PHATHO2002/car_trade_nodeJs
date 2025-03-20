const express = require('express');
const router = express.Router();
const MesageController = require('../controller/mesageController');
const authenToken = require('../middleware/authentoken');

router.post('/', authenToken, MesageController.create);
router.patch('/', authenToken, MesageController.update);
router.get('/', authenToken, MesageController.get);
router.get('/list-partner', authenToken, MesageController.getPartners);

module.exports = router;
