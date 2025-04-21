const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  // sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associate sale with seller
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Allow null for Admins
});

module.exports = mongoose.model('Sale', saleSchema);