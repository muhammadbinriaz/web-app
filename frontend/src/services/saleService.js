import API from './api';

// Sale API calls
export const saleService = {
  // Get all sales
  getAllSales: async () => {
    try {
      const response = await API.get('/sales');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  },

  // Create new sale
  createSale: async (saleData) => {
    try {
      const response = await API.post('/sales', saleData);
      return response.data;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  },

  // Get sales report
  getSalesReport: async (startDate, endDate) => {
    try {
      const response = await API.get('/sales/report', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw error;
    }
  }
}; 