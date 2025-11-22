const express = require('express');
const router = express.Router();
const {
  getMedicines,
  getMedicineById,
  createMedicine,  // Remove auth for testing
  updateMedicine,
  deleteMedicine,
  getLowStockMedicines,
  getExpiringMedicines
} = require('../controllers/medicineController');
// const { auth, adminAuth } = require('../middlewares/auth');  // Comment out for now

router.get('/', getMedicines);
router.get('/lowstock', getLowStockMedicines);
router.get('/expiring', getExpiringMedicines);
router.get('/:id', getMedicineById);
router.post('/', createMedicine);  // Remove auth middleware
// router.post('/', auth, adminAuth, createMedicine);  // Original protected route
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

module.exports = router;