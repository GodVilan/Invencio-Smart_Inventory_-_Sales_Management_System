const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getSellerDashboard,
    getSellerSales,
    createSellerSale,
    updateSellerSale,
    deleteSellerSale,
} = require('../controllers/sellerController');

const router = express.Router();

// Seller Dashboard Route
router.get('/dashboard', protect, authorize(['seller']), getSellerDashboard);

// Seller Sales Management Routes
router.get('/sales', protect, authorize(['seller']), getSellerSales);
router.post('/sales', protect, authorize(['seller']), createSellerSale);
router.put('/sales/:id', protect, authorize(['seller']), updateSellerSale);
router.delete('/sales/:id', protect, authorize(['seller']), deleteSellerSale);

module.exports = router;