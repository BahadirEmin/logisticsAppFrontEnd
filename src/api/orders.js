import api from "./axios";

// Orders API functions
export const ordersAPI = {
  // Create new order
  create: async (orderData) => {
    try {
      const response = await api.post("/v1/orders", orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all orders
  getAll: async () => {
    try {
      const response = await api.get("/v1/orders");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/v1/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order
  update: async (id, orderData) => {
    try {
      const response = await api.put(`/v1/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete order
  delete: async (id) => {
    try {
      const response = await api.delete(`/v1/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assign order to operation person
  assignToOperation: async (orderId, operationPersonId) => {
    try {
      const response = await api.post(
        `/v1/orders/${orderId}/assign-operation?operationPersonId=${operationPersonId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assign order to fleet person
  assignToFleet: async (orderId, fleetPersonId) => {
    try {
      const response = await api.post(
        `/v1/orders/${orderId}/assign-fleet?fleetPersonId=${fleetPersonId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by sales person ID
  getBySalesPersonId: async (salesPersonId) => {
    try {
      const response = await api.get(
        `/v1/orders/sales-person/${salesPersonId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by fleet person ID
  getByFleetPersonId: async (fleetPersonId) => {
    try {
      const response = await api.get(
        `/v1/orders/fleet-person/${fleetPersonId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by trip status
  getByTripStatus: async (tripStatus) => {
    try {
      const response = await api.get(`/v1/orders/status/${tripStatus}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
