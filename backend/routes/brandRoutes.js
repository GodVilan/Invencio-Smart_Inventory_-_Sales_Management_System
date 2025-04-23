const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const router = express.Router();

router.get('/', protect, authorize(['admin', 'seller', 'supplier']), getBrands);
router.post('/', protect, authorize(['admin']), createBrand);
router.put('/:id', protect, authorize(['admin']), updateBrand);
router.delete('/:id', protect, authorize(['admin']), deleteBrand);

module.exports = router;