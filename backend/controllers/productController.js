const Product = require('../models/Product');

// Create a product
exports.createProduct = async (req, res) => {
    const { name, description, price, stock, category, brand, image } = req.body;

    try {
        if (!name || !price || !stock || !category || !brand || !image) {
            return res.status(400).json({ message: 'All required fields, including image, must be provided' });
        }

        const product = new Product({ name, description, price, stock, category, brand, image });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
};
// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name') // Populate category name
            .populate('brand', 'name'); // Populate brand name
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, category, brand, image } = req.body;

    try {
        const updatedFields = { name, description, price, stock, category, brand };
        if (image) updatedFields.image = image; // Update image if provided

        const product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
};

// Get filtered products
exports.getFilteredProducts = async (req, res) => {
    const { name, category, brand, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    try {
        const products = await Product.find(filter)
            .populate('category', 'name') // Populate category name
            .populate('brand', 'name') // Populate brand name
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await Product.countDocuments(filter);

        res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch filtered products', error: error.message });
    }
};