import axiosInstance from './axios';

export const countriesAPI = {
  // Get all countries
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/v1/country-codes');
      return response.data;
    } catch (error) {
      console.error('Countries API error:', error);
      throw error;
    }
  },

  // Get active countries only (recommended for dropdowns)
  getActive: async () => {
    try {
      const response = await axiosInstance.get('/v1/country-codes/active');
      return response.data;
    } catch (error) {
      console.error('Active countries API error:', error);
      throw error;
    }
  },

  // Get country by ID
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/v1/country-codes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Country API error:', error);
      throw error;
    }
  },

  // Get country by ISO code
  getByIso: async (isoCode) => {
    try {
      const response = await axiosInstance.get(`/v1/country-codes/iso/${isoCode}`);
      return response.data;
    } catch (error) {
      console.error('Country by ISO API error:', error);
      throw error;
    }
  },

  // Get country by numeric code
  getByNumeric: async (numericCode) => {
    try {
      const response = await axiosInstance.get(`/v1/country-codes/numeric/${numericCode}`);
      return response.data;
    } catch (error) {
      console.error('Country by numeric API error:', error);
      throw error;
    }
  },

  // Search countries
  search: async (params) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axiosInstance.get(`/v1/country-codes/search?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Country search API error:', error);
      throw error;
    }
  },

  // Find country by any name (multi-language)
  findByName: async (countryName) => {
    try {
      const response = await axiosInstance.get(`/v1/country-codes/find/${encodeURIComponent(countryName)}`);
      return response.data;
    } catch (error) {
      console.error('Country find by name API error:', error);
      throw error;
    }
  },

  // Create new country
  create: async (countryData) => {
    try {
      const response = await axiosInstance.post('/v1/country-codes', countryData);
      return response.data;
    } catch (error) {
      console.error('Country create API error:', error);
      throw error;
    }
  },

  // Update country
  update: async (id, countryData) => {
    try {
      const response = await axiosInstance.put(`/v1/country-codes/${id}`, countryData);
      return response.data;
    } catch (error) {
      console.error('Country update API error:', error);
      throw error;
    }
  },

  // Delete country (soft delete)
  delete: async (id) => {
    try {
      await axiosInstance.delete(`/v1/country-codes/${id}`);
    } catch (error) {
      console.error('Country delete API error:', error);
      throw error;
    }
  }
};
