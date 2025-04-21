const express = require('express');
const {
    createSale,
    getSales1,
    getSales2,
    deleteSale,
    updateSale,
    generateSalesReport,
} = require('../controllers/salesController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a sale (Admin and Seller)
router.post('/', protect, authorize(['admin', 'seller']), createSale);

// View all sales (Admin)
router.get('/', protect, authorize(['admin']), getSales1);

// View sales for the logged-in seller (Seller)
router.get('/seller', protect, authorize(['seller']), getSales2);

// Generate sales reports (Admin and Seller)
router.get('/report', protect, authorize(['admin', 'seller']), generateSalesReport);

// Update a sale (Admin and Seller)
router.put('/:id', protect, authorize(['admin', 'seller']), updateSale);

// Delete a sale (Admin and Seller)
router.delete('/:id', protect, authorize(['admin', 'seller']), deleteSale);

module.exports = router;