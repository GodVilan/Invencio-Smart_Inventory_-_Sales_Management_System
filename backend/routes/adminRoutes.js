const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const router = express.Router();

// Admin Dashboard Route
router.get('/dashboard', protect, authorize(['admin']), async (req, res) => {
    try {
        // Always fetch the last 30 days of data, including today
        const today = new Date();
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 29); // Start from 29 days ago to include today

        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalSales = await Sale.countDocuments();

        // Low Inventory Alerts
        const lowInventory = await Product.find({ stock: { $lte: 5 } });

        // Stock Levels by Category
        const stockLevelsByCategory = await Product.aggregate([
            { $group: { _id: '$category', stock: { $sum: '$stock' } } },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'categoryDetails' } },
            { $unwind: '$categoryDetails' },
            { $project: { name: '$categoryDetails.name', stock: 1 } },
        ]);

        // Top-Selling Products
        const topSellingProducts = await Sale.aggregate([
            { $group: { _id: '$productId', sales: { $sum: '$quantity' } } },
            { $sort: { sales: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
            { $unwind: '$productDetails' },
            { $project: { name: '$productDetails.name', sales: 1 } },
        ]);

        // Sales and Revenue Data (Last 30 Days)
        const salesData = await Sale.aggregate([
            { $match: { date: { $gte: last30Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    sales: { $sum: '$quantity' },
                    revenue: { $sum: '$totalAmount' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Generate a complete date range for the last 30 days, including today
        const dateRange = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(last30Days);
            date.setDate(last30Days.getDate() + i);
            dateRange.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        }

        // Fill missing dates with 0 sales and revenue
        const completeSalesData = dateRange.map((date) => {
            const existingData = salesData.find((entry) => entry._id === date);
            return {
                date,
                sales: existingData ? existingData.sales : 0,
                revenue: existingData ? existingData.revenue : 0,
            };
        });

        res.json({
            totalUsers,
            totalProducts,
            totalSales,
            lowInventory,
            stockLevelsByCategory,
            topSellingProducts,
            salesData: completeSalesData,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin dashboard data', error: error.message });
    }
});

// Generate Reports
router.get('/reports', protect, authorize(['admin']), async (req, res) => {
    try {
        const salesReport = await Sale.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    totalSales: { $sum: '$totalAmount' },
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.json(salesReport);
    } catch (error) {
        res.status(500).json({ message: 'Error generating reports', error: error.message });
    }
});

module.exports = router;