const express = require('express');
const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getFilteredProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Assuming you have a middleware for handling file uploads
const router = express.Router();

// Only admin and seller can create products
router.post('/', protect, authorize(['admin', 'seller']), upload.single('image'), createProduct);

// All roles can view products
router.get('/', protect, authorize(['admin', 'seller', 'supplier']), getProducts);

// Admin and seller can update products
router.put('/:id', protect, authorize(['admin', 'seller']), upload.single('image'), updateProduct);

// Only admin can delete products
router.delete('/:id', protect, authorize(['admin']), deleteProduct);

// All roles can search and filter products
router.get('/search', protect, authorize(['admin', 'seller', 'supplier']), getFilteredProducts);

module.exports = router;