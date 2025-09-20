import api from "./axios";

// Supplier API functions
export const supplierAPI = {
  // Get all suppliers
  getAll: async () => {
    try {
      const response = await api.get("/v1/suppliers");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get supplier by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/v1/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new supplier
  create: async (supplierData) => {
    try {
      const response = await api.post("/v1/suppliers", supplierData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update supplier
  update: async (id, supplierData) => {
    try {
      const response = await api.put(`/v1/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete supplier
  delete: async (id) => {
    try {
      const response = await api.delete(`/v1/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
