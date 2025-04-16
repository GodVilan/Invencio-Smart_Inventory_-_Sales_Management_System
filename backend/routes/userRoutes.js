const express = require('express');
const {
    getAllUsers,
    addUser,
    editUser,
    deleteUser,
    getUserById,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all users (Admin only)
router.get('/', protect, authorize(['admin']), getAllUsers);

// Get a single user by ID (Admin only)
router.get('/:id', protect, authorize(['admin']), getUserById);

// Add a new user (Admin only)
router.post('/', protect, authorize(['admin']), addUser);

// Edit a user (Admin only)
router.put('/:id', protect, authorize(['admin']), editUser);

// Delete a user (Admin only)
router.delete('/:id', protect, authorize(['admin']), deleteUser);

module.exports = router;