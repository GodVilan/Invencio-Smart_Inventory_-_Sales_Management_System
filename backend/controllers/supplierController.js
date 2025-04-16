const Supplier = require('../models/Supplier');
const Supply = require('../models/Supply');
const Order = require('../models/Order');

// Create a supplier
exports.createSupplier = async (req, res) => {
    const { name, contactInfo } = req.body;
    try {
        const supplier = await Supplier.create({ name, contactInfo });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create supplier', error: error.message });
    }
};

// Get all suppliers
exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch suppliers', error: error.message });
    }
};

// Get supplier dashboard data
exports.getSupplierDashboard = async (req, res) => {
    try {
        const totalSupplies = await Supply.countDocuments({ supplierId: req.user.id });
        const pendingOrders = await Order.countDocuments({ supplierId: req.user.id, status: 'pending' });
        res.json({ totalSupplies, pendingOrders });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch supplier dashboard data', error: error.message });
    }
};

// Update a supplier
exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, contactInfo } = req.body;
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            id,
            { name, contactInfo },
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

// Delete a supplier
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