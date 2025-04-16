const Sale = require('../models/Sale');

// Create a sale
exports.createSale = async (req, res) => {
    const { productId, quantity, totalAmount } = req.body;
    try {
        const sale = await Sale.create({ productId, quantity, totalAmount });
        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create sale', error: error.message });
    }
};

// Get all sales
exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find().populate('productId', 'name price');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
    }
};