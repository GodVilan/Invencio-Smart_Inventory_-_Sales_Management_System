const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

// Add a new user
exports.addUser = async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, role, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add user', error: error.message });
    }
};

// Edit a user
exports.editUser = async (req, res) => {
    const { name, email, role } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        ).select('-password'); // Exclude passwords
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude passwords
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    const { role } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user role', error: error.message });
    }
};