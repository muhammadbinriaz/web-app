const Prescription = require('../models/Prescription');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('medicines.medicine', 'name category')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('medicines.medicine');
    
    if (prescription) {
      res.json(prescription);
    } else {
      res.status(404).json({ message: 'Prescription not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prescription by prescription number
// @route   GET /api/prescriptions/number/:prescriptionNumber
// @access  Private
const getPrescriptionByNumber = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ 
      prescriptionNumber: req.params.prescriptionNumber 
    }).populate('medicines.medicine');
    
    if (prescription) {
      res.json(prescription);
    } else {
      res.status(404).json({ message: 'Prescription not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new prescription
// @route   POST /api/prescriptions
// @access  Private
const createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    const createdPrescription = await prescription.save();
    res.status(201).json(createdPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private
const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (prescription) {
      Object.assign(prescription, req.body);
      const updatedPrescription = await prescription.save();
      res.json(updatedPrescription);
    } else {
      res.status(404).json({ message: 'Prescription not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update prescription status
// @route   PATCH /api/prescriptions/:id/status
// @access  Private
const updatePrescriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const prescription = await Prescription.findById(req.params.id);
    
    if (prescription) {
      prescription.status = status;
      const updatedPrescription = await prescription.save();
      res.json(updatedPrescription);
    } else {
      res.status(404).json({ message: 'Prescription not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (prescription) {
      await prescription.deleteOne();
      res.json({ message: 'Prescription removed' });
    } else {
      res.status(404).json({ message: 'Prescription not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending prescriptions
// @route   GET /api/prescriptions/status/pending
// @access  Private
const getPendingPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ status: 'pending' })
      .populate('medicines.medicine', 'name category')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionByNumber,
  createPrescription,
  updatePrescription,
  updatePrescriptionStatus,
  deletePrescription,
  getPendingPrescriptions
};