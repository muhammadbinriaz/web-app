const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  doctorName: {
    type: String,
    required: true,
    trim: true
  },
  medicines: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);