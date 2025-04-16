const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const router = express.Router();

// Admin Dashboard Route
router.get('/dashboard', protect, authorize(['admin']), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalSales = await Sale.countDocuments();
        res.json({ totalUsers, totalProducts, totalSales });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin dashboard data' });
    }
});

module.exports = router;