import API from './api';

// Medicine API calls
export const medicineService = {
  // Get all medicines
  getAllMedicines: async () => {
    try {
      const response = await API.get('/medicines');
      return response.data;
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  },

  // Get single medicine by ID
  getMedicineById: async (id) => {
    try {
      const response = await API.get(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medicine:', error);
      throw error;
    }
  },

  // Create new medicine
  createMedicine: async (medicineData) => {
    try {
      const response = await API.post('/medicines', medicineData);
      return response.data;
    } catch (error) {
      console.error('Error creating medicine:', error);
      throw error;
    }
  },

  // Update medicine
  updateMedicine: async (id, medicineData) => {
    try {
      const response = await API.put(`/medicines/${id}`, medicineData);
      return response.data;
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  },

  // Delete medicine
  deleteMedicine: async (id) => {
    try {
      const response = await API.delete(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  },

  // Get low stock medicines
  getLowStockMedicines: async () => {
    try {
      const response = await API.get('/medicines/lowstock');
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock medicines:', error);
      throw error;
    }
  }
};