const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true
  },
  suppliedMedicines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Supplier', supplierSchema);