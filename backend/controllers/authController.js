const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);
        // console.log('Hashed password:', hashedPassword);

        // Create the user
        const user = await User.create({
            name,
            email,
            // password: hashedPassword,
            password: password, // Use the plain password for now (not recommended for production)
            role,
        });

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        console.log('Login request received:', { email, password });

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user);

        // Compare the password
        console.log('Password provided:', password);
        console.log('Password stored in DB:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = password === user.password; // Use plain password comparison for now (not recommended for production)
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            console.log('Invalid credentials for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('role'); // Fetch only the role
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ role: user.role });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, getUserDetails };