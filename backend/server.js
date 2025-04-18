const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const sellerRoutes = require('./routes/sellerRoutes'); 
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');

dotenv.config();
connectDB();

const app = express();
const cors = require('cors');

app.use(cors()); // Enable CORS for all origins
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/products', productRoutes); // RBAC applied in productRoutes
app.use('/api/admin/sales', salesRoutes); // RBAC applied in salesRoutes
app.use('/api/admin/suppliers', supplierRoutes); // RBAC applied in supplierRoutes
app.use('/api/seller', sellerRoutes); // Register seller-specific routes
app.use('/api/admin/users', userRoutes); // Register user-specific routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);

// Default route for root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Invencio API!');
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, function () {
    console.log("Server running on http://localhost:" + PORT);
    console.log(`Server running on http://localhost:${PORT}`);
});