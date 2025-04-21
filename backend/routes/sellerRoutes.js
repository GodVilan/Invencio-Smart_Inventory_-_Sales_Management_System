const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const router = express.Router();

// Seller Dashboard Route
router.get('/dashboard', protect, authorize(['seller']), async (req, res) => {
    try {
        const totalSales = await Sale.countDocuments({ sellerId: req.user.id });
        const totalRevenueResult = await Sale.aggregate([
            { $match: { sellerId: req.user.id } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0; // Fallback to 0

        const topProducts = await Sale.aggregate([
            { $match: { sellerId: req.user.id } },
            { $group: { _id: '$productId', sales: { $sum: '$quantity' } } },
            { $sort: { sales: -1 } },
            { $limit: 5 },
        ]).lookup({
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails',
        });

        res.json({
            totalSales,
            totalRevenue,
            topSellingProducts: topProducts.map((p) => ({
                name: p.productDetails[0]?.name || 'Unknown Product',
                sales: p.sales,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seller dashboard data', error: error.message });
    }
});

module.exports = router;