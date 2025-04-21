const express = require('express');
const {
    createSupplier,
    getSuppliers,
    getSupplierDashboard,
    getSupplierAnalytics,
    getSupplierProfile,
    getSupplierProducts,
    updateSupplier,
    deleteSupplier,
    updateSupplierProfile,
} = require('../controllers/supplierController');

const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// 🔐 Admin-only routes
router.post('/', protect, authorize(['admin']), createSupplier);
router.get('/', protect, authorize(['admin', 'supplier']), getSuppliers);
router.put('/:id', protect, authorize(['admin']), updateSupplier);
router.delete('/:id', protect, authorize(['admin']), deleteSupplier);

// 👤 Supplier-only routes
router.get('/dashboard', protect, authorize(['supplier']), getSupplierDashboard);
router.get('/profile', protect, authorize(['supplier']), getSupplierProfile); // Ensure this route exists
router.get('/products', protect, authorize(['supplier']), getSupplierProducts); // Ensure this route exists
router.get('/analytics', protect, authorize(['supplier']), getSupplierAnalytics);
router.put('/profile', protect, authorize(['supplier']), updateSupplierProfile);

module.exports = router;