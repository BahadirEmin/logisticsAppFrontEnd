import api from "./axios";

// Customer API functions
export const customerAPI = {
  // Get all customers
  getAll: async () => {
    try {
      const response = await api.get("/v1/customers");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/v1/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new customer
  create: async (customerData) => {
    try {
      const response = await api.post("/v1/customers", customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const response = await api.put(`/v1/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const response = await api.delete(`/v1/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get risk statuses (for dropdown) - Transform backend response
  getRiskStatuses: async () => {
    try {
      console.log("Calling risk statuses API...");
      const response = await api.get("/v1/risk-statuses");
      console.log("Risk statuses API response:", response);
      console.log("Risk statuses response.data:", response.data);

      // Transform backend response from statusName to name
      const transformedStatuses = response.data.map((status) => ({
        id: status.id,
        name: status.statusName, // Transform statusName to name
      }));

      console.log("Transformed risk statuses:", transformedStatuses);
      return transformedStatuses;
    } catch (error) {
      console.error("Risk statuses API error:", error);
      console.error("Error response:", error.response);
      throw error;
    }
  },
};
