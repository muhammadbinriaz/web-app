const express = require('express');
const router = express.Router();
const {
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionByNumber,
  createPrescription,
  updatePrescription,
  updatePrescriptionStatus,
  deletePrescription,
  getPendingPrescriptions
} = require('../controllers/prescriptionController');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getPrescriptions);
router.get('/pending', auth, getPendingPrescriptions);
router.get('/number/:prescriptionNumber', auth, getPrescriptionByNumber);
router.get('/:id', auth, getPrescriptionById);
router.post('/', auth, createPrescription);
router.put('/:id', auth, updatePrescription);
router.patch('/:id/status', auth, updatePrescriptionStatus);
router.delete('/:id', auth, deletePrescription);

module.exports = router;