const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true }, // Reference to Brand
  image: { type: String, required: true }, // Store Base64-encoded image as a string
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);