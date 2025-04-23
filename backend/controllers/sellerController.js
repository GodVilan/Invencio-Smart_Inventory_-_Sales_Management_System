const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.getSellerDashboard = async (req, res) => {
    try {
        const today = new Date();
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 29); // Start from 29 days ago to include today

        // Fetch all sales data
        const allSales = await Sale.find({ date: { $gte: last30Days } });

        // Filter sales for the specific seller
        // Filter sales for the specific seller
        const sellerSales = allSales.filter(sale => sale.sellerId && sale.sellerId.toString() === req.user.id);

        // Total Sales Count
        const totalSales = sellerSales.length;

        // Total Revenue
        const totalRevenue = sellerSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

        // Sales and Revenue Data (Last 30 Days)
        const salesDataMap = {};
        sellerSales.forEach(sale => {
            const date = sale.date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            if (!salesDataMap[date]) {
                salesDataMap[date] = { sales: 0, revenue: 0 };
            }
            salesDataMap[date].sales += sale.quantity;
            salesDataMap[date].revenue += sale.totalAmount;
        });

        // Generate a complete date range for the last 30 days, including today
        const dateRange = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(last30Days);
            date.setDate(last30Days.getDate() + i);
            dateRange.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        }

        // Fill missing dates with 0 sales and revenue
        const completeSalesData = dateRange.map(date => ({
            date,
            sales: salesDataMap[date]?.sales || 0,
            revenue: salesDataMap[date]?.revenue || 0,
        }));

        // Top-Selling Products
        const productSalesMap = {};
        sellerSales.forEach(sale => {
            const productId = sale.productId.toString();
            if (!productSalesMap[productId]) {
                productSalesMap[productId] = { sales: 0 };
            }
            productSalesMap[productId].sales += sale.quantity;
        });

        const topProducts = Object.entries(productSalesMap)
            .sort((a, b) => b[1].sales - a[1].sales)
            .slice(0, 5)
            .map(([productId, data]) => ({
                productId,
                sales: data.sales,
            }));

        // Populate product details for top-selling products
        const populatedTopProducts = await Promise.all(
            topProducts.map(async product => {
                const productDetails = await Product.findById(product.productId).select('name');
                return {
                    name: productDetails?.name || 'Unknown Product',
                    sales: product.sales,
                };
            })
        );

        res.json({
            totalSales,
            totalRevenue,
            salesData: completeSalesData,
            topSellingProducts: populatedTopProducts,
        });
    } catch (error) {
        console.error('Error in getSellerDashboard:', error); // Log the error
        res.status(500).json({ message: 'Error fetching seller dashboard data', error: error.message });
    }
};

// Fetch Seller Sales
exports.getSellerSales = async (req, res) => {
    try {
        const sales = await Sale.find({ sellerId: req.user.id }).populate('productId', 'name price');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sales', error: error.message });
    }
};

// Create a Sale
exports.createSellerSale = async (req, res) => {
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
            sellerId: req.user.id,
        });
        await sale.save();

        product.stock -= quantity;
        await product.save();

        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create sale', error: error.message });
    }
};

// Update a Sale
exports.updateSellerSale = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity, totalAmount } = req.body;

    try {
        const sale = await Sale.findById(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const quantityDifference = quantity - sale.quantity;
        if (product.stock < quantityDifference) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        product.stock -= quantityDifference;
        await product.save();

        sale.productId = productId;
        sale.quantity = quantity;
        sale.totalAmount = totalAmount;
        await sale.save();

        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update sale', error: error.message });
    }
};

// Delete a Sale
exports.deleteSellerSale = async (req, res) => {
    const { id } = req.params;

    try {
        const sale = await Sale.findById(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        const product = await Product.findById(sale.productId);
        if (product) {
            product.stock += sale.quantity;
            await product.save();
        }

        await Sale.findByIdAndDelete(id);

        res.json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete sale', error: error.message });
    }
};