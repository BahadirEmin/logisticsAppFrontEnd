import api from './axios';

// Trailer API functions
export const trailerAPI = {
  // Get all trailers
  getAll: async () => {
    try {
      const response = await api.get('/v1/trailers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get trailer by ID
  getById: async id => {
    try {
      const response = await api.get(`/v1/trailers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new trailer
  create: async trailerData => {
    try {
      const response = await api.post('/v1/trailers', trailerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update trailer
  update: async (id, trailerData) => {
    try {
      const response = await api.put(`/v1/trailers/${id}`, trailerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete trailer
  delete: async id => {
    try {
      const response = await api.delete(`/v1/trailers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
