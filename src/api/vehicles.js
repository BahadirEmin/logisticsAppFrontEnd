import api from './axios';

// Vehicle API functions
export const vehicleAPI = {
  // Get all vehicles
  getAll: async () => {
    try {
      const response = await api.get('/v1/vehicles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get vehicle by ID
  getById: async id => {
    try {
      const response = await api.get(`/v1/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new vehicle
  create: async vehicleData => {
    try {
      const response = await api.post('/v1/vehicles', vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle
  update: async (id, vehicleData) => {
    try {
      const response = await api.put(`/v1/vehicles/${id}`, vehicleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete vehicle
  delete: async id => {
    try {
      const response = await api.delete(`/v1/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
