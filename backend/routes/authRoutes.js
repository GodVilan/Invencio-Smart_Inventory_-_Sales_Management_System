// filepath: d:\NoSQL_Database\Invencio\Invencio-Smart_Inventory_-_Sales_Management_System\backend\routes\authRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserDetails } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);


// Route to get user details (protected)
router.get('/me', protect, getUserDetails);

module.exports = router;