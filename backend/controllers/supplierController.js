const Supplier = require('../models/Supplier');
const Medicine = require('../models/Medicine');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate({
      path: 'suppliedMedicines',
      select: 'name sellingPrice stockQuantity category'
    });
    console.log('Suppliers with populated medicines:', suppliers); // Add this for debugging
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get single supplier by ID
// @route   GET /api/suppliers/:id
// @access  Public
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).populate('suppliedMedicines');
    
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
const createSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (supplier) {
      Object.assign(supplier, req.body);
      const updatedSupplier = await supplier.save();
      res.json(updatedSupplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (supplier) {
      // Check if supplier has medicines
      const medicinesCount = await Medicine.countDocuments({ supplier: supplier._id });
      
      if (medicinesCount > 0) {
        return res.status(400).json({ 
          message: 'Cannot delete supplier with associated medicines' 
        });
      }
      
      await supplier.deleteOne();
      res.json({ message: 'Supplier removed' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};