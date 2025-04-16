const express = require('express');
const { createSale, getSales } = require('../controllers/salesController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Only seller can create sales
router.post('/', protect, authorize(['seller']), createSale);

// Admin and seller can view sales
router.get('/', protect, authorize(['admin', 'seller']), getSales);

module.exports = router;