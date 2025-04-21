const Sale = require('../models/Sale');
const Product = require('../models/Product');

// Create a sale
exports.createSale = async (req, res) => {
    const { productId, quantity, totalAmount } = req.body;

    try {
        // Check if the product exists and has enough stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock for this product' });
        }

        // Determine the sellerId (if the user is a Seller)
        const sellerId = req.user.role === 'seller' ? req.user.id : null;

        // Create the sale
        const sale = await Sale.create({
            productId,
            quantity,
            totalAmount,
            sellerId,
        });

        // Update the product stock
        product.stock -= quantity;
        await product.save();

        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create sale', error: error.message });
    }
};

// Get all sales (Admin)
exports.getSales1 = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('productId', 'name image price'); // Include product details
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
    }
};

// Get sales for the logged-in seller (Seller)
exports.getSales2 = async (req, res) => {
    try {
        const sales = await Sale.find({ sellerId: req.user.id }) // Restrict to the logged-in seller
            .populate('productId', 'name image price'); // Include product details
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
    }
};

// Update a sale
exports.updateSale = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity, totalAmount } = req.body;

    try {
        // Find the existing sale
        const existingSale = await Sale.findById(id);
        if (!existingSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Find the product associated with the sale
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Adjust the stock based on the difference in quantity
        const quantityDifference = quantity - existingSale.quantity;
        if (product.stock < quantityDifference) {
            return res.status(400).json({ message: 'Insufficient stock for this product' });
        }

        product.stock -= quantityDifference;
        await product.save();

        // Update the sale
        const updatedSale = await Sale.findByIdAndUpdate(
            id,
            { productId, quantity, totalAmount },
            { new: true }
        ).populate('productId', 'name price');

        res.json(updatedSale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update sale', error: error.message });
    }
};

// Delete a sale
exports.deleteSale = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the sale to be deleted
        const sale = await Sale.findById(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Find the product associated with the sale
        const product = await Product.findById(sale.productId);
        if (product) {
            // Add the sale quantity back to the product stock
            product.stock += sale.quantity;
            await product.save();
        }

        // Delete the sale
        await Sale.findByIdAndDelete(id);

        res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete sale', error: error.message });
    }
};

// Generate sales reports
exports.generateSalesReport = async (req, res) => {
    try {
        const { period } = req.query; // 'daily', 'weekly', 'monthly'
        let groupBy;
        if (period === 'weekly') {
            groupBy = { $week: '$date' };
        } else if (period === 'monthly') {
            groupBy = { $month: '$date' };
        } else {
            groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
        }

        const report = await Sale.aggregate([
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: '$totalAmount' },
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate sales report', error: error.message });
    }
};