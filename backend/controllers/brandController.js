const Brand = require('../models/Brand');

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch brands', error: error.message });
    }
};

exports.createBrand = async (req, res) => {
    const { name, description } = req.body;
    try {
        const brand = new Brand({ name, description });
        await brand.save();
        res.status(201).json(brand);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create brand', error: error.message });
    }
};

exports.updateBrand = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const brand = await Brand.findByIdAndUpdate(id, { name, description }, { new: true });
        res.json(brand);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update brand', error: error.message });
    }
};

exports.deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        await Brand.findByIdAndDelete(id);
        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete brand', error: error.message });
    }
};