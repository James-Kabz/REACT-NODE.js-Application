const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

router.post('/addAdmin', adminController.addAdmin)
router.post('/loginAdmin',adminController.loginAdmin)
module.exports = router;