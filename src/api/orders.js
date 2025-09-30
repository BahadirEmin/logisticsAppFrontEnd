import api from './axios';

// Orders API functions
export const ordersAPI = {
  // Create new order
  create: async orderData => {
    try {
      const response = await api.post('/v1/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all orders
  getAll: async () => {
    try {
      const response = await api.get('/v1/orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  getById: async id => {
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
  delete: async id => {
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
      if (!orderId || !operationPersonId) {
        throw new Error('Order ID and Operation Person ID are required');
      }

      const response = await api.post(
        `/v1/orders/${orderId}/assign-operation?operationPersonId=${operationPersonId}`
      );
      return response.data;
    } catch (error) {
      console.error('Assign to operation error:', error);
      throw error;
    }
  },

  // Assign order to fleet person
  assignToFleet: async (orderId, fleetPersonId) => {
    try {
      if (!orderId || !fleetPersonId) {
        throw new Error('Order ID and Fleet Person ID are required');
      }

      console.log(`Assigning order ${orderId} to fleet person ${fleetPersonId}`);

      const response = await api.post(
        `/v1/orders/${orderId}/assign-fleet?fleetPersonId=${fleetPersonId}`,
        {}, // Empty body since backend expects query parameter
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Assign to fleet response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Assign to fleet error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  // Get orders by sales person ID
  getBySalesPersonId: async salesPersonId => {
    try {
      const response = await api.get(`/v1/orders/sales-person/${salesPersonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by fleet person ID using search endpoint
  getByFleetPersonId: async fleetPersonId => {
    try {
      const response = await api.get(`/v1/orders/search?fleetPersonId=${fleetPersonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by operation person ID using search endpoint
  getByOperationPersonId: async operationPersonId => {
    try {
      const response = await api.get(`/v1/orders/search?operationPersonId=${operationPersonId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by trip status
  getByTripStatus: async tripStatus => {
    try {
      const response = await api.get(`/v1/orders/status/${tripStatus}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search orders with multiple filters
  searchOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.salesPersonId) params.append('salesPersonId', filters.salesPersonId);
      if (filters.fleetPersonId) params.append('fleetPersonId', filters.fleetPersonId);
      if (filters.operationPersonId) params.append('operationPersonId', filters.operationPersonId);
      if (filters.tripStatus) params.append('tripStatus', filters.tripStatus);

      const response = await api.get(`/v1/orders/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by customer ID using search endpoint
  getByCustomerId: async customerId => {
    try {
      const response = await api.get(`/v1/orders/search?customerId=${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get orders by trip status using search endpoint
  getByTripStatusSearch: async tripStatus => {
    try {
      const response = await api.get(`/v1/orders/search?tripStatus=${tripStatus}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Assign fleet resources (vehicle, driver, trailer) to order
  assignFleetResources: async (orderId, resources) => {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (resources.vehicleId) params.append('vehicleId', resources.vehicleId);
      if (resources.driverId) params.append('driverId', resources.driverId);
      if (resources.trailerId) params.append('trailerId', resources.trailerId);

      const response = await api.post(
        `/v1/orders/${orderId}/assign-fleet-resources?${params.toString()}`,
        {}, // Empty body since backend expects query parameters
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Assign fleet resources error:', error);
      throw error;
    }
  },

  // Download driver information document
  downloadDriverInformationDocument: async orderId => {
    try {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      const response = await api.get(`/v1/orders/${orderId}/driver-information-document`, {
        responseType: 'blob', // Important for downloading binary files
        headers: {
          accept: 'application/octet-stream',
        },
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `driver_info_${orderId}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      console.error('Download driver information document error:', error);
      throw error;
    }
  },
};
