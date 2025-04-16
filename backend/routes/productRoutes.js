const express = require('express');
const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getFilteredProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Only admin and seller can create products
router.post('/', protect, authorize(['admin', 'seller']), createProduct);

// All roles can view products
router.get('/', protect, authorize(['admin', 'seller', 'supplier']), getProducts);

// Admin and seller can update products
router.put('/:id', protect, authorize(['admin', 'seller']), updateProduct);

// Only admin can delete products
router.delete('/:id', protect, authorize(['admin']), deleteProduct);

// All roles can search and filter products
router.get('/search', protect, authorize(['admin', 'seller', 'supplier']), getFilteredProducts);

module.exports = router;