import api from './axios';

// Drivers API functions
export const driversAPI = {
  // Get driver by ID
  getById: async id => {
    try {
      const response = await api.get(`/v1/drivers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all drivers
  getAll: async () => {
    try {
      const response = await api.get('/v1/drivers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new driver
  create: async driverData => {
    try {
      const response = await api.post('/v1/drivers', driverData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update driver
  update: async (id, driverData) => {
    try {
      const response = await api.put(`/v1/drivers/${id}`, driverData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete driver
  delete: async id => {
    try {
      const response = await api.delete(`/v1/drivers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search drivers
  search: async licenseNo => {
    try {
      const response = await api.get(`/v1/drivers/search?licenseNo=${licenseNo}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
