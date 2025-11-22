const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('medicines.medicine', 'name category')
      .populate('pharmacist', 'username')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single sale by ID
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('medicines.medicine')
      .populate('pharmacist', 'username email');
    
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
  try {
    const { medicines, customerName, paymentMethod, pharmacist } = req.body;
    
    // Calculate total and update stock
    let totalAmount = 0;
    const saleItems = [];
    
    for (const item of medicines) {
      const medicine = await Medicine.findById(item.medicine);
      
      if (!medicine) {
        return res.status(404).json({ message: `Medicine not found: ${item.medicine}` });
      }
      
      if (medicine.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stockQuantity}` 
        });
      }
      
      // Calculate item total
      const itemTotal = medicine.sellingPrice * item.quantity;
      totalAmount += itemTotal;
      
      // Update stock
      medicine.stockQuantity -= item.quantity;
      await medicine.save();
      
      saleItems.push({
        medicine: medicine._id,
        quantity: item.quantity,
        price: medicine.sellingPrice
      });
    }
    
    const sale = new Sale({
      medicines: saleItems,
      totalAmount,
      customerName,
      paymentMethod,
      pharmacist
    });
    
    const createdSale = await sale.save();
    res.status(201).json(createdSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get sales by date range
// @route   GET /api/sales/report
// @access  Private
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const sales = await Sale.find(query)
      .populate('medicines.medicine', 'name category')
      .sort({ createdAt: -1 });
    
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    res.json({
      sales,
      totalRevenue,
      totalSales: sales.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSales,
  getSaleById,
  createSale,
  getSalesReport
};