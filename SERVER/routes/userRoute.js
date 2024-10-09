const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

router.post('/addUser', userController.addUser)
router.post('/loginUser', userController.loginUser)
router.post('/resetPassword', userController.resetPassword)
router.post('/forgotPassword', userController.forgotPassword)

module.exports = router;