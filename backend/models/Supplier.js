const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validate email format
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10,15}$/, // Validate phone number (10-15 digits)
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    contactInfo: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', supplierSchema);