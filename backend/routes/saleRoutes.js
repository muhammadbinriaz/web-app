const express = require('express');
const router = express.Router();
const {
  getSales,
  getSaleById,
  createSale,
  getSalesReport
} = require('../controllers/saleController');
// const { auth } = require('../middlewares/auth');  // Comment out for now

router.get('/', getSales);  // Remove auth temporarily
router.get('/report', getSalesReport);  // Remove auth temporarily
router.get('/:id', getSaleById);  // Remove auth temporarily
router.post('/', createSale);  // Remove auth temporarily
// router.get('/', auth, getSales);  // Original protected route
// router.get('/report', auth, getSalesReport);
// router.get('/:id', auth, getSaleById);
// router.post('/', auth, createSale);

module.exports = router;