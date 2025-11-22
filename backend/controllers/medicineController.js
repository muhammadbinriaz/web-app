const Medicine = require('../models/Medicine');
const Supplier = require('../models/Supplier'); // ADD THIS IMPORT

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Public
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().populate('supplier', 'name contact');
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single medicine by ID
// @route   GET /api/medicines/:id
// @access  Public
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('supplier');
    if (medicine) {
      res.json(medicine);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new medicine
// @route   POST /api/medicines
// @access  Private
const createMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const createdMedicine = await medicine.save();

    // AUTO-UPDATE SUPPLIER'S MEDICINES ARRAY
    if (req.body.supplier) {
      await Supplier.findByIdAndUpdate(
        req.body.supplier,
        { $addToSet: { suppliedMedicines: createdMedicine._id } },
        { new: true }
      );
      console.log(`✅ Updated supplier ${req.body.supplier} with medicine ${createdMedicine._id}`);
    }

    res.status(201).json(createdMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    
    if (medicine) {
      const oldSupplier = medicine.supplier;
      Object.assign(medicine, req.body);
      const updatedMedicine = await medicine.save();

      // Update supplier relationships if supplier changed
      if (req.body.supplier && req.body.supplier !== oldSupplier?.toString()) {
        // Remove from old supplier
        if (oldSupplier) {
          await Supplier.findByIdAndUpdate(
            oldSupplier,
            { $pull: { suppliedMedicines: medicine._id } }
          );
        }
        // Add to new supplier
        await Supplier.findByIdAndUpdate(
          req.body.supplier,
          { $addToSet: { suppliedMedicines: medicine._id } }
        );
      }

      res.json(updatedMedicine);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    
    if (medicine) {
      // Remove medicine from supplier's array
      if (medicine.supplier) {
        await Supplier.findByIdAndUpdate(
          medicine.supplier,
          { $pull: { suppliedMedicines: medicine._id } }
        );
      }

      await medicine.deleteOne();
      res.json({ message: 'Medicine removed' });
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low stock medicines
// @route   GET /api/medicines/lowstock
// @access  Public
const getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $expr: { $lte: ['$stockQuantity', '$minStockThreshold'] }
    }).populate('supplier', 'name contact');
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expired or expiring soon medicines
// @route   GET /api/medicines/expiring
// @access  Public
const getExpiringMedicines = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.setDate(today.getDate() + 30));
    
    const medicines = await Medicine.find({
      expiryDate: { $lte: thirtyDaysFromNow }
    }).populate('supplier', 'name contact');
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getLowStockMedicines,
  getExpiringMedicines
};