const express = require('express');
const {
    createSupplier,
    getSuppliers,
    getSupplierDashboard,
    updateSupplier,
    deleteSupplier,
} = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Only admin can create suppliers
router.post('/', protect, authorize(['admin']), createSupplier);

// Admin and supplier can view suppliers
router.get('/', protect, authorize(['admin', 'supplier']), getSuppliers);

// Supplier dashboard route
router.get('/', protect, authorize(['supplier']), getSupplierDashboard);

// Only admin can update a supplier
router.put('/:id', protect, authorize(['admin']), updateSupplier);

// Only admin can delete a supplier
router.delete('/:id', protect, authorize(['admin']), deleteSupplier);

module.exports = router;