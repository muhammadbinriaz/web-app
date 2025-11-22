import API from './api';

// Supplier API calls
export const supplierService = {
  // Get all suppliers
  getAllSuppliers: async () => {
    try {
      const response = await API.get('/suppliers');
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  // Get single supplier by ID
  getSupplierById: async (id) => {
    try {
      const response = await API.get(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching supplier:', error);
      throw error;
    }
  },

  // Create new supplier
  createSupplier: async (supplierData) => {
    try {
      const response = await API.post('/suppliers', supplierData);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  // Update supplier
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await API.put(`/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  },

  // Delete supplier
  deleteSupplier: async (id) => {
    try {
      const response = await API.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  }
};