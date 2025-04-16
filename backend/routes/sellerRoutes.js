const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const Sale = require('../models/Sale');
const router = express.Router();

// Seller Dashboard Route
router.get('/dashboard', protect, authorize(['seller']), async (req, res) => {
    try {
        const totalSales = await Sale.countDocuments({ sellerId: req.user.id });
        const topProducts = await Sale.aggregate([
            { $match: { sellerId: req.user.id } },
            { $group: { _id: '$productId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);
        res.json({ totalSales, topProducts: topProducts.map((p) => p._id) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seller dashboard data' });
    }
});

module.exports = router;