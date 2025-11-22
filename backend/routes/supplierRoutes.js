const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
// const { auth, adminAuth } = require('../middlewares/auth');  // Comment out for now

router.get("/", getSuppliers); // Remove auth temporarily
router.get("/:id", getSupplierById); // Remove auth temporarily
router.post("/", createSupplier); // Remove auth temporarily
router.put("/:id", updateSupplier); // Remove auth temporarily
router.delete("/:id", deleteSupplier); // Remove auth temporarily

// Original protected routes:
// router.get('/', auth, adminAuth, getSuppliers);
// router.get('/:id', auth, adminAuth, getSupplierById);
// router.post('/', auth, adminAuth, createSupplier);
// router.put('/:id', auth, adminAuth, updateSupplier);
// router.delete('/:id', auth, adminAuth, deleteSupplier);

module.exports = router;
