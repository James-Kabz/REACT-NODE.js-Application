const express = require('express');
const salesController = require('../controller/SaleController')
const router = express.Router();

router.post('/makeSale', salesController.makeSale)
router.get('/getAllSales', salesController.getAllSales)
router.delete("/deleteSale/:id", salesController.deleteSale);

module.exports = router;