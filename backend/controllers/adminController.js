const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Supply = require('../models/Supply');

// Admin: Sell stock from a supplier
exports.sellStockFromSupplier = async (req, res) => {
    const { productId, quantity, totalAmount } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const sale = new Sale({
            productId,
            quantity,
            totalAmount,
            sellerId: null, // Admin is selling, so no sellerId
        });
        await sale.save();

        product.stock -= quantity;
        await product.save();

        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to sell stock', error: error.message });
    }
};

// Admin: Request stock increase from a supplier
exports.requestStockIncrease = async (req, res) => {
    const { productId, supplierId, quantity } = req.body;

    try {
        const supplyRequest = new Supply({
            productId,
            supplierId,
            quantity,
            status: 'pending',
        });
        await supplyRequest.save();

        res.status(201).json({ message: 'Stock increase request sent to supplier', supplyRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to request stock increase', error: error.message });
    }
};