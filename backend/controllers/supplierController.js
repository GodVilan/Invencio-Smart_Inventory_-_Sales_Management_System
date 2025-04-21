const Supplier = require('../models/Supplier');
const Supply = require('../models/Supply');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// ✅ Create a supplier (admin)
exports.createSupplier = async (req, res) => {
    const { name, email, phone, address, contactInfo } = req.body;

    try {
        // Validate required fields
        if (!name || !email || !phone || !address) {
            return res.status(400).json({ message: 'All fields (name, email, phone, address) are required.' });
        }

        // Check for duplicate email in both Supplier and User collections
        const existingUser = await User.findOne({ email });
        const existingSupplier = await Supplier.findOne({ email });
        if (existingUser || existingSupplier) {
            return res.status(400).json({ message: 'A user or supplier with this email already exists.' });
        }

        // Create a new user for the supplier
        const newUser = await User.create({
            name,
            email,
            password: 'defaultpassword123', // Set a default password (Admin can reset later)
            role: 'supplier', // Assign the 'supplier' role
        });

        // Create the supplier and link it to the new user
        const supplier = await Supplier.create({
            userId: newUser._id,
            name,
            email,
            phone,
            address,
            contactInfo,
        });

        res.status(201).json(supplier);
    } catch (error) {
        console.error('Error creating supplier:', error.message); // Log the error message
        res.status(500).json({ message: 'Failed to create supplier', error: error.message });
    }
};

// ✅ Get all suppliers (admin/supplier)
exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch suppliers', error: error.message });
    }
};

// ✅ Supplier Dashboard (stats)
exports.getSupplierDashboard = async (req, res) => {
    try {
        const totalSupplies = await Supply.countDocuments({ supplierId: req.user.id });
        const pendingOrders = await Order.countDocuments({ supplierId: req.user.id, status: 'pending' });

        res.json({ totalSupplies, pendingOrders });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch supplier dashboard data', error: error.message });
    }
};

// ✅ Supplier Profile
exports.getSupplierProfile = async (req, res) => {
    try {
        const supplier = await Supplier.findOne({ userId: req.user.id });

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier profile not found' });
        }

        res.status(200).json(supplier);
    } catch (error) {
        console.error('Error fetching supplier profile:', error);
        res.status(500).json({ message: 'Failed to fetch supplier profile', error: error.message });
    }
};

// ✅ Supplier Products
exports.getSupplierProducts = async (req, res) => {
    try {
        const supplier = await Supplier.findOne({ userId: req.user.id });

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const products = await Product.find({ createdBy: supplier.userId }); // Ensure `createdBy` matches `userId`
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching supplier products:', error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

// ✅ Supplier Analytics
exports.getSupplierAnalytics = async (req, res) => {
    try {
        const supplierId = req.user.id;

        const monthlySupplies = await Supply.aggregate([
            { $match: { supplierId: supplierId } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: 1 },
                },
            },
            { $sort: { '_id': 1 } }
        ]);

        const topProducts = await Supply.aggregate([
            { $match: { supplierId: supplierId } },
            {
                $group: {
                    _id: '$productId',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            monthlySupplies,
            topProducts,
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Failed to load analytics' });
    }
};

// ✅ Update supplier (admin)
exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, contactInfo } = req.body;
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            { name, email, phone, address, contactInfo },
            { new: true }
        );
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(updatedSupplier);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update supplier', error: error.message });
    }
};

// ✅ Delete supplier (admin)
exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(id);
        if (!deletedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete supplier', error: error.message });
    }
};

// ✅ Update Supplier Profile
exports.updateSupplierProfile = async (req, res) => {
    try {
        const supplier = await Supplier.findOneAndUpdate(
            { userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!supplier) {
            return res.status(404).json({ message: 'Supplier profile not found' });
        }

        res.status(200).json(supplier);
    } catch (error) {
        console.error('Error updating supplier profile:', error);
        res.status(500).json({ message: 'Failed to update supplier profile', error: error.message });
    }
};

exports.updateSupplierContact = async (req, res) => {
    const { phone, address } = req.body;
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, { phone, address }, { new: true });
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update supplier contact details', error: error.message });
    }
};