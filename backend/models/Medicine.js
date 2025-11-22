const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  minStockThreshold: {
    type: Number,
    default: 10,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);